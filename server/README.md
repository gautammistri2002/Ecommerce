# ElectroMart — Server vs Postman Collection Guide

## 1. Quick Summary (The Kitchen vs The Menu)

| ElectromartBackendApplication.java | electromart_postman_collection.json |
|---|---|
| **The Restaurant Kitchen & Chef** | **The Menu Card / Order Slip** |
| Cooks food, manages database, serves API responses. | Lists available dishes so customers can order easily. |
| **THE SERVER (Backend Engine)** | **THE CLIENT PRESET (Testing Tool)** |

---

## 2. Comparison Table

| Feature | `ElectromartBackendApplication.java` | `electromart_postman_collection.json` |
|---|---|---|
| **File Type** | Java Source Code (`.java`) | JSON Data Format (`.json`) |
| **Role** | Starts and runs backend server | Pre-configured test requests |
| **Language** | Java 17+, Spring Boot, Tomcat | JSON Schema (Postman v2.1) |
| **Network Port** | Opens and listens on **Port 8080** | Does **NOT** open any port |
| **Database** | Connects to MySQL on **Port 3306** | Has **NO** database connection |
| **Standalone?** | **YES.** It is an active backend application. | **NO.** It is a config file imported into Postman. |
| **If it is OFF** | Port 8080 is closed; website and Postman fail. | Nothing stops; website works normally. |
| **Action** | **YOU RUN IT** (`mvn spring-boot:run` or F5 in VS Code). | **YOU IMPORT IT** into Postman Desktop. |

---

## 3. What Does `ElectromartBackendApplication.java` Do?

File: `backend/src/main/java/com/electromart/ElectromartBackendApplication.java`

```java
@SpringBootApplication
public class ElectromartBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ElectromartBackendApplication.class, args);
    }
}
```

* Boots up the embedded **Tomcat Web Server** on port `8080`.
* Connects to MySQL (`jdbc:mysql://localhost:3306/electromart`).
* Activates all REST API endpoints:
  - `GET  /api/auth/health`
  - `POST /api/auth/send-otp`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/reset-password`
* Performs actual computations: generates OTPs, encrypts passwords with BCrypt, stores users in MySQL.

---

## 4. What Does `electromart_postman_collection.json` Do?

File: `electromart_postman_collection.json`

* It contains pre-written request templates:
  - URLs (`http://localhost:8080/api/auth/...`)
  - HTTP Methods (`GET`, `POST`)
  - Headers (`Content-Type: application/json`)
  - Sample JSON request bodies
* Saves you from typing errors (like missing quotes or wrong methods).
* **It does NOT create any server.** It only tells Postman what to send to the server.

---

## 5. Workflow Diagram

```
1. YOU START:
   ElectromartBackendApplication.java (Click "Run")
               │
               ▼
   [Server starts listening on Port 8080 & MySQL]

2. YOU IMPORT:
   electromart_postman_collection.json  ───imported into───►  [Postman App]
                                                                  │
3. YOU TEST:                                                      ▼
   Postman clicks "Send" ───────HTTP Request (Port 8080)────────► Spring Boot
   Postman sees 200 OK  ◄───────HTTP Response JSON ────────────── Spring Boot
```

