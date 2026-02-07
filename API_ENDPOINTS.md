# API Endpoints Reference

## Backend Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Send OTP
```
POST /auth/send-otp
Content-Type: application/json

Request:
{
  "phone": "+919876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP
```
POST /auth/verify-otp
Content-Type: application/json

Request:
{
  "phone": "+919876543210",
  "otp": "1234"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "userId": "user_123",
  "message": "Authentication successful"
}
```

---

## Profile Endpoints

### Get Profile
```
GET /profile
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "user_123",
    "fullName": "Aditya K.",
    "phone": "+919876543210",
    "address": "House 123, Pune"
  }
}
```

### Update Profile
```
PATCH /profile
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "fullName": "Aditya Kumar",
  "address": "New Address",
  "city": "Pune",
  "ward": "12"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### Add Utility Connection
```
POST /profile/connections
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "utility": "electricity",
  "consumerId": "1234567890",
  "meterNumber": "meter123"
}

Response:
{
  "success": true,
  "message": "Connection added successfully"
}
```

---

## Complaint Endpoints

### Create Complaint
```
POST /complaint
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "title": "Complaint Title",
  "description": "Complaint description",
  "location": "Ward 12, Pune",
  "photo": <file>
}

Response:
{
  "success": true,
  "data": {
    "complaintId": "CMP12345",
    "status": "Registered"
  }
}
```

### Get My Complaints
```
GET /complaint/my
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "CMP12345",
      "title": "Power Outage",
      "status": "In Progress",
      "createdAt": "2026-02-07T10:00:00Z"
    }
  ]
}
```

### Get Complaint Details
```
GET /complaint/{complaintId}
Headers:
  Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "CMP12345",
    "title": "Power Outage",
    "description": "...",
    "status": "In Progress",
    "assignedTo": "Officer Name",
    "createdAt": "2026-02-07T10:00:00Z"
  }
}
```

---

## Electricity Service Endpoints

### Pay Electricity Bill
```
POST /electricity/pay-bill
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "customerId": "1234567890",
  "amount": 5000
}

Response:
{
  "success": true,
  "data": {
    "billId": "ELEC-2026-001",
    "amount": 5000
  }
}
```

### Report Power Outage
```
POST /electricity/complaints/outage
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "location": "Ward 12, Kothrud",
  "description": "Power cut from 2 PM",
  "photo": <file>
}

Response:
{
  "success": true,
  "data": {
    "ticketId": "PWR-9988"
  }
}
```

### Report Meter Issue
```
POST /electricity/complaints/meter
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "issue": "Meter running fast",
  "description": "Meter reading increased abnormally"
}

Response:
{
  "success": true,
  "message": "Complaint registered"
}
```

### Request Load Change
```
POST /electricity/requests/load-change
Headers:
  Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "currentLoad": "5 kW",
  "requestedLoad": "10 kW",
  "reason": "Additional appliances"
}

Response:
{
  "success": true,
  "data": {
    "requestId": "LDC-001"
  }
}
```

### Request New Connection
```
POST /electricity/requests/new-connection
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "applicantName": "Aditya Kumar",
  "address": "House 123",
  "load": "5 kW",
  "document": <file>
}

Response:
{
  "success": true,
  "data": {
    "connectionRequestId": "CONN-001"
  }
}
```

---

## Water Service Endpoints

### Pay Water Bill
```
POST /water/pay-bill
Headers:
  Authorization: Bearer {token}

Request:
{
  "customerId": "WC123456",
  "amount": 2000
}

Response:
{
  "success": true
}
```

### Report No Water Supply
```
POST /water/complaints/no-supply
Headers:
  Authorization: Bearer {token}

Request:
{
  "location": "Sector 4",
  "description": "No water supply complaint"
}

Response:
{
  "success": true,
  "data": {
    "complaintId": "WTR-001"
  }
}
```

### Report Low Pressure
```
POST /water/complaints/low-pressure
Headers:
  Authorization: Bearer {token}

Request:
{
  "location": "Sector 4",
  "description": "Very low water pressure"
}

Response:
{
  "success": true
}
```

