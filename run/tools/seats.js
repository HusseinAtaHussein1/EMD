// usage: node seats.js [pick <seatId>]
// Lists seat buttons in the open seat map (id/aria/title/disabled) or clicks one seat by its label (e.g. 24C).
const { run } = require('./lib');
const [op, seat] = process.argv.slice(2);
run(async (page) => {
  const dlg = page.locator('[role=dialog]').last();
  const seats = await dlg.locator('button').evaluateAll(bs => bs.map(b => ({
    t: b.innerText.trim(), aria: b.getAttribute('aria-label'), title: b.getAttribute('title'),
    dis: b.disabled || b.getAttribute('aria-disabled') === 'true', cls: b.className,
    data: Object.fromEntries([...b.attributes].filter(a => a.name.startsWith('data-')).map(a => [a.name, a.value])),
  })).filter(s => s.t.length <= 3 && /^[A-K]$/.test(s.t)));
  if (op !== 'pick') {
    seats.filter(s => !/Occupied/.test(s.aria || '')).slice(0, 30).forEach(s => console.log(s.aria));
    console.log('total', seats.length); return;
  }
  const btn = dlg.locator(`button[aria-label*="${seat}"]`).first();
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForTimeout(1000);
  const actions = await dlg.locator('button').allInnerTexts();
  console.log('Buttons now:', actions.map(t => t.trim().replace(/\s+/g, ' ')).filter(t => t.length > 3).join(' | '));
});
