# EgyptAir Seat Map / Ancillary EMD — Run Report

| | |
|---|---|
| Run date | 2026-11-19 |
| Environment | http://192.168.1.80/auth/login |
| User / Branch | e.saady / NDC1_Hussein (BRN222) |
| Skill | ndc-emd-booking-verification |
| Process per booking | 1. Search flight → 2. Book → 3. User confirms displayed EMDs → 4. Check PNR Query and Itinerary show the same EMDs on the correct passenger and ancillary |
| Rules from user | All ancillaries (seat, meal, baggage) have EMDs. Infants have no seat. Adult travelling with an infant cannot take an exit seat. Finance Report not checked (TC-SEATEMD-012 excluded). Second flight in the results is used. No screenshots. |

## Booking plan

| # | Trip | Passengers | Action | Test cases |
|---|---|---|---|---|
| B1 | One-way CAI→JED 30/11/2026 | 1 ADT | Book | 001, 002, 003, 009, 011, 013, 017, 024 |
| B2 | One-way CAI→JED 30/11/2026 | 1 ADT + 1 CHD | Book | 005, 008 |
| B3 | Round trip CAI→JED 30/11, JED→CAI 30/11 | 1 ADT | Book | 006, 025 |
| B4 | Round trip (same dates) | 2 ADT + 1 CHD + 1 INF | Book | 007, 010, 026 |
| B5 | Multi-city CAI→JED 30/11, JED→CAI 01/12, CAI→DXB 02/12 | 1 ADT | Book | 028 |
| B6 | Multi-city (same dates) | 1 ADT + 2 CHD + 1 INF | Book | 029 |
| B7 | One-way CAI→JED 30/11/2026 | 1 ADT + 1 CHD + 1 INF | Hold → user clicks Pay | 030, 031, 032, 034 |
| B8 | One-way CAI→JED 30/11/2026 | 1 ADT | Hold → cancel with user approval | 033 |

Blocked (cannot be produced in this environment): 004, 014, 016, 018, 019, 020, 021, 022, 023 (reasons in the results table).

## Results

| # | PNR | Order | EMDs confirmed by user | Booking Confirmation | PNR Query | Itinerary |
|---|---|---|---|---|---|---|
| B1 | Y7SS4Z | BRN222NDCORD261119RDYIYL | Yes | Pass | Pass | Pass |
| B2 | Y7TVJ8 | BRN222NDCORD261119VNCO5Z | Yes | Pass | Pass | Pass |
| B3 | Y7UQJD | BRN222NDCORD261119C666FE | Yes | Pass | Pass | Pass |
| B4 (CAI⇄JED, 3 attempts) | — (Failed) | UJZKMD / LN7TMJ / MQ783G | — | Booking failed | Not run | Not run |
| B4 (CAI⇄DXB) | Y7YFIJ | BRN222NDCORD261119I3M9RE | Yes | Pass | Pass | Pass |
| B5 (attempt 1) | — (Failed) | BRN222NDCORD261119F4EBPQ | — | Booking failed | Not run | Not run |
| B5 (CAI→DXB→CAI→JED, 07–09/12) | Y83D84 | BRN222NDCORD261119IIORTX | Yes | Pass | Pass | Pass |
| B6 (same route, 1 ADT + 2 CHD + 1 INF) | Y842TP | BRN222NDCORD261119QR8606 | Yes | Pass | Pass | Pass |
| B7 (Hold → Pay, 1 ADT + 1 CHD + 1 INF) | Y8645Q | BRN222NDCORD261119XDPRAO | Yes | Pass (hold: no EMD; after pay: EMDs) | Pass | Pass |
| B8 (Hold → cancel, 1 ADT) | Y86K5V | BRN222NDCORD2611192BB3PS | n/a (hold) | No EMD on hold | No EMD | No EMD |
| B9 (Round trip Hold → Pay, 1 ADT + 1 CHD) | Y87CR2 | BRN222NDCORD2611190BFI40 | Yes | Pass (hold: no EMD; after pay: EMDs) | Pass | Pass |
| B10 (Multi-city Hold → Pay, 1 ADT + 1 CHD) | Y893NB | BRN222NDCORD261119LU72KG | Yes | Pass (hold: no EMD; after pay: EMDs) | Pass | Pass |

## Summary (34 test cases)

| Result | Count | Test cases |
|---|---|---|
| Pass | 21 | 001, 003, 005, 006, 007, 009, 010, 011, 013, 015, 016, 017, 025, 026, 027, 028, 029, 030, 031, 032, 034 |
| Blocked | 12 | 002, 004, 008, 014, 018, 019, 020, 021, 022, 023, 024, 033 |
| Not run (excluded by user) | 1 | 012 (Finance Report) |
| Fail | 0 | — |

