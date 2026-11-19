// usage: node verify.js <PNR> <OrderId> <label> <EMD1,EMD2,...>
// 1) PNR Query by PNR: prints the Ancillaries section and whether each expected EMD is present.
// 2) Itinerary: opens Booking Details (same page the Search Booking grid opens) and does the same
//    for the "Segment Ancillaries" section. Saves screenshots pnrquery_<label>_<PNR>.png / itinerary_<label>_<PNR>.png.
const { run, shot } = require('./lib');
const [pnr, order, label, list] = process.argv.slice(2);
const emds = list.split(',').filter(Boolean);
async function settle(p) {
  for (let k = 0; k < 40; k++) { if (!/\bLoading\b/.test(await p.locator('body').innerText())) break; await p.waitForTimeout(2000); }
  await p.waitForTimeout(2000);
}
function norm(t) { return t.replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n'); }
run(async (p) => {
  // PNR Query
  await p.goto('http://192.168.1.80/pnr-query', { waitUntil: 'networkidle' }).catch(() => {});
  if (!(await p.locator('#id-Search').count())) { await p.locator('#p-tabpanel-8-label').click(); await p.waitForTimeout(2000); }
  await p.fill('#id-Search', pnr);
  await p.locator("button[type=submit]:has-text('Search')").click();
  await p.waitForTimeout(3000);
  await settle(p);
  let t = norm(await p.locator('body').innerText());
  const a = t.indexOf('Flight Legs'), b = t.indexOf('Passenger List');
  console.log('=== PNR QUERY', pnr, '===\n' + t.slice(a, b));
  for (const e of emds) console.log('PNRQ contains', e, t.includes(e));
  // no screenshot
  // Itinerary
  await p.goto(`http://192.168.1.80/booking/booking-details/${order}`, { waitUntil: 'networkidle' }).catch(() => {});
  await settle(p);
  t = norm(await p.locator('body').innerText());
  const c = t.indexOf('Journey Details'), d = t.indexOf('View Passenger Details');
  console.log('=== ITINERARY', order, '===\n' + t.slice(c, d));
  for (const e of emds) console.log('ITIN contains', e, t.includes(e));
  // no screenshot
});
