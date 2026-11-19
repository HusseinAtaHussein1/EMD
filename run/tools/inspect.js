// usage: node inspect.js [url] [screenshotName] [scopeSelector]
// Optionally navigates, then lists visible inputs/buttons/links/dropdowns and visible headings, and takes a screenshot.
const { run, shot } = require('./lib');
const [url, name, scope] = process.argv.slice(2);
run(async (page) => {
  if (url && url !== '-') await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(800);
  const info = await page.evaluate((scope) => {
    const root = scope ? document.querySelector(scope) : document.body;
    if (!root) return { error: 'scope not found' };
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const txt = el => (el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    const out = [];
    root.querySelectorAll('input,button,a,select,textarea,p-dropdown,p-multiselect,p-calendar,[role=button],[role=tab],label,h1,h2,h3,h4,h5').forEach(el => {
      if (!vis(el)) return;
      const tag = el.tagName.toLowerCase();
      const id = el.id ? '#' + el.id : '';
      const nm = el.getAttribute('name') ? `[name=${el.getAttribute('name')}]` : '';
      const fc = el.getAttribute('formcontrolname') ? `[fc=${el.getAttribute('formcontrolname')}]` : '';
      const type = el.getAttribute('type') ? `(${el.getAttribute('type')})` : '';
      const extra = tag === 'input' && (el.type === 'checkbox' || el.type === 'radio') ? (el.checked ? ' [x]' : ' [ ]') : '';
      const t = txt(el);
      if (tag === 'a' && !t) return;
      out.push(`${tag}${type}${id}${nm}${fc}${extra} ${t}`);
    });
    return { url: location.href, items: [...new Set(out)] };
  }, scope || null);
  console.log(JSON.stringify(info, null, 0).replace(/","/g, '"\n"'));
  if (name) console.log('shot', await shot(page, name));
});
