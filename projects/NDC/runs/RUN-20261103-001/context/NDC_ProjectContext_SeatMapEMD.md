# NDC — Project Context — EgyptAir INT Seat Map EMD

**Run:** RUN-20261103-001 · **Status:** `Approved` (user, 2026-11-03) · **Produced by:** Project Context Agent (Stage 1) · **Date:** 2026-11-03
**Run Scope:** Type = User Story · Source = Pasted text — **EgyptAir INT Seat Map — EMD Information Support** (`PRD.md` User Story 5; full original in `resources/requirements/user_stories/EgyptAir-INT-SeatMap-EMD.md`).

> **Approval workflow:** lives under `runs/RUN-20261103-001/context/` while `Pending`; on approval moves to `projects/NDC/workspace/context/NDC_ProjectContext_SeatMapEMD.md`. New scope — no prior Project Context covers Seat Map or EMD; other Project Context documents are untouched.

---

## 1. Scope Summary

Enhancement of the existing EgyptAir INT Seat Map / Seat Ancillary flow so Core consumes the EMD ID and EMD Free Text from the NDC Integration common/normalized response, associates them with the correct Passenger + Flight Segment + confirmed Seat/Ancillary, and displays them in four existing post-booking locations: Booking Confirmation, PNR Query, Itinerary, Finance Report. No new EMD flow, no EgyptAir-specific EMD logic in Core, no fabricated or stale EMD data, and the existing Seat Map flow must not change.

## 2. Modules In Scope

| Req. ID | Requirement | Source |
|---|---|---|
| FR-EMD-01 | Consume EMD info for EgyptAir INT Seat Map ancillaries from the common/normalized response | FR1, AC1, AC2 |
| FR-EMD-02 | Display EMD ID when returned, against the confirmed Seat/Ancillary | FR2, AC3 |
| FR-EMD-03 | Display EMD Free Text when returned, per existing EMD display rules; never created/inferred | FR3, AC4 |
| FR-EMD-04 | EMD associated with correct Passenger | FR4, AC5 |
| FR-EMD-05 | EMD associated with correct Flight Segment | FR5, AC6 |
| FR-EMD-06 | EMD associated with correct Seat/Ancillary | FR6, AC7 |
| FR-EMD-07 | Multiple passengers: separate EMD per passenger; not reused unless supplier returns it so | FR7, AC8 |
| FR-EMD-08 | Multiple segments: EMD per passenger/segment/seat; not duplicated across unrelated segments | FR8, AC9 |
| FR-EMD-09 | Display in Booking Confirmation where existing ancillary info is shown | FR9, AC10 |
| FR-EMD-10 | Display in PNR Query, correct passenger and segment | FR10, AC11 |
| FR-EMD-11 | Display in Itinerary alongside Seat/Ancillary | FR11, AC12 |
| FR-EMD-12 | Display in Finance Report per existing reporting structure | FR12, AC13 |
| FR-EMD-13 | No EMD displayed when not returned/applicable | FR13, AC14 |
| BR-EMD-01 | No stale EMD from another passenger/segment/seat/booking/previous transaction | AC15, BR 11 |
| BR-EMD-02 | Core supplier-agnostic: no EgyptAir-specific EMD display/processing logic | FR14, AC18, BR 14 |
| BR-EMD-03 | Existing Seat Map flow unchanged; no separate EMD user journey | FR15, AC16, AC17, BR 12–13 |

**Preconditions (from story):** supplier is EgyptAir INT; Seat Map available via common interface; seat/ancillary selected; booking processed; supplier returns EMD.

## 3. Modules Out of Scope

- Separate EMD flow; manual EMD creation from Core; EgyptAir-specific EMD calculations.
- Seat Map for other suppliers; changes to the common NDC Integration interface (unless an integration gap is identified); Seat Map booking logic unrelated to EMD.
- Fabricating EMD when not returned.
- All modules covered by other Project Contexts (Login, Credential Routes Filter, Agency, Branch/Staff, Role, E-Ticket Branding).
- Seat Map selection UI itself, except as the precondition path to a confirmed seat.

## 4. Roles & Credentials Required

