// Logs in using projects/NDC/credentials/credentials.json and the NDC browser profile. Never prints credentials.
const fs = require('fs');
const path = require('path');
const { REPO, run } = require('./lib');
run(async (page) => {
  const profile = JSON.parse(fs.readFileSync(path.join(REPO, 'projects/NDC/browser/profile.json'), 'utf8'));
  const file = JSON.parse(fs.readFileSync(path.join(REPO, 'projects/NDC/credentials/credentials.json'), 'utf8'));
  const c = file.environments[file.activeEnvironment];
  await page.goto('http://192.168.1.80/auth/login', { waitUntil: 'networkidle' });
  await page.fill(profile.login.usernameSelector, c.username);
  await page.fill(profile.login.passwordSelector, c.password);
  await page.click(profile.login.submitSelector);
  await page.waitForSelector(profile.login.successSelector, { timeout: 30000 });
  console.log('Logged in:', page.url());
});
