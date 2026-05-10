"""
Stage 5: Quality-check the generated article.

Validates frontmatter completeness, body structure, word count, FAQ items,
references, and internal links. Returns a (score, concerns) tuple — the PR
description shows the concerns so a human reviewer knows what to verify.
"""

from __future__ import annotations

import re
from typing import List, Tuple

import frontmatter

from . import config


def check_article(mdx_text: str) -> Tuple[int, List[str], dict]:
    """
    Returns (quality_score_0_to_10, list_of_concerns, parsed_metadata).
    Score: deduct 1 per concern, floor at 0.
    """
    concerns: List[str] = []

    # Parse frontmatter
    try:
        post = frontmatter.loads(mdx_text)
        meta = post.metadata
        body = post.content
    except Exception as exc:  # noqa: BLE001
        return 0, [f'Could not parse frontmatter: {exc}'], {}

    # 1. Required frontmatter fields
    for field in config.REQUIRED_FRONTMATTER_FIELDS:
        if field not in meta or not meta[field]:
            concerns.append(f'Missing or empty frontmatter field: `{field}`')

    # 2. Title length
    title = meta.get('title', '')
    if title:
        if len(title) < 30:
            concerns.append(f'Title is short ({len(title)} chars) — aim for 50–70')
        elif len(title) > 80:
            concerns.append(f'Title is long ({len(title)} chars) — Google may truncate')

    # 3. Description length
    desc = meta.get('description', '')
    if desc:
        if len(desc) < 100:
            concerns.append(f'Description is short ({len(desc)} chars) — aim for 140–160')
        elif len(desc) > 170:
            concerns.append(f'Description exceeds 170 chars — will be truncated in SERPs')

    # 4. Keywords count
    keywords = meta.get('keywords', []) or []
    if len(keywords) < 3:
        concerns.append(f'Only {len(keywords)} keywords — aim for 5–7')

    # 5. References count
    refs = meta.get('references', []) or []
    if len(refs) < config.MIN_REFERENCES:
        concerns.append(f'Only {len(refs)} references — aim for {config.MIN_REFERENCES}+ for E-E-A-T signals')

    # 6. FAQ items count
    faq = meta.get('faq', []) or []
    if len(faq) < config.MIN_FAQ_ITEMS:
        concerns.append(f'Only {len(faq)} FAQ items — need {config.MIN_FAQ_ITEMS}+ for FAQPage schema')
    else:
        # Check FAQ structure
        for i, item in enumerate(faq):
            if not isinstance(item, dict):
                concerns.append(f'FAQ item {i+1} is not a dict')
                continue
            if 'question' not in item or 'answer' not in item:
                concerns.append(f'FAQ item {i+1} missing question or answer')

    # 7. Word count
    word_count = len(re.findall(r'\b\w+\b', body))
    if word_count < config.MIN_WORD_COUNT:
        concerns.append(f'Body word count {word_count} < {config.MIN_WORD_COUNT} (article too short)')
    elif word_count > config.MAX_WORD_COUNT:
        concerns.append(f'Body word count {word_count} > {config.MAX_WORD_COUNT} (article too long)')

    # 8. Has H1
    if not re.search(r'^#\s+\S', body, flags=re.MULTILINE):
        concerns.append('No H1 heading in body')

    # 9. Has H2 sections (at least 3)
    h2_count = len(re.findall(r'^##\s+\S', body, flags=re.MULTILINE))
    if h2_count < 3:
        concerns.append(f'Only {h2_count} H2 sections — aim for 4+')

    # 10. Internal calculator link
    if '/en' not in body and '/calculator' not in body.lower():
        concerns.append('No internal link to the calculator (/en) — required for conversion')

    # 11. ISSN dose mention (sanity check)
    if '0.03' not in body and 'ISSN' not in body:
        concerns.append('Article does not mention ISSN dose (0.03g/kg/day) — likely not science-backed')

    # 12. Has at least one table
    if '|---' not in body and '|--' not in body:
        concerns.append('No comparison table — tables boost AI citation likelihood')

    score = max(0, 10 - len(concerns))
    return score, concerns, {**meta, 'word_count': word_count}


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        text = open(sys.argv[1], 'r', encoding='utf-8').read()
    else:
        text = sys.stdin.read()
    score, concerns, meta = check_article(text)
    print(f'Score: {score}/10')
    print(f'Word count: {meta.get("word_count", "?")}')
    if concerns:
        print('Concerns:')
        for c in concerns:
            print(f'  - {c}')
    else:
        print('No concerns!')
