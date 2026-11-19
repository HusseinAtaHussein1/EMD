// usage: node seatauto.js <nth Select Seat / Change Seats button (0-based)>
// Opens that segment's seat map and, for each non-infant traveller, books the cheapest available seat that is
// not occupied, not an exit-row seat and not already taken in this map. Then confirms the seats.
// Prints "SEAT <traveller> <seat> <price>" lines.
const { run } = require('./lib');
const nth = Number(process.argv[2] || 0);
run(async (p) => {
  if (!(await p.locator('[role=dialog] button[aria-label^="Seat "]').count())) {
    const opener = p.locator("button:has-text('Select Seat'), button:has-text('Change Seats')").nth(nth);
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    await p.waitForTimeout(4000);
  }
  const dlg = p.locator('[role=dialog]').last();
  const title = (await dlg.locator('h2').first().innerText()).trim();
  console.log('MAP', title);
  const travellers = (await dlg.locator('button').allInnerTexts())
    .map(t => t.replace(/\s+/g, ' ').trim())
    .filter(t => /\b(Adult|Child|Infant)\b/.test(t) && /^[A-Z]{2} \d+ /.test(t));
  console.log('TRAVELLERS', JSON.stringify(travellers));
  const used = new Set();
  for (let k = 0; k < travellers.length; k++) {
    const tv = travellers[k];
    if (/\bInfant\b/.test(tv)) { console.log('SKIP infant', tv); continue; }
    const name = tv.split(' ').slice(2, 3)[0]; // first name
    // make this traveller active
    await dlg.locator('button', { hasText: name }).first().click().catch(() => {});
    await p.waitForTimeout(600);
    const seats = await dlg.locator('button[aria-label^="Seat "]').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label')));
    const cand = seats
      .filter(a => a && /available/i.test(a) && !/Occupied/.test(a) && !/exit/i.test(a))
      .map(a => {
        const id = (a.match(/^Seat\s+(\w+)/) || [])[1];
        const pr = (a.match(/EGP\s*([\d,.]+)/) || [])[1];
        return { a, id, price: pr ? Number(pr.replace(/,/g, '')) : 0 };
      })
      .filter(s => s.id)
      .filter(s => !used.has(s.id))
      .sort((x, y) => x.price - y.price || x.id.localeCompare(y.id, undefined, { numeric: true }));
    if (!cand.length) throw new Error('no free seat for ' + tv);
    const s = cand[0];
    await dlg.locator(`button[aria-label^="Seat ${s.id},"]`).first().scrollIntoViewIfNeeded();
    await dlg.locator(`button[aria-label^="Seat ${s.id},"]`).first().click();
    await p.waitForTimeout(1000);
    const bookBtn = dlg.locator('button', { hasText: /^\s*Book \w+ for / }).first();
    const bt = (await bookBtn.innerText()).trim();
    if (!bt.toLowerCase().includes(name.toLowerCase())) throw new Error(`unexpected book button "${bt}" for ${name}`);
    await bookBtn.click();
    await p.waitForTimeout(1200);
    used.add(s.id);
    console.log('SEAT', name, bt.replace(/^Book (\w+) for .*/, '$1'), 'EGP', s.price);
  }
  const confirm = dlg.locator('button', { hasText: /^\s*Confirm/ }).first();
  console.log('confirm button:', (await confirm.innerText()).trim());
  await confirm.click();
  await p.waitForTimeout(2500);
});
