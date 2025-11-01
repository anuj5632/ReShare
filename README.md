##  Tech Stack – ReShare: Surplus Item Donation Platform

### Frontend
- *Next.js (React Framework):* Builds a fast, scalable, and SEO-friendly user interface.  
- *Tailwind CSS:* Provides a clean, responsive, and modern design system.  
- *Framer Motion:* Adds smooth, interactive animations for better user experience.  
- *React Google Maps API:* Displays nearby NGOs and donations with real-time map pins.  
- *Lucide Icons / HeroIcons:* Ensures consistent and accessible iconography throughout the app.  

---

### Backend & Database
- *Firebase Authentication:* Handles secure user login and signup (Google + Email/Password).  
- *Firebase Firestore:* Real-time NoSQL database to store users, NGOs, donations, and analytics.  
- *Firebase Cloud Storage:* Used for uploading images, certificates, and digital receipts.  
- *Firebase Cloud Functions:* Powers automation for NGO verification, email notifications, and PDF generation.  
- *Firebase Hosting / Vercel:* Enables fast, scalable, and reliable deployment of the application.  

---

### APIs & Integrations
- *Google Maps API:* Integrates live maps, distance calculation, and location-based discovery.  
- *GeoFire / GeoQuery:* Supports efficient geolocation-based matching between donors and NGOs.  
- *Email Notifications (via Cloud Functions):* Sends automated updates for registration, approvals, and donations.  
- *PDFKit / jsPDF:* Generates digital donation receipts upon successful delivery.  

---

### Architecture
- *Component-Based Modular Design:* Separates UI, logic, and Firestore integration for better maintainability.  
- *Role-Based Access Control (RBAC):* Manages Donor, NGO, Volunteer, and Admin access securely.  
- *Progressive Web App (PWA):* Allows basic functionality even in low-connectivity environments.  
- *Real-Time Listeners:* Tracks donation lifecycle (Available → Claimed → Picked → Delivered).  

---

### Analytics & Visualization
- *Firebase Analytics:* Monitors usage, engagement, and platform activity.  
- *Chart.js / Recharts:* Visualizes sustainability metrics such as CO₂ saved, waste prevented, and people helped.  
- *Impact Dashboard:* Displays real-time insights for Admins, NGOs, and Donors.  

---

### Development & Collaboration Tools
- *Visual Studio Code:* Main IDE for development.  
- *GitHub:* Version control and collaboration.  
- *Figma:* UI/UX wireframing and design.  
- *Postman:* API testing and validation.  
- *ESLint + Prettier:* Maintains clean and consistent code style.  

---

### Deployment
- *Frontend:* Deployed using Vercel for continuous integration and production hosting.  
- *Backend:* Managed on Firebase (Functions, Firestore, Storage, Authentication).  
- *Domain & SSL:* Configured via GitHub and Vercel integration for secure and seamless access.
