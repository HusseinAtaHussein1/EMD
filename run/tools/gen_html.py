# usage: py -I gen_html.py <tcs.json> <out.html>
# Builds the self-contained AdminReportAI.html from the execution workbook dump plus run bookings/findings.
import sys, json, html
tcs = json.load(open(sys.argv[1], encoding='utf-8'))
e = lambda s: html.escape(s or '')

BK = {
 'B1': ('Y7SS4Z', 'BRN222NDCORD261119RDYIYL', 'One-way CAI→JED 30/11', '1 ADT', 'Book'),
 'B2': ('Y7TVJ8', 'BRN222NDCORD261119VNCO5Z', 'One-way CAI→JED 30/11', '1 ADT + 1 CHD', 'Book'),
 'B3': ('Y7UQJD', 'BRN222NDCORD261119C666FE', 'Round trip CAI⇄JED 30/11', '1 ADT', 'Book'),
 'B4': ('Y7YFIJ', 'BRN222NDCORD261119I3M9RE', 'Round trip CAI⇄DXB 30/11', '2 ADT + 1 CHD + 1 INF', 'Book'),
 'B5': ('Y83D84', 'BRN222NDCORD261119IIORTX', 'Multi-city CAI→DXB→CAI→JED 07–09/12', '1 ADT', 'Book'),
 'B6': ('Y842TP', 'BRN222NDCORD261119QR8606', 'Multi-city CAI→DXB→CAI→JED 07–09/12', '1 ADT + 2 CHD + 1 INF', 'Book'),
 'B7': ('Y8645Q', 'BRN222NDCORD261119XDPRAO', 'One-way CAI→JED 30/11', '1 ADT + 1 CHD + 1 INF', 'Hold → Pay'),
 'B8': ('Y86K5V', 'BRN222NDCORD2611192BB3PS', 'One-way CAI→JED 30/11', '1 ADT', 'Hold → Cancel'),
 'B9': ('Y87CR2', 'BRN222NDCORD2611190BFI40', 'Round trip CAI⇄DXB 30/11', '1 ADT + 1 CHD', 'Hold → Pay'),
 'B10': ('Y893NB', 'BRN222NDCORD261119LU72KG', 'Multi-city CAI→DXB→CAI→JED 07–09/12', '1 ADT + 1 CHD', 'Hold → Pay'),
}
BK_RES = {
 'B1': ('Pass', 'Pass', 'Pass'), 'B2': ('Pass', 'Pass', 'Pass'), 'B3': ('Pass', 'Pass', 'Pass'),
 'B4': ('Pass', 'Pass', 'Pass'), 'B5': ('Pass', 'Pass', 'Pass'), 'B6': ('Pass', 'Pass', 'Pass'),
 'B7': ('Pass', 'Pass', 'Pass'), 'B8': ('No EMD (hold)', 'No EMD', 'No EMD'),
 'B9': ('Pass', 'Pass', 'Pass'), 'B10': ('Pass', 'Pass', 'Pass'),
}
TC2B = {}
for b, ids in {'B1': '001 002 003 009 011 013 017 024', 'B2': '005 008', 'B3': '006 015 025 027',
               'B4': '007 010 016 026', 'B5': '028', 'B6': '029', 'B7': '030 031 032 034', 'B8': '033',
               'B9': '030 031 032 034', 'B10': '030 031 032 034'}.items():
    for i in ids.split():
        TC2B.setdefault('TC-SEATEMD-' + i, []).append(b)

def status_of(t):
    s = t['Status']
    return 'Not Run' if s in ('Not Executed', '') else s

def chip(v):
    if not v: return '<span class="cell-na">—</span>'
    cls = 'pass' if v.startswith('Pass') else 'fail' if v.startswith('Fail') else 'blocked' if v.startswith('Blocked') else 'na'
    label = 'Not run' if v.startswith('Not Run') else v
    return f'<span class="chip {cls}">{e(label)}</span>'

counts = {}
for t in tcs: counts[status_of(t)] = counts.get(status_of(t), 0) + 1
total = len(tcs)

