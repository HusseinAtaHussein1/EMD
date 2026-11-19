// usage: node paxsearch.js <adults> <children> <infants> [search]
// Sets passenger counts in the Flight Search passenger popover (starts from the default 1 adult),
// optionally clicks Search, waits for results and prints the first 6 result cards.
const { run, shot } = require('./lib');
const [ad, ch, inf, doSearch] = process.argv.slice(2);
run(async (page) => {
  const want = { Adults: Number(ad), Children: Number(ch), Infants: Number(inf) };
  const toggle = page.locator('button').filter({ has: page.locator('svg, i') }).filter({ hasText: /^\s*\d+\s*$/ }).first();
  await toggle.click();
  await page.waitForTimeout(800);
  for (const [label, n] of Object.entries(want)) {
    const row = page.locator('div', { has: page.locator(`text="${label}"`) })
      .filter({ has: page.locator('button') }).last();
    const btns = row.locator('button');
    const plus = btns.last();
    // read current count (number text inside the row)
    let cur = Number(((await row.innerText()).match(/\b(\d+)\s*$/m) || [0, label === 'Adults' ? 1 : 0])[1]);
    const nums = (await row.innerText()).match(/\d+/g) || [];
    cur = Number(nums.filter(x => x.length <= 1).pop() ?? cur);
    for (let i = cur; i < n; i++) { await plus.click(); await page.waitForTimeout(300); }
    for (let i = cur; i > n; i--) { await btns.first().click(); await page.waitForTimeout(300); }
  }
  await page.keyboard.press('Escape');
  await page.mouse.click(10, 300);
  await page.waitForTimeout(500);
  console.log('pax button now:', (await toggle.innerText()).trim());
  console.log(await shot(page, 'search_form_pax'));
  if (doSearch !== 'search') return;
  await page.locator("button:has-text('Search'):not(:has-text('Supplier'))").click();
  await page.locator("button:has-text('Book Flight')").first().waitFor({ timeout: 120000 });
  await page.waitForTimeout(1500);
  const header = (await page.locator('body').innerText()).match(/NDC1_Hussein \(BRN222\)[^\n]*\n?[^\n]*/);
  console.log('header:', header && header[0].replace(/\s+/g, ' '));
  const cards = await page.locator("div:has(> * button:has-text('Book Flight'))").allInnerTexts();
  const seen = new Set();
  let k = 0;
  for (const c of cards) {
    const s = c.replace(/\s+/g, ' ').slice(0, 200);
    if (seen.has(s)) continue; seen.add(s);
    console.log(`#${++k}`, s);
    if (k >= 6) break;
  }
});
