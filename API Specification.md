# DOCUMENT 6: API SPECIFICATION

## EcoTrack — Smart E-Waste Traceability System

**Version:** 1.0  
**Base URL (local):** `http://localhost:5000/api`  
**Protocol:** REST over HTTP/HTTPS  
**Request/Response Format:** JSON  
**Backend:** Node.js + Express  
**Database:** MongoDB Atlas + Mongoose  
**Authentication:** JWT bearer access token for the MVP

## 1. Purpose

This document defines the API endpoints, HTTP methods, request fields, response formats, authentication requirements, access permissions, validation rules, and error codes for EcoTrack.

The API connects the React frontend with the Express backend and supports customer authentication, e-waste registration, QR tracking, stakeholder status updates, inspection, recycling, and administrative operations.

## 2. API Conventions

### 2.1 Base URL

Local development:

`http://localhost:5000/api`

Replace the host with the deployed backend URL when deploying the application.

### 2.2 Headers

For JSON requests:

```http
Content-Type: application/json
```

For protected requests:

```http
Authorization: Bearer <access_token>
```

Public tracking endpoints do not require an access token.

### 2.3 Standard Success Response

```json
{
  "success": true,
  "message": "Item registered successfully",
  "data": {
    "itemId": "EW-0001",
    "currentStatus": "REGISTERED"
  }
}
```

### 2.4 Standard Error Response

```json
{
  "success": false,
  "message": "Invalid status transition",
  "errorCode": "INVALID_STATUS_TRANSITION"
}
```

All endpoints should use a consistent response structure. Additional metadata, such as pagination details, may be included where needed.

## 3. Authentication APIs

### API 1: Customer Registration

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Purpose:** Create a customer account.

Request body:

```json
{
  "name": "Demo Customer",
  "email": "customer@example.com",
  "mobile": "9999999999",
  "password": "ExamplePass123!",
  "confirmPassword": "ExamplePass123!"
}
```

Required fields must follow the configured validation rules. At least one supported login identifier must be supplied. `confirmPassword` is validated but must never be stored.

The backend must:
1. Validate the request.
2. Check for an existing account using the supplied login identifiers.
3. Hash the password.
4. Create a user with role `CUSTOMER`.
5. Return the created account's safe public fields.

Example response (`201 Created`):

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "name": "Demo Customer",
      "email": "customer@example.com",
      "role": "CUSTOMER",
      "accountStatus": "ACTIVE"
    }
  }
}
```

The response must not contain `passwordHash`.

### API 2: Login

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Purpose:** Authenticate an existing account.

Request body:

```json
{
  "email": "customer@example.com",
  "password": "ExamplePass123!"
}
```

A mobile number may be used instead of an email when supported by the account.

Example response (`200 OK`):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<signed_access_token>",
    "user": {
      "id": "<user_id>",
      "name": "Demo Customer",
      "role": "CUSTOMER"
    }
  }
}
```

Implementation requirements:
- Verify the password against the stored hash.
- Reject invalid credentials with a generic error.
- Reject suspended or otherwise ineligible accounts.
- Apply rate limiting to repeated login attempts.
- Sign access tokens using a strong secret stored in environment configuration.
- Define token expiry and verify tokens on protected requests.

The access token shown above is a placeholder, not a real credential.

### API 3: Get Current User

**Endpoint:** `GET /api/auth/me`

**Access:** Authenticated user

**Purpose:** Retrieve the authenticated user's account information.

Headers:

```http
Authorization: Bearer <access_token>
```