rows = []
for t in sorted(tcs, key=lambda x: x['TC ID']):
    st = status_of(t)
    bks = TC2B.get(t['TC ID'], [])
    bk_html = ' '.join(f'<span class="bk" title="{e(BK[b][2])} · {e(BK[b][3])}">{b} · {BK[b][0]}</span>' for b in bks) or '<span class="cell-na">—</span>'
    detail = ''.join(f'<div class="kv"><div class="k">{k}</div><div class="v">{e(t.get(k, ""))}</div></div>'
                     for k in ['Expected Result', 'Actual Result', 'Comments', 'Test Data', 'Traceability (FR | AC)'] if t.get(k))
    rows.append(f'''<tr class="tc" data-status="{e(st)}" data-text="{e((t['TC ID']+' '+t['Test Case Title']+' '+t['Section']).lower())}">
<td class="mono">{e(t['TC ID'].replace('TC-SEATEMD-', ''))}</td>
<td><div class="title">{e(t['Test Case Title'])}</div><div class="sub">{e(t['Section'])} · {e(t['Priority'])} · {e(t['Trip Type'])}</div></td>
<td>{chip(st)}</td>
<td class="hide-sm">{chip(t['Booking Confirmation'])}</td><td class="hide-sm">{chip(t['PNR Query'])}</td><td class="hide-sm">{chip(t['Itinerary'])}</td><td class="hide-sm">{chip(t['Finance Report'])}</td>
<td class="hide-sm">{bk_html}</td>
<td><button class="more" aria-expanded="false" aria-label="Show details for {e(t['TC ID'])}">Details</button></td></tr>
<tr class="detail" hidden><td colspan="9"><div class="detail-body">{detail}</div></td></tr>''')

bk_rows = ''.join(
    f'<tr><td class="mono">{b}</td><td>{e(v[2])}</td><td>{e(v[3])}</td><td>{e(v[4])}</td><td class="mono">{v[0]}</td>'
    f'<td class="mono hide-sm">{v[1]}</td><td>{chip(BK_RES[b][0])}</td><td>{chip(BK_RES[b][1])}</td><td>{chip(BK_RES[b][2])}</td></tr>'
    for b, v in BK.items())

findings = [
 ('Defect', 'Cancel Hold fails silently (B8, PNR Y86K5V): POST /odeysysadmin/v2/bookingDetails2/cancel-void-ticket returns HTTP 500 "Invalid request…"; no UI message; booking stays On Hold. Blocks TC-033.'),
 ('Issue', 'Bookings failed with "The requested flight or class is no longer available." — CAI⇄JED round trip (3 attempts, flights #2 and #3) and CAI→JED→CAI→DXB multi-city (1 attempt). Wallet not charged on the attempt checked.'),
 ('Issue', 'Long passenger names with an infant: Next returns "Invalid request… Adult (QaRunFourA Tester)". Short letters-only names work.'),
 ('Observation', 'PNR Query Flight Legs show times 1 hour earlier than Booking Confirmation and Itinerary on every booking.'),
 ('Observation', 'Itinerary shows CAI→DXB duration as 5h 15m (local times 09:45–15:00 / 13:45–19:00 give 3h 15m).'),
 ('Observation', 'Some seats show no EMD (user confirmed correct): B3 return seat; B4 onward free seats and child return seat; B9 return seats (MS906); B5/B6/B10 leg DXB→CAI seats (MS913).'),
 ('Observation', 'Pay on a held booking is only available after taking the Lock in PNR Query (then Confirm To Pay → Pay). Held bookings show no EMD until paid.'),
 ('Observation', 'Meal ancillaries show an order-item ID (e.g. 1H2MSZ_…-37) without an "EMD" label or connected ticket; user confirmed this as the expected value.'),
]
fd = ''.join(f'<li><span class="tag {k.lower()}">{k}</span><span>{e(v)}</span></li>' for k, v in findings)

def stat(label, n, cls):
    return f'<div class="stat {cls}"><div class="n">{n}</div><div class="l">{label}</div></div>'

