// usage: node pickopt.js <formcontrolname> <nth dropdown, 0-based> <option text | #index>
// Opens the nth PrimeNG dropdown with that formcontrolname, prints all options, and picks one.
const { run } = require('./lib');
const [fc, nth, want] = process.argv.slice(2);
run(async (page) => {
  const dd = page.locator(`p-dropdown[formcontrolname=${fc}]`).nth(Number(nth));
  await dd.scrollIntoViewIfNeeded();
  await dd.click();
  await page.waitForTimeout(800);
  const opts = page.locator('.p-dropdown-panel').last().locator('li[role=option]');
  const texts = (await opts.allInnerTexts()).map(t => t.trim().replace(/\s+/g, ' '));
  texts.forEach((t, i) => console.log(`  [${i}] ${t}`));
  let target;
  if (want.startsWith('#')) target = opts.nth(Number(want.slice(1)));
  else target = opts.filter({ hasText: want }).first();
  await target.click();
  await page.waitForTimeout(800);
  console.log('SELECTED', (await dd.innerText()).trim().replace(/\s+/g, ' '));
});
