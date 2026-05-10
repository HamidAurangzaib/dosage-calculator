# Reddit Link Prospector — Setup Guide

A Python script that scans target subreddits for fresh creatine question threads and emails you a daily digest with optional AI-drafted comments.

**What it does:**
- Polls r/Supplements, r/Creatine, r/Nootropics, r/StrongerByScience, r/GYM, r/beginnerfitness
- Filters for posts from last 24h that mention creatine, look like questions, and have <30 comments
- (Optional) Generates a personalized comment draft via Claude for each thread
- Emails you an HTML digest

**What it doesn't do:**
- Auto-post comments (you write/edit/post manually — that's the whole point)
- Spam (max 1 email per day; Reddit API is read-only mode)

---

## One-time Setup (~15 minutes)

### 1. Install Python dependencies

Open PowerShell in the project root:

```powershell
pip install -r scripts/requirements.txt
```

If `pip` isn't found, install Python from [python.org](https://www.python.org/downloads/) first (check "Add to PATH" during install).

### 2. Create a Reddit App (read-only mode)

- Go to **[reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)** while logged into your Reddit account
- Scroll to bottom → click **"create another app..."**
- Fill in:
  - **name:** `CreatineCalc Prospector`
  - **type:** select **"script"**
  - **redirect uri:** `http://localhost:8080` (required but unused)
  - description / about url: leave blank
- Click **"create app"**
- After creation you'll see:
  - **client_id** — the random string under "personal use script" (e.g. `aBc123XyZ_defGHI`)
  - **client_secret** — labeled "secret" (longer string)
- Copy both. You'll paste them into `.env.local` in step 5.

### 3. Create a Gmail App Password

Required because Gmail blocks SMTP login with your real password.

- Go to **[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
- If 2FA isn't enabled, you'll be prompted to enable it first (required for app passwords)
- Create app password:
  - **App:** select "Mail"
  - **Device:** select "Windows Computer" (or "Other" → name it "Reddit Prospector")
- Click **Create**
- Copy the 16-character password (e.g. `abcd efgh ijkl mnop`) — you won't see it again
- This is what you'll use as `GMAIL_APP_PASSWORD`

### 4. (Optional) Get an Anthropic API Key for AI-drafted comments

If you skip this, the digest still works — it just won't include comment drafts. You can add it later.

- Go to **[console.anthropic.com](https://console.anthropic.com)** → sign up
- Add a payment method (cost is ~$0.001 per draft, so $0.05/month at heavy use)
- Go to **API Keys** → **Create Key**
- Copy the key (starts with `sk-ant-...`)

### 5. Add credentials to `.env.local`

Edit `.env.local` at the project root (gitignored — never committed). Append:

```
# Reddit Link Prospector
REDDIT_CLIENT_ID=aBc123XyZ_defGHI
REDDIT_CLIENT_SECRET=your_long_secret_here
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
RECIPIENT_EMAIL=your.email@gmail.com
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
```

(Replace the values. Remove spaces from the Gmail app password — paste it as one continuous string.)

---

## Run It

```powershell
python scripts/reddit_prospector.py
```

You'll see something like:

```
Scanning 6 subs for creatine threads from last 24h...
Found 4 matching threads.
  · r/Supplements (3h, 2 comments) — Creatine and pre-workout timing question
  · r/Creatine (8h, 5 comments) — How much creatine for a 65kg woman?
  · r/GYM (14h, 12 comments) — Loading phase necessary?
  · r/beginnerfitness (19h, 7 comments) — Should I try creatine?
✓ Sent digest with 4 opportunities to your.email@gmail.com
```

Check your inbox. You'll get an HTML email with each thread's link, post body, and (if Anthropic key set) a custom comment draft.

---

## Schedule It Daily (Windows Task Scheduler)

To get a digest automatically every morning at 8am:

1. Open **Task Scheduler** (search in Start menu)
2. **Create Basic Task** → name: `Reddit Prospector`
3. Trigger: **Daily**, start time `08:00`
4. Action: **Start a program**
5. **Program/script:** full path to `python.exe` (find with `where python` in PowerShell)
6. **Add arguments:** `scripts/reddit_prospector.py`
7. **Start in:** `e:\Projects\Donage Calculator\creatine-calculator`
8. Finish → it runs every day at 8am

If you'd rather run it manually, just `python scripts/reddit_prospector.py` whenever you want a digest.

---

## Tuning

Edit the top of `scripts/reddit_prospector.py`:

| Variable | Default | Effect |
|---|---|---|
| `TARGET_SUBREDDITS` | 6 subs | Add/remove subs to monitor |
| `LOOKBACK_HOURS` | 24 | How far back to look (set 48 if running every 2 days) |
| `MAX_COMMENTS` | 30 | Skip threads with more comments (your reply gets buried) |
| `KEYWORDS` | creatine, creatin | Add other terms like "supplement", "ISSN" |

---

## Troubleshooting

**"Missing required env vars"** → check `.env.local` has all 4 required vars (Reddit ID/secret, Gmail user/password)

**"401 Unauthorized" from Reddit** → wrong client_id or client_secret. Double-check on reddit.com/prefs/apps

**"Username and Password not accepted" from Gmail** → you used your real Gmail password instead of the app password. Generate one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

**"No opportunities found"** → totally normal. Some days there aren't fresh question threads. Try `LOOKBACK_HOURS=48` or add more subs.

**AI drafts not appearing** → either `ANTHROPIC_API_KEY` is missing, or your Anthropic account is out of credits

---

## Important: Use Drafts as Drafts

The AI-generated comments are **starting points, not finished posts**. Always:

1. Read the actual thread before posting
2. Edit to match the thread's specific context
3. Vary wording across drafts (Reddit's spam filter detects templated patterns)
4. Cap at 1–2 link comments per day from the same account

This script saves you research time. It does NOT replace human judgment.
