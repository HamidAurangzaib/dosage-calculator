"""
Stage 3: Research the chosen topic.

Pulls context from:
  - The original Reddit thread (top comments often have great insight)
  - DuckDuckGo HTML search results (no API key needed)
  - PubMed E-utilities for real research citations

Returns a research bundle the generation stage can use as context.
"""

from __future__ import annotations

import re
import time
from typing import Dict, List
from urllib.parse import quote_plus

import requests
from bs4 import BeautifulSoup


USER_AGENT = (
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
)


def _safe_get(url: str, timeout: int = 10, **kwargs) -> requests.Response | None:
    """GET that swallows errors and returns None on failure."""
    try:
        headers = {'User-Agent': USER_AGENT, **kwargs.pop('headers', {})}
        return requests.get(url, headers=headers, timeout=timeout, **kwargs)
    except Exception as exc:  # noqa: BLE001
        print(f'  ! Request failed: {url} — {exc}')
        return None


def fetch_reddit_thread_context(reddit_url: str) -> Dict:
    """Pull the OP body + top few comments from a Reddit thread (via .json endpoint)."""
    if not reddit_url:
        return {}

    json_url = reddit_url.rstrip('/') + '.json?limit=10'
    resp = _safe_get(json_url, headers={'User-Agent': USER_AGENT})
    if not resp or resp.status_code != 200:
        return {}

    try:
        data = resp.json()
        post_data = data[0]['data']['children'][0]['data']
        comments = data[1]['data']['children']
        op_body = post_data.get('selftext', '')[:2000]
        top_comments = []
        for c in comments[:5]:
            if c.get('kind') != 't1':
                continue
            body = c['data'].get('body', '')
            score = c['data'].get('score', 0)
            if body and score > 0:
                top_comments.append({'score': score, 'body': body[:1000]})
        return {
            'op_body': op_body,
            'top_comments': top_comments,
        }
    except Exception as exc:  # noqa: BLE001
        print(f'  ! Could not parse Reddit JSON: {exc}')
        return {}


def search_duckduckgo(query: str, max_results: int = 5) -> List[Dict]:
    """Scrape DuckDuckGo HTML results — no API key, no rate limit issues."""
    url = f'https://html.duckduckgo.com/html/?q={quote_plus(query)}'
    resp = _safe_get(url, timeout=15)
    if not resp or resp.status_code != 200:
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')
    results = []
    for r in soup.select('.result')[:max_results]:
        title_el = r.select_one('.result__title')
        snippet_el = r.select_one('.result__snippet')
        link_el = r.select_one('.result__url')
        if not title_el:
            continue
        results.append({
            'title': title_el.get_text(strip=True),
            'snippet': snippet_el.get_text(strip=True) if snippet_el else '',
            'url': link_el.get_text(strip=True) if link_el else '',
        })
    return results


def fetch_competitor_h2s(query: str, max_pages: int = 3) -> List[str]:
    """For each top result, scrape its H2 headings — these reveal what Google expects."""
    results = search_duckduckgo(query, max_results=max_pages)
    h2s: List[str] = []
    seen = set()

    for r in results:
        url = r.get('url', '')
        if not url or 'reddit.com' in url or 'youtube.com' in url:
            continue
        # DuckDuckGo HTML returns urls without scheme sometimes
        if not url.startswith('http'):
            url = 'https://' + url

        resp = _safe_get(url, timeout=10)
        if not resp or resp.status_code != 200:
            continue

        try:
            soup = BeautifulSoup(resp.text, 'html.parser')
            for h2 in soup.find_all('h2'):
                text = h2.get_text(strip=True)
                if 5 < len(text) < 120 and text.lower() not in seen:
                    seen.add(text.lower())
                    h2s.append(text)
        except Exception:  # noqa: BLE001
            continue
        time.sleep(0.5)  # be polite

    return h2s[:20]


def search_pubmed(query: str, max_results: int = 6) -> List[Dict]:
    """Find real research citations via PubMed E-utilities (free, no key)."""
    # First, search for IDs
    search_url = (
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'
        f'?db=pubmed&term={quote_plus(query + " creatine")}&retmax={max_results}&retmode=json'
    )
    resp = _safe_get(search_url, timeout=10)
    if not resp or resp.status_code != 200:
        return []

    try:
        ids = resp.json().get('esearchresult', {}).get('idlist', [])
        if not ids:
            return []
    except Exception:  # noqa: BLE001
        return []

    # Then fetch summaries
    summary_url = (
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'
        f'?db=pubmed&id={",".join(ids)}&retmode=json'
    )
    resp = _safe_get(summary_url, timeout=10)
    if not resp or resp.status_code != 200:
        return []

    try:
        result = resp.json().get('result', {})
        citations = []
        for pid in ids:
            entry = result.get(pid)
            if not entry:
                continue
            authors = entry.get('authors', [])
            first_author = authors[0]['name'] if authors else 'Unknown'
            title = entry.get('title', '').strip().rstrip('.')
            source = entry.get('source', '')
            pub_date = entry.get('pubdate', '')
            volume = entry.get('volume', '')
            pages = entry.get('pages', '')
            year_match = re.search(r'\d{4}', pub_date)
            year = year_match.group(0) if year_match else ''

            citation = f'{first_author}'
            if len(authors) > 1:
                citation += ', et al'
            citation += f'. {title}. {source}.'
            if year:
                citation += f' {year}'
                if volume:
                    citation += f';{volume}'
                if pages:
                    citation += f':{pages}'
            citation += '.'
            citations.append({'pmid': pid, 'citation': citation})
        return citations
    except Exception as exc:  # noqa: BLE001
        print(f'  ! Could not parse PubMed: {exc}')
        return []


def gather_research(topic: Dict) -> Dict:
    """Main entry — assembles a full research bundle for the topic."""
    title = topic.get('cleaned_title') or topic.get('title', '')
    print(f'  Researching: "{title}"')

    reddit_context = {}
    if topic.get('url') and 'reddit.com' in topic.get('url', ''):
        print('  · Fetching Reddit thread context...')
        reddit_context = fetch_reddit_thread_context(topic['url'])

    print('  · Searching for competitor H2 headings...')
    competitor_h2s = fetch_competitor_h2s(title)

    print('  · Finding real PubMed citations...')
    pubmed_citations = search_pubmed(title)

    return {
        'topic_title': title,
        'reddit_context': reddit_context,
        'competitor_h2s': competitor_h2s,
        'pubmed_citations': pubmed_citations,
    }


if __name__ == '__main__':
    from .trend_detection import detect_trends
    from .topic_validation import pick_best_topic
    cands = detect_trends()
    topic = pick_best_topic(cands)
    if topic:
        import json
        print(json.dumps(gather_research(topic), indent=2))