## Defects / observations
1. **Cancel Hold fails silently** (B8, Y86K5V): `POST /odeysysadmin/v2/bookingDetails2/cancel-void-ticket` → HTTP 500 "Invalid request…"; UI shows nothing; booking stays On Hold. Blocks TC-033.
2. **Booking failures** "The requested flight or class is no longer available." on CAI⇄JED round trip (3 attempts) and CAI→JED→CAI→DXB multi-city (1 attempt); wallet not charged (checked once).
3. **Long passenger names** with an infant: Next returns "Invalid request… Adult (QaRunFourA Tester)"; short names work.
4. **Seats without EMD** (user confirmed correct): B3 return seat; B4 onward free seats and child return seat; B5/B6 leg DXB→CAI (MS913) seats.
5. **PNR Query Flight Legs times are 1 h earlier** than Booking Confirmation/Itinerary on every booking.
6. **Itinerary duration for CAI→DXB** shown as 5h 15m (local times give 3h 15m).
7. **Pay on a held booking** is only reachable after taking the Lock in PNR Query (Confirm To Pay → Pay).
8. Meal ancillaries show an order-item ID (e.g. `1H2MSZ_…-37`) without an "EMD" label or connected ticket; user confirmed this as the expected value.

## Additional run — Pay after Hold for Round trip and Multi-city (added at user request)

### B9 — Round trip CAI⇄DXB 30/11, 1 ADT + 1 CHD (Hold → Pay)
- Search "CAI → DXB & Back", 12 options; flight #2 MS912 CAI 09:45→DXB 15:00 + MS906 DXB 20:00→CAI 22:05, EGP 30,104 (fares).
- Passengers kna kdf (ADT), knb kdf (CHD). Meals Vegetarian Hindu / Bland (ADT), Fruit Platter / Gluten Intolerant (CHD); baggage UPTO22LB 10KG ×4 (4,302 each); seats ADT 21K / 23A, CHD 22A / 23K. Net payable EGP 49,036. Wallet before hold EGP 8,482,866.6.
- Hold placed 19/11/2026 16:23: PNR **Y87CR2**, last ticketing date 20-11-2026, booking ref NDCEG-BR-F261119ytp1uX, order BRN222NDCORD2611190BFI40. Hold confirmation: no tickets, **no EMD** (meal IDs only).
- Pay: PNR Query → Lock (Locked By Essam Sherif) → Booking Details → Confirm To Pay → Terms → Pay → processing → Booking Confirmation status **Confirmed**. Tickets: kna 772453754100, knb 772453754101.
- EMDs displayed on Booking Confirmation after payment:

| Passenger | Segment | Ancillary | Displayed value | Connected ticket |
|---|---|---|---|---|
| kna kdf (ADT) | Onward MS912 CAI→DXB | Meal – Vegetarian Hindu | 1H2MSZ_SZUH6R1K3FHMKME1N024Z6RI6DLK-74 | — |
| kna kdf (ADT) | Onward MS912 | Seat 21K | EMD 774556363929 | 772453754100 |
| kna kdf (ADT) | Onward MS912 | Baggage UPTO22LB 10KG | EMD 774556363927 | 772453754100 |
| kna kdf (ADT) | Return MS906 DXB→CAI | Meal – Bland | 1H2MSZ_SZUH6R1K3FHMKME1N024Z6RI6DLK-184 | — |
| kna kdf (ADT) | Return MS906 | Seat 23A | No EMD displayed | — |
| kna kdf (ADT) | Return MS906 | Baggage UPTO22LB 10KG | EMD 774556363928 | 772453754100 |
| knb kdf (CHD) | Onward MS912 | Meal – Fruit Platter | 1H2MSZ_SZUH6R1K3FHMKME1N024Z6RI6DLK-87 | — |
| knb kdf (CHD) | Onward MS912 | Seat 22A | EMD 774556363930 | 772453754101 |
| knb kdf (CHD) | Onward MS912 | Baggage UPTO22LB 10KG | EMD 774556363925 | 772453754101 |
| knb kdf (CHD) | Return MS906 | Meal – Gluten Intolerant | 1H2MSZ_SZUH6R1K3FHMKME1N024Z6RI6DLK-197 | — |
| knb kdf (CHD) | Return MS906 | Seat 23K | No EMD displayed | — |
| knb kdf (CHD) | Return MS906 | Baggage UPTO22LB 10KG | EMD 774556363926 | 772453754101 |

- User confirmation: **Approved**.
- PNR Query (Y87CR2): Journey 1 CAI-DXB and Journey 2 DXB-CAI — all 10 values under the same passenger/journey/ancillary with the same connected tickets; return seats 23A/23K without EMD → **Pass**.
- Itinerary: identical mapping → **Pass**.
- Result: Pay after Hold for **round trip** works; EMDs appear only after payment and map correctly.

