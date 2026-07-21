# NestFinder

> A full-stack real estate platform engineered for seamless property discovery, listing, and robust user authentication. It provides homeseekers and agents an integrated environment to interact with market listings in real time.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/) ![status](https://img.shields.io/badge/status-active-success?style=flat-square) ![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

NestFinder is a secure, modern real estate web ecosystem built to optimize how users explore, buy, rent, and list residential or commercial properties. The architecture leverages a clean decoupling of layout logic and performance layers, featuring an optimized React frontend built on Next.js and a highly scalable, asynchronous Python API backend managed via FastAPI. Data integrity and state verification are fully handled through MongoDB Atlas cluster interactions via the Motor async driver. With built-in secure authentication pipelines and stateful token handling, the application provides a highly resilient base framework primed for advanced data analytics, predictive modeling, and personalized intelligent property recommendations.

---

## Example Screenshot

### Main Interface & Property Hub
![NestFinder Landing Page UI](https://github.com/user-attachments/assets/d30cf3f4-48f4-4466-8a6d-746724f2aa11
)
![NestFinder properties listings](https://github.com/user-attachments/assets/e55f876a-051e-4449-a548-ee34efa05bf8
)
![NestFinder property details](https://github.com/user-attachments/assets/86573221-5dcd-4280-9329-7b7188b8b763
)
![NestFinder signup/signin page](https://github.com/user-attachments/assets/d2a4416b-0083-4aa8-a0d3-648ce611f9f5
)
![NestFinder insights module](https://github.com/user-attachments/assets/7fbe78e2-cbbb-47cc-9e0d-eed132b24070
)
![NestFinder analytics module](https://github.com/user-attachments/assets/a49dd6ed-1316-4a87-8524-aca625cdc8d7
)
![NestFinder spatial analysis module](https://github.com/user-attachments/assets/6b67cba7-3038-46c2-a339-530ca671fa9e
)
![NestFinder price distribution module](https://github.com/user-attachments/assets/f53e1269-5245-4e57-befb-534113a6d9fb
)
![NestFinder price vs built-up area module](https://github.com/user-attachments/assets/394fd77d-ef99-44d7-95ca-d05fc897676d
)
![NestFinder room configuration module](https://github.com/user-attachments/assets/1e74a183-9450-46c4-9933-5fd61d463e7e
)
![NestFinder price prediction module](https://github.com/user-attachments/assets/089bebf0-de2b-409f-8b82-f788c646c01a
)

---

## Table of Contents

- [Illustrations](#illustrations)
- [Scope of Functionalities](#scope-of-functionalities)
- [Installation](#installation)
  - [Windows](#windows)
  - [OS X & Linux](#os-x--linux)
- [Development Setup](#development-setup)
- [Usage Example](#usage-example)
- [Benefits](#benefits)
- [Project Status](#project-status)
- [Release History](#release-history)
- [Sources](#sources)
- [Other Information](#other-information)

---

## Illustrations

Below is the architectural diagram illustrating the request-response workflow between the frontend layer, secure API endpoints, and cloud database storage:

```text
 ┌────────────────────────────────────────────────────────┐
 │                   Next.js Frontend                     │
 │      (Client Application running on localhost:3000)    │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │ Secure HTTPS Requests
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                   FastAPI Backend                      │
 │         (Uvicorn Server running on localhost:8000)     │
 ├────────────────────────────────────────────────────────┤
 │  ┌──────────────────────┐    ┌──────────────────────┐  │
 │  │    Auth Router       │    │   Property Router    │  │
 │  │ (JWT Sign-in/Signup) │    │  (Fetch/Post Listings)│  │
 │  └──────────┬───────────┘    └──────────┬───────────┘  │
 └─────────────┼───────────────────────────┼──────────────┘
               │                           │
               └─────────────┬─────────────┘
                             │ Async Connection (Motor Driver)
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                   MongoDB Atlas                        │
 │        (Cloud Persistent Distributed Database)         │
 └────────────────────────────────────────────────────────┘
```

---

## Scope of Functionalities

### 🛠️ Current Implemented Features

- **Secure Authentication Engine**: Dedicated client-side sign-up and sign-in pages integrated with server-side validation schemas using Pydantic, Passlib, and Bcrypt hashing mechanisms.
- **Property Directory Infrastructure**: Dynamic real estate feed listing comprehensive properties structured with local configuration metadata (price valuation, structural specifications, geographical tags).
- **Cross-Origin Configuration (CORS)**: Granular middleware rules actively restricting external actions to designated trusted local development origins.
- **Geographical Filtering Foundations**: Clean UI categorization layout allowing navigation filtering grouped by city nodes.

### 🚀 Upcoming Feature Roadmap

**Advanced Real Estate Analytics Module**
- **Spatial Analysis**: Dynamic mapping layer visualizing regional density and real estate activity.
- **Price Distribution Across Sectors**: Multi-variable bar graphs parsing cost metrics across specific zones.
- **Price vs. Square Foot Analysis**: Scatter plot implementations mapping value metrics against scale.
- **Room Volume Allocation**: Categorized pie chart visualizations highlighting distribution frequency for configuration numbers.

**Machine Learning Price Prediction Module**
Algorithmic forecasting models analyzing structural attributes and historical data trends to suggest optimized value targets.

**Intelligent Recommender System Module**
Personalized property matchmaking workflows utilizing content-filtering paradigms mapping explicit user search trajectories.

**Strategic Market Insights Module**
High-level dashboard surfacing core micro-market movements, volume adjustments, and investment metrics.

---

## Installation

### Windows

1. Clone the project codebase repository:
   ```bash
   git clone https://github.com/AryaShukla123/nest_finder.git
   cd NestFinder
   ```

2. Initialize and provision the backend system:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Provision the client packages application:
   ```bash
   cd ..
   npm install
   ```

### OS X & Linux

1. Clone the project codebase repository:
   ```bash
   git clone https://github.com/AryaShukla123/nest_finder.git
   cd NestFinder
   ```

2. Initialize and provision the backend system:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Provision the client packages application:
   ```bash
   cd ..
   npm install
   ```

---

## Development Setup

### 1. Backend Environment Setup

Create a secure custom environment text file named `.env` inside the `/backend` subdirectory to isolate production configurations:

```env
MONGODB_URL="mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="nestfinder"
SECRET_KEY="your-cryptographically-secure-64-character-hex-string"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

💡 To generate a compliant security key value on the fly, run this localized terminal command:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2. Launching Execution Instances

Run both server terminals concurrently to start local execution:

**Backend Execution Terminal:**
```bash
cd backend
uvicorn main:app --reload
```
Backend validation API document testing runs directly at: `http://127.0.0.1:8000/docs`

**Frontend Client Terminal:**
```bash
npm run dev
```
Client application layer runs directly at: `http://localhost:3000`

---

## Usage Example

### Creating a Secure Account & Browsing Real Estate Listings

1. Direct the browser instance to `http://localhost:3000/auth/signup`.
2. Fill standard name, unique credential email, and matching password strings inside the application registration form block.
3. Upon clicking submission validation, the frontend application redirects you to `http://localhost:3000/auth/signin` where credentials are validated to yield temporary authentication state tokens.
4. Once authenticated, browse the comprehensive market index feed displaying pricing matrices, interior dimensions, and specific property attributes.

---

## Benefits

- **Asynchronous Non-Blocking Tasks**: FastAPI engine combined with Motor drivers ensures multiple high-load analytical reads execute without slowing connection handling speeds.
- **Component Optimization**: Modern Next.js routing splits operational pages into modular components, maximizing performance scores.
- **Encapsulated Schema Safety**: Pydantic definitions catch data integrity errors before queries touch the backend data layers.
- **Future-Ready Architecture**: Clean project separation allows adding the analytical engine and data visual layers without disrupting the existing authentication infrastructure.

---

## Project Status

**Under Active Development**

Phase 1 (Secure Authentication Systems & Persistence Interfaces) is completely finalized and stable. Architecture transitions are moving towards Phase 2 (Analytics Module Integration & Machine Learning Prediction Models).

---

## Release History

| Version | Date | Description |
|---------|------|-------------|
| v1.0.0 | Current | Core application build complete: Integrated FastAPI CORS middleware, token handlers, user schemas, Next.js routing pipelines, and secure registration/login interfaces. |
| v1.1.0 (Beta) | Upcoming | Integration rollout of the spatial analytics suite, charting frameworks, and regression price modeling engines. |
 
---
 
## 📊 System Information Summary
 
| Metric | Details |
|--------|---------|
| **Built For** | Advanced Full-Stack Real Estate Portfolio System Showcase |
| **Frontend Stack** | Next.js (App Router), TypeScript, Tailwind CSS, Lucide Icons |
| **Backend Stack** | FastAPI, Python, Motor, Pydantic, Passlib, PyJWT, Uvicorn |
| **Database Engine** | MongoDB Atlas (Cloud NoSQL Distributed Storage Engine) |
| **License Type** | MIT Open-Source Permissive License |
 
---
 
## Sources
 
- [FastAPI Documentation Framework](https://fastapi.tiangolo.com/) - High-performance core routing guidelines.
- [Next.js App Routing Concepts](https://nextjs.org/docs) - Universal structural component standards.
- [MongoDB Async Drivers](https://motor.readthedocs.io/) - Concurrent asynchronous persistence layers.
---
 
## Other Information
 
### 👤 Author Information
 
- **Lead Architect**: Arya Shukla
- **Academic Specialization**: Computer Science (Artificial Intelligence & Machine Learning)
