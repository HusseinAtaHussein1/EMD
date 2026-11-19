# EgyptAir Seat Map / Ancillary EMD — Agency Portal Run Report

| | |
|---|---|
| Run date | 2026-11-19 |
| Environment | http://192.168.1.80:9500/auth/login (Agency portal) |
| Agency / User | AGN2 / e.saady@ndceg.com (Essam Saady) |
| Skill | ndc-emd-booking-verification |
| Process per booking | 1. Search flight → 2. Book (or Hold → Pay) → 3. User confirms displayed EMDs → 4. Check Itinerary shows the same EMDs on the correct passenger, segment and ancillary |
| Scope | Same routes, dates, passenger mixes and actions as the Admin run (B1–B10). PNR Query excluded (not available in the agency portal). Finance Report excluded. Second flight in the results. Short letters-only names. No screenshots. |

## Booking plan

| # | Trip | Passengers | Action |
|---|---|---|---|
| B1 | One-way CAI→JED 30/11/2026 | 1 ADT | Book |
| B2 | One-way CAI→JED 30/11/2026 | 1 ADT + 1 CHD | Book |
| B3 | Round trip CAI→JED 30/11, JED→CAI 30/11 | 1 ADT | Book |
| B4 | Round trip CAI→DXB 30/11, DXB→CAI 30/11 | 2 ADT + 1 CHD + 1 INF | Book |
| B5 | Multi-city CAI→DXB 07/12, DXB→CAI 08/12, CAI→JED 09/12 | 1 ADT | Book |
| B6 | Multi-city (same) | 1 ADT + 2 CHD + 1 INF | Book |
| B7 | One-way CAI→JED 30/11/2026 | 1 ADT + 1 CHD + 1 INF | Hold → Pay |
| B8 | One-way CAI→JED 30/11/2026 | 1 ADT | Hold → Cancel (user approval) |
| B9 | Round trip CAI→DXB 30/11, DXB→CAI 30/11 | 1 ADT + 1 CHD | Hold → Pay |
| B10 | Multi-city CAI→DXB 07/12, DXB→CAI 08/12, CAI→JED 09/12 | 1 ADT + 1 CHD | Hold → Pay |

## Results

| # | PNR | Order | EMDs confirmed by user | Booking Confirmation | Itinerary |
|---|---|---|---|---|---|
| B1 | Y9VX4A | AGN2TESTESORD2611196BMH0O | Not given (run stopped) | Seat/baggage EMD not displayed | Not checked |
| B2–B10 | — | — | — | Not run (stopped by user) | Not run |

## Details per booking

### B1 — One-way CAI→JED 30/11, 1 ADT (Book)
- Search: 29 options; flight #2 MS661 (RBD T) CAI 07:15 → JED 10:25, EGP 9,043. Agency wallet before booking EGP 1,348,810.985.
- Passenger Mr paa kdf (ADT); email/phone pre-filled by the portal. Meal R1?SRV30 Vegetarian Hindu, baggage UPTO22LB 10KG (3,495), seat 25F (538). Total EGP 13,076.
- Booked 19/11/2026 23:28 (portal time): PNR **Y9VX4A**, ticket 772453754136, booking ref NDCEG-BR-F261119yEH5em, order AGN2TESTESORD2611196BMH0O. Status Confirmed.
- Displayed on Booking Confirmation:

| Passenger | Segment | Ancillary | Displayed value | Connected ticket |
|---|---|---|---|---|
| paa kdf (ADT) | MS661 CAI→JED | Meal – Vegetarian Hindu | 1H2MSZ_K1M47O6XPCT3FHL07IBYAK6O82R0-37 | — |
| paa kdf (ADT) | MS661 | Seat 25F | **No EMD displayed** | — |
| paa kdf (ADT) | MS661 | Baggage UPTO22LB 10KG | **No EMD displayed** | — |

- Difference from the Admin portal: the same flow on the Admin portal showed EMD + CONNECTED ticket for seat and baggage (Admin B1 Y7SS4Z).
- User confirmation: not given — **run stopped by the user** after B1 booking (19/11/2026). Itinerary not checked. B2–B10 not run.
