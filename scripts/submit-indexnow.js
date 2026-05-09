// IndexNow submission script — pushes all sitemap URLs to Bing/Yandex
// Usage: node scripts/submit-indexnow.js [url1 url2 ...]
// With no args: submits every URL in public/sitemap.xml
// With args: submits only the URLs listed (useful after publishing a single new article)

const fs = require('fs');
const path = require('path');
const https = require('https');

const KEY = 'e22851331c2f42c491a4f35d7ffee5f9';
const HOST = 'www.creatinedosagecalculator.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

function extractUrlsFromSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

function submit(urlList) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  const options = {
    hostname: 'api.indexnow.org',
    path: '/IndexNow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const cliUrls = process.argv.slice(2);
  const urls = cliUrls.length > 0 ? cliUrls : extractUrlsFromSitemap();

  console.log(`Submitting ${urls.length} URL(s) to IndexNow…`);
  urls.forEach((u) => console.log(`  • ${u}`));

  try {
    const result = await submit(urls);
    console.log(`\nResponse: ${result.status}`);
    if (result.body) console.log(result.body);

    // IndexNow returns 200 (accepted), 202 (accepted, queued), or 4xx/5xx errors.
    if (result.status === 200 || result.status === 202) {
      console.log('\n✓ IndexNow submission accepted by Bing/Yandex.');
    } else {
      console.log('\n✗ Unexpected status — verify the key file is live at:');
      console.log(`  ${KEY_LOCATION}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('\nRequest failed:', err.message);
    process.exit(1);
  }
})();
