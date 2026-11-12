# NDC — Coverage Report — EgyptAir INT Seat Map EMD

## 1. Run Scope
User Story / Pasted text — RUN-20261103-001. Run Type: Feature-level story. Designed against Project Context `NDC_ProjectContext_SeatMapEMD.md` (Approved 2026-11-03). **No Discovery performed** (user choice) — all Discovery References are "Not independently verified in Discovery".

## 2. Requirements Covered
16/16 in-scope requirements have at least one test case = 100% (Covered only; Partially Covered reported separately below).
Uncovered: none.

## 3. Coverage Matrix
| Requirement | Test Cases |
|---|---|
| FR-EMD-01 | TC-SEATEMD-001, TC-SEATEMD-023, TC-SEATEMD-031 |
| FR-EMD-02 | TC-SEATEMD-001, TC-SEATEMD-002, TC-SEATEMD-021, TC-SEATEMD-031 |
| FR-EMD-03 | TC-SEATEMD-002, TC-SEATEMD-003, TC-SEATEMD-020, TC-SEATEMD-021, TC-SEATEMD-031 |
| FR-EMD-04 | TC-SEATEMD-005, TC-SEATEMD-007, TC-SEATEMD-010, TC-SEATEMD-016, TC-SEATEMD-026, TC-SEATEMD-029, TC-SEATEMD-032 |
| FR-EMD-05 | TC-SEATEMD-006, TC-SEATEMD-007, TC-SEATEMD-010, TC-SEATEMD-025, TC-SEATEMD-026, TC-SEATEMD-027, TC-SEATEMD-028, TC-SEATEMD-029, TC-SEATEMD-032 |
| FR-EMD-06 | TC-SEATEMD-001, TC-SEATEMD-005, TC-SEATEMD-007, TC-SEATEMD-025, TC-SEATEMD-028, TC-SEATEMD-031 |
| FR-EMD-07 | TC-SEATEMD-005, TC-SEATEMD-007, TC-SEATEMD-008, TC-SEATEMD-026, TC-SEATEMD-029, TC-SEATEMD-032 |
| FR-EMD-08 | TC-SEATEMD-006, TC-SEATEMD-007, TC-SEATEMD-025, TC-SEATEMD-026, TC-SEATEMD-028, TC-SEATEMD-029, TC-SEATEMD-032 |
| FR-EMD-09 | TC-SEATEMD-001, TC-SEATEMD-013, TC-SEATEMD-026, TC-SEATEMD-034 |
| FR-EMD-10 | TC-SEATEMD-009, TC-SEATEMD-010, TC-SEATEMD-013, TC-SEATEMD-022, TC-SEATEMD-026, TC-SEATEMD-029, TC-SEATEMD-034 |
| FR-EMD-11 | TC-SEATEMD-011, TC-SEATEMD-013, TC-SEATEMD-022, TC-SEATEMD-026, TC-SEATEMD-029, TC-SEATEMD-034 |
| FR-EMD-12 | TC-SEATEMD-012, TC-SEATEMD-013, TC-SEATEMD-026, TC-SEATEMD-029, TC-SEATEMD-034 |
| FR-EMD-13 | TC-SEATEMD-004, TC-SEATEMD-014, TC-SEATEMD-015, TC-SEATEMD-016, TC-SEATEMD-018, TC-SEATEMD-027, TC-SEATEMD-030, TC-SEATEMD-033 |
| BR-EMD-01 | TC-SEATEMD-004, TC-SEATEMD-014, TC-SEATEMD-015, TC-SEATEMD-027, TC-SEATEMD-030, TC-SEATEMD-033 |
| BR-EMD-02 | TC-SEATEMD-024 |
| BR-EMD-03 | TC-SEATEMD-004, TC-SEATEMD-017, TC-SEATEMD-018, TC-SEATEMD-019, TC-SEATEMD-030 |

## 4. Business Rules
| BR | Test Cases |
|---|---|
| BR-EMD-01 | TC-SEATEMD-004, TC-SEATEMD-014, TC-SEATEMD-015, TC-SEATEMD-027, TC-SEATEMD-030, TC-SEATEMD-033 |
| BR-EMD-02 | TC-SEATEMD-024 |
| BR-EMD-03 | TC-SEATEMD-004, TC-SEATEMD-017, TC-SEATEMD-018, TC-SEATEMD-019, TC-SEATEMD-030 |

## 5. Test Scenarios
Total 34 cases. By category: Positive: 10; Negative — Empty Values: 3; Integration Behaviour: 8; Business Rules (ambiguous): 1; Negative — Security/Data Integrity: 3; Boundary Values: 3; Regression Impact: 2; Error Handling: 1; Special Characters / Unicode: 1; Permissions (exploratory): 1; Configuration: 1.
Priorities: P1 20, P2 7, P3 6, P4 1.

