# EgyptAir INT Seat Map — EMD Information Support

**Source:** Plain Text (pasted by user, 2026-11-03) · **Environment given with story:** `192.168.1.92`

## Description
EgyptAir is already integrated with the Seat Map flow through the NDC Integration Common Seat Map Interface.

This story shall enhance the EgyptAir INT Seat Map integration to support and display the applicable EMD information returned by the supplier/common interface.

The enhancement shall be applied to: EgyptAir INT Seat Map / Seat Ancillary.

The Core System shall consume the EMD information from the existing common/normalized response and shall not introduce EgyptAir-specific EMD business logic. No separate EMD creation or processing flow shall be introduced.

## Scope
### In Scope
- Support EMD information for EgyptAir INT Seat Map.
- Consume EMD information from the NDC Integration common/normalized response.
- Capture the EMD associated with the confirmed Seat / Ancillary.
- Display the applicable EMD ID.
- Display the applicable EMD Free Text.
- Associate EMD information with the correct: Passenger; Flight Segment; Seat / Ancillary.
- Display EMD information in the applicable existing post-booking locations: Booking Confirmation; PNR Query; Itinerary; Finance Report.
- Preserve the existing Seat Map flow.
- Preserve the existing common EMD display behavior.

### Out of Scope
- Creating a separate EMD flow.
- Creating an EMD manually from Core.
- EgyptAir-specific EMD calculations.
- Changes to unrelated Seat Map suppliers.
- Changes to the common NDC Integration interface unless an integration gap is identified.
- Changes to Seat Map booking logic unrelated to EMD.
- Fabricating EMD information when it is not returned by the supplier/common interface.

## Preconditions
- The booking supplier is EgyptAir INT.
- Seat Map is available through the NDC Integration Common Interface.
- The user successfully selects the applicable seat/ancillary.
- The booking is successfully processed.
- The supplier/common interface returns applicable EMD information.

## Main Business Flow
EgyptAir INT Flight → Seat Map Retrieved through Common Interface → User Selects Seat → Booking Submitted → Seat / Ancillary Confirmed → Supplier / Common Interface Returns EMD Information → Core Stores / Maps EMD against Correct PAX + Segment + Seat → EMD Displayed in Applicable Post-Booking Screens

## EMD Information
**EMD ID** — display against the applicable confirmed Seat / Ancillary.
Example: Passenger: Ahmed Adel; Segment: CAI → JED; Seat: 12A; EMD ID: 1761234567890

**EMD Free Text** — where returned, display according to the existing EMD display behavior. Example: EMD ID: 1761234567890 / EMD Free Text: SEAT 12A. The system shall not create or infer Free Text when it is not returned.

**Passenger Association** — EMD associated with the correct passenger. Example: PAX 1 Seat 12A EMD-001; PAX 2 Seat 12B EMD-002. EMD returned for PAX 1 shall not be displayed against PAX 2.

**Segment Association** — multi-segment journeys map EMD to the correct segment. Example: PAX 1: CAI → JED Seat 12A EMD-001; JED → RUH Seat 15C EMD-002. Preserve the relationship Passenger + Segment + Seat/Ancillary + EMD.

**Multiple Passengers** — display applicable EMD separately against each passenger; do not reuse the same EMD across passengers unless explicitly returned that way by the supplier/common interface.

**Multiple Segments** — each seat stays associated with its segment; each EMD stays associated with its seat/ancillary and segment; no duplication across unrelated segments.

**Booking Confirmation** — display applicable EMD for the confirmed Seat / Ancillary wherever existing ancillary information is displayed.

**PNR Query** — display applicable EMD for EgyptAir INT Seat Map ancillaries; correct passenger and segment.

**Itinerary** — display applicable EMD alongside the corresponding Seat / Ancillary information.

**Finance Report** — where confirmed Seat / Ancillary information is displayed, also display applicable EMD per the existing reporting structure.

**No EMD Returned** — Given the supplier/common interface does not return EMD information, the system shall: not display an incorrect EMD ID; not display stale EMD information from another transaction; not reuse an EMD from another passenger; not reuse an EMD from another segment; not fabricate EMD Free Text. The Seat Map booking itself follows existing behavior.

