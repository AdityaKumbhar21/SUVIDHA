<p align="center">
  <img src="https://img.shields.io/badge/SUVIDHA-Smart%20Urban%20Digital%20Helpdesk%20Assistant-1e3a8a?style=for-the-badge&labelColor=0f172a" alt="SUVIDHA Banner" />
</p>

<h1 align="center">🏛️ SUVIDHA — Smart Urban Digital Helpdesk Assistant</h1>

<p align="center">
  <strong>A unified, AI-powered, touch-based public service kiosk for modern urban governance</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=flat-square&logo=twilio&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🌐_Multilingual-English_%7C_Hindi-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/🔐_Auth-WhatsApp_OTP-25D366?style=flat-square" />
  <img src="https://img.shields.io/badge/🤖_AI-Gemini_1.5_Flash-4285F4?style=flat-square" />
  <img src="https://img.shields.io/badge/📄_Receipts-Auto_PDF-red?style=flat-square" />
  <img src="https://img.shields.io/badge/📱_Notifications-WhatsApp-25D366?style=flat-square" />
</p>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Department Modules](#-department-modules)
- [AI-Powered Intelligence](#-ai-powered-intelligence)
- [Authentication & Security](#-authentication--security)
- [Payment Infrastructure](#-payment-infrastructure)
- [Notification System](#-notification-system)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Screenshots & User Flow](#-screenshots--user-flow)
- [Compliance with Criteria](#-compliance-with-evaluation-criteria)

---

## 🎯 Problem Statement

> Design and develop a **Smart Urban Digital Helpdesk Assistant (SUVIDHA)** — a public-facing, touch-based kiosk interface for customer interaction in civic utility offices. The solution should address real-world challenges of modern urban governance by improving **accessibility**, **transparency**, and **efficiency** in citizen–government interactions.

Citizens across India face significant friction when interacting with government utility departments:

| Challenge | Impact |
|---|---|
| 🏢 Multiple offices for different departments | Hours wasted in physical queues |
| 📝 Paper-based complaint systems | No tracking, no accountability |
| 💰 Cash-only payment counters | Long wait times, no receipts |
| 🌐 Language barriers | Non-English speakers underserved |
| 🔍 Zero status visibility | Citizens revisit offices repeatedly |
| 📞 No unified support channel | Disconnected helpdesks per department |

---

## 💡 Our Solution

**SUVIDHA** is a **single, integrated, self-service digital kiosk** deployed at civic utility offices, serving as a one-stop gateway for citizens to interact with **5 major urban departments**:

```
┌─────────────────────────────────────────────────────────────┐
│                    🏛️  SUVIDHA KIOSK                        │
│               Smart Urban Digital Helpdesk                  │
├─────────┬─────────┬─────────┬───────────┬──────────────────┤
│   ⚡    │   💧    │   🔥    │    ♻️      │      🏛️          │
│Electric │  Water  │   Gas   │   Waste   │   Municipal      │
│  ity    │ Supply  │ Distrib │   Mgmt    │   Corporation    │
├─────────┴─────────┴─────────┴───────────┴──────────────────┤
│  🤖 AI Classification  │  💳 Stripe Payments              │
│  📱 WhatsApp OTP Auth  │  📄 Auto PDF Receipts            │
│  🌐 English / Hindi    │  📲 WhatsApp Notifications       │
│  🎨 Touch-First UI     │  👨‍💼 Admin Dashboard              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌──────────────────────┐     ┌────────────────────────────────────┐
│   SUVIDHA KIOSK UI   │     │         EXTERNAL SERVICES          │
│  ┌────────────────┐  │     │                                    │
│  │  React 19 SPA  │  │     │  🤖 Google Gemini 1.5 Flash       │
│  │  Tailwind CSS  │──┼────▶│  💳 Stripe Payment Gateway        │
│  │  Framer Motion │  │ API │  📱 Twilio WhatsApp/SMS           │
│  │  Vite 7        │  │     │  ☁️  Cloudinary CDN                │
│  └────────────────┘  │     └────────────────────────────────────┘
│         │            │              │
│   Touch-Optimized    │              │
│   Kiosk Interface    │              │
└──────────┼───────────┘              │
           │ REST API                 │
           ▼                          ▼
┌──────────────────────────────────────────┐
│           EXPRESS.JS BACKEND             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │   Auth   │ │ Payments │ │ Gemini   │ │
│  │  (JWT +  │ │ (Stripe) │ │   AI     │ │
│  │   OTP)   │ │          │ │ Engine   │ │
│  ├──────────┤ ├──────────┤ ├──────────┤ │
│  │ 5 Dept   │ │ Receipt  │ │ Twilio   │ │
│  │ Control- │ │  (PDF +  │ │ Notifier │ │
│  │  lers    │ │ Cloud)   │ │ (WA/SMS) │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│              │                           │
│         Prisma ORM                       │
│              │                           │
│         ┌────▼────┐                      │
│         │  MySQL  │                      │
│         │   DB    │                      │
│         └─────────┘                      │
└──────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🌐 Multilingual Interface (English / Hindi)

The entire kiosk interface operates in **English and Hindi**, togglable with a single tap — covering all service pages, form labels, error messages, success states, AI responses, and complaint descriptions.

- **Frontend:** React context + 296-line translation file covering all UI strings
- **Backend:** `x-language` header middleware passes language to Gemini AI for multilingual complaint classification

### 🤖 AI-Powered Complaint Classification (Gemini 1.5 Flash)

When a citizen files a complaint, SUVIDHA's AI engine automatically:

| AI Feature | Description |
|---|---|
| **Department Routing** | Auto-detects the correct department (Electricity / Water / Gas / Waste / Municipal) |
| **Complaint Categorization** | Maps to specific type (BILLING, OUTAGE, LEAKAGE, NO_SUPPLY, etc.) |
| **Priority Assignment** | Assigns LOW / MEDIUM / CRITICAL based on severity analysis |
| **ETA Estimation** | Calculates expected resolution time in minutes |
| **Duplicate Detection** | Flags potential duplicate complaints to prevent redundancy |
| **Sentiment Analysis** | Analyzes citizen feedback tone (POSITIVE / NEGATIVE / NEUTRAL) |

> AI output is validated with **Zod schemas** and gracefully falls back to safe defaults on failure — zero crash risk.

### 💳 Integrated Payment System (Stripe)

- **Bill payments** across all departments (Electricity, Water, Gas, Property Tax)
- **Kiosk-optimized keypad** for consumer number entry
- **Stripe Elements** card payment integration (INR currency)
- **Webhook-verified** payment confirmations
- **Auto-generated PDF receipts** (PDFKit → Cloudinary → stored URL)
- **Cylinder booking** with Pay Now (online) or Pay on Delivery options

### 📱 WhatsApp Notifications (Twilio)

Every citizen action triggers a **real-time WhatsApp notification** via Twilio:

| Event | Notification |
|---|---|
| 🔐 Login OTP | 6-digit OTP via WhatsApp (SMS fallback) |
| 💰 Payment Initiated | Amount + consumer number confirmation |
| ✅ Payment Success | Amount + receipt download link |
| ❌ Payment Failed | Failure alert + retry prompt |
| 📋 Complaint Registered | Complaint ID + department + ETA |
| 🔌 New Connection Request | Request ID + estimated processing time |
| 🔗 Connection Linked | Consumer number + department confirmation |
| 📦 Cylinder Booked | Booking ID + delivery ETA + payment mode |
| 🏛️ Certificate Request | Request ID + document type |
| 🏠 Property Tax | Payment initiated + property ID |

### 📄 Automated Receipt Generation

- **PDFKit** generates branded A4 government receipts
- Contains: Receipt number, date, citizen name, mobile, transaction ID, amount (₹), payment status
- Automatically uploaded to **Cloudinary CDN**
- Download URL stored in Payment record and sent via WhatsApp

### 🎨 Touch-First Kiosk UI

- **Large tap targets** (min 48px) designed for public kiosk touchscreens
- **Numeric keypads** for consumer numbers and mobile entry (no keyboard required)
- **Step-by-step wizard flows** with animated transitions (Framer Motion)
- **High-contrast design** (bg-[#1e3a8a] primary, clear typography)
- **No photo upload prompts** — kiosks don't have cameras
- **Auto-redirect** after successful actions (4-second timeout)
- **Accessible** for citizens of diverse backgrounds and technical literacy

---

## 🏢 Department Modules

### ⚡ Electricity Department

| Service | Route | Description |
|---|---|---|
| **Bill Payment** | `/service/electricity/pay` | Keypad entry → fetch pending bills → Stripe payment → PDF receipt |
| **Outage Report** | `/service/electricity/outage` | Location + description → AI classification → WhatsApp notification |
| **Meter Issue** | `/service/electricity/meter` | Report faulty/stuck meters |
| **Load Change** | `/service/electricity/load` | Request residential/commercial load modification |
| **New Connection** | `/service/electricity/new` | Apply for new electricity connection |

### 💧 Water Supply Department

| Service | Route | Description |
|---|---|---|
| **Bill Payment** | `/service/water/pay` | Keypad consumer entry → payment flow |
| **No Supply Complaint** | `/service/water/complaint` | Report complete water supply failure |
| **Pipe Burst / Leakage** | `/service/water/leakage` | Emergency pipeline issue reporting |
| **Water Quality Issue** | `/service/water/quality` | Report contamination or discoloration |

### 🔥 Gas Distribution Department

| Service | Route | Description |
|---|---|---|
| **Book Cylinder** | `/service/gas/book` | **Mobile lookup → fetch details → select provider/cylinder → Pay on Delivery or Pay Now** |
| **Gas Leakage** | `/service/gas/leakage` | 🚨 Emergency reporting with safety warning modal |
| **Cylinder Issue** | `/service/gas/cylinder-issue` | Report defective/damaged cylinder |
| **New Connection** | `/service/gas/new` | Apply for new LPG gas connection |
| **Bill Payment** | Backend API | Gas bill payment with Stripe |

> **Cylinder Booking Flow:** Enter mobile → system fetches user's gas connections → select Indane/HP/Bharat provider → choose 5kg/14.2kg/19kg cylinder → choose **Pay on Delivery** (₹ cash/UPI) or **Pay Now** (card) → booking confirmed with WhatsApp notification.

### ♻️ Waste Management Department

| Service | Route | Description |
|---|---|---|
| **Missed Pickup** | `/service/waste/missed-pickup` | Report garbage van skipping area |
| **Overflowing Bin** | `/service/waste/overflow` | Report overflowing community dustbin |
| **Bulk Waste Pickup** | `/service/waste/bulk-pickup` | Request special pickup for large waste items |

### 🏛️ Municipal Corporation

| Service | Route | Description |
|---|---|---|
| **Property Tax** | `/service/municipal/tax` | Online property tax payment via Stripe |
| **Certificate Request** | `/service/municipal/certificate` | Birth / Death / Marriage certificate applications |
| **Civic Grievance** | `/service/municipal/grievance` | **AI-powered** 3-step wizard: Select category → Describe issue → AI classifies, assigns priority & routes to department |

> **Grievance Categories:** Road/Pothole, Streetlight, Drainage/Sewer, Water Supply, Garbage/Waste, Tree/Park, Encroachment, Other

---

## 🤖 AI-Powered Intelligence

### Complaint Classification Pipeline

```
Citizen Input (EN/HI)
       │
       ▼
┌─────────────────────┐
│  Gemini 1.5 Flash   │
│  Structured Prompt   │
│  JSON Output Format  │
└──────────┬──────────┘
           │
     Zod Validation
           │
           ▼
┌─────────────────────────────────┐
│  Classified Output              │
│  ├─ department: ELECTRICITY     │
│  ├─ complaintType: OUTAGE       │
│  ├─ priority: CRITICAL          │
│  ├─ etaMinutes: 120             │
│  ├─ isDuplicateLikely: false    │
│  └─ reason: "Power outage..."   │
└─────────────────────────────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
 Database     WhatsApp
  Record     Notification
```

### Supported AI Operations

| Operation | Model | Purpose |
|---|---|---|
| `classifyComplaint()` | gemini-1.5-flash | Department routing + priority + ETA |
| `analyzeSentiment()` | gemini-1.5-flash | Feedback sentiment scoring |
| `detectIntent()` | gemini-1.5-flash | Free-text intent detection |

---

## 🔐 Authentication & Security

### OTP-Based Authentication Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│  Enter   │     │  Receive │     │  Enter  │     │  Access  │
│  Mobile  │────▶│ WhatsApp │────▶│   OTP   │────▶│ Dashboard│
│  Number  │     │   OTP    │     │         │     │          │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
                    Twilio         bcrypt          JWT Token
                  WhatsApp/SMS     verified        issued
```

### Security Measures

| Feature | Implementation |
|---|---|
| **OTP Hashing** | bcrypt-hashed OTPs (never stored in plaintext) |
| **OTP Expiry** | 5-minute window, max 5 verification attempts |
| **JWT Tokens** | Stateless auth with `jsonwebtoken` |
| **Helmet** | HTTP security headers (XSS, clickjacking, MIME sniffing) |
| **Rate Limiting** | 200 requests per 15-minute window per IP |
| **CORS** | Cross-origin request protection |
| **Input Validation** | Zod schemas on all API endpoints |
| **File Validation** | Multer with MIME type + size limits (5MB max) |
| **Stripe Webhooks** | Signature verification with `constructWebhookEvent` |
| **Role-Based Access** | `CITIZEN` / `ADMIN` roles enforced via middleware |

---

## 💳 Payment Infrastructure

### Payment Flow

```
Consumer Number Entry (Keypad)
         │
         ▼
 Fetch Pending Bills (DB)
         │
    ┌────┴────┐
    │  Select │
    │   Bill  │
    └────┬────┘
         │
         ▼
   Bill Summary Page
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│  Stripe Payment │────▶│   Webhook    │
│    Intent       │     │ Confirmation │
│  (Card Entry)   │     │              │
└─────────────────┘     └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │  PDF Receipt (A4)   │
                    │  ├─ PDFKit generate │
                    │  ├─ Cloudinary CDN  │
                    │  └─ WhatsApp sent   │
                    └─────────────────────┘
```

### Supported Payment Types

| Department | Payment Type | Method |
|---|---|---|
| Electricity | Bill Payment | Stripe Card |
| Water | Bill Payment | Stripe Card |
| Gas | Bill Payment | Stripe Card |
| Gas | Cylinder Booking | **Pay on Delivery** or Stripe Card |
| Municipal | Property Tax | Stripe Card |

---

## 📲 Notification System

All notifications are delivered via **Twilio WhatsApp** (with SMS fallback) — no in-app notification panel. Every significant citizen action triggers a real-time message.

### Notification Coverage (27 Events)

| Category | Events Covered |
|---|---|
| **Authentication** | OTP delivery (WhatsApp + SMS fallback) |
| **Payments** | Initiated, Success (with receipt link), Failed |
| **Complaints** | Registered (all 5 departments), with priority & ETA |
| **Service Requests** | New connections, load changes, certificates |
| **Bookings** | Cylinder confirmed (COD & online), delivery ETA |
| **Profile** | Utility connection linked |

### Architecture

```
Controller Action
       │
       ▼
sendNotification(userId, message, type)
       │
       ├─ Lookup user mobile from DB
       ├─ Send via Twilio (WhatsApp / SMS)
       └─ Store in Notification table (with twilioSid)
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.19 | HTTP framework |
| **Prisma ORM** | 6.2 | Database toolkit |
| **MySQL** | 8.0 | Relational database |
| **Stripe SDK** | 16.12 | Payment processing |
| **Twilio SDK** | 5.3 | WhatsApp/SMS messaging |
| **Google Generative AI** | 0.21 | Gemini AI integration |
| **PDFKit** | 0.15 | PDF receipt generation |
| **Cloudinary** | 2.5 | Media storage CDN |
| **bcryptjs** | 2.4 | OTP hashing |
| **jsonwebtoken** | 9.0 | JWT authentication |
| **Zod** | 4.3 | Schema validation |
| **Helmet** | 7.1 | Security middleware |
| **Multer** | 1.4 | File uploads |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2 | UI framework |
| **Vite** | 7.2 | Build toolchain |
| **React Router** | 7.13 | Client-side routing |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Framer Motion** | 12.31 | Page transitions & animations |
| **Lucide React** | 0.563 | Icon system |
| **Axios** | 1.13 | HTTP client |

---

## 🗄️ Database Schema

### Entity-Relationship Diagram

```
┌──────────┐     ┌───────────────────┐     ┌─────────────┐
│   User   │────▶│ UtilityConnection │     │  Complaint  │
│          │     │ (ELEC/GAS/WATER)  │     │             │
│  id      │     │ consumerNumber    │     │ department  │
│  mobile  │     └───────────────────┘     │ type        │
│  name    │──────────────────────────────▶│ status      │
│  role    │                               │ priority    │
│  address │     ┌──────────────┐          │ etaMinutes  │
└──────────┘     │   Payment    │◀─────────│ photoUrl    │
     │           │              │          └─────────────┘
     │           │ amountPaise  │                │
     │           │ consumerNo   │          ┌─────▼─────┐
     │           │ stripeId     │          │ Feedback   │
     ├──────────▶│ invoiceUrl   │          │ sentiment  │
     │           │ status       │          └───────────┘
     │           └──────────────┘
     │
     ├──────────▶┌──────────────────┐
     │           │ CylinderBooking  │
     │           │ provider         │
     │           │ cylinderType     │
     │           │ paymentMode      │
     │           │ deliveryAddress  │
     │           └──────────────────┘
     │
     ├──────────▶┌──────────────┐
     │           │ Notification │
     │           │ type         │
     │           │ message      │
     │           │ twilioSid    │
     │           └──────────────┘
     │
     └──────────▶┌──────────────┐
                 │  AuditLog    │
                 │  action      │
                 │  details     │
                 └──────────────┘
```

### Models Summary

| Model | Records | Key Purpose |
|---|---|---|
| **User** | Citizens & Admins | Mobile-based identity with role-based access |
| **UtilityConnection** | Linked meters/accounts | Maps consumer numbers to departments |
| **Complaint** | Service requests & issues | Full lifecycle tracking with AI classification |
| **Payment** | Bill payments | Stripe-integrated with PDF receipts |
| **CylinderBooking** | LPG bookings | Supports Pay on Delivery & Pay Now |
| **Notification** | WhatsApp messages | Twilio delivery tracking with SID |
| **Feedback** | Citizen ratings | AI sentiment analysis on text |
| **Otp** | Login tokens | Bcrypt-hashed, time-limited, attempt-capped |
| **AuditLog** | System events | JSON detail logging with user attribution |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/send-otp` | Send OTP to mobile via WhatsApp |
| `POST` | `/api/auth/verify-otp` | Verify OTP and receive JWT token |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get current user profile |
| `PATCH` | `/api/profile` | Update name, address, city ward |
| `POST` | `/api/profile/connections` | Link a utility connection (consumer number) |

### Electricity

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/electricity/pending-bills` | Fetch user's pending electricity bills |
| `POST` | `/api/electricity/pay-bill` | Initiate electricity bill payment |
| `POST` | `/api/electricity/complaints/outage` | Report power outage |
| `POST` | `/api/electricity/complaints/meter` | Report meter issue |
| `POST` | `/api/electricity/requests/load-change` | Request load modification |
| `POST` | `/api/electricity/requests/new-connection` | Apply for new connection |

### Water

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/water/pending-bills` | Fetch user's pending water bills |
| `POST` | `/api/water/pay-bill` | Initiate water bill payment |
| `POST` | `/api/water/complaints/no-supply` | Report no water supply |
| `POST` | `/api/water/complaints/low-pressure` | Report low pressure |
| `POST` | `/api/water/complaints/meter` | Report water meter issue |
| `POST` | `/api/water/requests/new-connection` | Apply for new connection |

### Gas

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/gas/pending-bills` | Fetch user's pending gas bills |
| `POST` | `/api/gas/pay-bill` | Initiate gas bill payment |
| `POST` | `/api/gas/complaints/leakage` | Report gas leakage (emergency) |
| `POST` | `/api/gas/complaints/cylinder` | Report cylinder issue |
| `POST` | `/api/gas/requests/new-connection` | Apply for new connection |
| `POST` | `/api/gas/lookup-mobile` | Lookup user by mobile number |
| `POST` | `/api/gas/book-cylinder` | Book cylinder (COD or Online) |

### Waste Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/waste/complaints/missed-pickup` | Report missed garbage pickup |
| `POST` | `/api/waste/complaints/overflow` | Report overflowing bin |
| `POST` | `/api/waste/complaints/dead-animal` | Report dead animal |
| `POST` | `/api/waste/requests/bulk-pickup` | Request bulk waste pickup |

### Municipal

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/municipal/pay-property-tax` | Pay property tax |
| `POST` | `/api/municipal/certificates/birth` | Request birth certificate |
| `POST` | `/api/municipal/certificates/death` | Request death certificate |
| `POST` | `/api/municipal/complaints/grievance` | Submit AI-classified civic grievance |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payment/create-intent` | Create Stripe payment intent |
| `POST` | `/api/payment/confirm` | Confirm payment + generate receipt |
| `GET` | `/api/payment/my` | Get user's payment history |
| `POST` | `/api/payment/webhook` | Stripe webhook (signature-verified) |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/complaints` | List all complaints (with filters) |
| `GET` | `/api/admin/complaints/:id` | Get complaint details |
| `PUT` | `/api/admin/complaints/:id/assign` | Assign complaint to officer |
| `PUT` | `/api/admin/complaints/:id/status` | Update complaint status |
| `GET` | `/api/admin/analytics/complaints` | Complaint statistics |
| `GET` | `/api/admin/analytics/sla` | SLA performance metrics |
| `GET` | `/api/admin/analytics/payments` | Payment analytics |

---

## 📁 Project Structure

```
SUVIDHA/
├── README.md
│
├── backend/
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma              # 9 models, 7 enums
│   │   ├── seed.js                    # Database seeding
│   │   └── migrations/               # MySQL migration history
│   │
│   └── src/
│       ├── app.js                     # Express server + route registration
│       │
│       ├── controllers/
│       │   ├── auth.js                # OTP send/verify + JWT
│       │   ├── complaint.js           # Generic complaint CRUD
│       │   ├── payments.js            # Stripe intents + webhooks + receipts
│       │   ├── profile.js             # Profile CRUD + connection linking
│       │   ├── admin/
│       │   │   ├── analytics.js       # Dashboard statistics
│       │   │   └── complaint.js       # Complaint management
│       │   └── departments/
│       │       ├── electricity.js     # 6 endpoints
│       │       ├── water.js           # 6 endpoints
│       │       ├── gas.js             # 7 endpoints (incl. cylinder booking)
│       │       ├── waste.js           # 4 endpoints
│       │       └── municipal.js       # 4 endpoints (incl. AI grievance)
│       │
│       ├── services/
│       │   ├── gemini.js              # AI classification + sentiment
│       │   ├── twilio.js              # WhatsApp OTP + notifications
│       │   ├── stripe.js              # Payment intent creation
│       │   ├── receipt.js             # PDFKit receipt → Cloudinary
│       │   └── upload.js              # Image upload to Cloudinary
│       │
│       ├── middleware/
│       │   ├── auth.js                # JWT + admin middleware
│       │   ├── error.js               # Global error handler
│       │   └── language.js            # x-language header middleware
│       │
│       ├── lib/
│       │   ├── prisma.js              # Prisma client singleton
│       │   ├── cloudinary.js          # Cloudinary config
│       │   ├── customError.js         # Error classes
│       │   └── validators.js          # Joi validation schemas
│       │
│       └── constants/
│           └── enums.js               # Department & complaint type enums
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    │
    └── src/
        ├── App.jsx                    # 30+ routes with animated transitions
        ├── main.jsx                   # React entry point
        ├── index.css                  # Tailwind base styles
        │
        ├── api/
        │   └── axios.js               # Axios instance with JWT interceptor
        │
        ├── services/
        │   └── api.js                 # 8 API service modules (380+ lines)
        │
        ├── context/
        │   └── LanguageContext.jsx     # EN/HI language provider
        │
        ├── utils/
        │   └── translations.js        # 296-line bilingual translation map
        │
        ├── components/
        │   ├── layout/
        │   │   ├── MainLayout.jsx     # Kiosk shell (header + footer + chat)
        │   │   ├── Header.jsx         # Government branding header
        │   │   └── PageTransition.jsx # Framer Motion page wrapper
        │   ├── chat/
        │   │   └── ChatWidget.jsx     # AI assistant "Suvidha Sahayak"
        │   └── dashboard/
        │       └── WeatherWidget.jsx  # Dashboard weather display
        │
        └── pages/
            ├── Welcome.jsx            # Language selection landing
            ├── auth/
            │   ├── login.jsx          # 3-step OTP login flow
            │   └── ProfileCreation.jsx # New user onboarding
            ├── dashboard/
            │   └── Dashboard.jsx      # 6-tile service grid
            ├── admin/
            │   └── AdminDashboard.jsx # Complaint management panel
            └── services/
                ├── Electricity.jsx    # + 8 sub-pages
                ├── Water.jsx          # + 4 sub-pages
                ├── Gas.jsx            # + 4 sub-pages
                ├── Waste.jsx          # + 3 sub-pages
                ├── Municipal.jsx      # + 3 sub-pages
                └── Feedback.jsx       # Service rating
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **MySQL** 8.0+ running locally
- API keys for: Twilio, Stripe, Google Gemini AI, Cloudinary

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SUVIDHA.git
cd SUVIDHA
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 4. Access the Kiosk

Open **http://localhost:5173** in a browser (Chrome recommended for kiosk mode).

> **Kiosk Mode (Chrome):** `chrome --kiosk http://localhost:5173`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ── Database ──
DATABASE_URL="mysql://root:password@localhost:3306/suvidha_db"

# ── Server ──
PORT=5000

# ── Authentication ──
JWT_SECRET=your_jwt_secret_key_here

# ── Google Gemini AI ──
GEMINI_API_KEY=your_gemini_api_key

# ── Twilio (WhatsApp + SMS) ──
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_USE_WHATSAPP=true
TWILIO_SMS_FALLBACK=true

# ── Stripe Payments ──
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ── Cloudinary (Media Storage) ──
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## 📸 Screenshots & User Flow

### Citizen Journey

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. WELCOME          2. OTP LOGIN       3. DASHBOARD    │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐    │
│  │ 🇮🇳        │       │ 📱 Enter │       │ ⚡💧🔥   │    │
│  │ Select   │──────▶│ Mobile + │──────▶│ ♻️🏛️⭐   │    │
│  │ Language │       │ OTP      │       │ Services │    │
│  └──────────┘       └──────────┘       └──────────┘    │
│                                              │          │
│  ┌───────────────────────────────────────────┘          │
│  │                                                      │
│  ▼                                                      │
│  4. SERVICE PAGE     5. ACTION FORM    6. CONFIRMATION  │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐    │
│  │ Pay Bill │       │ Consumer │       │ ✅ Done!  │    │
│  │ Report   │──────▶│ Number   │──────▶│ WhatsApp │    │
│  │ Request  │       │ Details  │       │ Receipt  │    │
│  └──────────┘       └──────────┘       └──────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Admin Journey

```
Admin Login → Dashboard → View Complaints → Assign Officer → Update Status
                            ↓
                      Analytics Panel
                   (Complaints / SLA / Payments)
```

---

## ✅ Compliance with Evaluation Criteria

| Requirement | SUVIDHA Implementation | Status |
|---|---|---|
| **Touch-based kiosk interface** | Large tap targets (48px+), numeric keypads, step-by-step wizards, no keyboard dependency | ✅ |
| **Multi-department support** | 5 departments: Electricity, Gas, Water, Waste, Municipal | ✅ |
| **Electricity Utility** | Bill payment, outage, meter issue, load change, new connection (5 services) | ✅ |
| **Gas Distribution** | Cylinder booking (3 providers, 3 sizes, COD/online), leakage, issue, new connection | ✅ |
| **Municipal Corporation** | Property tax, certificates (birth/death), AI-classified grievance | ✅ |
| **Water Supply** | Bill payment, no-supply, leakage, quality complaints | ✅ |
| **Waste Management** | Missed pickup, overflowing bin, bulk pickup | ✅ |
| **Multilingual UI** | Full English/Hindi support — 296 translated strings, backend AI in both languages | ✅ |
| **Secure citizen authentication** | WhatsApp OTP (bcrypt-hashed, 5-min expiry, attempt-limited) + JWT tokens | ✅ |
| **Service request submission** | All 5 departments with structured forms + AI classification | ✅ |
| **Complaint submission** | 10+ complaint types with AI auto-routing, priority, ETA | ✅ |
| **Document upload functionality** | Multer + Cloudinary (images up to 5MB, PDFs) | ✅ |
| **Real-time status tracking** | Complaint lifecycle (SUBMITTED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED) | ✅ |
| **Automated receipt generation** | PDFKit → Cloudinary → WhatsApp delivery | ✅ |
| **Scalable architecture** | Prisma ORM, Express middleware pattern, modular controllers | ✅ |
| **Reliable system** | Error middleware, Zod validation, AI fallbacks, rate limiting | ✅ |
| **Intuitive for diverse citizens** | Touch-first design, bilingual, large fonts, minimal cognitive load | ✅ |
| **Notifications** | 27 WhatsApp notification events via Twilio (every action notified) | ✅ |
| **Payment processing** | Stripe (card), Pay on Delivery (cylinder), webhook-verified | ✅ |
| **Admin panel** | Complaint management, officer assignment, analytics dashboard | ✅ |
| **AI integration** | Gemini 1.5 Flash — classification, routing, sentiment, priority | ✅ |

---

## 📊 Project Statistics

| Metric | Count |
|---|---|
| **Frontend Pages** | 30+ |
| **API Endpoints** | 40+ |
| **Database Models** | 9 |
| **Department Modules** | 5 |
| **Services/Integrations** | 5 (Gemini, Stripe, Twilio, Cloudinary, PDFKit) |
| **Notification Events** | 27 |
| **Supported Languages** | 2 (English, Hindi) |
| **Complaint Types** | 10 |
| **Payment Methods** | 2 (Card, Pay on Delivery) |
| **Translation Strings** | 296 |

---
## 👥 Team

<table>
<tr>
<td align="center">
<a href="https://github.com/someear9h">
<img src="https://github.com/someear9h.png" width="100px;" alt="Samarth"/><br />
<sub><b>Samarth Titotkar</b></sub>
</a><br />
<a href="mailto:tikotkarsamarth@gmail.com">📧</a>
</td>
<td align="center">
<a href="https://github.com/AdityaKumbhar21">
<img src="https://github.com/AdityaKumbhar21.png" width="100px;" alt="Aditya"/><br />
<sub><b>Aditya Kumbhar</b></sub>
</a><br />
<a href="mailto:adityakumbhar915@gmail.com">📧</a>
</td>
<td align="center">
<a href="https://github.com/shivraj-nalawade">
<img src="https://github.com/shivraj-nalawade.png" width="100px;" alt="Shivraj"/><br />
<sub><b>Shivraj Nalawade</b></sub>
</a><br />
<a href="mailto:shivrajnalawade77@gmail.com">📧</a>
</td>
<td align="center">
<a href="https://github.com/Kas1705">
<img src="https://github.com/Kas1705.png" width="100px;" alt="Kishan"/><br />
<sub><b>Kishan Shukla</b></sub>
</a><br />
<a href="mailto:kishanshukla509@gmail.com">📧</a>
</td>
</tr>
</table>

---

<p align="center">
  <img src="https://img.shields.io/badge/Made_with_❤️_for-Digital_India-FF9933?style=for-the-badge&labelColor=138808" />
</p>

<p align="center">
  <strong>SUVIDHA — सुविधा</strong><br/>
  <em>"Convenience" in Hindi — Making government services accessible to every citizen.</em>
</p>

<p align="center">
  <sub>Built for the Smart Urban Digital Helpdesk Assistant Challenge · Government of India · 2025</sub>
</p>