### B10 — Multi-city CAI→DXB 07/12, DXB→CAI 08/12, CAI→JED 09/12, 1 ADT + 1 CHD (Hold → Pay)
- Search "CAI → JED (Via: DXB, CAI)", 50 options; flight #2 MS905 / MS913 / MS661, EGP 59,568 (fares).
- Passengers koa kdf (ADT), kob kdf (CHD). Seats ADT 23A / 24A / 24E, CHD 23K / 24K / 24F; baggage UPTO22LB 10KG ×6. Net payable EGP 86,566. Wallet before hold EGP 8,433,830.6.
- Hold placed 19/11/2026 16:29: PNR **Y893NB**, last ticketing date 20-11-2026, booking ref NDCEG-BR-F261119DT4w83, order BRN222NDCORD261119LU72KG. Hold confirmation: no tickets, **no EMD** (meal IDs only).
- Pay: PNR Query → Lock → Booking Details → Confirm To Pay → Terms → Pay → Booking Confirmation status **Confirmed**. Tickets: koa 772453754102, kob 772453754103.
- EMDs displayed on Booking Confirmation after payment (connected ticket in brackets):

| Passenger | Ancillary | Leg 1 MS905 CAI→DXB | Leg 2 MS913 DXB→CAI | Leg 3 MS661 CAI→JED |
|---|---|---|---|---|
| koa kdf (ADT) | Meal | ...88G3P-74 | ...88G3P-184 | ...88G3P-304 |
| koa kdf (ADT) | Seat | 23A EMD 774556363937 (…102) | 24A no EMD | 24E EMD 774556363938 (…102) |
| koa kdf (ADT) | Baggage | EMD 774556363934 (…102) | EMD 774556363935 (…102) | EMD 774556363936 (…102) |
| kob kdf (CHD) | Meal | ...88G3P-89 | ...88G3P-199 | ...88G3P-311 |
| kob kdf (CHD) | Seat | 23K EMD 774556363939 (…103) | 24K no EMD | 24F EMD 774556363940 (…103) |
| kob kdf (CHD) | Baggage | EMD 774556363931 (…103) | EMD 774556363932 (…103) | EMD 774556363933 (…103) |

- Meal ID prefix 1H2MSZ_ZDZCUPEZURLFWNITVGVKMQY88G3P. Leg 2 (MS913) seats without EMD, as in B5/B6.
- User confirmation: **Approved**.
- PNR Query (Y893NB): Journeys 1–3 — all 16 values under the same passenger/journey/ancillary with the same connected tickets; leg 2 seats without EMD → **Pass**.
- Itinerary: identical mapping → **Pass**.
- Result: Pay after Hold for **multi-city** works; EMDs appear only after payment and map correctly.

### B9 / B10 results

| # | PNR | Order | Hold shows EMD? | EMDs confirmed by user | Booking Confirmation (after pay) | PNR Query | Itinerary |
|---|---|---|---|---|---|---|---|
| B9 Round trip hold → pay | Y87CR2 | BRN222NDCORD2611190BFI40 | No (correct) | Yes | Pass | Pass | Pass |
| B10 Multi-city hold → pay | Y893NB | BRN222NDCORD261119LU72KG | No (correct) | Yes | Pass | Pass | Pass |

Hold test cases 030, 031, 032, 034 now cover one-way (B7), round trip (B9) and multi-city (B10) — all Pass. Overall summary unchanged: 21 Pass, 12 Blocked, 1 Not run, 0 Fail.

## Open items
- B8 hold Y86K5V still On Hold (expires 20-11-2026); cancel failed. Options: Release PNR, retry after fix, or let it expire.
- Earlier-session bookings Y7Q77S, Y7R6AM, Y7RQC2 and all run bookings are real, wallet-paid tickets on staging.

## Bookings created in this session (all real, wallet-paid)

| PNR | Order | Booking | Note |
|---|---|---|---|
| Y7Q77S | BRN222NDCORD2611199W5KFY | Earlier B1 attempt (1 ADT, MS661) | Before restart |
| Y7R6AM | BRN222NDCORD261119AKTWYS | Earlier B2 attempt (1 ADT + 1 CHD, MS661) | Before restart |
| Y7RQC2 | BRN222NDCORD261119TGXNER | Earlier B3 attempt (RT 1 ADT, MS667/MS670) | Before restart; return seat showed no EMD |

## Details per booking

### B1 — One-way CAI→JED, 1 ADT (Book)
- Search: 29 options; flight #2 MS661 (RBD T) CAI 07:15 → JED 10:25, 30/11/2026.
- Passenger: Mr QaRunOne Tester (ADT). Meal R1?SRV30 Vegetarian Hindu (0 EGP), baggage UPTO22LB 10KG (EGP 3,495), seat 22F (EGP 538). Total EGP 13,076 (wallet).
- Booked 19/11/2026 14:45: PNR **Y7SS4Z**, ticket 772453754008, booking ref NDCEG-BR-F261119agLqUP, order BRN222NDCORD261119RDYIYL. Status Confirmed.
- EMDs displayed on Booking Confirmation:

| Passenger | Segment | Ancillary | Displayed value |
|---|---|---|---|
| QaRunOne Tester (ADT) | MS661 CAI→JED | Meal – Vegetarian Hindu | 1H2MSZ_DB7UV13OXCYBU297WEA0RHUB6QAG-37 |
| QaRunOne Tester (ADT) | MS661 CAI→JED | Seat 22F | EMD 774556363871 (connected 772453754008) |
| QaRunOne Tester (ADT) | MS661 CAI→JED | Baggage UPTO22LB 10KG | EMD 774556363870 (connected 772453754008) |

- User confirmation: **Correct** (all three values).
- PNR Query (Y7SS4Z): Ancillaries > Journey 1 CAI-JED > QaRunOne Tester — meal `...QAG-37`, baggage EMD 774556363870, seat 22F EMD 774556363871, all connected to 772453754008 → **Pass**. Observation: Flight Legs shows 06:15–09:25 vs 07:15–10:25 on the other pages; baggage block also shows ID `...QAG-3`.
- Itinerary (Booking Details > Itinerary Details > Segment Ancillaries): same three values under QaRunOne Tester, Journey 1 CAI-JED → **Pass**.
- Test cases: 001 Pass, 003 Pass, 009 Pass, 011 Pass, 013 Pass (3 locations), 017 Pass, 002 Blocked (no Free Text returned), 024 Blocked (no other supplier), 012 Not run (excluded).

### B2 — One-way CAI→JED, 1 ADT + 1 CHD (Book)
- Search "1 Adult • 1 Child", 29 options; flight #2 MS661 (RBD T) CAI 07:15 → JED 10:25, 30/11/2026, EGP 17,652.
- Passengers: Mr QaRunTwoA Tester (ADT) — Vegetarian Hindu, UPTO22LB 10KG, seat 24E; Ms QaRunTwoC Tester (CHD, DOB 10/03/2018) — Bland, UPTO22LB 10KG, seat 24F. Total EGP 25,718 (wallet). Child titles offered: Mr/Ms/Mrs only.
- Booked 19/11/2026 14:50: PNR **Y7TVJ8**, tickets 772453754017 (ADT) / 772453754018 (CHD), booking ref NDCEG-BR-F261119opKgEi, order BRN222NDCORD261119VNCO5Z.
- EMDs displayed on Booking Confirmation:

| Passenger | Segment | Ancillary | Displayed value |
|---|---|---|---|
| QaRunTwoA Tester (ADT) | MS661 CAI→JED | Meal – Vegetarian Hindu | 1H2MSZ_I7P3BAYZPUM5IDMJ1T2P5HAQBRN1-72 |
| QaRunTwoA Tester (ADT) | MS661 CAI→JED | Seat 24E | EMD 774556363874 (connected 772453754017) |
| QaRunTwoA Tester (ADT) | MS661 CAI→JED | Baggage UPTO22LB 10KG | EMD 774556363873 (connected 772453754017) |
| QaRunTwoC Tester (CHD) | MS661 CAI→JED | Meal – Bland | 1H2MSZ_I7P3BAYZPUM5IDMJ1T2P5HAQBRN1-75 |
| QaRunTwoC Tester (CHD) | MS661 CAI→JED | Seat 24F | EMD 774556363875 (connected 772453754018) |
| QaRunTwoC Tester (CHD) | MS661 CAI→JED | Baggage UPTO22LB 10KG | EMD 774556363872 (connected 772453754018) |

- User confirmation: **Correct** (all six values).
- PNR Query (Y7TVJ8): Journey 1 CAI-JED, 2 passengers — each passenger shows only its own meal ID, baggage EMD and seat EMD (connected to its own ticket) → **Pass**. Flight Legs again 1 h earlier (06:15–09:25).
- Itinerary: same values under the same passengers → **Pass**.
- Test cases: 005 Pass; 008 Blocked (supplier returned distinct EMDs per passenger).

### B3 — Round trip CAI⇄JED 30/11, 1 ADT (Book)
- Search "CAI → JED & Back", return date auto-filled 30/11/2026; flight #2 MS667 (RBD W) CAI 08:10 → JED 11:20 + MS670 (RBD T) JED 23:00 → CAI 00:15 (+1), EGP 17,282.
- Passenger: Mr QaRunThree Tester (ADT). Onward: Vegetarian Hindu, UPTO22LB 10KG, seat 21J. Return: Bland, UPTO22LB 10KG, seat 21J. Total EGP 25,348 (wallet).
- Booked 19/11/2026 14:55: PNR **Y7UQJD**, ticket 772453754021 (one ticket for both legs), booking ref NDCEG-BR-F261119mIX86f, order BRN222NDCORD261119C666FE.
- EMDs displayed on Booking Confirmation:

| Passenger | Segment | Ancillary | Displayed value |
|---|---|---|---|
| QaRunThree Tester (ADT) | Onward MS667 CAI→JED | Meal – Vegetarian Hindu | 1H2MSZ_PTUO6C6MTGT6UMV8K45K0R3PUIZ4-37 |
| QaRunThree Tester (ADT) | Onward MS667 CAI→JED | Seat 21J | EMD 774556363879 (connected 772453754021) |
| QaRunThree Tester (ADT) | Onward MS667 CAI→JED | Baggage UPTO22LB 10KG | EMD 774556363877 (connected 772453754021) |
| QaRunThree Tester (ADT) | Return MS670 JED→CAI | Meal – Bland | 1H2MSZ_PTUO6C6MTGT6UMV8K45K0R3PUIZ4-91 |
| QaRunThree Tester (ADT) | Return MS670 JED→CAI | Seat 21J | **No EMD displayed** |
| QaRunThree Tester (ADT) | Return MS670 JED→CAI | Baggage UPTO22LB 10KG | EMD 774556363878 (connected 772453754021) |

- Same pattern as the earlier B3 attempt (Y7RQC2): return seat shows no EMD. EMD 774556363876 is absent from the displayed sequence (875 = B2 child seat, 877–879 = this booking) — possibly the return-seat EMD; not confirmed.
- User confirmation: **Values are displayed correctly and related to the correct segments** (including return seat without EMD).
- PNR Query (Y7UQJD): Journey 1 CAI-JED and Journey 2 JED-CAI each show the same values as Booking Confirmation under QaRunThree Tester; return seat no EMD → **Pass**. Flight Legs 1 h earlier (07:10, 22:00; return arrival 30/11 23:15).
- Itinerary: same values per journey → **Pass**.
- Test cases: 006 Pass, 025 Pass, 027 Pass, 015 Pass.

### B4 — Round trip CAI⇄JED 30/11, 2 ADT + 1 CHD + 1 INF (Book) — FAILED
- Search "2 Adults • 1 Child • 1 Infant"; flight #2 MS667 + MS670, EGP 56,490 (fares).
- Passenger Details: infant form has an "Assigned to" field (adults listed). With names "QaRunFourA Tester" etc., Next returned toast "Invalid request. Please check the request parameters and try again. Adult (QaRunFourA Tester)". Per user, names changed to short letters-only: kda kdf (ADT, infant assigned), kdb kdf (ADT), kdc kdf (CHD), kdd kdf (INF) → Ancillaries loaded.
- Ancillaries: 3 passengers × 2 directions (infant has no meal/baggage/seat). Seats onward/return: kda 22B, kdb 22J, kdc 23B. Net payable EGP 80,688.
- Book result 19/11/2026 15:09: status **Failed**, no PNR, no ticket numbers, no EMDs on any ancillary. Booking ref NDCEG-BR-F261119JF7K52, order BRN222NDCORD261119UJZKMD. Wallet deduction not yet checked.
- Test cases 007, 010, 026: not yet executed (booking failed).
- Wallet check: balance before the retry was EGP 8,771,273.6, unchanged → failed attempt was not charged.
- Retry 2 (19/11/2026 15:13), same flight #2 MS667/MS670, names kfa/kfb/kfc/kfd kdf, seats 22B/22J/23B both ways, EGP 80,688: status **Failed** with message "The requested flight or class is no longer available." Booking ref NDCEG-BR-F2611193MSJ0J, order BRN222NDCORD261119LN7TMJ, no PNR/tickets/EMDs.
- Retry 3 (19/11/2026 15:17), flight #3 MS665 CAI 02:30→JED 05:40 + MS662 JED 11:40→CAI 12:55, names kga/kgb/kgc/kgd kdf, EGP 80,963: status **Failed**, "The requested flight or class is no longer available." Booking ref NDCEG-BR-F261119RZ32yj, order BRN222NDCORD261119MQ783G.
- Retry 4: user asked to use route CAI⇄DXB instead.

### B4 (retry 4) — Round trip CAI⇄DXB 30/11, 2 ADT + 1 CHD + 1 INF (Book)
- Search "CAI → DXB & Back", 12 options; flight #2 MS912 CAI 09:45 → DXB 15:00 + MS906 DXB 20:00 → CAI 22:05, EGP 51,171 (fares).
- Passengers: kha kdf (ADT, infant assigned), khb kdf (ADT), khc kdf (CHD, DOB 03/09/2017), khd kdf (INF, DOB 01/06/2025). Baggage UPTO22LB 10KG EGP 4,302 per slot. Total EGP 78,707 (wallet).
- Booked 19/11/2026 15:21: PNR **Y7YFIJ**, booking ref NDCEG-BR-F261119gXClIP, order BRN222NDCORD261119I3M9RE. Tickets: kha 772453754052, khb 772453754053, khc 772453754054, khd (INF) 772453754051.
- EMDs displayed on Booking Confirmation:

| Passenger | Segment | Ancillary | Displayed value |
|---|---|---|---|
| kha kdf (ADT) | Onward MS912 CAI→DXB | Meal – Vegetarian Hindu | 1H2MSZ_QLK1OY8ZFZUD06VI6RO616FJTMJQ-110 |
| kha kdf (ADT) | Onward MS912 | Seat 54A (free, EGP 0) | No EMD displayed |
| kha kdf (ADT) | Onward MS912 | Baggage UPTO22LB 10KG | EMD 774556363884 (connected 772453754052) |
| kha kdf (ADT) | Return MS906 DXB→CAI | Meal – Bland | 1H2MSZ_QLK1OY8ZFZUD06VI6RO616FJTMJQ-275 |
| kha kdf (ADT) | Return MS906 | Seat 21A (EGP 431) | EMD 774556363887 (connected 772453754052) |
| kha kdf (ADT) | Return MS906 | Baggage UPTO22LB 10KG | EMD 774556363885 (connected 772453754052) |
| khb kdf (ADT) | Onward MS912 | Meal – Fruit Platter | 1H2MSZ_QLK1OY8ZFZUD06VI6RO616FJTMJQ-129 |
| khb kdf (ADT) | Onward MS912 | Seat 54K (free, EGP 0) | No EMD displayed |
| khb kdf (ADT) | Onward MS912 | Baggage UPTO22LB 10KG | EMD 774556363882 (connected 772453754053) |
| khb kdf (ADT) | Return MS906 | Meal – Gluten Intolerant | 1H2MSZ_QLK1OY8ZFZUD06VI6RO616FJTMJQ-294 |
| khb kdf (ADT) | Return MS906 | Seat 22A (EGP 431) | EMD 774556363888 (connected 772453754053) |
| khb kdf (ADT) | Return MS906 | Baggage UPTO22LB 10KG | EMD 774556363883 (connected 772453754053) |
| khc kdf (CHD) | Onward MS912 | Meal – Low Calorie | 1H2MSZ_QLK1OY8ZFZUD06VI6RO616FJTMJQ-136 |
| khc kdf (CHD) | Onward MS912 | Seat 21A (EGP 431) | EMD 774556363886 (connected 772453754054) |
| khc kdf (CHD) | Onward MS912 | Baggage UPTO22LB 10KG | EMD 774556363880 (connected 772453754054) |
| khc kdf (CHD) | Return MS906 | Meal – Low Salt | 1H2MSZ_QLK1OY8ZFZUD06VI6RO616FJTMJQ-301 |
| khc kdf (CHD) | Return MS906 | Seat 22K (EGP 431) | No EMD displayed |
| khc kdf (CHD) | Return MS906 | Baggage UPTO22LB 10KG | EMD 774556363881 (connected 772453754054) |
| khd kdf (INF) | Both | Meal / Baggage / Seat | None (infant has no ancillaries) |

- User confirmation: **Approved** (after reviewing connected ticket per EMD: kha → 772453754052, khb → 772453754053, khc → 772453754054).
- PNR Query (Y7YFIJ): Journey 1 CAI-DXB and Journey 2 DXB-CAI, 3 passengers each; all 15 values under the same passenger/journey/ancillary with the same connected tickets; seats 54A, 54K (onward) and khc 22K (return) without EMD → **Pass**. Flight Legs 1 h earlier (08:45, 19:00).
- Itinerary: same values per journey and passenger → **Pass**. Observation: CAI-DXB duration shown as 5h 15m (local 09:45–15:00).
- Test cases: 007 Pass, 010 Pass, 026 Pass, 016 Pass (partial seat EMD occurred naturally).

### B5 — Multi-city CAI→JED 30/11, JED→CAI 01/12, CAI→DXB 02/12, 1 ADT (Book) — FAILED
- Search "CAI → DXB (Via: JED, CAI)", 50 options; flight #2 MS665 CAI 02:30→JED 05:40, MS674 JED 05:30→CAI 06:45, MS901 CAI 04:25→DXB 09:40, EGP 34,080.
- Passenger kia kdf (ADT). Meals Vegetarian Hindu / Bland / Fruit Platter; baggage UPTO22LB 10KG ×3 (3,495 / 3,495 / 4,302); seats 21J / 21B / 21A. Total EGP 46,879.
- Book result 19/11/2026 15:28: status **Failed**, "The requested flight or class is no longer available." Booking ref NDCEG-BR-F261119xfzamM, order BRN222NDCORD261119F4EBPQ. No PNR, tickets or EMDs.
- Test case 028: not yet executed.

### B5 (retry) — Multi-city CAI→DXB 07/12, DXB→CAI 08/12, CAI→JED 09/12, 1 ADT (Book)
- Route and dates changed by user. Search "CAI → JED (Via: DXB, CAI)", 50 options; flight #2 MS905 CAI 13:45→DXB 19:00, MS913 DXB 16:20→CAI 18:20, MS661 CAI 07:15→JED 10:25, EGP 30,375.
- Passenger kja kdf (ADT). Meals Vegetarian Hindu / Bland / Fruit Platter; baggage UPTO22LB 10KG (4,302 / 4,302 / 3,495); seats 21A / 22A / 22E. Total EGP 43,874.
- Booked 19/11/2026 15:46: PNR **Y83D84**, ticket 772453754092 (all 3 legs), booking ref NDCEG-BR-F261119bAAyaF, order BRN222NDCORD261119IIORTX.
- EMDs displayed on Booking Confirmation:

