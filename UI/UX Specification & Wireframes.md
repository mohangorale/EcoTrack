# DOCUMENT 5: UI/UX SPECIFICATION & WIREFRAMES

## EcoTrack — Smart E-Waste Traceability System using QR Codes

**Project Name:** EcoTrack  
**Document Version:** 1.0  
**Status:** Approved for Technical Specification & Implementation  
**Design Paradigm:** Premium Eco-Tech (Dark Slate & Emerald Glassmorphism)  
**Target Viewports:** Mobile First (360px–480px) for Frontline Scanner; Desktop (1280px–1920px) for Admin & Portals  

---

## 1. Design System & Visual Aesthetics

EcoTrack marries environmental responsibility with cutting-edge digital precision. The interface abandons flat, boring enterprise layouts in favor of an immersive "Eco-Tech" aesthetic featuring deep slate gradients, glowing emerald accents, glassmorphic card elevations, crisp typography, and fluid micro-animations.

### 1.1 Color Palette & Design Tokens

```
  +-------------------------------------------------------------------------------+
  |                              ECOTRACK COLOR TOKENS                            |
  +-----------------------+-----------------------+-------------------------------+
  |  Deep Obsidian        |  Surface Slate        |  Emerald Accent (Action)      |
  |  #0B0F17              |  #131B2A              |  #10B981                      |
  |  (Canvas Base)        |  (Cards & Panels)     |  (Primary CTAs & Success)     |
  +-----------------------+-----------------------+-------------------------------+
  |  Mint Glow            |  Electric Cyan        |  Border Line                  |
  |  #34D399              |  #06B6D4              |  #243247                      |
  |  (Highlight & Badges) |  (Links & Transit)    |  (Subtle Dividers)            |
  +-----------------------+-----------------------+-------------------------------+
```

#### Status Token System

| Status Name | Foreground Color | Background Tint | Border Accent | Semantic Meaning |
|---|---|---|---|---|
| `REGISTERED` | `#38BDF8` (Sky) | `#082F49` | `#0284C7` | Item declared by citizen; awaiting kiosk intake |
| `COLLECTED` | `#FBBF24` (Amber) | `#451A03` | `#D97706` | Received at physical drop-off center |
| `IN_TRANSIT` | `#A78BFA` (Purple) | `#2E1065` | `#7C3AED` | Cargo dispatched with logistics vehicle |
| `UNDER_INSPECTION` | `#60A5FA` (Blue) | `#172554` | `#2563EB` | Testing bench evaluation in progress |
| `REFURBISHED` | `#34D399` (Mint) | `#064E3B` | `#059669` | Overhaul certified for second-life reuse (Terminal) |
| `SENT_FOR_RECYCLING`| `#FB923C` (Orange) | `#431407` | `#EA580C` | Discarded for metallurgical reclamation |
| `PROCESSED` | `#2DD4BF` (Teal) | `#134E4A` | `#0D9488` | Material shredded, extracted, and safe (Terminal) |

---

### 1.2 Typography & Sizing Scale

- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Font (Item IDs & Code):** `'JetBrains Mono', 'SF Mono', Consolas, monospace`
- **Scale:**
  - `Hero Title / H1`: 32px (Mobile) / 44px (Desktop), Weight 700, Line Height 1.15
  - `Section Title / H2`: 24px (Mobile) / 30px (Desktop), Weight 600
  - `Card Title / H3`: 18px (Mobile) / 20px (Desktop), Weight 600
  - `Body Text`: 14px–16px, Weight 400, Line Height 1.5
  - `Small / Metadata`: 12px–13px, Weight 500
  - `Monospace Tags`: 13px, Weight 600, Letter Spacing 0.05em

---

## 2. Information Architecture & Navigation

```
                                 [EcoTrack Portal]
                                         |
     +-----------------------------------+-----------------------------------+
     |                                   |                                   |
[Public Pages]                  [Authenticated Workspace]           [Operations Hub]
  |-- Landing (/)                 |-- Customer Dashboard               |-- Camera Scanner (/scanner)
  |-- QR Tracker (/track/:id)     |    |-- My Registered Items         |-- Checkpoint Handoff
  |-- Login (/login)              |    +-- Register E-Waste Form       |-- Diagnostic Workbench
  +-- Citizen Signup (/register)  |-- Admin Console (/admin)           +-- Recycler Intake
                                  |    |-- System KPI Metrics
                                  |    |-- Item Master Registry
                                  |    +-- Stakeholder Provisioning
```

---

## 3. Screen Wireframes & UI Layouts

