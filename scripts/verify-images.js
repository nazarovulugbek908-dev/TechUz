import { mockProducts } from '../src/data/mockProducts.js';

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: 'ERROR', ok: false, error: err.message };
  }
}

async function main() {
  console.log('Testing mock product images...');
  const allUrls = new Set();
  mockProducts.forEach(p => {
    (p.images || []).forEach(img => allUrls.add(img));
  });

  const results = await Promise.all([...allUrls].map(checkUrl));
  const failed = results.filter(r => !r.ok);

  console.log(`Total unique URLs: ${allUrls.size}`);
  console.log(`Failed URLs: ${failed.length}`);
  failed.forEach(f => console.log(`❌ ${f.status}: ${f.url}`));
}

main();
