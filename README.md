# ReShare: Donation Management Platform

ReShare is a full-stack system designed to connect donors, NGOs, and volunteers for redistribution of usable surplus items such as food, clothes, books, appliances, and more. It ensures transparent, verified, and trackable donation workflow to promote sustainability and support communities.

---

# 1. Table of Contents
- [2. Features](#2-features)
- [3. Tech Stack](#3-tech-stack)
- [4. Installation](#4-installation)
- [5. Environment Variables](#5-environment-variables)
- [6. Project Structure](#6-project-structure)

  

---

# 2. Features

## 2.1 Donor Features
- Create donation requests (food, clothes, books, appliances, etc.)
- Upload item images and details
- Real-time donation tracking
- Notification when NGO receives the donation
- History of contributions

## 2.2 NGO Features
- Apply for verification with documentation
- Browse and claim donation requests
- Track accepted donations
- Manage pickup and delivery status

## 2.3 Volunteer Features
- View delivery assignments
- Accept delivery tasks
- Update status (picked → in-transit → delivered)

## 2.4 Admin Features
- Approve/verify NGOs
- Manage user roles and donations
- Assign delivery tasks
- Review and monitor system activity

## 2.5 Core System Features
- Firebase Authentication (Google + Email/Password)
- Firestore with role-based security rules
- Firebase Storage for images and docs
- Google Maps for location and route assistance
- Real-time listeners and updates

---

# 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (React), Tailwind CSS |
| Backend | Firebase Cloud Functions |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Maps | Google Maps JavaScript API |
| Deployment | Vercel / Firebase Hosting |

---

# 4. Installation

## 4.1 Prerequisites
- Node.js (LTS version)
- Firebase CLI installed
- Google Cloud account with Maps API enabled

## 4.2 Steps to Run Locally

```bash
git clone <repository-url>
cd ReShare
npm install
npm run dev
firebase deploy --only functions
```
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

/
├── app/<br>
│   ├── donor/<br>
│   ├── ngo/<br>
│   ├── volunteer/<br>
│   └── admin/<br>
├── components/<br>
├── firebase/<br>
│   ├── config.js<br>
│   ├── auth.js<br>
│   └── firestore.js<br>
├── functions/<br>
│   └── index.js<br>
└── public/<br>