page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>EMD Admin Report</title>
<style>
:root {{ --bg:#f6f7f9; --surface:#ffffff; --text:#1b1f24; --muted:#5b6470; --border:#e3e6ea;
 --pass:#1a7f37; --pass-bg:#e6f4ea; --fail:#c62828; --fail-bg:#fdecea; --blocked:#9a6700; --blocked-bg:#fff4d6;
 --na:#57606a; --na-bg:#eef0f3; --accent:#1f4fd1; --accent-bg:#e8eefc; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#0f1216; --surface:#171b21; --text:#e6e9ee; --muted:#9aa4b2; --border:#2a313b;
 --pass:#56d364; --pass-bg:#10291a; --fail:#ff7b72; --fail-bg:#3a1513; --blocked:#e3b341; --blocked-bg:#33280c; --na:#9aa4b2; --na-bg:#232a33; --accent:#79a6ff; --accent-bg:#17233d; }} }}
:root[data-theme="dark"] {{ --bg:#0f1216; --surface:#171b21; --text:#e6e9ee; --muted:#9aa4b2; --border:#2a313b;
 --pass:#56d364; --pass-bg:#10291a; --fail:#ff7b72; --fail-bg:#3a1513; --blocked:#e3b341; --blocked-bg:#33280c; --na:#9aa4b2; --na-bg:#232a33; --accent:#79a6ff; --accent-bg:#17233d; }}
* {{ box-sizing:border-box; }}
body {{ margin:0; background:var(--bg); color:var(--text); font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }}
.wrap {{ max-width:1200px; margin:0 auto; padding:24px 16px 48px; }}
h1 {{ font-size:22px; margin:0 0 4px; }} h2 {{ font-size:16px; margin:32px 0 12px; }}
.meta {{ color:var(--muted); font-size:13px; }}
.meta b {{ color:var(--text); font-weight:600; }}
.card {{ background:var(--surface); border:1px solid var(--border); border-radius:10px; }}
.stats {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:12px; margin-top:20px; }}
.stat {{ padding:14px 16px; background:var(--surface); border:1px solid var(--border); border-radius:10px; }}
.stat .n {{ font-size:26px; font-weight:700; font-variant-numeric:tabular-nums; }} .stat .l {{ color:var(--muted); font-size:12px; }}
.stat.pass .n {{ color:var(--pass); }} .stat.blocked .n {{ color:var(--blocked); }} .stat.fail .n {{ color:var(--fail); }} .stat.na .n {{ color:var(--na); }}
.bar {{ display:flex; height:8px; border-radius:4px; overflow:hidden; margin-top:12px; background:var(--na-bg); }}
.bar span {{ display:block; }}
.scroll {{ overflow-x:auto; }}
table {{ width:100%; border-collapse:collapse; }}
th, td {{ text-align:left; padding:10px 12px; border-bottom:1px solid var(--border); vertical-align:top; }}
th {{ font-size:12px; color:var(--muted); font-weight:600; white-space:nowrap; background:var(--surface); position:sticky; top:0; }}
tr:last-child td {{ border-bottom:none; }}
.mono {{ font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:12.5px; white-space:nowrap; }}
.title {{ font-weight:600; }} .sub {{ color:var(--muted); font-size:12px; }}
.chip {{ display:inline-block; padding:2px 8px; border-radius:999px; font-size:12px; font-weight:600; white-space:nowrap; }}
.chip.pass {{ color:var(--pass); background:var(--pass-bg); }} .chip.fail {{ color:var(--fail); background:var(--fail-bg); }}
.chip.blocked {{ color:var(--blocked); background:var(--blocked-bg); }} .chip.na {{ color:var(--na); background:var(--na-bg); }}
.cell-na {{ color:var(--muted); }}
.bk {{ display:inline-block; margin:0 4px 4px 0; padding:1px 6px; border:1px solid var(--border); border-radius:6px; font-size:12px; font-family:ui-monospace,Consolas,monospace; white-space:nowrap; }}
.toolbar {{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:12px; }}
.toolbar input {{ flex:1 1 220px; min-width:0; padding:8px 10px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); font:inherit; }}
.filter, .more {{ padding:6px 10px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); font:inherit; font-size:13px; cursor:pointer; }}
.filter[aria-pressed="true"] {{ background:var(--accent-bg); border-color:var(--accent); color:var(--accent); }}
.more:hover, .filter:hover {{ border-color:var(--accent); }}
.detail td {{ background:var(--bg); }}
.detail-body {{ display:grid; gap:10px; padding:4px 0; }}
.kv {{ display:grid; grid-template-columns:180px 1fr; gap:12px; }} .kv .k {{ color:var(--muted); font-size:12px; font-weight:600; }}
.kv .v {{ white-space:pre-wrap; word-break:break-word; }}
ul.findings {{ list-style:none; margin:0; padding:0; }}
ul.findings li {{ display:flex; gap:10px; padding:12px 16px; border-bottom:1px solid var(--border); }} ul.findings li:last-child {{ border-bottom:none; }}
.tag {{ flex:none; font-size:11px; font-weight:700; padding:2px 8px; border-radius:6px; height:fit-content; text-transform:uppercase; letter-spacing:.02em; }}
.tag.defect {{ color:var(--fail); background:var(--fail-bg); }} .tag.issue {{ color:var(--blocked); background:var(--blocked-bg); }} .tag.observation {{ color:var(--accent); background:var(--accent-bg); }}
.note {{ color:var(--muted); font-size:12.5px; margin-top:8px; }}
.empty {{ padding:20px; color:var(--muted); text-align:center; }}
@media (max-width: 760px) {{ .hide-sm {{ display:none; }} .kv {{ grid-template-columns:1fr; gap:2px; }} th, td {{ padding:8px; }} }}
</style></head>
<body><main class="wrap">
<h1>EgyptAir Seat Map / Ancillary EMD — Admin Test Report</h1>
<div class="meta">Run date <b>19/11/2026</b> · Environment <b>http://192.168.1.80</b> · User <b>e.saady</b> · Branch <b>NDC1_Hussein (BRN222)</b> · Supplier <b>EgyptAirEgy STG</b> · Skill <b>ndc-emd-booking-verification</b></div>
<div class="meta">Process per booking: search → book → user confirms the displayed EMDs → verify the same EMDs on PNR Query and Itinerary (correct passenger, segment, ancillary, connected ticket). Finance Report excluded by the user.</div>

<div class="stats">
{stat('Total test cases', total, '')}{stat('Pass', counts.get('Pass', 0), 'pass')}{stat('Fail', counts.get('Fail', 0), 'fail')}{stat('Blocked', counts.get('Blocked', 0), 'blocked')}{stat('Not run', counts.get('Not Run', 0), 'na')}{stat('Bookings verified', 9, '')}
</div>
<div class="bar" role="img" aria-label="Pass {counts.get('Pass',0)}, Blocked {counts.get('Blocked',0)}, Not run {counts.get('Not Run',0)} of {total}">
<span style="width:{counts.get('Pass',0)/total*100:.2f}%;background:var(--pass)"></span><span style="width:{counts.get('Fail',0)/total*100:.2f}%;background:var(--fail)"></span><span style="width:{counts.get('Blocked',0)/total*100:.2f}%;background:var(--blocked)"></span><span style="width:{counts.get('Not Run',0)/total*100:.2f}%;background:var(--na)"></span>
</div>

<h2>Test cases and results</h2>
<div class="toolbar">
<input id="q" type="search" placeholder="Search by TC ID, title or section" aria-label="Search test cases">
<button class="filter" data-f="all" aria-pressed="true">All ({total})</button>
<button class="filter" data-f="Pass" aria-pressed="false">Pass ({counts.get('Pass',0)})</button>
<button class="filter" data-f="Blocked" aria-pressed="false">Blocked ({counts.get('Blocked',0)})</button>
<button class="filter" data-f="Not Run" aria-pressed="false">Not run ({counts.get('Not Run',0)})</button>
</div>
<div class="card scroll"><table id="tct">
<thead><tr><th>TC</th><th>Test case</th><th>Status</th><th class="hide-sm">Booking Conf.</th><th class="hide-sm">PNR Query</th><th class="hide-sm">Itinerary</th><th class="hide-sm">Finance Report</th><th class="hide-sm">Booking(s)</th><th></th></tr></thead>
<tbody>{''.join(rows)}</tbody></table><div id="empty" class="empty" hidden>No test cases match.</div></div>
<div class="note">Blank location cells mean that location was not part of that test case. Finance Report was excluded by the user for all cases.</div>

<h2>Bookings</h2>
<div class="card scroll"><table>
<thead><tr><th>#</th><th>Trip</th><th>Passengers</th><th>Action</th><th>PNR</th><th class="hide-sm">Order</th><th>Booking Conf.</th><th>PNR Query</th><th>Itinerary</th></tr></thead>
<tbody>{bk_rows}</tbody></table></div>
<div class="note">Failed attempts (no PNR, not counted): B4 CAI⇄JED orders …UJZKMD, …LN7TMJ, …MQ783G; B5 first route order …F4EBPQ. Bookings before the restart: Y7Q77S, Y7R6AM, Y7RQC2. All bookings are real wallet-paid tickets on staging; B8 hold Y86K5V remains On Hold (expires 20/11/2026).</div>

<h2>Defects and observations</h2>
<div class="card"><ul class="findings">{fd}</ul></div>
</main>
<script>
(function(){{
  var q=document.getElementById('q'), f='all', rows=[].slice.call(document.querySelectorAll('tr.tc')), empty=document.getElementById('empty');
  function apply(){{ var s=q.value.trim().toLowerCase(), shown=0;
    rows.forEach(function(r){{ var ok=(f==='all'||r.dataset.status===f)&&(!s||r.dataset.text.indexOf(s)>-1);
      r.hidden=!ok; var d=r.nextElementSibling; if(!ok){{ d.hidden=true; r.querySelector('.more').setAttribute('aria-expanded','false'); }} if(ok) shown++; }});
    empty.hidden=shown>0; }}
  q.addEventListener('input',apply);
  [].forEach.call(document.querySelectorAll('.filter'),function(b){{ b.addEventListener('click',function(){{
    f=b.dataset.f; [].forEach.call(document.querySelectorAll('.filter'),function(x){{x.setAttribute('aria-pressed',x===b?'true':'false');}}); apply(); }}); }});
  [].forEach.call(document.querySelectorAll('.more'),function(b){{ b.addEventListener('click',function(){{
    var d=b.closest('tr').nextElementSibling, open=d.hidden; d.hidden=!open; b.setAttribute('aria-expanded',open?'true':'false'); b.textContent=open?'Hide':'Details'; }}); }});
}})();
</script>
</body></html>'''
open(sys.argv[2], 'w', encoding='utf-8').write(page)
print('written', sys.argv[2], len(page), 'bytes;', counts)
