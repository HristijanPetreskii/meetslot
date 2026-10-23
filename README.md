# MeetSlot — Simple Scheduling App

MeetSlot is a full-stack web application that makes scheduling simple. Hosts can create time slots, and visitors can browse available times and book a slot using their name and email address.

**Live Demo:** https://meetslot-ashy.vercel.app  
**GitHub Repository:** https://github.com/HristijanPetreskii/meetslot

## Features

- **Create time slots:** Add a date, start time, and duration.
- **View availability:** Browse available time slots in chronological order.
- **Book a slot:** Submit your name and email to reserve an available time.
- **Prevent double booking:** Once a slot is booked, it is no longer available to others.
- **Persistent data:** Store time slots and bookings in MongoDB Atlas.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB Atlas
- Mongoose

## Project Structure

```text
meetslot/
├── public/
├── src/
│   ├── App.jsx
│   └── App.css
├── server/
│   ├── models/
│   │   └── Slot.js
│   ├── routes/
│   │   └── slotRoutes.js
│   ├── server.js
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas database or another MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/HristijanPetreskii/meetslot.git
cd meetslot
```

### 2. Install frontend dependencies

From the project root, run:

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection string. Keep this file private and never commit credentials to GitHub.

The frontend defaults to `http://localhost:5001/api/slots` for local development. To use a different backend URL, create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:5001/api/slots
```

Update the URL if your backend runs at a different address.

### 5. Start the backend

From the `server/` directory, run:

```bash
npm run dev
```

The backend connects to MongoDB and runs on `http://localhost:5001`.

### 6. Start the frontend

Open a second terminal, navigate to the project root, and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/slots` | Retrieve available time slots |
| POST | `/api/slots` | Create a time slot |
| POST | `/api/slots/:id/book` | Book an available time slot |

The booking endpoint validates booking details and prevents a slot from being booked more than once.

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

The deployed application is available at: https://meetslot-ashy.vercel.app

## AI Tools

ChatGPT was used as a development assistant for implementation guidance, debugging, understanding backend concepts, and improving the user interface.

## Future Improvements

- Google Calendar integration
- Email booking confirmations
- Validation for overlapping time slots
- Automated tests
- Improved booking management and scheduling options