---

## Gas Service Endpoints

### Pay Gas Bill
```
POST /gas/pay-bill
Headers:
  Authorization: Bearer {token}

Request:
{
  "customerId": "GAS123",
  "amount": 903
}

Response:
{
  "success": true
}
```

### Report Gas Leakage (EMERGENCY)
```
POST /gas/complaints/leakage
Headers:
  Authorization: Bearer {token}

Request:
{
  "phone": "+919876543210",
  "location": "Shaniwar Peth, Pune",
  "description": "Gas leak emergency"
}

Response:
{
  "success": true,
  "data": {
    "ticketId": "GAS-EMG-911"
  }
}
```

### Book Cylinder
```
POST /gas/requests/new-connection
Headers:
  Authorization: Bearer {token}

Request:
{
  "provider": "indane",
  "cylinderType": "14.2kg"
}

Response:
{
  "success": true,
  "data": {
    "referenceId": "GAS-2026-8899"
  }
}
```

---

## Waste Management Endpoints

### Report Missed Pickup
```
POST /waste/complaints/missed-pickup
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "location": "Ward 5",
  "description": "Waste not collected today",
  "photo": <file>
}

Response:
{
  "success": true
}
```

### Report Overflowing Bin
```
POST /waste/complaints/overflow
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "location": "Ward 5",
  "photo": <file>
}

Response:
{
  "success": true
}
```

### Request Bulk Pickup
```
POST /waste/requests/bulk-pickup
Headers:
  Authorization: Bearer {token}

Request:
{
  "location": "Ward 5",
  "quantity": "10 bags",
  "description": "Home renovation waste"
}

Response:
{
  "success": true
}
```

---

## Municipal Service Endpoints

### Pay Property Tax
```
POST /municipal/pay-property-tax
Headers:
  Authorization: Bearer {token}

Request:
{
  "propertyId": "PROP-123",
  "amount": 5000
}

Response:
{
  "success": true
}
```

### Request Birth Certificate
```
POST /municipal/certificates/birth
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "applicantName": "Child Name",
  "dateOfBirth": "2020-01-15",
  "document": <file>
}

Response:
{
  "success": true,
  "data": {
    "applicationId": "BC-001"
  }
}
```

### Request Death Certificate
```
POST /municipal/certificates/death
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "deceasedName": "Name",
  "dateOfDeath": "2026-02-01",
  "document": <file>
}

Response:
{
  "success": true
}
```

### Submit Municipal Grievance
```
POST /municipal/complaints/grievance
Headers:
  Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "grievance": "Street damaged",
  "location": "Ward 12",
  "photo": <file>
}

Response:
{
  "success": true
}
```

---

## Admin Endpoints

### Get Complaint Statistics
```
GET /admin/analytics/complaints
Headers:
  Authorization: Bearer {token}
  (Requires admin role)

Response:
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 45,
    "inProgress": 60,
    "resolved": 45
  }
}
```

### List All Complaints
```
GET /admin/complaints
Headers:
  Authorization: Bearer {token}
  (Requires admin role)

Query Parameters:
  status=pending
  department=electricity
  limit=10
  offset=0

Response:
{
  "success": true,
  "data": [
    {
      "id": "CMP12345",
      "department": "Electricity",
      "status": "In Progress",
      "citizen": "Aditya K.",
      "createdAt": "2026-02-07T10:00:00Z"
    }
  ]
}
```

### Update Complaint Status
```
PUT /admin/complaints/{complaintId}/status
Headers:
  Authorization: Bearer {token}
  (Requires admin role)

Request:
{
  "status": "Resolved"
}

Response:
{
  "success": true,
  "message": "Status updated successfully"
}
```

### Assign Complaint to Officer
```
PUT /admin/complaints/{complaintId}/assign
Headers:
  Authorization: Bearer {token}
  (Requires admin role)

Request:
{
  "assignedTo": "officer_id_123"
}

Response:
{
  "success": true
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request format
- `INTERNAL_ERROR` - Server error
- `RATE_LIMIT` - Too many requests

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

**Last Updated:** February 7, 2026
