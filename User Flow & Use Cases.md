# DOCUMENT 2: USER FLOW & USE CASES

## EcoTrack — Smart E-Waste Traceability System

**Version:** 1.0  
**Project:** Six-Hour Hackathon MVP  
**Tagline:** Scan. Track. Recycle.

## 1. Purpose

This document describes the user journeys, navigation flow, role-based actions, and main use cases of EcoTrack. It will serve as the reference for designing the application screens and connecting frontend pages to backend APIs.

## 2. User Roles

| User Role | Primary Responsibilities |
|---|---|
| Guest | Scan QR codes and view public tracking information |
| Customer | Register e-waste and view registered items |
| Collection Centre | Record collection and handover |
| Transporter | Record transportation and delivery |
| Inspector / Refurbisher | Inspect items and record refurbishment or recycling decisions |
| Recycler | Record final recycling and processing |
| Admin | Manage stakeholder accounts, review records, and monitor statistics |

## 3. Application Entry Flow

When a visitor opens EcoTrack, the home page provides the following options:

- Login
- Register as a customer
- Track an item using its ID
- Scan a QR code using the device camera

Visitors can access public tracking without an account. Operations such as updating a status require an authenticated and authorized stakeholder account.

## 4. Customer Registration and Login Flow

1. The customer opens the EcoTrack home page.
2. The customer selects Register.
3. The registration form collects the name, email or mobile number, password, and required consent.
4. The backend validates the information and creates the account.
5. The customer logs in using their registered credentials.
6. The backend verifies the credentials and establishes an authenticated session.
7. The customer is redirected to the customer dashboard.
8. The customer can register e-waste, view their items, or log out.

**Alternative flows:**

- If required fields are missing, the application displays validation messages.
- If the email or mobile number is already registered, the application asks the user to log in.
- If login credentials are invalid, an appropriate error message is displayed.
- If the user forgets the password, they can use the configured password-recovery process.

## 5. E-Waste Registration Flow

1. The customer opens the dashboard.
2. The customer selects Register E-Waste.
3. The application displays the registration form.
4. The customer enters the device name, category, condition, quantity, pickup location, and optional notes.
5. The frontend validates required fields.
6. The backend validates the submission and saves the record.
7. The system generates a unique item ID.
8. A QR code is generated containing the item's tracking URL.
9. The application displays a success page with the item ID and QR code.
10. The customer can download the QR code or open the tracking page.

**Expected result:** A uniquely identified e-waste record is saved in the database and can be tracked.

## 6. Public QR Tracking Flow

1. A visitor scans an item's QR code or opens EcoTrack.
2. The visitor enters the item ID if they do not have a QR code.
3. The application retrieves the corresponding item.
4. The tracking page displays the device category, current status, last update, and tracking timeline.
5. The visitor reviews the item's recorded journey without logging in.

**Alternative flow:** If the ID is invalid or the item does not exist, the application displays an item-not-found message.

Public tracking must not expose customer passwords, phone numbers, private addresses, or other sensitive information.

## 7. Stakeholder Login and Dashboard Flow

1. An approved stakeholder logs in.
2. The backend verifies the account and its assigned role.
3. The application redirects the stakeholder to the appropriate dashboard.
4. The dashboard displays relevant items and permitted operations.
5. The stakeholder searches for or selects an item.
6. The stakeholder performs an authorized action.
7. The backend validates the action and saves the result.
8. The dashboard and tracking page display the updated information.

A stakeholder must not be able to gain additional permissions by changing a role value in the frontend.

## 8. Collection Centre Flow

1. The collection-centre user opens the assigned dashboard.
2. The user locates the registered item.
3. The user verifies the item's ID and details.
4. The user records collection, location, and optional notes.
5. The backend saves a `Collected` history event.
6. The collection-centre user records a handover when the item is transferred to the transporter.
7. The tracking timeline displays the recorded collection and handover events.

## 9. Transporter Flow

1. The transporter logs in.
2. The transporter opens the items assigned for transportation.
3. The transporter confirms the item ID and destination.
4. The transporter records pickup or dispatch.
5. The system records the `In Transit` status and timestamp.
6. When the destination receives the item, the delivery or handover is recorded.
7. The item moves to the appropriate next stage.