| Passenger | Segment | Ancillary | Displayed value | Connected ticket |
|---|---|---|---|---|
| kja kdf (ADT) | Leg 1 MS905 CAI→DXB | Meal – Vegetarian Hindu | 1H2MSZ_2JNWOL47GDOXY62R7DOHJKKCGRPP-38 | — |
| kja kdf (ADT) | Leg 1 MS905 | Seat 21A | EMD 774556363904 | 772453754092 |
| kja kdf (ADT) | Leg 1 MS905 | Baggage UPTO22LB 10KG | EMD 774556363901 | 772453754092 |
| kja kdf (ADT) | Leg 2 MS913 DXB→CAI | Meal – Bland | 1H2MSZ_2JNWOL47GDOXY62R7DOHJKKCGRPP-93 | — |
| kja kdf (ADT) | Leg 2 MS913 | Seat 22A | No EMD displayed | — |
| kja kdf (ADT) | Leg 2 MS913 | Baggage UPTO22LB 10KG | EMD 774556363902 | 772453754092 |
| kja kdf (ADT) | Leg 3 MS661 CAI→JED | Meal – Fruit Platter | 1H2MSZ_2JNWOL47GDOXY62R7DOHJKKCGRPP-153 | — |
| kja kdf (ADT) | Leg 3 MS661 | Seat 22E | EMD 774556363905 | 772453754092 |
| kja kdf (ADT) | Leg 3 MS661 | Baggage UPTO22LB 10KG | EMD 774556363903 | 772453754092 |

- User confirmation: **Approved** (after reviewing connected tickets).
- PNR Query (Y83D84): Journeys 1–3 each show the same meal ID, baggage EMD and seat EMD as Booking Confirmation, connected to 772453754092; leg 2 seat 22A without EMD → **Pass**. Flight Legs 1 h earlier (12:45, 15:20, 06:15).
- Itinerary: same values per journey → **Pass**. CAI-DXB duration again shown as 5h 15m.
- Test case: 028 Pass.

### B6 — Multi-city CAI→DXB 07/12, DXB→CAI 08/12, CAI→JED 09/12, 1 ADT + 2 CHD + 1 INF (Book)
- Same route/dates as B5 retry. Search "1 Adult • 2 Children • 1 Infant", 50 options; flight #2 MS905 / MS913 / MS661, EGP 95,471 (fares).
- Passengers: kka kdf (ADT, infant assigned), kkb kdf (CHD, 03/09/2017), kkc kdf (CHD, 14/02/2019), kkd kdf (INF, 01/06/2025). Total EGP 135,968 (wallet).
- Booked 19/11/2026 15:53: PNR **Y842TP**, booking ref NDCEG-BR-F261119uHs4M5, order BRN222NDCORD261119QR8606. Tickets: kka 772453754094, kkb 772453754095, kkc 772453754096, kkd (INF) 772453754093.
- EMDs displayed on Booking Confirmation (connected ticket in brackets):

| Passenger | Leg 1 MS905 CAI→DXB | Leg 2 MS913 DXB→CAI | Leg 3 MS661 CAI→JED |
|---|---|---|---|
| kka (ADT) meal | ...BIRQX-110 | ...BIRQX-275 | ...BIRQX-455 |
| kka seat | 21K EMD 774556363915 (…094) | 22K no EMD | 22F EMD 774556363916 (…094) |
| kka baggage | EMD 774556363912 (…094) | EMD 774556363913 (…094) | EMD 774556363914 (…094) |
| kkb (CHD) meal | ...BIRQX-132 | ...BIRQX-297 | ...BIRQX-465 |
| kkb seat | 22A EMD 774556363917 (…095) | 23A no EMD | 23E EMD 774556363919 (…095) |
| kkb baggage | EMD 774556363909 (…095) | EMD 774556363910 (…095) | EMD 774556363911 (…095) |
| kkc (CHD) meal | ...BIRQX-112 | ...BIRQX-277 | ...BIRQX-457 |
| kkc seat | 22K EMD 774556363918 (…096) | 23K no EMD | 23F EMD 774556363920 (…096) |
| kkc baggage | EMD 774556363906 (…096) | EMD 774556363907 (…096) | EMD 774556363908 (…096) |
| kkd (INF) | none | none | none |

- Meal IDs prefix 1H2MSZ_L5QZOWDM18MEO1ZID4B4SO3BIRQX. Leg 2 (DXB→CAI, MS913) seats have no EMD for any passenger (same leg as B5).
- User confirmation: **Approved**.
- PNR Query (Y842TP): Journeys 1–3, 3 passengers each — all 24 values found under the same journey/passenger/ancillary with the same connected tickets; leg 2 seats without EMD → **Pass**.
- Itinerary: identical mapping → **Pass**.
- Test case: 029 Pass.