Example response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "<user_id>",
      "name": "Demo Customer",
      "email": "customer@example.com",
      "role": "CUSTOMER",
      "accountStatus": "ACTIVE"
    }
  }
}
```

This endpoint helps the frontend restore the current user's identity and display the appropriate navigation.

## 4. E-Waste Item APIs

### API 4: Register E-Waste

**Endpoint:** `POST /api/items`

**Access:** Customer

**Purpose:** Create a new e-waste record.

Request body:

```json
{
  "deviceName": "Dell Laptop",
  "category": "LAPTOP",
  "condition": "NON_WORKING",
  "quantity": 1,
  "pickupLocation": "Bhiwandi",
  "description": "Old laptop submitted for processing"
}
```

The registering customer is determined from the verified access token, not a user ID supplied by the frontend.

The backend must generate the unique item ID and initialize the status to `REGISTERED`. It must also create the initial tracking-history event.

Example response (`201 Created`):

```json
{
  "success": true,
  "message": "Item registered successfully",
  "data": {
    "item": {
      "itemId": "EW-0001",
      "deviceName": "Dell Laptop",
      "category": "LAPTOP",
      "currentStatus": "REGISTERED",
      "createdAt": "2026-10-09T09:15:00.000Z"
    },
    "trackingUrl": "/track/EW-0001"
  }
}
```

### API 5: Get My Items

**Endpoint:** `GET /api/items/my`

**Access:** Customer

**Purpose:** Retrieve the authenticated customer's registered items.

Optional query parameters:

- `status`: Filter by current status.
- `page`: Page number.
- `limit`: Number of records per page.

Example:

`GET /api/items/my?status=REGISTERED&page=1&limit=10`

Example response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "itemId": "EW-0001",
        "deviceName": "Dell Laptop",
        "currentStatus": "REGISTERED"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

The backend must restrict results to the authenticated customer's permitted records.

### API 6: Get Item Details

**Endpoint:** `GET /api/items/:itemId`

**Access:** Authenticated and authorized user

**Purpose:** Retrieve the full item record for an authorized operation.

Example:

`GET /api/items/EW-0001`

The backend checks whether the requester is the item's owner or has a stakeholder/admin permission that allows access.

The response may include approved operational information but must not expose password hashes, authentication secrets, or unnecessary private account details.

### API 7: Public Item Tracking

**Endpoint:** `GET /api/public/items/:itemId`

**Access:** Public

**Purpose:** Retrieve a safe public representation of an item.

Example:

`GET /api/public/items/EW-0001`

Example response:

```json
{
  "success": true,
  "data": {
    "item": {
      "itemId": "EW-0001",
      "deviceName": "Dell Laptop",
      "category": "LAPTOP",
      "currentStatus": "IN_TRANSIT",
      "lastUpdatedAt": "2026-10-09T11:30:00.000Z"
    }
  }
}
```

This endpoint must use an explicit public response projection. It must not return private customer contact information, account records, internal notes, or other sensitive fields.

## 5. Tracking History APIs

### API 8: Get Item Tracking History

**Endpoint:** `GET /api/public/items/:itemId/history`

**Access:** Public, with safe-field filtering

**Purpose:** Display the item's recorded lifecycle events on its public tracking page.

Example:

`GET /api/public/items/EW-0001/history`

Example response:

```json
{
  "success": true,
  "data": {
    "itemId": "EW-0001",
    "history": [
      {
        "status": "REGISTERED",
        "location": "Bhiwandi",
        "roleAtEvent": "CUSTOMER",
        "createdAt": "2026-10-09T09:15:00.000Z"
      },
      {
        "status": "COLLECTED",
        "location": "Bhiwandi Collection Centre",
        "roleAtEvent": "COLLECTION_CENTRE",
        "createdAt": "2026-10-09T10:00:00.000Z"
      },
      {
        "status": "IN_TRANSIT",
        "location": "Bhiwandi",
        "roleAtEvent": "TRANSPORTER",
        "createdAt": "2026-10-09T11:30:00.000Z"
      }
    ]
  }
}
```

The history must be ordered by timestamp. Only fields approved for public display should be returned.

For private operational notes, a separate authenticated history endpoint may be implemented if needed.

## 6. Status Update API

### API 9: Update Item Status

**Endpoint:** `PATCH /api/items/:itemId/status`

**Access:** Authorized stakeholder or admin, subject to role permissions

**Purpose:** Record an accepted status change and append a history event.

Example request:

```json
{
  "status": "COLLECTED",
  "location": "Bhiwandi Collection Centre",
  "notes": "Item received at the collection centre"
}
```

The server derives the actor's user ID and role from the authenticated token. The timestamp is generated by the server.

The backend must:
1. Verify authentication and account status.
2. Retrieve the item.
3. Verify the user's permission for the requested transition.
4. Validate the lifecycle transition.
5. Save the new history event.
6. Update the item's current status and update timestamp consistently.
7. Return the saved result.

Example response:

```json
{
  "success": true,
  "message": "Item status updated successfully",
  "data": {
    "itemId": "EW-0001",
    "currentStatus": "COLLECTED",
    "lastUpdatedAt": "2026-10-09T10:00:00.000Z"
  }
}
```

The history event and current-status update must remain consistent. Use a MongoDB transaction when the database deployment supports transactions; otherwise implement an explicit consistency and rollback strategy.

## 7. Inspection API

### API 10: Record Inspection

**Endpoint:** `POST /api/items/:itemId/inspection`

**Access:** Inspector or authorized admin

**Purpose:** Record the inspection result and choose the next operational path.

Request body:

```json
{
  "decision": "SEND_FOR_RECYCLING",
  "location": "Inspection Centre",
  "notes": "Device is not economically repairable"
}
```

Allowed decision values:

- `APPROVE_REFURBISHMENT`
- `SEND_FOR_RECYCLING`

The backend verifies that the item is in an appropriate inspection state, the requester has permission, and the decision is valid.

For `SEND_FOR_RECYCLING`, the resulting lifecycle event is `SENT_FOR_RECYCLING`.

For `APPROVE_REFURBISHMENT`, the system records the inspection decision. The item should become `REFURBISHED` only after the refurbishment work is confirmed complete, using an authorized status update.

Example response:

```json
{
  "success": true,
  "message": "Inspection decision recorded",
  "data": {
    "itemId": "EW-0001",
    "decision": "SEND_FOR_RECYCLING",
    "currentStatus": "SENT_FOR_RECYCLING"
  }
}
```

The API must not claim that a device has been refurbished merely because refurbishment was approved.

## 8. Admin APIs

### API 11: Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Access:** Admin

**Purpose:** Retrieve system-wide counts from persisted records.

Example response:

```json
{
  "success": true,
  "data": {
    "totalItems": 120,
    "registered": 20,
    "collected": 12,
    "inTransit": 18,
    "underInspection": 8,
    "refurbished": 16,
    "sentForRecycling": 24,
    "processed": 22
  }
}
```

These counts are illustrative. The backend must calculate the actual values from the database.

### API 12: Get All Items

**Endpoint:** `GET /api/admin/items`

**Access:** Admin

**Purpose:** Return searchable and filterable item records.

Optional query parameters:
- `status`
- `category`
- `page`
- `limit`

The endpoint must apply appropriate validation, pagination, and safe-field selection.

### API 13: Create Stakeholder Account

**Endpoint:** `POST /api/admin/users`

**Access:** Admin

**Purpose:** Create or provision an authorized stakeholder account.

Example request:

```json
{
  "name": "Demo Collection Staff",
  "email": "staff@example.com",
  "password": "ExamplePass123!",
  "role": "COLLECTION_CENTRE",
  "organizationName": "Demo Collection Centre"
}
```

The backend must validate the requested role, hash the password, and apply the account's configured activation or approval policy. Public customer registration must not offer this privileged role-selection operation.

### API 14: List Users

**Endpoint:** `GET /api/admin/users`

**Access:** Admin

**Purpose:** Retrieve authorized account-management fields for the admin panel.

Passwords, password hashes, access tokens, and other secrets must never be returned.

### API 15: Change User Account Status

**Endpoint:** `PATCH /api/admin/users/:userId/status`

**Access:** Admin

**Purpose:** Activate or suspend an account.

Example request:

```json
{
  "accountStatus": "SUSPENDED"
}
```

The backend must validate the target account and status value. Suspended accounts must be prevented from performing protected operations.

## 9. Health Check

### API 16: Backend Health

**Endpoint:** `GET /api/health`

**Access:** Public

**Purpose:** Confirm that the backend service is running.

Example response:

```json
{
  "success": true,
  "message": "EcoTrack backend is running"
}
```

This endpoint should not disclose database credentials, environment variables, or internal diagnostics.

## 10. Status Transition Rules

The backend must enforce the permitted lifecycle transitions.

| Current Status | Permitted Next Status |
|---|---|
| `REGISTERED` | `COLLECTED` |
| `COLLECTED` | `IN_TRANSIT` |
| `IN_TRANSIT` | `UNDER_INSPECTION` |
| `UNDER_INSPECTION` | `REFURBISHED` or `SENT_FOR_RECYCLING` |
| `SENT_FOR_RECYCLING` | `PROCESSED` |
| `REFURBISHED` | No further transition in the initial MVP |
| `PROCESSED` | No further transition in the initial MVP |

The refurbishment path should record that refurbishment was approved and then completed before using `REFURBISHED`. The recycling path records `SENT_FOR_RECYCLING` and progresses to `PROCESSED` only when the recycler confirms final processing.

Any transition outside the configured rules must be rejected.

## 11. HTTP Status Codes

| Code | Meaning | Typical Usage |
|---|---|---|
| `200` | OK | Successful retrieval or update |
| `201` | Created | Account or item created |
| `400` | Bad Request | Invalid fields or status transition |
| `401` | Unauthorized | Missing, expired, or invalid authentication |
| `403` | Forbidden | Authenticated user lacks permission |
| `404` | Not Found | Requested item or user not found |
| `409` | Conflict | Duplicate account or identifier conflict |
| `422` | Unprocessable Content | Valid JSON but invalid business rules, if used consistently |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server-side failure |

Choose one consistent convention for validation failures (`400` or `422`) and use it throughout the API.

## 12. Error Codes

The backend should return stable machine-readable error codes.

| Error Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Required field missing or invalid |
| `INVALID_CREDENTIALS` | Login credentials are incorrect |
| `ACCOUNT_EXISTS` | Account identity already registered |
| `UNAUTHENTICATED` | Valid authentication is required |
| `FORBIDDEN` | User is not allowed to perform the operation |
| `ITEM_NOT_FOUND` | Item does not exist |
| `INVALID_STATUS_TRANSITION` | Requested lifecycle transition is not permitted |
| `DUPLICATE_ITEM_ID` | Generated item ID conflicts with an existing record |
| `RATE_LIMIT_EXCEEDED` | Request limit exceeded |
| `INTERNAL_ERROR` | Unexpected server failure |

Error messages must not expose passwords, secrets, stack traces, or database implementation details.

## 13. Frontend API Service

The React application should use one shared Axios instance configured with the API base URL from an environment variable.

Illustrative usage:

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
```

