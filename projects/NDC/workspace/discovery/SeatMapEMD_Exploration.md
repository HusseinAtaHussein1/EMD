# NDC — Discovery — EgyptAir Seat Map EMD (RUN-20261103-001)

**Status:** `Pending Review` (partial exploration, not yet approved) · **Date:** 2026-11-03 · **Environment:** `http://192.168.1.80` (user-directed; `.92` not used) · **Mode:** Browser automation (Playwright MCP), Admin `e.saady`, Branch `NDC1_Hussein (BRN222)`.
**Evidence:** `SeatMapEMD_evidence/` (screenshots named below).

> Scope reached: one-way, 1 ADT, CAI → JED, EgyptAir MS665, seat 22A, booking placed on **Hold**. No payment/ticketing performed. **No EMD has been observed anywhere yet.**

## 1. Environment & supplier
- Flight search returned 27 EgyptAir options from supplier **"EgyptAirEgy STG"** (PNR Query shows Supplier `EgyptAirEgy`, Credential `EgyptAirEgy owi`). The story says "EgyptAir INT"; no supplier named "INT" was seen. Open question for the story owner (Coverage Gap).
- Evidence: `page-2026-11-03T08-26-38-292Z.png` (search results).

## 2. Booking flow (Booking-Mid Office)
Flight Search (Branch required; Agency/Agent optional; One-way/Round-trip/Multi-city) → **Book Flight** → Passenger Details (Title, First/Last Name, DOB, Gender, Email, Phone, Document Number, Document Expiry, Nationality) → **Next** → Ancillaries (Meal Preference, Baggage You Want, **Seat Selection**) → bottom buttons **Book / Hold / Save Quote** with a required Terms & Conditions checkbox. Payment section offers **Wallet** only ("money is currently being deducted from your wallet balance"). A 15-minute "Time left" session timer runs on the page.
- Evidence: `page-2026-11-03T08-29-05-911Z.png`.

## 3. Seat Map
- Opens as a modal "Seat Map · CAI → JED · Onward": flight MS665 (738), 138 seats, single Economy cabin (CAC1), rows **20–42**, columns **A B C | H J K**; some seats Occupied (e.g. 20A, 20B, 21C); chargeable seats from EGP 559. Seat 22A = EGP 1,117 ("Chargeable seat, Window seat").
- Flow: click seat → "Book 22A for {passenger}" → "Confirm seat". Fare breakdown then shows "(+) Ancillaries & SSR 1,117 EGP / Seat Selection" and total 9,815 EGP.
- **Impact:** the story's example seats (12A, 12B, 15C…) do not exist on this aircraft; test data updated to rows 20+.
- Evidence: `page-2026-11-03T08-28-30-111Z.png`.

## 4. Hold confirmation page (TC-SEATEMD-030)
- Message: "Your booking has been on hold for PNR number: YHI6NJ and last ticketing date is 04-11-2026 12:00:00 AM". Status `Hold`. Booking Reference `NDCEG-BR-F261103CnOuUP`, Trip ID `BRN222NDCORD261103MAXREO`.
- Passenger Details table columns: Passenger Name, Flight, Ticket Number, Meal, Seat, Bundle, Baggage Allowance, Frequent Flyer No. Seat cell shows `MS 665 - AvailablePaid - (Chargeable seat, Window seat) (22A)` (raw status text "AvailablePaid" is shown to the user). **No EMD column or value.** Fare Details lists Base fare 1,877, Taxes 6,821, Seat (+) 1,117, Total 9,815 EGP.
- Evidence: `page-2026-11-03T08-29-56-640Z.png`.

## 5. PNR Query for the held PNR
- Search by PNR (also Ticket No. / Booking Ref.; "Search About" Itinerary Details / Agency Information). Result sections: Lock Info, Agency User Info, Payment Info, Flight Info, Booking Info, Flight Legs, Passenger List (Void / Reissue / Refund buttons), Comments, Reissue History.
- **No seat or ancillary information is shown for the held PNR, and no EMD.** So "seat shown in PNR Query" (TC-SEATEMD-009 premise) is not verifiable on a held booking.
- Evidence: `page-2026-11-03T08-30-31-310Z.png`.

