// usage: node act.js <op> <args...> [-- <op> <args...>] ...
// ops: click <sel> | clicknth <sel> <n> | fill <sel> <val> | type <sel> <val> (slow, per key) | press <key>
//      wait <ms> | waitfor <sel> | goto <url> | shot <name> | text <sel> (print innerText) | check <sel>
// Selectors are Playwright selectors. Each op runs in order; stops on the first error.
const { run, shot } = require('./lib');
const argv = process.argv.slice(2);
const ops = []; let cur = [];
for (const a of argv) { if (a === '--') { if (cur.length) ops.push(cur); cur = []; } else cur.push(a); }
if (cur.length) ops.push(cur);
run(async (page) => {
  for (const [op, a, b] of ops) {
    switch (op) {
      case 'click': await page.locator(a).first().click({ timeout: 15000 }); break;
      case 'clicknth': await page.locator(a).nth(Number(b)).click({ timeout: 15000 }); break;
      case 'fill': await page.locator(a).first().fill(b, { timeout: 15000 }); break;
      case 'type': await page.locator(a).first().click(); await page.locator(a).first().pressSequentially(b, { delay: 80 }); break;
      case 'press': await page.keyboard.press(a); break;
      case 'wait': await page.waitForTimeout(Number(a)); break;
      case 'waitfor': await page.locator(a).first().waitFor({ timeout: Number(b || 30000) }); break;
      case 'goto': await page.goto(a, { waitUntil: 'networkidle', timeout: 30000 }); break;
      case 'shot': console.log('shot', await shot(page, a)); break;
      case 'text': console.log((await page.locator(a).first().innerText({ timeout: 15000 })).trim()); break;
      case 'check': await page.locator(a).first().check({ timeout: 15000 }); break;
      default: throw new Error('unknown op ' + op);
    }
    console.log('ok', op, a || '', b || '');
  }
});
