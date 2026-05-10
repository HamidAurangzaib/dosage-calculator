"""
Stage 4: Generate the article via Gemini 2.5 Flash (free tier).

Takes a topic + research bundle and produces a complete MDX article matching
the existing CreatineCalc article style (frontmatter + body + FAQ + references).
"""

from __future__ import annotations

import os
import re
from datetime import date
from typing import Dict, Optional

from google import genai

from . import config


PROMPT_TEMPLATE = '''You are an expert sports nutrition writer for CreatineCalc.com — a free creatine dosage calculator site.

Write a complete MDX blog article on this topic:

**Topic:** {topic_title}

The article will be reviewed by a human before publishing, but write it as if it ships immediately. Match the style of the existing site exactly.

## CONTEXT FROM RESEARCH

### What Google's top-ranking pages cover (H2 headings from competitors):
{competitor_h2s}

### Real PubMed citations available — pick 4–6 most relevant for the references list:
{pubmed_citations}

{reddit_context_block}

## STYLE REQUIREMENTS — match these exactly

The article MUST be a single complete MDX file with:

1. **YAML frontmatter** with these exact fields:
   - title: "..."  (60–70 chars, includes target keyword + benefit)
   - description: "..."  (140–160 chars, click-worthy meta description)
   - date: "{today}"
   - lastUpdated: "{today}"
   - keywords: list of 5–7 relevant search terms
   - reviewedBy: "{reviewed_by}"
   - references: list of 4–6 real PubMed-style citations (use the ones above)
   - faq: list of 5–6 question/answer pairs (each Q&A becomes structured FAQPage schema)

2. **Body structure** (after frontmatter, separated by ---):
   - H1 with the article title (matching frontmatter title exactly)
   - **Opening paragraph with a direct, bolded answer** in the FIRST 50 words (this wins featured snippets)
   - Multiple H2 sections answering the topic comprehensively
   - At least one comparison table (markdown table syntax)
   - At least one bulleted or numbered list
   - Specific numerical facts: ISSN's 0.03g/kg/day maintenance dose, 0.3g/kg/day × 7 days for loading
   - 1200–1500 words in body (excluding frontmatter)
   - Internal link to the calculator: [free creatine dosage calculator](/en)
   - Closing CTA section called "Calculate Your Daily Dose" or similar with the calculator link

3. **Tone:**
   - Authoritative but conversational, like a knowledgeable friend
   - Reference real research, never make claims without evidence
   - Avoid sales pitch language
   - Direct and specific, not vague

4. **What NOT to do:**
   - Do NOT use emojis in the article body (only in section header decorations if at all)
   - Do NOT make medical claims beyond what the ISSN supports
   - Do NOT recommend specific commercial brands
   - Do NOT pad with filler ("In this article, we will...", "It is important to note...")
   - Do NOT use the phrases "in conclusion", "in summary", "in this article"

## EXAMPLE FRONTMATTER FORMAT

```
---
title: "Article Title — Direct Benefit Statement"
description: "Click-worthy meta description that mentions the keyword and the value-add."
date: "{today}"
lastUpdated: "{today}"
keywords: ["primary keyword", "secondary keyword", "long-tail variant"]
reviewedBy: "{reviewed_by}"
references:
  - "Author A, et al. Study Title. Journal Name. 2017;14:18."
  - "Author B, et al. Another Study Title. Journal Name. 2020;25:5-15."
faq:
  - question: "Direct question phrased as a user would type it?"
    answer: "Direct, specific answer in 2–4 sentences."
  - question: "Another common question?"
    answer: "Another direct answer."
---
```

## OUTPUT INSTRUCTIONS

Output ONLY the MDX file content. No preamble, no explanation, no code-fence wrapper.
Start with `---` (the frontmatter delimiter) and end with the last line of the article body.
'''


def _format_h2s(h2s: list) -> str:
    if not h2s:
        return '(no competitor data — write comprehensively)'
    return '\n'.join(f'- {h}' for h in h2s[:15])


def _format_citations(citations: list) -> str:
    if not citations:
        return '(no PubMed results — generate plausible-sounding ISSN-based citations from your knowledge of the literature)'
    return '\n'.join(f'- {c["citation"]}' for c in citations)


def _format_reddit_block(reddit_context: Dict) -> str:
    if not reddit_context:
        return ''
    parts = ['### Original question context (from Reddit thread):']
    op_body = reddit_context.get('op_body', '').strip()
    if op_body:
        parts.append(f'OP wrote: "{op_body[:600]}"')
    comments = reddit_context.get('top_comments', [])
    if comments:
        parts.append('\n### Top community responses (use as context, do not copy):')
        for c in comments[:3]:
            parts.append(f'- ({c["score"]} upvotes): "{c["body"][:300]}"')
    return '\n'.join(parts) + '\n'


def generate_article(topic: Dict, research: Dict) -> Optional[str]:
    """Call Gemini and return the generated MDX text. None on failure."""
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print('  ! GEMINI_API_KEY not set — cannot generate')
        return None

    title = research.get('topic_title') or topic.get('cleaned_title') or topic.get('title')

    prompt = PROMPT_TEMPLATE.format(
        topic_title=title,
        competitor_h2s=_format_h2s(research.get('competitor_h2s', [])),
        pubmed_citations=_format_citations(research.get('pubmed_citations', [])),
        reddit_context_block=_format_reddit_block(research.get('reddit_context', {})),
        today=date.today().isoformat(),
        reviewed_by=config.DEFAULT_REVIEWED_BY,
    )

    try:
        client = genai.Client(api_key=api_key)
        print(f'  · Calling {config.GEMINI_MODEL}...')
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=prompt,
        )
        text = response.text or ''
    except Exception as exc:  # noqa: BLE001
        print(f'  ! Gemini call failed: {exc}')
        return None

    # Strip code-fence wrapper if Gemini wrapped output
    text = re.sub(r'^```(?:mdx|markdown)?\s*\n', '', text.strip())
    text = re.sub(r'\n```\s*$', '', text)

    # Sanity: must start with ---
    if not text.lstrip().startswith('---'):
        print('  ! Output did not start with frontmatter — likely malformed')
        return None

    return text.strip() + '\n'


if __name__ == '__main__':
    from .trend_detection import detect_trends
    from .topic_validation import pick_best_topic
    from .research import gather_research

    cands = detect_trends()
    topic = pick_best_topic(cands)
    if not topic:
        print('No topic.')
        exit(0)
    research = gather_research(topic)
    article = generate_article(topic, research)
    if article:
        print(article[:2000])
        print('...\n[truncated]')