## 6. Manual Test Cases
`workspace/test_design/SeatMapEMD/NDC_TestCases_SeatMapEMD.md` and `.xlsx` (identical content).

## 7. Assumptions
Assumption-based cases: TC-SEATEMD-002, TC-SEATEMD-008, TC-SEATEMD-009, TC-SEATEMD-010, TC-SEATEMD-011, TC-SEATEMD-012, TC-SEATEMD-013, TC-SEATEMD-019, TC-SEATEMD-020, TC-SEATEMD-021, TC-SEATEMD-022, TC-SEATEMD-023, TC-SEATEMD-024, TC-SEATEMD-025, TC-SEATEMD-026, TC-SEATEMD-028, TC-SEATEMD-029, TC-SEATEMD-030, TC-SEATEMD-031, TC-SEATEMD-032, TC-SEATEMD-034, TC-SEATEMD-033.

## 8. Coverage Gaps
- **Partially Covered:** FR-EMD-03 (Free Text display rules undefined); FR-EMD-11 (Itinerary location undefined); FR-EMD-12 (Finance Report undefined); FR-EMD-07 (shared-EMD wording ambiguous); BR-EMD-02 (code-level rule, only observable indirectly via TC-SEATEMD-024).
- **Findings:** none exist for this run; 0 Uncovered Findings.
- **Undefined by the story (Project Context §6):** existing EMD display rules/format (#3), Finance Report identity (#4), Itinerary form (#5), actor/portal (#2), Free Text "applicable" (#9), EMD ID format/max length (#11), trip types (one-way/round trip/multi-city) and hold behavior are not in the story (TC-SEATEMD-025 to 034 assumption-based; multi-city availability for EgyptAir confirmed by user 2026-11-03); user clarified 2026-11-03: no EMD on hold confirmation, EMD shown on the Pay page after hold — a fifth display location not in the story, environment .92 vs .70 (#1).
- **Timeouts / Security Inputs / Invalid Inputs:** Not Applicable (see suite header).
- **Not UI-verifiable:** BR-EMD-02 (Core supplier-agnostic) needs code review or an API/contract-level check.
- **Smallest prerequisites to unblock:** (a) confirm the environment host and EgyptAir INT enablement; (b) supply a stubbed/controllable common-interface response (or known bookings) for no-EMD, partial-EMD, shared-EMD, long/special text; (c) identify an existing EMD-bearing booking of another supplier as the display baseline; (d) name the Finance Report and Itinerary screens.

## 9. Risks
Critical: TC-SEATEMD-001, 004, 005, 006, 007, 014, 015 (wrong/fabricated/stale EMD = financial/ticketing error). High: 002, 003, 009–013, 016–018. Medium: 008, 019, 022–024. Low: 020, 021.

## 10. Recommendations
- Exploratory charter (Finance Report): once located, explore report filters/exports to confirm EMD appears in every variant (CSV/PDF if any).
- Exploratory charter (Agency portal): decide whether EMD visibility should extend to Agency/Agent (TC-SEATEMD-022).
- Run Stage 2 Discovery on the confirmed environment before Stage 4; re-run Test Design to replace "Not independently verified" references.

## 11. Automation Candidates (advisory only)
Likely suitable: TC-SEATEMD-001, TC-SEATEMD-002, TC-SEATEMD-003, TC-SEATEMD-005, TC-SEATEMD-006, TC-SEATEMD-007, TC-SEATEMD-009, TC-SEATEMD-010, TC-SEATEMD-013, TC-SEATEMD-017, TC-SEATEMD-019, TC-SEATEMD-023, TC-SEATEMD-025, TC-SEATEMD-026, TC-SEATEMD-028, TC-SEATEMD-029, TC-SEATEMD-030, TC-SEATEMD-031, TC-SEATEMD-032. Partially: TC-SEATEMD-004, TC-SEATEMD-008, TC-SEATEMD-011, TC-SEATEMD-012, TC-SEATEMD-014, TC-SEATEMD-015, TC-SEATEMD-016, TC-SEATEMD-018, TC-SEATEMD-020, TC-SEATEMD-021, TC-SEATEMD-024, TC-SEATEMD-027, TC-SEATEMD-034, TC-SEATEMD-033. Manual/exploratory: TC-SEATEMD-022. Binding decision belongs to the Automation Agent.

## 12. Inputs for Automation Agent
Manual Test Suite (md + xlsx): present. Traceability Matrix: present. Coverage Report: this file. **Handoff NOT complete:** Discovery Artifacts, Findings and Evidence Packages do not exist for this scope, so Discovery References are non-specific by necessity (§21). Stage 4 should wait for Discovery.