## 6. Not yet located / not done
- **Pay page after hold confirmation** (per user: EMD shown there) — path not found yet; no payment/ticketing was done (wallet deduction would be a real transaction: EGP 9,815).
- **Itinerary** and **Finance Report** locations (Reports module not opened).
- Round trip, multi-city, 2-PAX bookings not yet created.
- Observed console error on PNR Query search (1 error, not investigated).

## 7. Created test data (shared staging)
PNR `YHI6NJ` / `NDCEG-BR-F261103CnOuUP` — hold, passenger "QaEmd Tester", expires 2026-11-04. Should be cancelled/expire; not cancelled by this run.

## 8. Search Booking → Booking Details (held PNR) — added 2026-11-03
- Path (per user): Booking-Mid Office > side menu > Booking-Mid Office > **Search Booking** (submenu also has Booking, My Quotes, Manual Booking Invoice) > **Flight** tab > Branch NDC1_Hussein (BRN222) + Airline/GDS PNR `YHI6NJ` > Search > grid row (Lock, Order Id, Branch, Agency, Client, Date of Booking, Booked By) > click Order Id.
- Booking Details (`/booking/booking-details/{OrderId}`): tabs Itinerary Details / Costing & Payment / Documents & Notes; Time Limit and History buttons; status On Hold. Itinerary tab has "Segment Ancillaries (Meals, Baggage, Seats)" → Seat Selection: Seat 22A, 1,117 EGP, "AvailablePaid - (Chargeable seat, Window seat)". **No EMD shown while on hold.**
- Costing & Payment tab: Total SSR 1,117 (Seat 1,117), Total Booking Amount 9,815, Payment Details table empty ("No data has been found!"). No Pay button found on any tab (buttons present: Time Limit, History, tabs, Segment Ancillaries, View Passenger Details | Void/Cancel).
- Pay action not located → user to trigger Pay.

## 9. TC-SEATEMD-001 run (skill ndc-emd-booking-verification) — 2026-11-03
- Booking (Book): 1 ADT "QaOne Tester", MS661 (A330, 244 seats, layout A C | D E F G | H K, rows 20-51) CAI-JED 24/11/2026 07:15; meal Vegetarian Hindu (R1?SRV30, free), baggage UPTO22LB 10KG (EGP 3,630), seat 22A (EGP 1,117); total EGP 13,612 from wallet. A "Confirm Booking" dialog ("Are you sure you want to book this flight?") appears after clicking Book. PNR YHROAB, ticket 772453749756, ref NDCEG-BR-F261103d3SMrw, order BRN222NDCORD261103LRZI0Z.
- Expected EMDs (given by user): meal `1H2MSZ_BXDWEFF44VBEDV8555068HDZQCQR-37`; seat 22A none; baggage none.
- Booking Confirmation: **Pass** (meal cell shows `MS 661 - VEGETARIAN HINDU MEAL (1H2MSZ_BXDWEFF44VBEDV8555068HDZQCQR-37)`; seat and baggage show no ID). Evidence: `bookingconfirmation_TC001_YHROAB.png`.
- PNR Query (by PNR YHROAB): **Fail** — EMD not displayed; page shows no meal/seat/baggage section. Evidence: `pnrquery_TC001_YHROAB.png`.
- Itinerary (Booking Details > Itinerary Details > Segment Ancillaries): **Pass** — meal shows the expected ID, seat 22A and baggage show none. Evidence: `itinerary_TC001_YHROAB.png`.
- Finance Report (branch NDC1_Hussein, 03/11/2026): **Fail** — booking row present (invoice INVNDC2611030Z5FaU) but the EMD value is not displayed; no detail view on row click; Export To Excel not checked. Evidence: `finance_TC001.png`.
- Overall TC-SEATEMD-001: **Fail** (2 of 4 pages pass).

