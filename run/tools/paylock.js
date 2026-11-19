// usage: node paylock.js <PNR> <OrderId>
// Pays a held booking as instructed by the user: PNR Query -> Lock -> Booking Details -> Confirm To Pay
// -> tick Terms -> Pay, waits for the processing dialog, then prints the resulting status/page text.
const { run } = require('./lib');
const [pnr, order] = process.argv.slice(2);
async function settle(p) {
  for (let k = 0; k < 30; k++) { if (!/\bLoading\b/.test(await p.locator('body').innerText())) break; await p.waitForTimeout(2000); }
  await p.waitForTimeout(2000);
}
run(async (p) => {
  await p.goto('http://192.168.1.80/dashboard', { waitUntil: 'networkidle' }).catch(() => {});
  await p.locator('#p-tabpanel-8-label').click();
  await p.locator('#id-Search').waitFor({ timeout: 30000 });
  await p.fill('#id-Search', pnr);
  await p.locator("button[type=submit]:has-text('Search')").click();
  await p.waitForTimeout(3000); await settle(p);
  const lb = p.locator('button:has(.pi-lock-open)');
  if (await lb.count()) { await lb.first().click(); await p.waitForTimeout(3000); }
  let t = (await p.locator('body').innerText()).replace(/\s+/g, ' ');
  console.log('LOCK', t.slice(t.indexOf('Lock Info'), t.indexOf('Lock Info') + 60));
  await p.goto(`http://192.168.1.80/booking/booking-details/${order}`, { waitUntil: 'networkidle' }).catch(() => {});
  await settle(p);
  await p.locator('button:has-text("Confirm To Pay")').click();
  await p.waitForTimeout(3000);
  const lbl = p.locator('label:has-text("I have read and agree")').last();
  if (await lbl.count()) await lbl.click();
  await p.waitForTimeout(500);
  const resp = [];
  p.on('response', async r => { const m = r.request().method(); if (m === 'POST' && /pay|book|issue|ticket/i.test(r.url())) { let b = ''; try { b = (await r.text()).replace(/\s+/g, ' ').slice(0, 200); } catch {} resp.push(`${r.status()} ${r.url().replace(/\?.*/, '').slice(-70)} :: ${b}`); } });
  await p.locator('xpath=//button[normalize-space()="Pay"]').last().click();
  console.log('Pay clicked at', new Date().toISOString());
  await p.waitForTimeout(3000);
  for (let k = 0; k < 80; k++) {
    if (!(await p.locator('[role=dialog]:visible:has-text("Booking Process")').count())) break;
    await p.waitForTimeout(3000);
  }
  await p.waitForTimeout(5000);
  console.log('RESP', JSON.stringify(resp));
  console.log('URL', p.url());
  t = (await p.locator('body').innerText()).replace(/\s+/g, ' ');
  const i = t.indexOf('BOOKING STATUS'), j = t.indexOf('GDS PNR Number');
  console.log(i >= 0 ? t.slice(i, i + 100) : t.slice(j, j + 160));
});
