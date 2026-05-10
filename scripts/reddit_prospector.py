#!/usr/bin/env python3
"""
Reddit Link Prospector — finds fresh creatine-related threads in target
subreddits and emails a daily digest.

Filters for threads that:
  - Were posted in the last 24 hours (configurable)
  - Mention a keyword (creatine)
  - Look like questions (title contains '?', 'how much', 'should i', etc.)
  - Have fewer than 30 comments (your reply will be visible)
  - Are not deleted/removed
  - Are in subs where promotional links aren't banned outright

If ANTHROPIC_API_KEY is set in .env.local, generates a custom comment draft
for each opportunity. Otherwise emails just the URLs and you write your own.

Setup:  see scripts/REDDIT_PROSPECTOR_SETUP.md
Run:    python scripts/reddit_prospector.py
"""

from __future__ import annotations

import os
import sys
import smtplib
from datetime import datetime, timezone, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from html import escape
from pathlib import Path

# ---------- Config ----------

TARGET_SUBREDDITS = [
    'Supplements',         # 150K+ subs, no anti-promo rule
    'Creatine',            # niche, focused, generally welcomes helpful info
    'Nootropics',          # creatine for cognition is on-topic
    'StrongerByScience',   # science-aware lifters
    'GYM',                 # general fitness, more permissive
    'beginnerfitness',     # beginner audience matches your calculator's target
]

KEYWORDS = ['creatine', 'creatin']  # second catches typos

QUESTION_INDICATORS = [
    '?', 'how much', 'should i', 'can i', 'do i', 'what is', 'is it',
    'when to', 'when should', 'how do', 'how to', 'why is', 'why does',
]

LOOKBACK_HOURS = 24
MAX_COMMENTS = 30
MAX_RESULTS_PER_SUB = 25  # how far back to scan in each sub's /new feed

# ---------- Env loading ----------

def load_env() -> None:
    """Load .env.local at project root (gitignored, holds secrets)."""
    env_path = Path(__file__).resolve().parent.parent / '.env.local'
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, _, value = line.partition('=')
        os.environ.setdefault(key.strip(), value.strip())


load_env()

REDDIT_CLIENT_ID = os.environ.get('REDDIT_CLIENT_ID')
REDDIT_CLIENT_SECRET = os.environ.get('REDDIT_CLIENT_SECRET')
GMAIL_USER = os.environ.get('GMAIL_USER')
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL') or GMAIL_USER
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')  # optional

required = {
    'REDDIT_CLIENT_ID': REDDIT_CLIENT_ID,
    'REDDIT_CLIENT_SECRET': REDDIT_CLIENT_SECRET,
    'GMAIL_USER': GMAIL_USER,
    'GMAIL_APP_PASSWORD': GMAIL_APP_PASSWORD,
}
missing = [k for k, v in required.items() if not v]
if missing:
    sys.stderr.write('Missing required env vars: ' + ', '.join(missing) + '\n')
    sys.stderr.write('See scripts/REDDIT_PROSPECTOR_SETUP.md for setup.\n')
    sys.exit(1)


# ---------- Reddit fetch ----------

def fetch_opportunities() -> list[dict]:
    """Scan target subs for fresh, on-topic question threads."""
    import praw  # imported here so missing-deps error is friendlier

    reddit = praw.Reddit(
        client_id=REDDIT_CLIENT_ID,
        client_secret=REDDIT_CLIENT_SECRET,
        user_agent='CreatineCalc-LinkProspector/1.0 by u/Least_Banana1242',
    )

    cutoff = datetime.now(timezone.utc) - timedelta(hours=LOOKBACK_HOURS)
    opportunities: list[dict] = []
    seen_ids: set[str] = set()

    for sub_name in TARGET_SUBREDDITS:
        try:
            subreddit = reddit.subreddit(sub_name)
            for post in subreddit.new(limit=MAX_RESULTS_PER_SUB):
                if post.id in seen_ids:
                    continue
                seen_ids.add(post.id)

                created = datetime.fromtimestamp(post.created_utc, timezone.utc)
                if created < cutoff:
                    continue

                title_lower = post.title.lower()
                body_lower = (post.selftext or '').lower()
                combined = title_lower + ' ' + body_lower

                if not any(kw in combined for kw in KEYWORDS):
                    continue

                if not any(ind in title_lower for ind in QUESTION_INDICATORS):
                    continue

                if post.num_comments > MAX_COMMENTS:
                    continue

                # Skip if OP deleted account or post was removed
                if not post.author:
                    continue
                if getattr(post, 'removed_by_category', None):
                    continue

                opportunities.append({
                    'sub': sub_name,
                    'title': post.title,
                    'url': f'https://www.reddit.com{post.permalink}',
                    'body': (post.selftext or '').strip()[:400],
                    'comments': post.num_comments,
                    'upvotes': post.score,
                    'hours_ago': int(
                        (datetime.now(timezone.utc) - created).total_seconds() / 3600
                    ),
                })
        except Exception as exc:  # noqa: BLE001
            print(f'  ! r/{sub_name}: {exc}', file=sys.stderr)

    # Most recent first
    opportunities.sort(key=lambda o: o['hours_ago'])
    return opportunities