## 10. TC-SEATEMD-005 run (skill ndc-emd-booking-verification) — 2026-11-03
- Flight search passenger selector: Adults (12+), Children (2-12), Infants (under 2), +/- per type. 2 adults CAI-JED 24/11/2026 returned 26 options (fare 17,730 for 2 before ancillaries).
- Passenger Details shows one accordion per passenger ("1- Adult", "2- Adult"); Ancillaries step shows one block per passenger with meal, baggage; seat map has a traveller chooser, "Book {seat} for {passenger}" per seat, then "Confirm 2 seats".
- Booking (Book): 2 ADT on MS661 (A330), QaTwoA = Vegetarian Hindu Meal + baggage + seat 23A, QaTwoB = Bland Meal Request + baggage + seat 23C; total EGP 27,224. PNR YI24HW, tickets 772453749765 / 772453749766, ref NDCEG-BR-F261103glITw4, order BRN222NDCORD261103MQTKTK.
- Expected EMDs (user): QaTwoA meal `1H2MSZ_0NFR5DBGQ4TKYR1RLLVJA3MTXT98-72`; QaTwoB meal `1H2MSZ_0NFR5DBGQ4TKYR1RLLVJA3MTXT98-75`; seats and baggage none.
- Booking Confirmation **Pass**; PNR Query **Fail** (no EMD, no meal/seat); Itinerary **Pass** (each meal ID under the right passenger); Finance Report **Fail** (one row per passenger, no EMD). Overall **Fail**.
- Observed: seat 22A on MS661 was already occupied (taken by TC-001's booking), seat map reflects live bookings.

## 11. TC-SEATEMD-025 run (round trip) — 2026-11-03
- Round-trip search: tab shows two rows (outbound, return); return From/To auto-fill reversed; return date must be chosen with the calendar button (typed value is dropped). 50 options CAI-JED & Back 24/11 - 28/11 (from EGP 16,918, 1 adult). Passenger form same as one-way; Ancillaries shows Onward and Return blocks for meal, baggage and seat, each with its own Select Seat map.
- Booking (Book): 1 ADT QaRound Tester; outbound MS673 (738) meal Vegetarian Hindu + baggage + seat 37B (EGP 559); return MS644 (738) meal Bland + baggage + seat 22C (EGP 1,117); total EGP 25,854. PNR YI3LMV, ticket 772453749774 (single ticket), ref NDCEG-BR-F261103h6CM1e, order BRN222NDCORD261103JZ9XWD. Booking took about 60 s.
- Expected EMDs (user): outbound meal `1H2MSZ_E5YXMW9LIXB1M1SIXW6YAZ5C1EPG-37`; return meal `1H2MSZ_E5YXMW9LIXB1M1SIXW6YAZ5C1EPG-91`; seats and baggage none.
- Booking Confirmation **Pass**; PNR Query **Fail** (2 flight legs, no ancillaries/EMD); Itinerary **Pass** (Journey 1 CAI-JED has -37, Journey 2 JED-CAI has -91); Finance Report **Fail** (one row, no EMD). Overall **Fail**.
- Observed: Booking Confirmation baggage column shows "2 Piece(s)" for outbound vs "1 Piece(s)" for return; PNR Query shows both legs under one ticket.

## 12. Re-run 2026-11-19 (skill ndc-emd-booking-verification) — run inputs and rules
- Environment `http://192.168.1.80/auth/login`, Admin `e.saady`, Branch NDC1_Hussein (BRN222). Driven via Playwright over CDP against a dedicated Chrome window.
- User rules for this run: all ancillaries (seat, meal, baggage) carry EMDs; infants have no seat (seat EMD not applicable for an infant); an adult travelling with an infant cannot choose an exit seat; Finance Report checks and TC-SEATEMD-012 are excluded.
- Planned bookings: B1 OW 1 ADT; B2 OW 1 ADT+1 CHD; B3 RT 1 ADT; B4 RT 2 ADT+1 CHD+1 INF; B5 MC 1 ADT; B6 MC 1 ADT+2 CHD+1 INF; B7 OW hold 1 ADT+1 CHD+1 INF (user pays); B8 OW hold 1 ADT (cancel with approval). Routes: OW CAI-JED 30/11/2026; RT CAI-JED 30/11, JED-CAI 30/11; MC CAI-JED 30/11, JED-CAI 01/12, CAI-DXB 02/12.

## 13. B1 — one-way, 1 ADT (Book) — 2026-11-19
- First attempt on result #1 (MS665 02:30, EGP 8,881) was interrupted by the user at the Confirm Booking dialog; wallet balance unchanged afterwards (EGP 8,899,557.6), so no booking was created. User asked to use the second result instead.
- Booking: MS661 (A330) CAI 07:15 - JED 10:25, 30/11/2026, RBD T; Mr QaBone Tester; meal R1?SRV30 Vegetarian Hindu (0 EGP); baggage UPTO22LB 10KG (EGP 3,495); seat 22E (EGP 538, centre, not exit). Total EGP 13,076 from wallet. PNR **Y7Q77S**, ticket 772453753904, ref NDCEG-BR-F261119WgrDkS, order BRN222NDCORD2611199W5KFY, invoice INVNDC261119IjsG38.
- EMDs shown and confirmed correct by the user: seat 22E `774556363862`; baggage `774556363861` (both "CONNECTED 772453753904"); meal shows `1H2MSZ_PGENRP5X3IO0JW8PJLJKEAW5MFLB-37` in brackets (no "EMD" label).
- Booking Confirmation **Pass** (`bookingconfirmation_B1_Y7Q77S.png`). PNR Query **Pass** — new "Ancillaries" section now lists meal, baggage and seat with EMDs (`pnrquery_B1_Y7Q77S.png`). Itinerary **Pass** (`itinerary_B1_Y7Q77S.png`). Finance Report not run (excluded).
- Observations: PNR Query Flight Legs shows 06:15-09:25 vs 07:15-10:25 on Booking Confirmation/Itinerary (1 h difference). PNR Query baggage block shows an extra ID `...MFLB-3` above the EMD. Seat map seat buttons expose an aria-label "Seat 22E, row 22, ..., available for EGP 538" usable as a locator. Gender is derived from Title and locked.

## 14. B2 — one-way, 1 ADT + 1 CHD (Book) — 2026-11-19
- Search header "1 Adult • 1 Child", 29 options; second result MS661 07:15 (EGP 17,652). Child Title list offers only Mr/Ms/Mrs (no Mstr/Miss); child set as Ms, DOB 10/03/2018. Second passenger accordion ("1- Child") is collapsed by default on both Passenger Details and Ancillaries.
- Seat map with 2 travellers: book seat for traveller 1 → button "Confirm 1 of 2 seats" → traveller 2 becomes active → book → "Confirm 2 seats".
- Booking: QaBtwoA (ADT) Vegetarian Hindu + UPTO22LB 10KG + 23E; QaBtwoC (CHD) Bland + UPTO22LB 10KG + 23F. Total EGP 25,718. PNR **Y7R6AM**, tickets 772453753921 / 772453753922, ref NDCEG-BR-F261119Dln7xv, order BRN222NDCORD261119AKTWYS.
- EMDs (user-confirmed): ADT seat `774556363865`, baggage `774556363864`, meal `...QZM-72`; CHD seat `774556363866`, baggage `774556363863`, meal `...QZM-75`.
- Booking Confirmation **Pass**, PNR Query **Pass**, Itinerary **Pass** (evidence `*_B2_Y7R6AM.png`). TC-008 Blocked (distinct EMDs returned). PNR Query again shows flight times 1 h earlier than the other pages.

## 15. B3 — round trip, 1 ADT (Book) — 2026-11-19
- From here on the user asked for no screenshots and for bookings to proceed without per-booking approval; evidence below is captured page text.
- Round-trip search: return row auto-filled JED→CAI with the same date (30/11/2026). 50 options; second result MS667 CAI 08:10-11:20 + MS670 JED 23:00-00:15 (+1), EGP 17,282.
- Ancillaries step: one meal, baggage and Select Seat per direction (Onward/Return), in that order.
- Booking: QaBthree Tester; onward Vegetarian Hindu + UPTO22LB 10KG + seat 21B (538); return Bland + UPTO22LB 10KG + seat 21B (538). Total EGP 25,348. PNR **Y7RQC2**, ticket 772453753958 (single ticket, both legs), ref NDCEG-BR-F261119BSAd06, order BRN222NDCORD261119TGXNER.
- Shown on Booking Confirmation, PNR Query and Itinerary (identical): onward seat EMD `774556363869`, onward baggage `774556363867`, return baggage `774556363868`, meals `...NR-37` / `...NR-91`. **Return seat 21B has no EMD in any of the three locations** → TC-006/TC-025 Fail per user rule (all ancillaries have EMDs); TC-027 and TC-015 Pass (no placeholder, no copied EMD).
- PNR Query Flight Legs times are 1 h earlier (07:10-10:20, 22:00-23:15) than Booking Confirmation/Itinerary.
