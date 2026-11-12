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