Authenticated requests must attach a valid bearer token using a consistent authentication mechanism. Keep token storage and expiry handling centralized; do not duplicate authentication logic across individual pages.

## 14. API Testing Requirements

Test each critical endpoint for:

1. Valid input and successful response.
2. Missing or malformed required fields.
3. Duplicate account or item identifiers.
4. Requests without authentication where authentication is required.
5. Attempts by unauthorized roles.
6. Invalid lifecycle transitions.
7. Non-existent item IDs.
8. Correct persistence of history events.
9. Public response privacy.
10. Database failures and appropriate error responses.

The complete end-to-end test should register an item, scan its QR code, record collection and transit, perform an inspection, and complete either the refurbishment or recycling path.

## 15. API Acceptance Criteria

The API specification is ready for implementation when:

- The frontend and backend agree on every endpoint and response shape.
- Registration produces a persistent item record and initial history entry.
- The QR tracking URL points to the correct public item endpoint through the frontend tracking page.
- Authentication and role permissions are enforced on the backend.
- Status updates are validated and recorded consistently.
- Public tracking exposes only approved information.
- Inspection, refurbishment, and recycling actions follow the lifecycle rules.
- Administrative statistics reflect persisted records.
- Errors use a consistent response structure.
- The critical workflow can be tested using the documented request and response examples.

## 16. Expected Outcome

This API contract allows the frontend, backend, QR/tracking, and integration team members to develop in parallel while sharing the same endpoint names, payloads, permissions, and business rules.