### Wireframe W-01: Public Landing Page & Instant QR Search

```
+--------------------------------------------------------------------------------+
|  [LOGO] EcoTrack       Track Item   How It Works   Impact   [Login] [Register]  |
+--------------------------------------------------------------------------------+
|                                                                                |
|                 REVOLUTIONIZING E-WASTE TRACEABILITY                           |
|          Smart End-to-End Chain-of-Custody from Citizen to Recycler            |
|                                                                                |
|       +----------------------------------------------------------------+       |
|       | [Search Icon] Enter Item ID (e.g. EW-0001)     [ Track Item ]  |       |
|       +----------------------------------------------------------------+       |
|                  Or scan the physical QR sticker on your device                |
|                                                                                |
|  +--------------------+   +--------------------+   +--------------------+      |
|  | [1] Register E-Waste|   | [2] Track Journey  |   | [3] Verified Impact|      |
|  | Generate unique QR |   | Follow verified    |   | 100% certified     |      |
|  | sticker in seconds |   | physical handoffs  |   | reuse or recovery  |      |
|  +--------------------+   +--------------------+   +--------------------+      |
|                                                                                |
|  LIVE METRICS:  [ 1,420 Items Tracked ]  [ 94% Landfill Diversion ]  [ 820 kg CO2 ]
+--------------------------------------------------------------------------------+
```

---

### Wireframe W-02: Public Item Tracking Timeline (`/track/:itemId`)

The primary destination when a citizen, recycler, or regulator scans a QR code with their mobile phone.

```
+--------------------------------------------------------------------------------+
|  [<- Back]  EcoTrack Public Verification Portal             [Share / Print Tag]|
+--------------------------------------------------------------------------------+
|                                                                                |
|  ITEM TRACEABILITY PASSPORT:  EW-0001                                          |
|  Device: Dell Latitude 5490 Laptop             Category: LAPTOP                |
|  Status: [ IN_TRANSIT ] (Purple Badge)         Last Update: 12 mins ago        |
|                                                                                |
|  ========================= LIFECYCLE TIMELINE ===============================  |
|                                                                                |
|  (o)  10 Oct 2026, 09:15 AM                                                    |
|   |   REGISTERED                                                               |
|   |   Location: Bhiwandi                                                       |
|   |   Actor: Customer                                                          |
|   |   Note: E-waste manifested and QR tag issued                               |
|   |                                                                            |
|  (o)  10 Oct 2026, 10:45 AM                                                    |
|   |   COLLECTED                                                                |
|   |   Location: Bhiwandi Municipal Collection Kiosk #3                         |
|   |   Actor: Collection Centre Staff                                           |
|   |   Note: Verified physical condition; battery intact                        |
|   |                                                                            |
|  (*)  10 Oct 2026, 01:20 PM  <-- CURRENT CHECKPOINT (Pulsing Indicator)       |
|   |   IN_TRANSIT                                                               |
|   |   Location: Logistics Van MH-04-AB-1234                                    |
|   |   Actor: Transporter Fleet                                                 |
|   |   Note: En route to Central Diagnostics Hub                                |
|   |                                                                            |
|  ( )  UNDER INSPECTION  (Upcoming)                                             |
|   |                                                                            |
|  ( )  FINAL DESTINATION: [ Refurbished OR Material Recycled ] (Pending)        |
|                                                                                |
|  +--------------------------------------------------------------------------+  |
|  | [Lock Icon] Privacy Protected: Customer personal contact information is  |  |
|  | permanently redacted in accordance with EcoTrack privacy standards.      |  |
|  +--------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------+
```

---

### Wireframe W-03: Customer Portal & E-Waste Registration Form

