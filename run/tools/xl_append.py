# usage: py -I xl_append.py <workbook> <json {tc: {"Actual Result": "...", "Comments": "..."}}> — appends text to existing cells
import sys, json, openpyxl
wb = openpyxl.load_workbook(sys.argv[1]); ws = wb['Test Cases']
hdr = {c.value: c.column for c in ws[1]}
upd = json.load(open(sys.argv[2], encoding='utf-8'))
for row in ws.iter_rows(min_row=2):
    tc = row[0].value
    if tc in upd:
        for k, v in upd[tc].items():
            cell = row[hdr[k]-1]
            cell.value = (str(cell.value) + ' | ' + v) if cell.value else v
wb.save(sys.argv[1]); print('appended', sorted(upd))
