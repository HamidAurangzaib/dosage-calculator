# Article Pipeline

Auto-detect trending creatine topics → research → generate article → open PR for human review.

Runs entirely on **GitHub Actions** (free for public repos) with **Gemini 2.5 Flash** (free tier). Zero local setup required.

## How It Works

```
Schedule trigger (Mon + Thu 09:00 UTC)
        │
        ▼
┌──────────────────────────────────────────┐
│  Stage 1: Trend Detection                │
│  Reddit RSS from 7 fitness/supplement    │
│  subs → recent question-format posts     │
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  Stage 2: Topic Validation               │
│  Compare against existing 25+ articles   │
│  Drop duplicates (>55% word overlap)     │
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  Stage 3: Research                       │
│  - Fetch original Reddit thread context  │
│  - Scrape competitor H2 headings         │
│  - Pull real PubMed citations            │
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  Stage 4: Generate                       │
│  Gemini 2.5 Flash writes complete MDX    │
│  with frontmatter, FAQ, references,      │
│  comparison table, internal links        │
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│  Stage 5: Quality Check                  │
│  Validate frontmatter, word count,       │
│  FAQ structure, references, internal     │
│  links. Score 0–10. Reject if < 4.       │
└──────────────────────────────────────────┘
        │
        ▼
GitHub PR opens with:
  - Generated article
  - Quality score
  - List of concerns to manually verify
  - Review checklist

You review on github.com (mobile or desktop) → merge → Vercel deploys.
```

## One-time Setup

### 1. Add `GEMINI_API_KEY` to GitHub Secrets

- Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `GEMINI_API_KEY`
- Value: paste your key (starts with `AIzaSy...`)
- Click **Add secret**

That's it. The workflow's `secrets.GEMINI_API_KEY` reference picks it up.

### 2. (Optional) Verify the workflow is enabled

- GitHub repo → **Actions** tab → look for "Article Pipeline" in the workflow list
- If it's disabled, click **Enable workflow**

## Usage

### Automatic mode (recommended)

The pipeline runs every Monday and Thursday at 09:00 UTC. No action needed.

You'll get a GitHub notification when a PR is opened. Review on github.com:
- Verify numerical claims (especially dosing math)
- Verify cited studies are real (search PubMed for the title)
- Edit for personal voice / unique insights
- Merge when satisfied → Vercel deploys → article goes live

### Manual mode (for ad-hoc topics)

To write about a specific topic right now:

1. GitHub repo → **Actions** tab → **Article Pipeline** workflow
2. Click **Run workflow** (top right)
3. Enter your topic in the input box, e.g. `"Should you take creatine while sick?"`
4. Click **Run workflow**

The pipeline skips trend detection and writes about your specified topic.

## Tuning

Edit `scripts/pipeline/config.py`:

| Setting | Default | What it does |
|---|---|---|
| `REDDIT_RSS_SUBREDDITS` | 7 subs | Which subreddits to monitor |
| `LOOKBACK_DAYS` | 7 | How far back to scan for trending posts |
| `GEMINI_MODEL` | `gemini-2.5-flash` | LLM to use (any free-tier Gemini model) |
| `TARGET_WORD_COUNT` | 1300 | Article length target |
| `MIN_FAQ_ITEMS` | 5 | Minimum FAQ entries (for FAQPage schema) |
| `MIN_REFERENCES` | 4 | Minimum citations (for E-E-A-T) |

To change the schedule, edit `.github/workflows/article-pipeline.yml` cron expression.

## Local Testing (advanced)

If you want to run the pipeline locally before pushing to GitHub:

```powershell
# Set up Python venv
python -m venv .venv
.\.venv\Scripts\activate

# Install deps
pip install -r scripts/pipeline/requirements.txt

# Set the API key (or add to .env.local)
$env:GEMINI_API_KEY = "AIzaSy..."

# Run from project root
python -m scripts.pipeline.runner
```

If a viable article is generated, you'll find it in `content/blog/<slug>.mdx` and metadata at `scripts/pipeline/output/metadata.json`.

You can also test individual stages:

```powershell
python -m scripts.pipeline.trend_detection      # Stage 1 only
python -m scripts.pipeline.topic_validation     # Stages 1-2
python -m scripts.pipeline.research             # Stages 1-3
python -m scripts.pipeline.generate             # Full pipeline up to generation
```

## What Could Go Wrong

| Problem | Likely cause | Fix |
|---|---|---|
| Workflow runs but no PR appears | No fresh topics OR all duplicates | Normal — try again next run, or use manual mode |
| Gemini API errors | Free tier rate-limited (15 req/min) | Workflow runs only twice a week, should never hit this |
| Generated article low quality score | Topic was too vague or research thin | Edit it in the PR, or close PR + re-run with manual topic |
| Reddit RSS feeds blocked | User-agent ban | Update User-Agent in `trend_detection.py` |
| PubMed citations missing | E-utilities downtime | Pipeline falls back to LLM-generated citations (verify these manually!) |

## Rules of the Road

1. **Always review before merging.** No exceptions. Google penalizes unedited AI content.
2. **Verify cited studies.** Search PubMed for the title before merging. AI sometimes invents plausible-sounding citations.
3. **Add personal voice.** Edit the PR to add unique insights, real-world examples, or specific numerical anecdotes. This is what makes the content "yours" in Google's eyes.
4. **Merge cadence:** 2 articles per week max. Don't run the manual trigger 5 times in a day — Google's spam team watches velocity.
