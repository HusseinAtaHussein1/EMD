# usage: py -I xl_update.py <workbook.xlsx> <updates.json>
# updates.json: {"TC-SEATEMD-001": {"Actual Result": "...", "Status": "Pass", "Booking Confirmation": "Pass", ...}, ...}
# Any earlier Status/Date/Comments on a row are kept by prefixing them into Comments as "Previous run ...".
import sys, json, openpyxl
wb_path, upd_path = sys.argv[1], sys.argv[2]
updates = json.load(open(upd_path, encoding='utf-8'))
wb = openpyxl.load_workbook(wb_path)
ws = wb['Test Cases']
hdr = {c.value: c.column for c in ws[1]}
done = set()
for row in ws.iter_rows(min_row=2):
    tc = row[0].value
    if tc not in updates:
        continue
    u = dict(updates[tc])
    prev_status = row[hdr['Status'] - 1].value
    prev_date = row[hdr['Execution Date'] - 1].value
    prev_comments = row[hdr['Comments'] - 1].value
    if prev_status and prev_status != 'Not Executed' and prev_date and str(prev_date) != u.get('Execution Date'):
        prev = f"Previous run {prev_date}: {prev_status}" + (f" ({', '.join(f'{k}={row[hdr[k]-1].value}' for k in ['Booking Confirmation','PNR Query','Itinerary','Finance Report'] if row[hdr[k]-1].value)})" if any(row[hdr[k]-1].value for k in ['Booking Confirmation','PNR Query','Itinerary','Finance Report']) else '')
        if prev_comments:
            prev += f"; earlier comments: {prev_comments}"
        u['Comments'] = (u.get('Comments', '') + ' | ' + prev).strip(' |')
    for k, v in u.items():
        if k not in hdr:
            raise SystemExit(f'unknown column {k}')
        row[hdr[k] - 1].value = v
    done.add(tc)
wb.save(wb_path)
missing = set(updates) - done
print('updated', sorted(done), 'missing', sorted(missing))
