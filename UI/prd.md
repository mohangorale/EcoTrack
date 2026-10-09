PRODUCT REQUIREMENTS DOCUMENT (PRD)

EcoTrack — Smart E-Waste Traceability System

Tagline: Scan. Track. Recycle.
Version: 1.0
Project Type: 6-Hour Hackathon MVP

1. Project Overview

EcoTrack is a web-based e-waste traceability platform that tracks electronic waste from registration and collection to inspection, refurbishment, or recycling.

Each registered item receives a unique identification number and QR code. Authorized stakeholders update its status throughout the process, while the public can scan the QR code to view its tracking history.

2. Problem Statement

Electronic waste passes through multiple collection, transportation, inspection, and recycling stages. Without a centralized tracking system, it can be difficult to understand where an item is, who handled it, and whether it reached its intended destination.

EcoTrack aims to provide a simple digital record of an item's journey using unique IDs, QR codes, and timestamped status updates.

3. Project Objectives

Make e-waste registration simple and organized.

Generate a unique ID and QR code for every registered item.

Maintain a chronological record of status changes.

Allow authorized stakeholders to update their part of the process.

Provide public access to non-sensitive tracking information.

Give administrators an overview of registered and processed items.

4. Target Users

Guest: Scans a QR code or enters an item ID to view public tracking information.

Customer / Waste Generator: Creates an account, registers electronic waste, and views registered items.

Collection Centre: Records item collection and handover.

Transporter: Records movement and delivery to the next facility.

Inspector / Refurbisher: Inspects the item and records the refurbishment or recycling decision.

Recycler: Records final recycling or processing.

Administrator: Manages stakeholder accounts, reviews records, and views system statistics.

5. Functional Requirements

FR-01: User Registration and Login
The system shall allow customers to register and existing users to log in securely. Stakeholder access shall be assigned or approved by an administrator.

FR-02: E-Waste Registration
The system shall accept required item details, including device name, category, condition, quantity, and pickup location.

FR-03: Unique Item ID
The system shall generate a unique ID for every successfully registered item.

FR-04: QR Code Generation
The system shall generate a scannable QR code that opens the item's public tracking page.

FR-05: Public Tracking
The system shall allow guests to view an item's current status and non-sensitive tracking history without logging in.

FR-06: Status Updates
Authorized stakeholders shall be able to update an item's status, location, and optional notes according to their assigned role.

FR-07: Tracking History
Every accepted status update shall be saved as a separate history record containing the status, timestamp, responsible role, location, and optional notes.

FR-08: Inspection Decision
The inspection role shall record whether an item is suitable for refurbishment or should be sent for recycling.

FR-09: Admin Dashboard
The administrator shall be able to view item counts, status summaries, records, and stakeholder accounts.

FR-10: Validation and Access Control
The system shall validate required fields, reject invalid status transitions, enforce role-based permissions on the backend, and avoid displaying private customer details on public tracking pages.

6. Item Status Lifecycle

The supported statuses are:

Registered

Collected

In Transit

Under Inspection

Refurbished — for items approved for reuse

Sent for Recycling

Processed — when final processing is recorded

The refurbishment and recycling paths shall remain distinct. An item sent for recycling can proceed to Processed; a refurbished item shall not automatically be labelled recycled.

7. Non-Functional Requirements

Usability: The interface shall be understandable and responsive on desktop and mobile screens.

Performance: Common operations should return promptly under the expected small hackathon demo workload.

Security: Passwords shall be hashed. Protected APIs shall verify authentication and role permissions.

Data Integrity: Item IDs shall be unique, and previous tracking events shall be retained when new events are added.

Privacy: Public tracking shall reveal only the information required to follow the item's journey.

Maintainability: Frontend, backend, database models, and API routes shall be organized into separate modules.

8. Technology Stack

Frontend: React, Vite, Tailwind CSS, React Router, Axios

Backend: Node.js and Express

Database: MongoDB Atlas and Mongoose

QR Generation: qrcode npm package

Authentication: Secure password hashing and authenticated sessions or tokens

Version Control: Git and GitHub

9. MVP Scope

The six-hour MVP will focus on:

Customer registration and login

Stakeholder login with assigned roles

E-waste registration and unique ID generation

Working QR code generation

Public tracking page

Status updates and persistent tracking history

Basic inspection decision flow

Admin overview and status counts

10. Out of Scope

The initial version will not require blockchain, IoT hardware, AI-based device diagnosis, OTP login, automated WhatsApp notifications, payment processing, or a native mobile application.

These can be considered future enhancements.

11. Acceptance Criteria

The MVP will be considered demonstrable when:

A customer can register an item successfully.

The item receives a unique ID and a valid QR code.

Scanning the QR code opens the correct tracking page.

An authorized stakeholder can update the status.

The database retains the update and its timestamp.

The tracking page displays the updated status and previous events.

Inspection can direct an item toward refurbishment or recycling.

The recycling path can record final processing.

Dashboard statistics reflect the stored records.

Unauthorized roles cannot perform restricted actions, and public pages do not expose private customer information.

12. Expected Outcome

EcoTrack will demonstrate an end-to-end digital traceability workflow for electronic waste, showing how registration, QR identification, stakeholder handovers, inspection decisions, and final processing can be recorded in one web application.

13. Future Scope

Potential improvements include OTP authentication, verified stakeholder onboarding, notifications, advanced analytics, mobile applications, and integration with recycling organizations.