### B7 — One-way CAI→JED 30/11, 1 ADT + 1 CHD + 1 INF (Hold → Pay by user)
- Search "1 Adult • 1 Child • 1 Infant", 29 options; flight #2 MS665 (RBD W) CAI 02:30 → JED 05:40, EGP 21,792 (fares).
- Passengers: kla kdf (ADT, infant assigned), klb kdf (CHD), klc kdf (INF). Meals Vegetarian Hindu / Bland; baggage UPTO22LB 10KG ×2; seats 21J / 22J. Net payable EGP 29,858. Wallet before hold EGP 8,512,724.6.
- Hold placed 19/11/2026 16:05: "Your booking has been on hold for PNR number: Y8645Q and last ticketing date is 20-11-2026 12:00:00 AM". PNR **Y8645Q**, booking ref NDCEG-BR-F26111973aL6C, order BRN222NDCORD261119XDPRAO. Status Hold.
- Hold confirmation page: no ticket numbers and **no EMD** on meal, seat or baggage (meal IDs ...EGK8EC-72 / -75 shown) → TC-030 **Pass**.
- Search Booking > Flight tab > Branch BRN222 + PNR Y8645Q → order BRN222NDCORD261119XDPRAO → Booking Details (Itinerary), status On Hold. No Pay button until the booking is locked.
- Pay flow (per user instruction "take the control from the lock icon and book"): PNR Query Y8645Q → **Lock** button (pi-lock-open) → "Locked By Essam Sherif" → Booking Details now shows Cancel Hold / **Confirm To Pay** / Release PNR → Confirm To Pay opens Payment Details (wallet, net payable EGP 29,858, Terms & Conditions, **Pay**) → Pay → "Booking Process… Do not refresh" dialog. Booking Details still showed On Hold right after; user reported the booking confirmed; window then showed Booking Confirmation.
- After payment — Booking Confirmation: status **Confirmed**, PNR Y8645Q, tickets kla 772453754098, klb 772453754099, klc (INF) 772453754097.

| Passenger | Segment | Ancillary | Displayed value | Connected ticket |
|---|---|---|---|---|
| kla kdf (ADT) | MS665 CAI→JED | Meal – Vegetarian Hindu | 1H2MSZ_0CGV7N6PH83L62CNWHC8Z4EGK8EC-72 | — |
| kla kdf (ADT) | MS665 | Seat 21J | EMD 774556363923 | 772453754098 |
| kla kdf (ADT) | MS665 | Baggage UPTO22LB 10KG | EMD 774556363922 | 772453754098 |
| klb kdf (CHD) | MS665 | Meal – Bland | 1H2MSZ_0CGV7N6PH83L62CNWHC8Z4EGK8EC-75 | — |
| klb kdf (CHD) | MS665 | Seat 22J | EMD 774556363924 | 772453754099 |
| klb kdf (CHD) | MS665 | Baggage UPTO22LB 10KG | EMD 774556363921 | 772453754099 |
| klc kdf (INF) | MS665 | — | No ancillaries | — |

- User confirmation: **Approved**.
- PNR Query (Y8645Q): Journey 1 CAI-JED — kla and klb each show the same meal ID, baggage EMD and seat EMD with their own connected tickets → **Pass**.
- Itinerary: identical mapping → **Pass**.
- Test cases: 030 Pass, 031 Pass, 032 Pass, 034 Pass.

### B8 — One-way CAI→JED 30/11, 1 ADT (Hold → cancel with user approval)
- Flight #2 MS661 CAI 07:15 → JED 10:25. Passenger kma kdf; meal Vegetarian Hindu, baggage UPTO22LB 10KG, seat 25E. Net payable EGP 13,076 (not paid).
- Hold placed 19/11/2026 16:14: PNR **Y86K5V**, last ticketing date 20-11-2026, booking ref NDCEG-BR-F261119c3JP5t, order BRN222NDCORD2611192BB3PS. Hold confirmation: no ticket number, no EMD (meal ID ...27QLJ-37 only).
- Cancellation approved by user ("cancel"); extra same-seat booking step skipped (not requested).
- Cancel attempt: PNR Query Y86K5V → Lock (Locked By Essam Sherif) → Booking Details → **Cancel Hold** (clicked twice). Request `POST :8080/odeysysadmin/v2/bookingDetails2/cancel-void-ticket` returned **HTTP 500** `{"code":500,"message":"Invalid request. Please check the request parameters and try again."}`. No error shown in the UI; booking remains **On Hold**. **Defect candidate.**
- While still on hold: PNR Query and Itinerary show meal ID, baggage and seat 25E with **no EMD** (no "EMD" label anywhere).
- TC-033: **Blocked** — hold could not be cancelled (Cancel Hold fails with HTTP 500). Hold will expire at last ticketing date 20-11-2026 unless released/cancelled otherwise.
