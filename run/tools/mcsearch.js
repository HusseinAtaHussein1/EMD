// usage: node mcsearch.js FROM-TO-dd/mm/yyyy FROM-TO-dd/mm/yyyy ...
// Fills the Multi-city legs on Flight Search (form must already be on the Multi-city tab with branch set).
const { run } = require('./lib');
const legs = process.argv.slice(2).map(s => { const [f, t, d] = s.split('-'); return { f, t, d }; });
run(async (p) => {
  const routeDds = () => p.locator('p-dropdown:not([formcontrolname])');
  for (let k = 0; k < legs.length; k++) {
    if (k > 0 && (await routeDds().count()) < 2 * (k + 1)) {
      await p.locator("button:has-text('Add flight')").click();
      await p.waitForTimeout(800);
    }
    for (const [j, code] of [[2 * k, legs[k].f], [2 * k + 1, legs[k].t]]) {
      const dd = routeDds().nth(j);
      const cur = (await dd.innerText()).trim();
      if (cur.startsWith(code)) continue; // auto-filled already
      await dd.click();
      await p.waitForTimeout(600);
      const panel = p.locator('.p-dropdown-panel').last();
      await panel.locator('input.p-dropdown-filter').pressSequentially(code, { delay: 80 });
      await p.waitForTimeout(1500);
      await panel.locator('li[role=option]').filter({ hasText: code }).first().click();
      await p.waitForTimeout(500);
    }
    const di = p.locator('p-calendar[formcontrolname=dateOfJourney] input').nth(k);
    await di.click(); await di.fill('');
    await di.pressSequentially(legs[k].d, { delay: 80 });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(500);
  }
  const dds = await routeDds().allInnerTexts();
  const dates = await p.locator('p-calendar[formcontrolname=dateOfJourney] input').evaluateAll(i => i.map(x => x.value));
  console.log('ROUTE', dds.map(s => s.trim()).join(' | '), 'DATES', dates.join(' | '));
});
