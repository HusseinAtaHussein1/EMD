---
name: ndc-emd-booking-verification
description: Executes the EgyptAir Seat Map / ancillary EMD test cases in the NDC Admin portal. Searches flights, books (Book or Hold) with passengers, meal, baggage and seats, then verifies the user-supplied EMD per passenger and ancillary on Booking Confirmation, PNR Query, Itinerary and Finance Report. Use when running or re-running NDC_TestCases_SeatMapEMD_Execution.xlsx against a live environment.
inputs:
  - name: test_cases
    type: file_path
    required: true
    description: "projects/NDC/workspace/test_design/SeatMapEMD/NDC_TestCases_SeatMapEMD_Execution.xlsx (or a list of TC IDs to run)."
  - name: run_inputs
    type: asked_from_user
    required: true
    description: "Environment URL, login, branch/agency/agent and flight search criteria. Never assumed or reused from a previous run; ask the user every time (see 'Ask before starting')."
outputs:
  - name: execution_results
    type: file_path
    location: "projects/NDC/workspace/test_design/SeatMapEMD/NDC_TestCases_SeatMapEMD_Execution.xlsx"
    description: Status, Actual Result, Tester, Execution Date, Comments per test case.
  - name: exploration_notes
    type: file_path
    location: "projects/NDC/workspace/discovery/SeatMapEMD_Exploration.md"
    description: Observations and evidence screenshot names (copied into SeatMapEMD_evidence/).
---

# NDC EMD Booking Verification

Process taught by the test owner. Follow the steps in order for each test case.

## Ask before starting (every run, every time)
This skill stores no environment, account, branch or search data. Before doing anything in the portal, ask the user for each of these, and do not reuse values from earlier runs, notes or files:
1. **Environment**: the portal URL to use.
2. **Login**: which credentials to use and where they are provided. Never print or paste the password.
3. **Branch**, plus **Agency** and **Agent** if the user wants them.
4. **Flight search criteria**: trip type, route(s), date(s), cabin, and the number and type of passengers.
5. **Passenger details** to enter (names and the other required fields), or confirm that the skill may invent obvious test data.
6. **Ancillary choices**: which meal, baggage and seat for each passenger and segment.
7. **Book or Hold** for each test case, unless the test case already says.

If the user changes any of these mid-run, use the new value and say so.

## Guardrails
- **Book, Hold and Pay change data or spend wallet money on a shared environment.** Only run them for cases the user asked for in this session.
- **Pay is always clicked by the user.** Stop and ask; never click it yourself.
- **Never guess expected EMDs.** After each booking, ask the user for them (see steps 5 and 6).
- Do not echo the password in messages or notes.
- List every PNR created in the notes. Leave or cancel holds only with the user's approval.
- The EMD is a **value** (an ID shown against each ancillary), not a table column. Search the displayed values for the exact EMD ID; do not look for a column header.

## Steps

### 1. Flight Search
Booking-Mid Office > Flight Search.
1. Select the **Branch** the user gave (Agency and Agent optional).
2. Choose the trip type: **One-way**, **Round-trip** or **Multi-city**.
3. Set From, To, date(s) and cabin, and the **number and type of passengers**, all as the user gave them.
4. Click **Search**. Confirm EgyptAir results appear.

### 2. Book Flight and passenger details
1. Click **Book Flight** on any result.
2. Fill **Passenger Details** for **every** passenger and click **Next**.

### 3. Ancillaries (every passenger)
On the Ancillaries step choose, for each passenger and each segment as the user gave them:
- **Meal Preference**
- **Baggage You Want**
- **Seat** (Seat Selection > Select Seat > pick seat > Book {seat} for {passenger} > Confirm seat)

### 4. Book or Hold
Tick **Terms & Conditions**, then click **Book** or **Hold**. Book pays from the wallet and issues the ticket. Hold reserves without payment. Clicking Book opens a "Confirm Booking" dialog ("Are you sure you want to book this flight?"); click Book in the dialog to proceed. The booking spinner can take about 40 seconds; do not refresh.

### 5. If Book: Booking Confirmation
The Booking Confirmation page displays the EMD for each ancillary. **Ask the user for the expected EMDs** (passenger, segment, ancillary, EMD ID, Free Text) and compare them with the page.

### 6. If Hold: pay from Search Booking
1. The hold confirmation page shows **no EMD**. That is expected; record it.
2. Booking-Mid Office > side menu > Booking-Mid Office > **Search Booking** > **Flight** tab.
3. Enter the Branch and the PNR (Airline/GDS PNR), click **Search**, and click the order in the grid. The page that opens is the **Itinerary**.
4. **Ask the user to click Pay.**
5. After payment, **ask the user for the correct EMDs by passenger** and compare them with the confirmation page.

### 7. Verify the same EMDs on the other pages
After every booking, check the user-supplied EMDs also appear next to the right passenger, segment and ancillary on:
1. **PNR Query** (top menu; search by PNR, Ticket No. or Booking Ref.).
2. **Itinerary**: the Booking Details page opened from the Search Booking grid, tab **Itinerary Details**, section Segment Ancillaries (Meals, Baggage, Seats).
3. **Finance Report**: Reports > Finance Report, Branch and date range required (ask the user for them). Look at row values and any detail view, not only column headers.

Also confirm the EMD is identical on all four pages (Booking Confirmation, PNR Query, Itinerary, Finance Report), and that no EMD is shown on the wrong passenger, wrong segment, or from another booking.

### 8. Record results
For each case record four separate checks: Booking Confirmation, PNR Query, Itinerary, Finance Report. Mark each Pass, Fail or Blocked, with the evidence screenshot name, Tester and Execution Date. Copy screenshots into `workspace/discovery/SeatMapEMD_evidence/`.

## UI tips
- Date fields: type per key (slow typing) or use the picker; close the open date picker before clicking other controls.
- Dropdowns are PrimeNG: filter box inside the open list; the Finance Report branch is a multi-select with checkboxes.
- Seat selection: click the seat, then "Book {seat} for {passenger}", then "Confirm seat" (with several passengers the last button reads "Confirm N seats"). If a locator is blocked, click by position; the map can scroll after the first click, so read the "Book {seat} for {passenger}" button text to see which seat was actually selected.
- Multi-passenger and round-trip bookings: each passenger has an accordion on Passenger Details and a block on Ancillaries; each direction has its own meal, baggage and Select Seat. The "Choose a meal" and "Choose a baggage" placeholders repeat, so pick them in order and take the first remaining one each time.
- Round trip: the return row's From/To fill themselves; set the return date with the calendar button (typed dates are dropped). The booking can take about 60 seconds.
- Seats taken by earlier test bookings show as occupied, so choose a different seat each run.

## Open items (confirm with the user)
- Where the **Pay** control is on a held booking.
- How the Finance Report shows EMD values.
- Whether an EMD is expected for meal and baggage as well as seats.
