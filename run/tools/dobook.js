// usage: node dobook.js <Book|Hold> <shotName>
// Ticks Terms & Conditions, clicks Book or Hold, confirms the portal's own confirmation dialog if shown,
// waits for the confirmation page and saves a screenshot. Run only after the user approved this booking.
const { run, shot } = require('./lib');
const [action, name] = process.argv.slice(2);
if (!['Book', 'Hold'].includes(action)) throw new Error('action must be Book or Hold');
run(async (p) => {
  const cb = p.locator('input[type=checkbox]').nth(1);
  if (!(await cb.isChecked())) await p.locator('label:has-text("I have read and agree")').click();
  console.log('terms checked:', await cb.isChecked());
  await p.locator(`xpath=//button[normalize-space()="${action}"]`).click();
  await p.waitForTimeout(1500);
  const dlg = p.locator('[role=dialog]').last();
  if (await dlg.count() && await dlg.isVisible()) {
    console.log('dialog:', (await dlg.innerText()).replace(/\s+/g, ' '));
    await dlg.locator(`xpath=.//button[normalize-space()="${action}"]`).click();
  }
  console.log('submitted at', new Date().toISOString());
  await p.waitForURL(u => !u.toString().includes('passenger-details'), { timeout: 240000 });
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.waitForTimeout(4000);
  console.log('URL', p.url());
  // screenshots disabled per user request
  const t = (await p.locator('body').innerText()).replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n');
  const a = t.indexOf('Order Details'); const b = t.indexOf('Fare Details');
  console.log(t.slice(a, b));
});
