"""
Stage 1: Detect trending creatine topics from public RSS feeds.

Pulls from Reddit RSS (no API key needed), filters for posts mentioning
creatine in the last N days, scores each by signal strength.

Output: list of candidate topic dicts, sorted by score desc.
"""

from __future__ import annotations

import time
from datetime import datetime, timezone, timedelta
from typing import List, Dict
from urllib.parse import quote

import feedparser

from . import config


def _parse_reddit_entry(entry, sub: str) -> Dict | None:
    """Convert a Reddit RSS entry into our topic dict, or None to skip."""
    title = entry.get('title', '')
    title_lower = title.lower()
    summary_lower = entry.get('summary', '').lower()
    combined = f'{title_lower} {summary_lower}'

    # Must mention a keyword
    if not any(kw in combined for kw in config.KEYWORDS):
        return None

    # Must look like a question
    if not any(ind in title_lower for ind in config.QUESTION_INDICATORS):
        return None

    # Parse publication date
    published_parsed = entry.get('published_parsed') or entry.get('updated_parsed')
    if not published_parsed:
        return None
    published = datetime(*published_parsed[:6], tzinfo=timezone.utc)

    # Filter by lookback window
    cutoff = datetime.now(timezone.utc) - timedelta(days=config.LOOKBACK_DAYS)
    if published < cutoff:
        return None

    return {
        'title': title.strip(),
        'url': entry.get('link', ''),
        'summary': entry.get('summary', '')[:500],
        'subreddit': sub,
        'published': published.isoformat(),
        'source': 'reddit',
        # Signal strength: question + keyword + recency
        'score': 1.0 + (1.0 / max((datetime.now(timezone.utc) - published).days + 1, 1)),
    }


def fetch_reddit_topics() -> List[Dict]:
    """Fetch and score creatine-related posts from target subreddits."""
    topics: List[Dict] = []
    seen_titles: set[str] = set()

    for sub in config.REDDIT_RSS_SUBREDDITS:
        url = f'https://www.reddit.com/r/{sub}/new/.rss?limit=25'
        try:
            feed = feedparser.parse(url, agent='CreatineCalc-Pipeline/1.0')
            if feed.bozo:
                print(f'  ! r/{sub}: feed parse warning: {feed.bozo_exception}')
            for entry in feed.entries:
                topic = _parse_reddit_entry(entry, sub)
                if topic is None:
                    continue
                # Dedupe by lowercased title (cross-sub crossposts)
                norm = topic['title'].lower().strip()
                if norm in seen_titles:
                    continue
                seen_titles.add(norm)
                topics.append(topic)
            # Be polite — RSS feeds don't need rate limiting really, but keep it slow
            time.sleep(0.5)
        except Exception as exc:  # noqa: BLE001
            print(f'  ! r/{sub}: {exc}')

    return topics


def detect_trends() -> List[Dict]:
    """Main entry — returns ranked list of candidate topics."""
    print(f'Fetching Reddit RSS from {len(config.REDDIT_RSS_SUBREDDITS)} subs...')
    topics = fetch_reddit_topics()

    # Sort by score desc
    topics.sort(key=lambda t: t['score'], reverse=True)
    print(f'  Found {len(topics)} on-topic posts in last {config.LOOKBACK_DAYS}d')
    return topics


if __name__ == '__main__':
    # Allow running this stage standalone for debugging:  python -m scripts.pipeline.trend_detection
    import json
    results = detect_trends()
    print(json.dumps(results[:10], indent=2))
