"""Configuration for the article pipeline. Tweak here, no code changes needed."""

from pathlib import Path

# ──── Paths ────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
BLOG_DIR = PROJECT_ROOT / 'content' / 'blog'
OUTPUT_DIR = Path(__file__).resolve().parent / 'output'

# ──── Trend detection ──────────────────────────────────────────────────
REDDIT_RSS_SUBREDDITS = [
    'Creatine',
    'Supplements',
    'Nootropics',
    'StrongerByScience',
    'beginnerfitness',
    'GYM',
    'AdvancedFitness',
]

# We only care about posts mentioning these terms
KEYWORDS = ['creatine', 'creatin']

# Question-pattern markers — posts looking like questions are best topics
QUESTION_INDICATORS = [
    '?', 'how much', 'should i', 'can i', 'do i', 'what is',
    'is it', 'when to', 'when should', 'how to', 'why',
    'best', 'better', 'worst', 'difference between', 'vs',
]

LOOKBACK_DAYS = 7  # only consider posts from this many days back

# ──── Generation (Gemini) ──────────────────────────────────────────────
GEMINI_MODEL = 'gemini-2.5-flash'  # free tier; change to '2.0-flash' if needed

TARGET_WORD_COUNT = 1300
MIN_WORD_COUNT = 1000
MAX_WORD_COUNT = 1800

# ──── Quality requirements ─────────────────────────────────────────────
MIN_FAQ_ITEMS = 5
MIN_REFERENCES = 4
REQUIRED_FRONTMATTER_FIELDS = [
    'title', 'description', 'date', 'lastUpdated',
    'keywords', 'reviewedBy', 'references', 'faq',
]

# ──── Output ───────────────────────────────────────────────────────────
SITE_URL = 'https://www.creatinedosagecalculator.com'
DEFAULT_REVIEWED_BY = 'ISSN Position Stand on Creatine Supplementation'
