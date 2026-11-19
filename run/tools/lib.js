// Shared helper for step scripts: attaches to the already-open test Chrome window (local port 9333)
// and returns its active page. Disconnecting leaves the window and session open for the next step.
const path = require('path');
const REPO = require('path').resolve(__dirname, '../..');
const { chromium } = require(path.join(REPO, 'node_modules/playwright'));
const OUT = __dirname;
const EVID = path.join(REPO, 'projects/NDC/workspace/discovery/SeatMapEMD_evidence');

async function attach() {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[pages.length - 1];
  page.on('dialog', d => { console.log('DIALOG', d.type(), d.message()); d.dismiss(); });
  return { browser, context, page };
}

async function shot(page, name, dir = OUT) {
  const f = path.join(dir, name.endsWith('.png') ? name : name + '.png');
  await page.screenshot({ path: f, fullPage: true });
  return f;
}

async function run(fn) {
  const { browser, page } = await attach();
  try { await fn(page); }
  catch (e) { console.error('ERR', String(e.message).split('\n').slice(0, 8).join('\n')); process.exitCode = 1; }
  finally { await browser.close(); } // CDP: disconnects only, the window stays open
}

module.exports = { REPO, OUT, EVID, attach, shot, run };
