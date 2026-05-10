"""
Pipeline orchestrator.

Runs the 5 stages in sequence. If a viable article is produced, writes it to
content/blog/<slug>.mdx and emits metadata.json for the GitHub Actions PR step.

Exits 0 in all cases (including no-article-produced) to keep the workflow
green; the workflow's PR-creation step is conditional on metadata.json existing.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Optional

from . import config
from .trend_detection import detect_trends
from .topic_validation import pick_best_topic, _to_slug
from .research import gather_research
from .generate import generate_article
from .quality_check import check_article


def _emit_metadata(metadata: dict) -> None:
    """Write metadata.json that the workflow reads to build the PR description."""
    config.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = config.OUTPUT_DIR / 'metadata.json'
    out_path.write_text(json.dumps(metadata, indent=2), encoding='utf-8')
    print(f'  · Wrote {out_path}')


def _build_manual_topic(manual_topic: str) -> dict:
    """Convert a manual_topic input into the topic dict structure stages expect."""
    return {
        'title': manual_topic,
        'cleaned_title': manual_topic,
        'suggested_slug': _to_slug(manual_topic),
        'url': '',
        'summary': '',
        'subreddit': 'manual',
        'source': 'manual',
        'score': 1.0,
    }


def main() -> int:
    print('═' * 60)
    print('  CREATINECALC ARTICLE PIPELINE')
    print('═' * 60)

    # ──── Manual topic override (workflow_dispatch input) ────
    manual_topic = (os.environ.get('MANUAL_TOPIC') or '').strip()
    topic: Optional[dict]

    if manual_topic:
        print(f'\n[Manual mode] Using user-provided topic: "{manual_topic}"')
        topic = _build_manual_topic(manual_topic)
    else:
        # ──── Stage 1: Trend Detection ────
        print('\n[Stage 1/5] Trend detection')
        candidates = detect_trends()
        if not candidates:
            print('  ! No candidate topics found — exiting cleanly (no PR will be created)')
            return 0

        # ──── Stage 2: Topic Validation ────
        print('\n[Stage 2/5] Topic validation (deduping vs existing articles)')
        topic = pick_best_topic(candidates)
        if topic is None:
            print('  ! All candidate topics overlap with existing articles — exiting cleanly')
            return 0

    # ──── Stage 3: Research ────
    print('\n[Stage 3/5] Research')
    research = gather_research(topic)

    # ──── Stage 4: Generate ────
    print('\n[Stage 4/5] Article generation')
    article_text = generate_article(topic, research)
    if not article_text:
        print('  ! Generation failed — exiting cleanly')
        return 0

    # ──── Stage 5: Quality Check ────
    print('\n[Stage 5/5] Quality check')
    score, concerns, meta = check_article(article_text)
    print(f'  Quality score: {score}/10')
    if concerns:
        print(f'  Concerns ({len(concerns)}):')
        for c in concerns:
            print(f'    - {c}')

    # Reject if score is critically low
    MIN_SCORE = 4
    if score < MIN_SCORE:
        print(f'\n  ! Quality score {score} below minimum {MIN_SCORE} — discarding article')
        return 0

    # ──── Write the MDX file ────
    slug = topic.get('suggested_slug') or _to_slug(meta.get('title', 'untitled'))
    out_path: Path = config.BLOG_DIR / f'{slug}.mdx'

    if out_path.exists():
        print(f'\n  ! Article already exists at {out_path} — pipeline conflict, discarding')
        return 0

    config.BLOG_DIR.mkdir(parents=True, exist_ok=True)
    out_path.write_text(article_text, encoding='utf-8')
    print(f'\n  ✓ Wrote article: {out_path.relative_to(config.PROJECT_ROOT)}')

    # ──── Emit metadata for the workflow ────
    _emit_metadata({
        'title': meta.get('title', 'Untitled'),
        'slug': slug,
        'topic_source': topic.get('source', 'unknown') + (
            f' (r/{topic["subreddit"]})' if topic.get('subreddit') and topic.get('source') == 'reddit' else ''
        ),
        'topic_url': topic.get('url', ''),
        'quality_score': score,
        'word_count': meta.get('word_count', 0),
        'concerns': concerns,
        'mdx_path': str(out_path.relative_to(config.PROJECT_ROOT)).replace('\\', '/'),
    })

    print('\n═' * 30)
    print('  PIPELINE COMPLETE — article ready for review')
    print('═' * 30)
    return 0


if __name__ == '__main__':
    sys.exit(main())