# ---------- AI draft (optional) ----------

def generate_comment_draft(opp: dict) -> str | None:
    """Generate a personalized Reddit comment draft via Claude. Optional."""
    if not ANTHROPIC_API_KEY:
        return None
    try:
        from anthropic import Anthropic
        client = Anthropic(api_key=ANTHROPIC_API_KEY)

        prompt = f"""You're drafting a Reddit comment to post on a fresh creatine question thread. The goal is a genuinely helpful reply that mentions creatinedosagecalculator.com (a free ISSN-based dosage calculator) at the end as a useful tool — NOT as a sales pitch.

Rules:
- 80–150 words
- Lead with a specific, useful answer to the OP's question
- Use ISSN-backed facts: 0.03g/kg/day maintenance, 0.3g/kg/day × 7 days for loading (optional)
- Casual Reddit tone, not formal
- Vary the opening hook every time — avoid templated phrases like "Quick math:" or "Real answer:"
- One link mention only, naked URL: creatinedosagecalculator.com
- Don't promise miracles. Don't pitch. Be the helpful Redditor people upvote.

Subreddit: r/{opp['sub']}
Title: {opp['title']}
Body: {opp['body'] or '(no body text)'}

Write only the comment. No preamble, no quotes, no explanation."""

        message = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=500,
            messages=[{'role': 'user', 'content': prompt}],
        )
        return message.content[0].text.strip()
    except Exception as exc:  # noqa: BLE001
        print(f'  ! AI draft failed for {opp["url"]}: {exc}', file=sys.stderr)
        return None


# ---------- Email ----------

def build_html(opportunities: list[dict]) -> str:
    today = datetime.now().strftime('%b %d, %Y')
    html = [
        '<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;'
        'max-width:720px;margin:0 auto;padding:24px;color:#222;line-height:1.5;">',
        f'<h2 style="margin:0 0 4px 0;">🔗 Reddit Link Opportunities</h2>',
        f'<p style="margin:0 0 24px 0;color:#666;font-size:14px;">'
        f'{today} · {len(opportunities)} fresh threads from the last {LOOKBACK_HOURS}h</p>',
    ]

    for opp in opportunities:
        body_text = escape(opp['body'])
        if len(opp['body']) >= 400:
            body_text += '...'

        html.append(
            f'<div style="border:1px solid #e5e5e5;border-radius:10px;padding:18px;'
            f'margin:0 0 16px 0;background:#fff;">'
            f'<p style="margin:0 0 6px 0;font-size:12px;color:#888;">'
            f'r/{escape(opp["sub"])} · {opp["hours_ago"]}h ago · '
            f'{opp["comments"]} comments · {opp["upvotes"]} upvotes</p>'
            f'<h3 style="margin:0 0 10px 0;font-size:16px;line-height:1.3;">'
            f'<a href="{escape(opp["url"])}" style="color:#0a7;text-decoration:none;">'
            f'{escape(opp["title"])}</a></h3>'
            f'<p style="margin:0 0 12px 0;color:#555;font-size:14px;white-space:pre-wrap;">'
            f'{body_text}</p>'
        )

        draft = generate_comment_draft(opp)
        if draft:
            html.append(
                f'<div style="background:#f5fff8;border-left:3px solid #0a7;padding:12px 14px;'
                f'border-radius:0 6px 6px 0;margin-top:12px;">'
                f'<p style="margin:0 0 6px 0;font-size:11px;font-weight:600;color:#0a7;'
                f'letter-spacing:0.5px;">📝 AI-DRAFTED COMMENT (review before posting)</p>'
                f'<p style="margin:0;font-size:14px;white-space:pre-wrap;color:#222;">'
                f'{escape(draft)}</p>'
                f'</div>'
            )

        html.append('</div>')

    html.append(
        '<p style="color:#999;font-size:12px;text-align:center;margin-top:32px;">'
        'Generated by reddit_prospector.py · Always edit drafts before posting · '
        'Space out replies (max 1–2/day from a new account)</p>'
        '</body></html>'
    )

    return '\n'.join(html)


def send_digest(opportunities: list[dict]) -> None:
    if not opportunities:
        print('No opportunities found. Skipping email.')
        return

    html = build_html(opportunities)

    msg = MIMEMultipart('alternative')
    msg['Subject'] = (
        f'🔗 {len(opportunities)} Reddit link opportunities '
        f'· {datetime.now().strftime("%b %d")}'
    )
    msg['From'] = GMAIL_USER
    msg['To'] = RECIPIENT_EMAIL
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_USER, [RECIPIENT_EMAIL], msg.as_string())

    print(f'✓ Sent digest with {len(opportunities)} opportunities to {RECIPIENT_EMAIL}')


# ---------- Main ----------

def main() -> None:
    print(f'Scanning {len(TARGET_SUBREDDITS)} subs for creatine threads from last {LOOKBACK_HOURS}h...')
    opps = fetch_opportunities()
    print(f'Found {len(opps)} matching threads.')

    if opps:
        for o in opps:
            print(f'  · r/{o["sub"]} ({o["hours_ago"]}h, {o["comments"]} comments) — {o["title"][:80]}')

    send_digest(opps)


if __name__ == '__main__':
    main()
