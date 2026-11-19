import sys, json, openpyxl
wb = openpyxl.load_workbook(sys.argv[1]); ws = wb['Test Cases']
hdr = [c.value for c in ws[1]]
rows = [dict(zip(hdr, [("" if v is None else str(v)) for v in r])) for r in ws.iter_rows(min_row=2, values_only=True) if r[0]]
json.dump(rows, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(rows), hdr)
