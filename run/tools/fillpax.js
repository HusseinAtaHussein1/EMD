// usage: node fillpax.js <idx> <Title> <First> <Last> <DOB dd/mm/yyyy> <Gender> <DocNo> <DocExpiry dd/mm/yyyy> <Nationality> [email] [phone]
// Fills one passenger block (index idx, 0-based) on the Passenger Details step with dummy test data.
const { run } = require('./lib');
const [idx, title, first, last, dob, gender, doc, exp, nat, email, phone] = process.argv.slice(2);
async function pick(page, dropdown, text) {
  await dropdown.scrollIntoViewIfNeeded();
  for (let k = 0; k < 3; k++) {
    if (await page.locator('.p-dropdown-panel').count()) break;
    await dropdown.locator('.p-dropdown-trigger, .p-dropdown').first().click();
    await page.waitForTimeout(700);
  }
  const panel = page.locator('.p-dropdown-panel').last();
  const filter = panel.locator('input.p-dropdown-filter');
  if (await filter.count()) { await filter.pressSequentially(text, { delay: 60 }); await page.waitForTimeout(800); }
  await panel.locator('li[role=option]', { hasText: text }).first().click();
  await page.waitForTimeout(300);
}
async function date(page, sel, val) {
  const el = page.locator(sel);
  await el.click(); await el.fill('');
  await el.pressSequentially(val, { delay: 70 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}
run(async (page) => {
  const i = Number(idx);
  const block = page.locator(`#firstName_${i}`).locator('xpath=ancestor::form[1]');
  const scope = (await block.count()) ? block : page;
  await pick(page, page.locator('p-dropdown[formcontrolname=title]').nth(i), title);
  await page.fill(`#firstName_${i}`, first);
  await page.fill(`#lastName_${i}`, last);
  await date(page, `#dob_${i}`, dob);
  // Gender is derived from Title and disabled in the portal; only pick it if it is editable.
  if (!(await page.locator(`#gender_${i} .p-disabled, #gender_${i}.p-disabled, #gender_${i} [aria-disabled=true]`).count())
      && gender && gender !== '-') {
    try { await pick(page, page.locator(`#gender_${i}`), gender); } catch { await page.keyboard.press('Escape'); }
  }
  if (email) await page.fill(`#email_${i}`, email);
  if (phone) await page.fill(`#phone_${i}`, phone);
  await page.fill(`#document_${i}`, doc);
  await date(page, `#docExpiry_${i}`, exp);
  await pick(page, page.locator('p-dropdown[formcontrolname=nationality]').nth(i), nat);
  const vals = await page.evaluate((i) => ['firstName', 'lastName', 'dob', 'email', 'phone', 'document', 'docExpiry']
    .map(k => `${k}=${(document.getElementById(`${k}_${i}`) || {}).value}`).join(' | '), i);
  console.log('PAX', i, vals);
});