## Functional Requirements
- FR1 Consume applicable EMD information returned for EgyptAir INT Seat Map ancillaries through the NDC Integration common interface.
- FR2 Display the EMD ID when returned.
- FR3 Display applicable EMD Free Text when returned.
- FR4 EMD associated with the correct Passenger.
- FR5 EMD associated with the correct Flight Segment.
- FR6 EMD associated with the correct Seat / Ancillary.
- FR7 Support EMD information for multiple passengers.
- FR8 Support EMD information for multiple flight segments.
- FR9 Display applicable EMD in Booking Confirmation.
- FR10 Display applicable EMD in PNR Query.
- FR11 Display applicable EMD in Itinerary.
- FR12 Display applicable EMD in Finance Report.
- FR13 Do not display EMD information when not returned or applicable.
- FR14 Consume common/normalized EMD information; no EgyptAir-specific EMD processing logic in Core.
- FR15 Existing EgyptAir Seat Map booking flow unchanged except for required EMD support.

## Acceptance Criteria
- AC1 EgyptAir Seat Map EMD — Given an EgyptAir INT Seat Map ancillary is confirmed and EMD information is returned, the system captures and displays it.
- AC2 Common Interface — EMD consumed from the existing NDC Integration common/normalized response.
- AC3 EMD ID — Given an EMD ID is returned, display it against the applicable confirmed Seat / Ancillary.
- AC4 EMD Free Text — Given applicable Free Text is returned, display per existing EMD display rules.
- AC5 Correct Passenger — EMD displayed against the passenger to whom the seat/ancillary belongs.
- AC6 Correct Segment — EMD displayed against the correct flight segment.
- AC7 Correct Seat / Ancillary — EMD remains associated with the corresponding confirmed seat/ancillary.
- AC8 Multiple PAX — each applicable EMD mapped and displayed against the correct passenger.
- AC9 Multiple Segments — each applicable EMD displayed against the correct passenger, segment, and Seat / Ancillary.
- AC10 Booking Confirmation — applicable EMD displayed.
- AC11 PNR Query — applicable EMD displayed when retrieving the booking.
- AC12 Itinerary — applicable EMD displayed.
- AC13 Finance Report — applicable EMD displayed per existing report behavior.
- AC14 No EMD Returned — no fabricated or unrelated EMD information displayed.
- AC15 No Stale EMD — no EMD stored from another passenger, segment, seat, booking, or previous transaction.
- AC16 Existing Seat Map Flow — EgyptAir INT Seat Map flow unchanged.
- AC17 No Separate EMD Flow — no separate EMD-specific user journey.
- AC18 Supplier-Agnostic Core — no EgyptAir-specific EMD display or processing logic in Core.

## Validation Matrix
| Scenario | Expected Result |
|---|---|
| Seat confirmed + EMD ID returned | Correct EMD ID displayed |
| EMD ID + Free Text returned | Both displayed |
| EMD not returned | No EMD displayed |
| Multiple PAX | Correct EMD per PAX |
| Multiple segments | Correct EMD per segment |
| Multiple seats | Correct EMD per seat |
| Booking Confirmation | EMD displayed |
| PNR Query | EMD displayed |
| Itinerary | EMD displayed |
| Finance Report | EMD displayed |
| Supplier returns no EMD | No fabricated/stale information |
| Existing Seat Map flow | Remains unchanged |

## Business Rules
1. Applies to EgyptAir INT Seat Map.
2. EMD information comes from the supplier/common NDC Integration response.
3. EMD ID displayed when returned.
4. EMD Free Text displayed when returned and applicable.
5. EMD mapped to the correct Passenger.
6. EMD mapped to the correct Segment.
7. EMD mapped to the correct Seat / Ancillary.
8. Multiple passengers and segments supported.
9. EMD displayed in Booking Confirmation, PNR Query, Itinerary, and Finance Report.
10. No EMD information fabricated when not returned.
11. No stale or unrelated EMD information displayed.
12. No separate EMD-specific user flow introduced.
13. Existing Seat Map behavior unchanged.
14. Core remains supplier-agnostic and consumes normalized EMD information from the common interface.

## Main Requirement
Enhance the EgyptAir INT Seat Map integration to consume and display applicable EMD information returned through the NDC Integration Common Interface. The system shall display the EMD ID and applicable EMD Free Text against the correct Passenger, Flight Segment, and confirmed Seat/Ancillary across Booking Confirmation, PNR Query, Itinerary, and Finance Report, without introducing a separate EMD flow or EgyptAir-specific EMD business logic into the Core System.
