# Laundry Wallah — Project Plan

## Overview

**Laundry Wallah** is a laundry service web application that connects customers with laundry services. Users can schedule pickups and drop-offs according to their availability, place orders at predefined rates, and pay securely. Admins can manage orders and update status throughout the delivery lifecycle.

---

## Tech Stack Recommendation

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript | Simple, no build step; can add React/Vue later |
| **Backend** | Node.js + Express, or PHP/Laravel | REST APIs, session management |
| **Database** | PostgreSQL / MySQL | Users, orders, slots |
| **Payments** | Stripe / Razorpay | Secure, popular gateways |
| **Auth** | JWT or sessions | Admin vs user role separation |

---

## User Flows

### Customer Flow
1. **Landing** → Homepage with services & info
2. **Register/Login** → User auth
3. **Select Services** → Choose laundry items (shirt, jeans, etc.) at predefined rates
4. **Pickup Slot** → Choose date & time for pickup
5. **Drop Slot** → Choose date & time for delivery
6. **Payment** → Pay via gateway
7. **Track** → See order status

### Admin Flow
1. **Login** → Admin auth
2. **Orders** → View all customer orders
3. **Status** → Update: Pickup Scheduled → Clothes Picked Up → Washing Completed → Out for Delivery → Delivered

---

## Database Schema

### Users
| Field | Type | Description |
|-------|------|-------------|
| id | PK | Auto-increment |
| email | VARCHAR | Unique |
| password_hash | VARCHAR | Bcrypt |
| name | VARCHAR | Full name |
| phone | VARCHAR | Contact |
| role | ENUM | 'admin' \| 'user' |
| address | TEXT | Default address |
| created_at | TIMESTAMP | |

### Service Rates (Predefined)
| Field | Type | Description |
|-------|------|-------------|
| id | PK | |
| name | VARCHAR | e.g., Shirt, Jeans, Saree |
| price_per_item | DECIMAL | Rate |
| category | VARCHAR | Clothes/Bedding/etc |

### Orders
| Field | Type | Description |
|-------|------|-------------|
| id | PK | |
| user_id | FK | References users |
| pickup_slot | DATETIME | Scheduled pickup |
| drop_slot | DATETIME | Scheduled delivery |
| items | JSON | [{service_id, quantity, price}] |
| total_amount | DECIMAL | |
| status | ENUM | See below |
| payment_id | VARCHAR | Gateway reference |
| address | TEXT | Delivery address |
| created_at | TIMESTAMP | |

### Order Status Enum
- `pending` — Order placed, awaiting pickup
- `pickup_scheduled` — Pickup slot confirmed
- `clothes_picked_up` — Collected from customer
- `washing_completed` — Laundry done
- `out_for_delivery` — On the way
- `delivered` — Completed

---

## Pages & Structure

```
/                     → Homepage (public)
/login                → User login
/register             → User registration
/admin/login          → Admin login

/user/
  /dashboard          → User dashboard
  /orders             → My orders + place new
  /orders/new         → Create order (slots, items, payment)
  /orders/:id         → Order detail + status

/admin/
  /dashboard          → Admin dashboard
  /orders             → All orders
  /orders/:id         → Order detail + update status
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` — User signup
- `POST /api/auth/login` — User login
- `POST /api/admin/login` — Admin login
- `POST /api/auth/logout` — Logout

### User
- `GET /api/services` — Predefined rates
- `GET /api/slots/available` — Available pickup/drop slots
- `POST /api/orders` — Create order
- `GET /api/orders/my` — User's orders
- `GET /api/orders/:id` — Order detail

### Admin
- `GET /api/admin/orders` — All orders
- `PATCH /api/admin/orders/:id/status` — Update status

### Payments
- `POST /api/payments/create` — Create payment intent (Stripe/Razorpay)
- `POST /api/payments/webhook` — Handle success callback

---

## UI/UX Guidelines

1. **Homepage**  
   - Hero with tagline and CTA  
   - Services with icons & short descriptions  
   - Pricing summary  
   - How it works (steps)  
   - Contact/Footer  

2. **Slots**  
   - Calendar for date  
   - Time slots (e.g., 9–12, 12–3, 3–6)  
   - Clear indication of availability  

3. **Order Status**  
   - Visual stepper/timeline  
   - Clear labels (Pickup → Washing → Delivery)  

4. **Payment**  
   - Secure, minimal form  
   - Supported methods (Card, UPI, etc.)  

---

## Implementation Phases

### Phase 1 — Static Frontend
- [x] Homepage with info
- [ ] Login/Register pages
- [ ] Basic order form (mock)
- [ ] Admin orders view (mock)

### Phase 2 — Backend & Auth
- [ ] API setup
- [ ] User & admin auth
- [ ] Database & models

### Phase 3 — Orders & Slots
- [ ] Service rates CRUD
- [ ] Slot availability logic
- [ ] Order creation flow

### Phase 4 — Payments
- [ ] Payment gateway integration
- [ ] Webhooks & order confirmation

### Phase 5 — Polish
- [ ] Email notifications
- [ ] Responsive design
- [ ] Error handling & validation

---

## File Structure (Frontend-First)

```
laundry-wallah/
├── PROJECT_PLAN.md          ← This file
├── index.html               ← Homepage
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── login.html               ← User login
├── register.html
├── admin/
│   └── login.html           ← Admin login
├── user/
│   ├── dashboard.html
│   └── orders.html
└── admin-panel/
    └── orders.html
```

---

*Last updated: Feb 14, 2025*
