// OneSignal push notification sender
// Usage: npm run notify <article-slug> [locale]
//   npm run notify creatine-on-rest-days
//   npm run notify creatine-on-rest-days en
//
// Reads MDX frontmatter (title, description) and POSTs to OneSignal API.
// Requires ONESIGNAL_REST_API_KEY in .env.local (gitignored).

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .forEach((line) => {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    });
}

const APP_ID = '6a2e9401-d0a5-48e1-bd4d-15b1609367c5';
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const SITE_ORIGIN = 'https://www.creatinedosagecalculator.com';

if (!REST_API_KEY) {
  console.error('Missing ONESIGNAL_REST_API_KEY.');
  console.error('Add it to .env.local at the project root:');
  console.error('  ONESIGNAL_REST_API_KEY=your_key_here');
  process.exit(1);
}

const slug = process.argv[2];
const locale = process.argv[3] || 'en';

if (!slug) {
  console.error('Usage: npm run notify <article-slug> [locale]');
  console.error('Example: npm run notify creatine-on-rest-days');
  process.exit(1);
}

// Parse MDX frontmatter without depending on gray-matter at runtime
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('No frontmatter found');
  const data = {};
  match[1].split('\n').forEach((line) => {
    const m = line.match(/^([a-zA-Z_]+):\s*"?(.*?)"?\s*$/);
    if (m) data[m[1]] = m[2];
  });
  return data;
}

const filePath = path.join(__dirname, '..', 'content', 'blog', `${slug}.mdx`);
if (!fs.existsSync(filePath)) {
  console.error(`Article not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf-8');
const fm = parseFrontmatter(raw);

if (!fm.title || !fm.description) {
  console.error('Frontmatter must contain title and description.');
  process.exit(1);
}

const articleUrl = `${SITE_ORIGIN}/${locale}/blog/${slug}`;

const payload = {
  app_id: APP_ID,
  contents: { en: fm.description },
  headings: { en: fm.title },
  url: articleUrl,
  chrome_web_icon: `${SITE_ORIGIN}/icon-192.png`,
  // Target everyone subscribed via the web. Use `included_segments: ['Subscribed Users']`
  // to send only to confirmed-subscribed users (most common default).
  included_segments: ['Subscribed Users'],
};

const body = JSON.stringify(payload);

const options = {
  hostname: 'api.onesignal.com',
  path: '/notifications',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    Authorization: `Basic ${REST_API_KEY}`,
  },
};

console.log('Sending push notification:');
console.log(`  Title:       ${fm.title}`);
console.log(`  Description: ${fm.description}`);
console.log(`  URL:         ${articleUrl}`);
console.log('');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log(`Response: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      if (parsed.id) {
        console.log(`\n✓ Notification queued. Recipients: ${parsed.recipients ?? 'unknown'}`);
      } else if (parsed.errors) {
        console.error('\n✗ OneSignal returned errors:');
        process.exit(1);
      }
    } catch {
      console.log(data);
    }
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});

req.write(body);
req.end();