The story names no actor. Booking, PNR Query, Itinerary and Finance Report exist in the Admin portal (`architecture.md`; Admin credential confirmed per `run_configuration.md`); whether the Agency/Agent portal also shows them is not stated. See §6 #2. Credentials: reference `credentials/credentials.json` (git-ignored); no secrets recorded here.

## 5. Environment Constraints

- **Target:** `192.168.1.92`, supplied by the user with this story. `run_configuration.md` lists `192.168.1.70` for STG; the relationship between the two hosts and whether `.92` is a separate environment is **unconfirmed** (§6 #1).
- **Read-only by default.** The standing project constraint applies; no mutation authorization has been granted for this run. Creating a booking with seats (needed to produce EMDs) is mutation and, on a real supplier, may incur cost. It must be authorized explicitly and fresh before any Discovery/Execution that books. Test Design alone needs no authorization.
- Shared environment assumption carried over until told otherwise.

## 6. Carried-Forward Assumptions & Risks

| # | Item | Treatment |
|---|---|---|
| 1 | **Environment:** `192.168.1.92` vs documented `192.168.1.70`; unknown whether it is the same app, a different stage, or has EgyptAir INT enabled. | Confirm with user before Discovery; do not update `run_configuration.md` unasked. |
| 2 | **Actor/portal not stated** (Admin vs Agency/Agent portal). | Design against Admin; log as Coverage Gap. |
| 3 | **"Existing EMD display behavior/rules"** (AC4, scope) is referenced but never defined; no prior NDC document describes it. | Cannot assert exact format/placement of EMD ID/Free Text; Explorer to observe an existing EMD display (another supplier) as baseline. Assumption-based tests. |
| 4 | **Finance Report** — which report(s)/screen, and its "existing reporting structure" are unspecified. `architecture.md` lists Reports but no Finance Report by name. | Explorer to locate; Coverage Gap until resolved. |
| 5 | **Itinerary** — whether this is a screen, a printable/emailed document, or the e-ticket is unspecified. | As above. |
| 6 | **Test data dependency:** EMD only exists if the supplier returns it; staging may not return EMDs, and the "no EMD returned" path requires a way to induce it (mock, or a supplier case with no EMD). | Flag in Coverage Gaps; recommend the smallest prerequisite (a stubbed common-interface response or a known booking). |
| 7 | **Stale/cross-association checks** (AC15) need multiple passengers/segments/bookings in sequence; requires multiple real bookings. | Mutation authorization needed (§5). |
| 8 | **AC8 vs FR7 wording:** "unless explicitly returned that way by the supplier" permits a shared EMD, so "never reuse" is conditional. | Ambiguous business rule: test both readings where possible. |
| 9 | **Free Text applicability** — "where returned and applicable": "applicable" is undefined. | Coverage Gap; design only the returned/not-returned cases. |
| 10 | **Core is supplier-agnostic (BR-EMD-02) is a code-level rule**, not UI-observable. | Likely Manual Only / out of UI test reach; record as non-UI gap (e.g. code review or API-level check). |
| 12 | **User clarification (2026-11-03): hold bookings.** EMD is NOT displayed on the hold confirmation page; it IS displayed on the Pay page shown after hold confirmation. That Pay page is a display location not named in the story (FR9–FR12 list four). | Added test coverage (TC-SEATEMD-030 to 034); confirm with the story owner whether the Pay page is in scope, and whether Trip Types (one-way/round trip/multi-city) apply. |
| 11 | "Display EMD ID" example (13-digit `1761234567890`) vs the other example `EMD-001`: format of EMD ID not specified. | No format assertion beyond "displayed as returned". |

## 7. Traceability Anchor

| Item | Source |
|---|---|
| §1–§3, §2 requirements | `PRD.md` User Story 5; `resources/requirements/user_stories/EgyptAir-INT-SeatMap-EMD.md` (FR1–FR15, AC1–AC18, Business Rules) |
| §4 portals/actors | `architecture.md` navigation model; `run_configuration.md` credentials |
| §5 environment | `run_configuration.md` Environment Constraints; user-supplied `192.168.1.92` |
| §6 #1 | `run_configuration.md` Target Environment |

---

*Per `pipeline/pipeline.md` §5.1, this artifact requires Human Review before Stage 2 (Explorer) or Stage 3 (Test Design) may proceed.*
