// Logs in to the agency portal (:9500) using the AGN2 block of projects/NDC/credentials/credentials.json.
// Never prints credentials.
const fs = require('fs');
const path = require('path');
const { REPO, run } = require('./lib');
run(async (page) => {
  const file = JSON.parse(fs.readFileSync(path.join(REPO, 'projects/NDC/credentials/credentials.json'), 'utf8'));
  const c = file.environments.AGN2;
  await page.goto(c.baseUrl + '/auth/login', { waitUntil: 'networkidle' });
  await page.fill('#id-AgencyCode', c.agencyCode);
  await page.fill('#id-Email', c.username);
  await page.fill('#id-Password', c.password);
  await page.locator('button[type=submit]:has-text("Login")').click();
  for (let k = 0; k < 30; k++) {
    await page.waitForTimeout(1000);
    if (!page.url().includes('/auth/login')) break;
  }
  await page.waitForTimeout(2000);
  const msg = await page.evaluate(() => [...document.querySelectorAll('.p-toast-message')].map(e => e.innerText.trim().replace(/\s+/g, ' ')).join(' | '));
  console.log('URL after login:', page.url(), msg ? 'MSG: ' + msg : '');
});