```
+--------------------------------------------------------------------------------+
|  [LOGO] EcoTrack       My Items    [+ Register E-Waste]       [Anita S. (Logout)]
+--------------------------------------------------------------------------------+
|                                                                                |
|  REGISTER NEW ELECTRONIC ITEM                                                  |
|  Fill out the form below to register your device and generate its QR tag.      |
|                                                                                |
|  Device Name *                 Category *                                      |
|  [ Apple MacBook Pro 2017    ] [ LAPTOP (v)                             ]      |
|                                                                                |
|  Condition *                   Quantity *                                      |
|  [ NON_WORKING (v)           ] [ 1                                      ]      |
|                                                                                |
|  Pickup Address / City *                                                       |
|  [ Flat 402, Green Towers, Andheri West, Mumbai                         ]      |
|                                                                                |
|  Description / Fault Details                                                   |
|  [ Swollen battery, motherboard intact, logic board diagnostic needed... ]     |
|                                                                                |
|  [ Cancel ]                                     [ Generate QR & Register -> ]  |
|                                                                                |
|  ----------------------------------------------------------------------------  |
|  MY REGISTERED ITEMS (3)                                                       |
|  +---------+--------------------+----------+--------------+-----------------+  |
|  | Item ID | Device Name        | Category | Status       | Actions         |  |
|  +---------+--------------------+----------+--------------+-----------------+  |
|  | EW-0001 | Dell Latitude 5490 | LAPTOP   | IN_TRANSIT   | [View QR] [Track|  |
|  | EW-0002 | Samsung Galaxy S9  | MOBILE   | PROCESSED    | [View QR] [Track|  |
|  | EW-0003 | HP LaserJet Pro    | APPLIANCE| REGISTERED   | [View QR] [Track|  |
|  +---------+--------------------+----------+--------------+-----------------+  |
+--------------------------------------------------------------------------------+
```

---

### Wireframe W-04: Printable QR Asset Tag Modal

```
+-----------------------------------------------------------------------+
|  Item Registered Successfully!                                    [X] |
+-----------------------------------------------------------------------+
|                                                                       |
|      +---------------------------------------------------------+      |
|      |               ECOTRACK ASSET IDENTIFIER                 |      |
|      |                                                         |      |
|      |          +-----------------------------------+          |      |
|      |          |  [#############################]  |          |      |
|      |          |  [###   ###   #####   ###   ###]  |          |      |
|      |          |  [###   ###   #####   ###   ###]  |          |      |
|      |          |  [#####   #   #####   #   #####]  |          |      |
|      |          |  [#############################]  |          |      |
|      |          +-----------------------------------+          |      |
|      |                                                         |      |
|      |                    ITEM ID: EW-0001                     |      |
|      |                   Dell Latitude 5490                    |      |
|      |                  Category: LAPTOP (1x)                  |      |
|      |                                                         |      |
|      |          * Scan with any camera to verify custody *     |      |
|      +---------------------------------------------------------+      |
|                                                                       |
|  Please print and affix this tag firmly to the device chassis.        |
|                                                                       |
|  [ Download PNG ]                     [ Print Physical Label ]        |
+-----------------------------------------------------------------------+
```

---

### Wireframe W-05: Frontline Mobile Scanner & Status Handoff (`/scanner`)

Tailored for single-hand warehouse and mobile driver use on phones.

```
+---------------------------------------------------+
|  [=] EcoTrack Scanner       [Role: COLLECTION]    |
+---------------------------------------------------+
|                                                   |
|   CAMERA VIEWFINDER                               |
|  +---------------------------------------------+  |
|  |  +--                                     --+|  |
|  |  |                                         ||  |
|  |  |     [=== SCANNING LASER ANIMATION ===]  ||  |
|  |  |                                         ||  |
|  |  +--                                     --+|  |
|  |       Point camera at EcoTrack QR Tag       |  |
|  +---------------------------------------------+  |
|                                                   |
|  - OR -  Enter Item ID Manually:                  |
|  [ EW-0001                               ] [Lookup|
|                                                   |
|  -----------------------------------------------  |
|  SCANNED ITEM SUMMARY:                            |
|  Item: EW-0001 — Dell Latitude 5490               |
|  Current Status: [ REGISTERED ]                   |
|                                                   |
|  Facility / Checkpoint Location:                  |
|  [ Bhiwandi Municipal E-Waste Kiosk #3          ] |
|                                                   |
|  Intake Notes:                                    |
|  [ Device received with charger, intact chassis ] |
|                                                   |
|  +---------------------------------------------+  |
|  |  [V] CONFIRM INTAKE & MARK COLLECTED        |  |
|  +---------------------------------------------+  |
+---------------------------------------------------+
```

---

### Wireframe W-06: Diagnostic Inspector Workbench (`/inspection/:itemId`)

