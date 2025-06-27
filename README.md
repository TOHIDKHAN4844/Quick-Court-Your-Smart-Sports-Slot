---

# 🏀 Court Booking System

A full-stack MERN web application designed to streamline the **sports court booking experience** at various centers. Users can register, log in, explore available centres, view sports and courts, and book time slots seamlessly. The platform also features a robust admin panel for managing content, built with modern design and scalable backend practices.

---

## 🌐 Live Demo

Coming Soon... (or add your deployed URL here if hosted)

---

## 📌 Table of Contents

* [Tech Stack](#-tech-stack)
* [Features](#-features)
* [Folder Structure](#-folder-structure)
* [Environment Variables](#-environment-variables)
* [Installation & Setup](#-installation--setup)
* [Running the Application](#-running-the-application)
* [API Endpoints](#-api-endpoints)
* [Contributing](#-contributing)
* [License](#-license)
* [Contact](#-contact)

---

## ⚙️ Tech Stack

### 🖥️ Frontend:

* **React** (with Hooks & Context)
* **React Router DOM** – routing/navigation
* **Material UI (MUI)** – UI components
* **Bootstrap** – responsive layout styling
* **Axios** – API handling
* **Day.js** – date manipulation
* **Formik & Yup** – form state and validation

### 🛠 Backend:

* **Node.js + Express.js**
* **MongoDB + Mongoose**
* **JWT (JSON Web Tokens)** – auth
* **Bcrypt.js** – password hashing
* **Joi** – data validation
* **Nodemailer** – OTP/email delivery
* **dotenv** – environment management
* **CORS** – cross-origin API access

### 🧰 Developer Tools:

* **Concurrently** – run frontend/backend together
* **ESLint** – code linting
* **Nodemon** – backend hot reload

---

## 🚀 Features

### 👤 User

* ✅ Register with email and password
* ✅ OTP verification during signup and password reset
* ✅ Login/logout functionality
* ✅ Book courts by selecting centre, sport, court, date, and time
* ✅ View booking history
* ✅ Profile management

### 🔐 Admin / Manager

* ✅ Role-based access via JWT
* ✅ Add new centres, sports, and courts
* ✅ Manage users and bookings
* ✅ View all users and their booking data

### 📩 Notifications

* ✅ OTP for account/email verification
* ✅ Booking confirmation via email

### 💻 UI/UX

* ✅ Fully responsive UI with MUI & Bootstrap
* ✅ Clean navigation with protected routes
* ✅ Friendly error/success messages

---

## 🗂 Folder Structure

```
Booking-System-main/
├── backend/
│   ├── controllers/      # Route handler logic
│   ├── mailer/           # Nodemailer configs
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── utils/            # Custom utilities
│   ├── joiSchema.js      # Joi validation
│   └── index.js          # Server entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/   # All React components
│       ├── context/      # Global state/context
│       ├── hooks/        # Custom React hooks
│       ├── styles/       # CSS/SCSS files
│       ├── config.js     # API base URL
│       └── App.js        # Root component
│
├── .env                  # Sample env (not committed)
├── README.md
```

---

## 🔑 Environment Variables

### ✅ Backend `.env` (in `/backend` directory)

```env
PORT=5000
DB_URL=mongodb://localhost:27017/your-db-name
SECRET_KEY=your_jwt_secret
NODE_ENV=development

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_SERVICE=gmail

LOCALURL=http://localhost:3000
GLOBALURL=https://your-deployed-frontend.vercel.app
```

### ✅ Frontend `.env` (in `/frontend` directory)

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GLOBALURL=http://localhost:5000
```

> 🔁 Restart both frontend and backend servers after modifying `.env` files.

---

## 🧩 Installation & Setup

### Prerequisites

* Node.js (v14+ recommended)
* npm or yarn
* MongoDB (local or MongoDB Atlas)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/Booking-System-main.git
cd Booking-System-main
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Then, create a `.env` file as shown above.

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Ensure `.env` contains the correct API URL.

---

## 🚦 Running the Application

### 🔄 Option 1: Start frontend and backend separately

```bash
# Backend
cd backend
npm run dev

# Frontend (in separate terminal)
cd ../frontend
npm start
```

### 🔄 Option 2: Run both with one command

```bash
npm run both
```

> This requires `concurrently` to be installed in root or frontend.

---

## 📡 API Endpoints

Here’s a summary of available endpoints:

| Method | Endpoint                                                 | Description                 |
| ------ | -------------------------------------------------------- | --------------------------- |
| POST   | `/api/auth/createuser`                                   | Register a new user         |
| POST   | `/api/auth/login`                                        | User login                  |
| POST   | `/api/auth/forgotPassword`                               | Request password reset      |
| POST   | `/api/auth/updatePassword/:token`                        | Update password with token  |
| POST   | `/api/auth/verifyOtp`                                    | Verify OTP                  |
| POST   | `/api/auth/resendOtp`                                    | Resend OTP                  |
| GET    | `/api/centres/getCentres`                                | List all centres            |
| GET    | `/api/centres/getSports/:centreId`                       | List sports at a centre     |
| GET    | `/api/centres/courts/:centreId/sport/:sportId/available` | Courts for sport and date   |
| GET    | `/api/centres/:centre/:sport/:court/:date/timeslots`     | Get available time slots    |
| POST   | `/api/centres/book/:centreId/...`                        | Book a slot (auth required) |
| POST   | `/api/centres/add-centres`                               | Add a new centre (admin)    |
| POST   | `/api/centres/add-sport/:centreId/:sportName`            | Add a sport (admin)         |
| POST   | `/api/centres/add-court/:selectedSport`                  | Add a court (admin)         |
| GET    | `/api/User/getUserDetailS/:userId1`                      | Get user details            |
| GET    | `/api/User/getBookingDetailS/:userId1`                   | Get booking history         |

---

## 🧑‍💻 Contributing

1. Fork this repo
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a pull request

Suggestions, improvements, and feature requests are welcome!

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 📬 Contact

**Author:** *Tohid Khan*
**GitHub:** [@yourusername](https://github.com/yourusername)
**LinkedIn:** [linkedin.com/in/your-linkedin](https://linkedin.com/in/your-linkedin)
**Email:** [your.email@example.com](mailto:your.email@example.com)

---