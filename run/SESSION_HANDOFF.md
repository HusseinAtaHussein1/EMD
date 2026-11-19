# Session handoff — EgyptAir Seat Map / Ancillary EMD runs (saved 2026-11-19)

## Where things stand

| Run | Portal | Status | Report |
|---|---|---|---|
| Admin run | http://192.168.1.80/auth/login (user e.saady, Branch NDC1_Hussein BRN222) | **Complete** B1–B10. 21 Pass, 12 Blocked, 1 Not run (TC-012 Finance Report excluded), 0 Fail | `run/EMD_Run_Report.md`, `run/AdminReportAI.html`, `projects/NDC/workspace/test_design/SeatMapEMD/NDC_TestCases_SeatMapEMD_Execution.xlsx` |
| Agency run | http://192.168.1.80:9500/auth/login (Agency AGN2, e.saady@ndceg.com) | **Stopped by user after B1.** B1 booked (PNR Y9VX4A, order AGN2TESTESORD2611196BMH0O) — Booking Confirmation shows meal ID only, **no seat/baggage EMD**. User has not confirmed EMDs; Itinerary not checked. B2–B10 not run. | `run/EMD_Run_Report_Agency_AGN2.md` |

Agency B1 confirmation URL: http://192.168.1.80:9500/booking/booking-confirmation/AGN2TESTESORD2611196BMH0O

### Open decisions for the user
1. Agency B1: is the missing seat/baggage EMD on the agency Booking Confirmation a defect, or expected? (Admin portal shows them.) Expected EMDs can be read from PNR Y9VX4A in the Admin portal.
2. Admin B8 hold Y86K5V (order BRN222NDCORD2611192BB3PS) is still On Hold — Cancel Hold returns HTTP 500; expires 20-11-2026. Try Release PNR or let it expire?

## How the user wants these runs done
- Per booking: search → book (no per-booking approval needed) → **show the displayed EMDs with the connected ticket for each and ask the user to confirm** → after confirmation check Itinerary (and PNR Query on Admin only) for the same EMDs on the right passenger/segment/ancillary → record.
- Always pick the **second** flight in the results unless told otherwise.
- **Short letters-only names** (e.g. `kna kdf`); long names fail with an infant ("Invalid request … Adult").
- **No screenshots.** Results go in the `run/` folder.
- Hold → Pay: take the **Lock** (PNR Query on Admin), then Booking Details → Confirm To Pay → Terms → Pay. User authorised the agent to do this.
- Infants: no seat; assign to adult 1 ("Assigned to"); adult with infant must not take an exit seat.
- Finance Report excluded; PNR Query not available on the agency portal.

## Routes that work (CAI⇄JED round trip and CAI→JED→CAI→DXB multi-city failed with "flight or class no longer available")
- One-way CAI→JED 30/11/2026
- Round trip CAI→JED 30/11 + JED→CAI 30/11 (1 ADT worked); CAI⇄DXB 30/11 for larger PAX mixes
- Multi-city CAI→DXB 07/12, DXB→CAI 08/12, CAI→JED 09/12

## Tools (`run/tools/`, Node + Playwright over Chrome DevTools)
1. Start the test Chrome (PowerShell):
   `Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9333","--remote-debugging-address=127.0.0.1","--user-data-dir=<any folder>","--no-first-run","--window-size=1440,900","http://192.168.1.80:9500/auth/login"`
2. Log in: `node run/tools/01_login.js` (Admin, STG block) or `node run/tools/01_login_agn.js` (Agency, AGN2 block). Credentials come from the git-ignored `projects/NDC/credentials/credentials.json` (never printed).
3. Main helpers (each attaches to the open window and leaves it open):
   - `act.js` – click/fill/type/press/goto/wait sequence (`--` separated)
   - `paxsearch.js A C I` – set passenger counts; `mcsearch.js FROM-TO-dd/mm/yyyy ...` – multi-city legs
   - `fillpax.js idx Title First Last DOB - Doc DocExpiry Nationality`
   - `pickopt.js meal|baggage|assignedTo|title nth "#idx"|"text"`
   - `seatauto.js nth` – cheapest free, non-exit seat per non-infant traveller, then confirm
   - `dobook.js Book|Hold label` – tick Terms, Book/Hold, confirm dialog, print confirmation
   - `paylock.js PNR OrderId` – Admin lock → Confirm To Pay → Pay
   - `verify.js PNR OrderId label "v1,v2,..."` – Admin PNR Query + Itinerary text and presence check (URLs are for :80; adapt base URL for :9500 and drop the PNR Query part)
   - `xl_update.py` / `xl_append.py` / `xl_dump.py` – workbook updates; `gen_html.py` – builds AdminReportAI.html
- Dropdowns close between script runs, so each selection must be made within one script call.