```
+--------------------------------------------------------------------------------+
|  [<-] EcoTrack Diagnostics Hub               [Inspector: Dr. Meera Nambiar]    |
+--------------------------------------------------------------------------------+
|                                                                                |
|  INSPECTION WORKBENCH: EW-0001 (Dell Latitude 5490)                            |
|  Current Status: [ UNDER_INSPECTION ]                                          |
|                                                                                |
|  DIAGNOSTIC TEST RESULTS:                                                      |
|  [x] Power Supply / Motherboard POST      [ ] Battery Health (> 70%)           |
|  [x] Display Panel Functional             [ ] Hard Drive Sanitized / Cleared   |
|                                                                                |
|  Technician Diagnostic Notes:                                                  |
|  [ Motherboard powers on. Battery swollen (must be removed). RAM functional. ] |
|                                                                                |
|  DECISION ROUTING (Select 1 Path):                                             |
|                                                                                |
|  +-----------------------------------+   +-----------------------------------+  |
|  |  PATH A: APPROVE REFURBISHMENT    |   |  PATH B: SEND FOR RECYCLING       |  |
|  |                                   |   |                                   |  |
|  |  Device is economically repairable|   |  Device is severely damaged or    |  |
|  |  Routes to repair queue.          |   |  hazardous scrap. Routes to       |  |
|  |                                   |   |  certified smelter facility.      |  |
|  |  [ Select Path A ]                |   |  [ Select Path B ]                |  |
|  +-----------------------------------+   +-----------------------------------+  |
|                                                                                |
|  [ Submit Diagnostic Decision ]                                                |
+--------------------------------------------------------------------------------+
```

---

### Wireframe W-07: Admin Command Center (`/admin`)

```
+--------------------------------------------------------------------------------+
|  [LOGO] EcoTrack Admin Console    Overview  Items  Users  Audit    [Logout]    |
+--------------------------------------------------------------------------------+
|                                                                                |
|  SYSTEM OVERVIEW & METRICS                                                     |
|                                                                                |
|  [ Total Items ]   [ Collected ]   [ In Transit ]   [ Inspected ]   [ Recycled]|
|       1,420             310             145              98             680    |
|                                                                                |
|  CIRCULAR ECONOMY DISTRIBUTION                                                 |
|  [== Refurbished (28%) ==] [======== Formally Recycled (68%) ========] [4% Reg]|
|                                                                                |
|  ----------------------------------------------------------------------------  |
|  MASTER ITEM REGISTRY                                                          |
|  Search: [ EW-0001        ]  Filter Status: [ All (v) ]  Category: [ All (v) ] |
|                                                                                |
|  +---------+--------------------+----------+------------------+-------------+  |
|  | Item ID | Device Name        | Category | Status           | Updated     |  |
|  +---------+--------------------+----------+------------------+-------------+  |
|  | EW-0001 | Dell Latitude 5490 | LAPTOP   | IN_TRANSIT       | 12 mins ago |  |
|  | EW-0002 | iPhone 11 Pro      | MOBILE   | REFURBISHED      | 2 hours ago |  |
|  | EW-0003 | Sony Bravia TV     | APPLIANCE| SENT_FOR_RECYC...| Yesterday   |  |
|  | EW-0004 | HP Pavilion Desktop| DESKTOP  | PROCESSED        | 3 days ago  |  |
|  +---------+--------------------+----------+------------------+-------------+  |
|                                                                                |
|  STAKEHOLDER USER MANAGEMENT                      [+ Add Stakeholder User]     |
|  +----------------------+-----------------------+-------------+-------------+  |
|  | Name                 | Email                 | Role        | Status      |  |
|  +----------------------+-----------------------+-------------+-------------+  |
|  | Rajesh Patel         | rajesh@kiosk.org      | COLLECTION  | [Active]    |  |
|  | Vikram Logistics     | vikram@transport.org  | TRANSPORTER | [Active]    |  |
|  | Dr. Meera Nambiar    | meera@lab.org         | INSPECTOR   | [Active]    |  |
|  | GreenSmelt Ops       | ops@greensmelt.com    | RECYCLER    | [Active]    |  |
|  +----------------------+-----------------------+-------------+-------------+  |
+--------------------------------------------------------------------------------+
```

---

## 4. Interaction Design & Micro-Animations

1. **Scanner Viewfinder Laser:** An animated horizontal emerald beam (`@keyframes scanLine`) sweeps continuously across the target viewfinder, giving immediate visual feedback that the camera is active.
2. **Timeline Checkpoint Pulse:** The active/latest status checkpoint features a pulsing halo (`box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7)`), distinguishing current custody from past milestones.
3. **Interactive QR Tag Zoom:** Hovering or tapping the QR code displays a subtle elevation effect with glowing border highlights.
4. **Toast Feedback Notifications:** All status changes trigger non-blocking slide-in toasts (Green for success, Crimson for permission error, Amber for invalid lifecycle sequence).
5. **Print Stylesheet (`@media print`):** Strips navigation headers, backgrounds, and sidebars, outputting only the high-contrast 2x2 inch sticker layout with crisp black vectors.
