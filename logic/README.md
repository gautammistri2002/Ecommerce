# ElectroMart — Full Backend, Postman & Architecture Logic Guide

## Table of Contents
1. [What Must Be "ON" & Running Continuously](#1-what-must-be-on--running-continuously)
2. [How to Check in Postman (Step-by-Step)](#2-how-to-check-in-postman-step-by-step)
3. [How the Website Talks to the Backend](#3-how-the-website-talks-to-the-backend)
4. [Complete API Endpoints Reference](#4-complete-api-endpoints-reference)
5. [Quick Daily Checklist & Commands](#5-quick-daily-checklist--commands)
6. [Core Architectural Logic (Deep-Dive)](#6-core-architectural-logic-deep-dive)
   - [6.1 Logic: Why Spring Boot & MySQL Must Stay Running Continuously](#61-logic-why-spring-boot--mysql-must-stay-running-continuously)
   - [6.2 Logic: How Postman Communicates with Spring Boot](#62-logic-how-postman-communicates-with-spring-boot)
   - [6.3 Logic: The Complete Registration & OTP Algorithm](#63-logic-the-complete-registration--otp-algorithm)
   - [6.4 Logic: BCrypt Password Hashing & Authentication](#64-logic-bcrypt-password-hashing--authentication)
   - [6.5 Logic: Frontend State Management & UI Synchronization](#65-logic-frontend-state-management--ui-synchronization)

---

## 1. What Must Be "ON" & Running Continuously

| Component | Port | Purpose | Status Command / How to Run |
|---|---|---|---|
| **MySQL Server** | `3306` | Persistent database storing `users` & tokens | Windows Service `MySQL80` |
| **Spring Boot** | `8080` | Business logic, BCrypt hashing, OTP cache, REST APIs | `cd backend && mvn spring-boot:run` (Keep terminal open!) |
| **Frontend Web** | `5500` / Browser | HTML/CSS/JS user interface | VS Code Live Server or browser open `frontend/index.html` |

> [!IMPORTANT]
> **Keep the Spring Boot terminal window open!** If you close the terminal or hit Ctrl+C, port 8080 closes immediately and the website will say `Backend Offline`.

---

## 2. How to Check in Postman (Step-by-Step)

The collection file is located at `electromart_postman_collection.json`.

1. **Import Collection:** Open Postman $\rightarrow$ Click **Import** $\rightarrow$ Select `electromart_postman_collection.json`.
2. **Health Check:** `GET http://localhost:8080/api/auth/health` $\rightarrow$ Returns `200 OK` with `"ElectroMart Backend is running!"`.
3. **Send OTP (Registration):** `POST http://localhost:8080/api/auth/send-otp` with JSON:
   ```json
   { "email": "testuser@example.com", "purpose": "REGISTRATION" }
   ```
   Copy the `debugOtp` returned in the response (e.g. `834192`).
4. **Register User:** `POST http://localhost:8080/api/auth/register` with JSON:
   ```json
   {
     "name": "Gutam Kumar",
     "email": "testuser@example.com",
     "password": "password123",
     "otp": "834192"
   }
   ```
5. **Login User:** `POST http://localhost:8080/api/auth/login` with JSON:
   ```json
   {
     "email": "testuser@example.com",
     "password": "password123"
   }
   ```

---

## 3. How the Website Talks to the Backend

```
[User on Website]
       │
       ▼ (1. Fills Name & Email)
[frontend/login.html] ──(POST /api/auth/send-otp)──► [Spring Boot :8080]
                                                             │
                                                             ▼ (Generates 6-digit OTP)
[User enters OTP] ◄─────(Returns debugOtp)─────────── [Spring Boot]
       │
       ▼ (2. Enters OTP & Password)
[frontend/login.html] ──(POST /api/auth/register)──► [Spring Boot]
                                                             │
                                                             ▼ (Hashes PW & Saves to DB)
                                                     [MySQL :3306 Database]
                                                             │
[localStorage.setItem] ◄───(Returns User Info)────────┘
       │
       ▼ (3. Redirects to homepage)
[frontend/index.html] displays: "Hi, Gutam 🟢"
```

---

## 4. Complete API Endpoints Reference

Base URL: `http://localhost:8080/api/auth`

| # | Action | Method | Path | Request Body |
|---|---|---|---|---|
| 1 | Health Check | `GET` | `/api/auth/health` | None |
| 2 | Send OTP | `POST` | `/api/auth/send-otp` | `{ "email": "...", "purpose": "REGISTRATION" }` |
| 3 | Register | `POST` | `/api/auth/register` | `{ "name": "...", "email": "...", "password": "...", "otp": "..." }` |
| 4 | Login | `POST` | `/api/auth/login` | `{ "email": "...", "password": "..." }` |
| 5 | Reset Password | `POST` | `/api/auth/reset-password` | `{ "email": "...", "otp": "...", "newPassword": "..." }` |

---

## 5. Quick Daily Checklist & Commands

```powershell
# 1. Verify MySQL service
Get-Service MySQL80

# 2. Start Spring Boot (keep terminal open)
cd "e:\gautm\project ecommerce\backend"
mvn spring-boot:run

# 3. Test Health
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/health" -Method Get
```

---

## 6. Core Architectural Logic (Deep-Dive)

### 6.1 Logic: Why Spring Boot & MySQL Must Stay Running Continuously
- **Network Socket (`Port 8080`):** Spring Boot boots embedded Tomcat that executes `ServerSocket.bind(8080)`. If terminal is closed, socket dies and requests fail with `ECONNREFUSED`.
- **Database Connection Pool (HikariCP):** Spring maintains active open TCP connections to MySQL (`3306`), keeping queries fast without reconnect overhead.
- **In-Memory OTP Cache:** OTPs are stored in JVM memory (`ConcurrentHashMap`). If Spring restarts before entering OTP, the memory wipes and verification fails.

### 6.2 Logic: How Postman Communicates with Spring Boot
1. Postman serializes JSON text into an HTTP request.
2. Spring's `DispatcherServlet` routes the request to `@PostMapping("/login")`.
3. Jackson JSON deserializer parses the payload into Java `LoginRequest`.
4. `SecurityConfig` allows public `/api/**` traffic without CSRF blocks.
5. Returns `200 OK` on success, or `400 Bad Request` on invalid credentials.

### 6.3 Logic: The Complete Registration & OTP Algorithm
- **Phase 1 (send-otp):** Checks `existsByEmailIgnoreCase(email)`. Generates 6-digit number `String.format("%06d", new Random().nextInt(999999))`. Sets expiry to `now() + 5 min`. Stores in `otpStore`.
- **Phase 2 (register):** Validates expiry timestamp and OTP string equality. Hashes password using BCrypt. Saves to MySQL `users` table. Calls `otpStore.remove(otpKey)` to prevent replay attacks.

### 6.4 Logic: BCrypt Password Hashing & Authentication
- Plaintext passwords (`password123`) are **never stored**.
- `BCryptPasswordEncoder` generates a random 128-bit salt and runs 10 rounds of Blowfish key expansion (`$2a$10$...`).
- BCrypt is a **one-way hash**. Verification uses `passwordEncoder.matches(enteredPassword, storedHash)`, re-hashing with the stored salt to verify equality.

### 6.5 Logic: Frontend State Management & UI Synchronization
- Upon successful login, the browser executes:
  ```javascript
  localStorage.setItem("electromart_user", JSON.stringify(userData));
  ```
- `frontend/script.js` listens to `storage`, `focus`, and `DOMContentLoaded` events.
- Reads `localStorage` and dynamically updates the UI to show `Hi, [Name] 🟢` across all tabs simultaneously.

