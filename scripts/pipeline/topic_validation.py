"""
Stage 2: Validate candidate topics against existing articles.

Drops candidates that overlap too much with content already published, to
prevent keyword cannibalization. Also extracts a clean target topic phrase
from the Reddit thread title.

Returns the single best topic to write about (or None if nothing fresh).
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, List, Optional, Set

import frontmatter

from . import config


# Words to strip when comparing topics — common stop words
STOP_WORDS: Set[str] = {
    'a', 'an', 'the', 'is', 'it', 'i', 'me', 'my', 'we', 'our',
    'you', 'your', 'and', 'or', 'but', 'if', 'so', 'as', 'do', 'does',
    'did', 'be', 'been', 'being', 'am', 'are', 'was', 'were', 'have',
    'has', 'had', 'this', 'that', 'these', 'those', 'of', 'in', 'on',
    'at', 'to', 'for', 'with', 'by', 'from', 'about', 'into', 'over',
    'after', 'before', 'than', 'then', 'when', 'while', 'how', 'what',
    'why', 'where', 'which', 'should', 'would', 'could', 'can', 'may',
    'might', 'will', 'just', 'also', 'too', 'really', 'very', 'much',
    'lot', 'one', 'two', 'some', 'any', 'all', 'no', 'not', 'only',
    'own', 'same', 'such', 'thats', 's', 't',
}


def _normalize(text: str) -> Set[str]:
    """Lowercase, strip punctuation, drop stop words. Returns word set."""
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', text.lower())
    words = {w for w in cleaned.split() if w not in STOP_WORDS and len(w) > 2}
    return words


def _load_existing_topics() -> List[Dict]:
    """Read all blog MDX files, extract title + keywords."""
    existing = []
    blog_dir: Path = config.BLOG_DIR
    if not blog_dir.exists():
        print(f'  ! Blog dir not found: {blog_dir}')
        return existing

    for mdx_path in blog_dir.glob('*.mdx'):
        try:
            post = frontmatter.load(mdx_path)
            keywords = post.metadata.get('keywords', []) or []
            title = post.metadata.get('title', '')
            existing.append({
                'slug': mdx_path.stem,
                'title': title,
                'words': _normalize(title) | _normalize(' '.join(keywords)),
            })
        except Exception as exc:  # noqa: BLE001
            print(f'  ! Could not read {mdx_path.name}: {exc}')

    return existing


def _overlap_ratio(topic_words: Set[str], existing_words: Set[str]) -> float:
    """Jaccard-like overlap. 0 = unrelated, 1 = identical."""
    if not topic_words or not existing_words:
        return 0.0
    intersection = topic_words & existing_words
    smaller = min(len(topic_words), len(existing_words))
    return len(intersection) / smaller


def _clean_topic_title(reddit_title: str) -> str:
    """Convert a casual Reddit title into a clean article-style topic phrase."""
    # Remove leading "[tag]" and common prefixes
    cleaned = re.sub(r'^\[[^\]]+\]\s*', '', reddit_title)
    # Strip casual prefix words
    cleaned = re.sub(
        r'^(quick question|hey|hi|hello|so|um|just|also|please|help|noob question)[\s,:]+',
        '', cleaned, flags=re.IGNORECASE,
    )
    return cleaned.strip()


def pick_best_topic(candidates: List[Dict]) -> Optional[Dict]:
    """Return the highest-scoring candidate that doesn't duplicate existing content."""
    if not candidates:
        return None

    existing = _load_existing_topics()
    print(f'  Comparing against {len(existing)} existing articles...')

    DUPLICATE_THRESHOLD = 0.55  # >55% word overlap = too similar

    for candidate in candidates:
        candidate_title = _clean_topic_title(candidate['title'])
        candidate_words = _normalize(candidate_title) | _normalize(candidate.get('summary', ''))

        # Find max overlap with any existing article
        if not existing:
            return _enriched(candidate, candidate_title)

        max_overlap = max(
            _overlap_ratio(candidate_words, e['words']) for e in existing
        )

        if max_overlap < DUPLICATE_THRESHOLD:
            print(f'  ✓ Picked: "{candidate_title}" (overlap={max_overlap:.0%})')
            return _enriched(candidate, candidate_title)

        print(f'  ✗ Skip: "{candidate_title[:60]}" (overlap={max_overlap:.0%})')

    print('  ! No fresh topics found — all candidates duplicate existing content')
    return None


def _enriched(candidate: Dict, cleaned_title: str) -> Dict:
    """Attach a final topic spec to the candidate dict."""
    candidate['cleaned_title'] = cleaned_title
    candidate['suggested_slug'] = _to_slug(cleaned_title)
    return candidate


def _to_slug(title: str) -> str:
    """Convert title to URL slug."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    # Trim length
    if len(slug) > 60:
        slug = slug[:60].rsplit('-', 1)[0]
    return slug


if __name__ == '__main__':
    from .trend_detection import detect_trends
    candidates = detect_trends()
    chosen = pick_best_topic(candidates)
    print(chosen)
