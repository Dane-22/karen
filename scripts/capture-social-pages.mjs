import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const accounts = [
  ['aducktivephilippines', 'https://www.instagram.com/aducktivephilippines/'],
  ['menalaherbals', 'https://www.instagram.com/menalaherbals/'],
  ['afbmangaan', 'https://www.facebook.com/afbmangaan'],
  ['foG2516', 'https://www.facebook.com/foG2516'],
  ['mosaiko_studio', 'https://www.instagram.com/mosaiko_studio/'],
  ['CCMManimalbitecenter', 'https://www.facebook.com/CCMManimalbitecenter/'],
];
mkdirSync('artifacts/social-captures', { recursive: true });
mkdirSync('public/media/social-accounts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [handle, url] of accounts) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForFunction(() => document.body.innerText.length > 100, null, { timeout: 15000 });
      await page.waitForFunction(() => Array.from(document.images).filter(image => image.complete && image.naturalWidth > 100).length >= 4, null, { timeout: 10000 }).catch(() => {});
      const close = page.getByRole('button', { name: 'Close', exact: true });
      if (await close.count()) await close.first().click().catch(() => {});
      await page.screenshot({ path: `artifacts/social-captures/${handle}.png` });
      await page.screenshot({ path: `public/media/social-accounts/${handle}.jpg`, type: 'jpeg', quality: 85, clip: { x: 170, y: 60, width: 940, height: url.includes('instagram') ? 520 : 540 } });
      console.log(JSON.stringify({ handle, url: page.url(), title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 900) }));
    } catch (error) { console.log(JSON.stringify({ handle, error: error.message })); }
    await page.close();
  }
} finally { await browser.close(); }
