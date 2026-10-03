import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173', { waitUntil: 'networkidle' });
assert.equal(await page.locator('.category-card').count(), 4);
assert.equal(await page.locator('.collaborators').count(), 0);
assert.equal(await page.locator('.socials').count(), 0);
assert.equal(await page.locator('video').count(), 0);
assert.ok((await page.locator('.project-cta').getAttribute('href')).startsWith('mailto:kawinsarchive@gmail.com'));
assert.equal(await page.locator('.section-backdrop').count(), 3);
assert.equal(await page.locator('.approach figure').count(), 0);
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  for (const section of ['#works', '.approach', '#contact']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForFunction(selector => { const img = document.querySelector(`${selector} .section-backdrop img`); return img?.complete && img.naturalWidth > 0; }, section);
    const source = await page.locator(`${section} .section-backdrop img`).evaluate(img => img.currentSrc);
    assert.ok(source.endsWith(width === 390 ? '-mobile.jpg' : '-desktop.jpg'));
    await page.locator(section).screenshot({ path: `artifacts/background-${section.replace(/[#.]/g, '')}-${width}.png` });
  }
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.evaluate(() => window.scrollTo(0, 0));

const photographyTrigger = page.getByRole('button', { name: 'Explore Photography', exact: true });
await photographyTrigger.click();
assert.equal(await page.locator('.photography-photo').count(), 29);
assert.equal(await page.locator('.project-card').count(), 0);
for (let i = 0; i < 29; i++) {
  const photo = page.locator('.photography-photo').nth(i);
  await photo.scrollIntoViewIfNeeded();
  await page.waitForFunction(index => {
    const image = document.querySelectorAll('.photography-photo img')[index];
    return image?.complete && image.naturalWidth > 0;
  }, i);
}
await page.locator('.photography-photo').nth(17).click();
await page.waitForFunction(() => { const image = document.querySelector('.viewer-stage img'); return image?.complete && image.naturalWidth > 0; });
assert.equal(await page.locator('.viewer-toolbar [aria-live]').textContent(), '18 / 29');
await page.keyboard.press('ArrowRight');
assert.equal(await page.locator('.viewer-toolbar [aria-live]').textContent(), '19 / 29');
await page.keyboard.press('ArrowLeft');
await page.keyboard.press('Escape');
assert.equal(await page.locator('.photo-viewer').count(), 0);
await page.waitForFunction(() => document.activeElement === document.querySelectorAll('.photography-photo')[17]);
assert.equal(await page.locator('.photography-photo').nth(17).evaluate(el => el === document.activeElement), true);
await page.locator('.photography-photo').first().click();
await page.keyboard.press('ArrowLeft');
assert.equal(await page.locator('.viewer-toolbar [aria-live]').textContent(), '29 / 29');
await page.keyboard.press('ArrowRight');
assert.equal(await page.locator('.viewer-toolbar [aria-live]').textContent(), '1 / 29');
for (let i = 0; i < 8; i++) {
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => !!document.activeElement?.closest('.photo-viewer')), true);
}
await page.keyboard.press('Escape');
for (const [width, columns] of [[1440, 4], [768, 2], [390, 1]]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(await page.locator('.photography-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), columns);
  assert.equal(await page.locator('.portfolio-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.locator('.photography-photo').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/photography-${width}.png` });
}
await page.keyboard.press('Escape');
assert.equal(await photographyTrigger.evaluate(el => el === document.activeElement), true);
await page.setViewportSize({ width: 1440, height: 1000 });

// Stub the third-party player: these checks validate our integration, not Facebook playback.
await page.route('https://www.facebook.com/plugins/video.php?**', route => route.fulfill({ contentType: 'text/html', body: '<html><body><button>Play</button></body></html>' }));
const filmTrigger = page.getByRole('button', { name: 'Explore Film', exact: true });
await filmTrigger.click();
assert.equal(await page.locator('.film-card').count(), 4);
assert.equal(await page.locator('.film-player iframe').count(), 0);
const videoIds = ['1259508485334210', '583619661106697', '1299406394108727', '3600869410203894'];
for (let i = 0; i < 4; i++) {
  await page.locator('.film-card').nth(i).click();
  const embed = new URL(await page.locator('.film-player iframe').getAttribute('src'));
  assert.ok(embed.searchParams.get('href').includes(videoIds[i]));
  assert.equal(embed.searchParams.get('autoplay'), 'true');
  assert.ok((await page.getByRole('link', { name: 'Watch on Facebook' }).getAttribute('href')).includes(videoIds[i]));
  assert.equal(await page.locator('.film-player-portrait').count(), i < 2 ? 1 : 0);
  await page.getByRole('button', { name: 'Close film viewer' }).click();
  assert.equal(await page.locator('.film-player iframe').count(), 0);
  await page.waitForFunction(index => document.activeElement === document.querySelectorAll('.film-card')[index], i);
}
await page.locator('.film-card').first().click();
await page.keyboard.press('Escape');
assert.equal(await page.locator('.film-viewer').count(), 0);
assert.equal(await page.locator('.portfolio-dialog[open]').count(), 1);
await page.waitForFunction(() => document.activeElement === document.querySelector('.film-card'));
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(await page.locator('.portfolio-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.screenshot({ path: `artifacts/film-${width}.png` });
  await page.locator('.film-card').nth(2).click();
  assert.equal(await page.locator('.film-viewer').evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.getByRole('button', { name: 'Close film viewer' }).click();
}
await page.keyboard.press('Escape');
await page.setViewportSize({ width: 1440, height: 1000 });

const socialTrigger = page.getByRole('button', { name: 'Explore Social Media', exact: true });
await socialTrigger.click();
const accountUrls = ['https://www.instagram.com/aducktivephilippines/', 'https://www.instagram.com/menalaherbals/', 'https://www.facebook.com/afbmangaan', 'https://www.facebook.com/foG2516', 'https://www.instagram.com/mosaiko_studio/', 'https://www.facebook.com/CCMManimalbitecenter/'];
assert.equal(await page.locator('.social-account-card').count(), 6);
await page.waitForFunction(() => Array.from(document.querySelectorAll('.social-account-preview img')).length === 6 && Array.from(document.querySelectorAll('.social-account-preview img')).every(image => image.complete && image.naturalWidth > 0));
assert.equal(await page.locator('.project-card').count(), 0);
for (let i = 0; i < accountUrls.length; i++) {
  const card = page.locator('.social-account-card').nth(i);
  assert.equal(await card.getAttribute('href'), accountUrls[i]);
  assert.equal(await card.getAttribute('target'), '_blank');
  assert.equal(await card.getAttribute('rel'), 'noopener noreferrer');
}
for (const [width, columns] of [[1440, 3], [768, 2], [390, 1]]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(await page.locator('.social-account-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), columns);
  assert.equal(await page.locator('.portfolio-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.screenshot({ path: `artifacts/social-media-${width}.png` });
}
await page.locator('.social-account-card').last().focus();
await page.keyboard.press('Tab');
assert.equal(await page.locator('.back-button').evaluate(el => el === document.activeElement), true);
await page.keyboard.press('Escape');
assert.equal(await socialTrigger.evaluate(el => el === document.activeElement), true);
await page.setViewportSize({ width: 1440, height: 1000 });

for (const [name, count] of [['Collaborations', 1]]) {
  const trigger = page.getByRole('button', { name: `Explore ${name}`, exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('dialog[open]').count(), 1);
  assert.equal(await page.locator('.project-card').count(), count);
  assert.equal(await page.locator('.concept-badge').count(), count);
  for (let i = 0; i < count; i++) {
    await page.locator('.project-card').nth(i).click();
    assert.ok((await page.locator('.detail-heading .eyebrow').textContent()).includes('Concept preview'));
    assert.ok((await page.locator('.project-role').textContent()).includes('Karen’s role'));
    assert.ok(await page.locator('.detail-gallery figure').count() >= 2);
    if (name === 'Film') assert.equal(await page.getByText('Video sample coming soon', { exact: true }).count(), 1);
    await page.locator('.back-button').click();
    assert.equal(await page.locator('.project-card').nth(i).evaluate(el => document.activeElement === el), true);
  }
  await page.locator('.project-card').first().click();
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement?.closest('dialog')), true);
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
}

mkdirSync('artifacts', { recursive: true });
await page.getByRole('link', { name: 'Mosaiko home', exact: true }).focus();
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
await page.screenshot({ path: 'artifacts/opening-desktop.png' });
for (const width of [360, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
  await page.evaluate(() => window.scrollTo(0, 0));
  const bounds = await page.locator('.category-card').first().boundingBox();
  assert.ok(bounds.y < 400, `Work preview too far below opening at ${width}`);
}
await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'Menu +' }).click();
assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible(), true);
await page.keyboard.press('Escape');
assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible(), false);
await page.getByRole('button', { name: 'Menu +' }).click();
await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Works' }).click();
assert.equal(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible(), false);
await page.getByRole('button', { name: 'Explore Social Media', exact: true }).click();
assert.equal(await page.locator('.portfolio-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
await page.screenshot({ path: 'artifacts/project-mobile.png' });
await page.getByRole('button', { name: 'Close portfolio' }).click();
await page.emulateMedia({ reducedMotion: 'reduce' });
assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
await page.screenshot({ path: 'artifacts/opening-mobile.png' });
await page.locator('footer').scrollIntoViewIfNeeded();
assert.equal(await page.locator('img').evaluateAll(imgs => imgs.filter(i => i.complete && !i.naturalWidth).length), 0);
assert.deepEqual(errors, []);

// Generate a local sharing image from the same approved fallback typography and demo artwork.
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html><body style="margin:0;background:#2e3029;color:#e3e6e4;font-family:Georgia,serif"><div style="padding:45px 55px"><div style="font:12px Arial;letter-spacing:3px">A VISUAL JOURNAL BY KAREN JOYCE P. DICANG</div><div style="font-size:130px;letter-spacing:-8px;line-height:1.2">MOSAIKO<span style="color:#a18e7c;font-size:65px"> ✳</span></div><div style="font-size:24px;font-style:italic;margin-bottom:30px">Still moments. Moving stories.</div><div style="display:flex;gap:14px">${['photography/IMG_0670%20(1)-thumb.jpg','hills.svg','social-journal.svg','collab.svg'].map((name,i)=>`<div style="width:25%"><img src="http://127.0.0.1:5173/media/${name}" style="width:100%;height:220px;object-fit:cover"/><div style="font:13px Arial;margin-top:12px">${['Photography','Film','Social Media','Collaborations'][i]}</div></div>`).join('')}</div><div style="font:11px Arial;color:#b9b7b1;margin-top:20px">Concept previews / Original demo illustrations</div></div></body></html>`);
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'public/social-cover.png' });
await browser.close();
console.log('Passed: 29 photographs, viewer navigation and wraparound, focus restoration and containment, responsive gallery; other collections, mobile navigation, reduced motion, email action, and no browser errors.');