Only permitted status transitions can be recorded.

## 10. Inspection and Refurbishment Flow

1. The inspection-centre user logs in.
2. The user opens an item awaiting inspection.
3. The user checks the recorded device details.
4. The user records the inspection result and optional notes.
5. The user chooses an outcome:
   - **Refurbishment:** The item is repaired or prepared for reuse. The record is updated to `Refurbished` once that work is completed.
   - **Recycling:** The item is sent to a recycler and its status becomes `Sent for Recycling`.
6. The system saves the decision as a tracking-history event.

The system records the inspector's decision; it does not automatically diagnose a device.

## 11. Recycler Flow

1. The recycler logs in using an approved account.
2. The recycler views items assigned or delivered for recycling.
3. The recycler verifies the item ID and records receipt.
4. The recycler performs or records the appropriate processing activity.
5. Once final processing is confirmed, the recycler updates the item to `Processed`.
6. The tracking history displays the final processing record.

An item must not be marked `Processed` merely because it was sent to a recycling facility.

## 12. Admin Flow

1. The administrator logs in.
2. The system verifies the account's admin permissions.
3. The admin dashboard displays item counts, status summaries, and stakeholder information.
4. The admin can review item records and their history.
5. The admin can approve or create stakeholder accounts.
6. The admin can investigate invalid records and perform permitted administrative corrections.
7. Relevant changes are recorded for accountability.

Administrative actions must not silently erase previous tracking events.

## 13. Logout Flow

1. The authenticated user selects Logout.
2. The application ends the user's authenticated session or invalidates the appropriate session credentials.
3. The application redirects the user to the home or login page.
4. Protected pages and APIs no longer accept the ended session.

## 14. Main Application Navigation

| Route | Screen | Access |
|---|---|---|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Customer registration | Public |
| `/forgot-password` | Password recovery | Public |
| `/dashboard` | Role-based dashboard | Authenticated users |
| `/register-item` | E-waste registration | Customer |
| `/my-items` | Customer's registered items | Customer |
| `/track/:id` | Public tracking page | Public |
| `/dashboard/items` | Operational item list | Authorized stakeholders |
| `/dashboard/items/:id` | Item details and history | Authorized stakeholders |
| `/dashboard/items/:id/update` | Status update | Authorized stakeholders |
| `/dashboard/items/:id/inspect` | Inspection and decision | Inspector / Refurbisher |
| `/admin` | Admin overview | Admin |
| `/profile` | User profile | Authenticated users |

For the six-hour MVP, status updates and inspection can be dialogs within the dashboard rather than separate pages.

## 15. Core Use Cases

| Use Case ID | Use Case | Primary Actor | Expected Outcome |
|---|---|---|---|
| UC-01 | Register an account | Customer | Account created |
| UC-02 | Log in | Registered user | Authenticated access established |
| UC-03 | Register e-waste | Customer | Item saved with a unique ID |
| UC-04 | Generate QR code | System | QR code opens the correct tracking URL |
| UC-05 | View public tracking | Guest | Current status and history displayed |
| UC-06 | Record collection | Collection Centre | Collection event saved |
| UC-07 | Record transportation | Transporter | Transit or handover event saved |
| UC-08 | Inspect an item | Inspector / Refurbisher | Inspection outcome recorded |
| UC-09 | Record recycling | Recycler | Processing outcome recorded |
| UC-10 | Review records | Admin | Item details and statistics displayed |

## 16. General Business Rules

1. Every e-waste item must have a unique identifier.
2. Every accepted status update must create a history record.
3. The backend must verify user permissions for protected operations.
4. Public tracking must not require login.
5. Public pages must expose only approved, non-sensitive information.
6. Invalid status transitions must be rejected.
7. Refurbishment and recycling must be represented as different outcomes.
8. Processing is complete only when the final processing activity has been recorded.
9. Failed operations must display useful error messages without corrupting the existing record.
10. Dashboard counts must be derived from saved data rather than hardcoded values.

## 17. Expected Outcome

The user-flow implementation should demonstrate the full journey of an electronic device: customer registration, QR generation, collection, transportation, inspection, refurbishment or recycling, and final processing where applicable.

Each journey should be traceable through a public tracking page, while authorized stakeholders use secure dashboards to record the operations assigned to them.
