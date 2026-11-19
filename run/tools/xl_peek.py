import sys, openpyxl
wb = openpyxl.load_workbook(sys.argv[1]); ws = wb.active
for r in ws.iter_rows(min_row=2, values_only=True):
    print(r[0], '|', (r[2] or '')[:60], '| status:', r[12], '| tester:', r[14], '| date:', r[15], '| BC/PQ/IT/FR:', r[17:21])
