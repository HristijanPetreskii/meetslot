
import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api/slots";

function App() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const notificationTimer = useRef(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("30");

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  function showNotification(text, type = "success") {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    setMessage(text);
    setNotificationType(type);

    notificationTimer.current = setTimeout(() => {
      setMessage("");
      notificationTimer.current = null;
    }, 3000);
  }

  useEffect(() => {
    fetchSlots();

    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  async function fetchSlots() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load available slots.");
      }

      const data = await response.json();
      setSlots(data);
      setError("");
    } catch {
      setError(
        "Could not connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSlot(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          startTime,
          duration: Number(duration),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create the slot.");
      }

      setDate("");
      setStartTime("");
      setDuration("30");

      showNotification("Time slot created successfully!");
      await fetchSlots();
    } catch (err) {
      showNotification(
        err.message || "Something went wrong.",
        "error"
      );
    }
  }

  async function handleBooking(event) {
    event.preventDefault();

    if (!selectedSlot) return;

    setError("");
    setBookingLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${selectedSlot._id}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: bookingName.trim(),
            email: bookingEmail.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not book this slot.");
      }

      setSelectedSlot(null);
      setBookingName("");
      setBookingEmail("");

      showNotification("Your booking was successful!");
      await fetchSlots();
    } catch (err) {
      showNotification(
        err.message || "Something went wrong.",
        "error"
      );

      await fetchSlots();
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">M</span>
          MeetSlot
        </a>
        <span className="topbar-label">Simple scheduling</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR TIME, YOUR WAY</p>
        <h1>Make time for what matters.</h1>
        <p className="hero-description">
          Find a time that works for you and book your next meeting in seconds.
        </p>
      </section>

      <section className="content">
        <div className="slots-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE CALENDAR</p>
              <h2>Available time slots</h2>
            </div>
            <span className="slot-count">
              {slots.length} {slots.length === 1 ? "slot" : "slots"}
            </span>
          </div>

          {loading && (
            <p className="status">Loading available times...</p>
          )}

          {!loading && !error && slots.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">◷</span>
              <h3>No available times yet</h3>
              <p>New time slots will appear here once they are added.</p>
            </div>
          )}

          <div className="slots-list">
            {slots.map((slot) => (
              <article className="slot-card" key={slot._id}>
                <div className="slot-date">
                  <span className="calendar-icon">▦</span>
                  <div>
                    <strong>{slot.date}</strong>
                    <span>{slot.duration} minutes</span>
                  </div>
                </div>

                <div className="slot-time">
                  <span>{slot.startTime}</span>
                  <span className="available-label">Available</span>
                </div>

                <button
                  type="button"
                  className="book-button"
                  onClick={() => {
                    setSelectedSlot(slot);
                    setBookingName("");
                    setBookingEmail("");
                    setError("");
                    setMessage("");
                  }}
                >
                  Book
                </button>
              </article>
            ))}
          </div>

          {selectedSlot && (
            <section className="booking-panel">
              <h2>Book your time slot</h2>
              <p className="panel-description">
                {selectedSlot.date} at {selectedSlot.startTime} ·{" "}
                {selectedSlot.duration} minutes
              </p>

              <form onSubmit={handleBooking}>
                <label htmlFor="bookingName">Your name</label>
                <input
                  id="bookingName"
                  type="text"
                  placeholder="Enter your full name"
                  value={bookingName}
                  onChange={(event) =>
                    setBookingName(event.target.value)
                  }
                  required
                />

                <label htmlFor="bookingEmail">Email address</label>
                <input
                  id="bookingEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={bookingEmail}
                  onChange={(event) =>
                    setBookingEmail(event.target.value)
                  }
                  required
                />

                <div className="booking-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setSelectedSlot(null)}
                    disabled={bookingLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Booking..." : "Confirm booking"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        <aside className="host-panel">
          <p className="eyebrow">HOST TOOLS</p>
          <h2>Create a time slot</h2>
          <p className="panel-description">
            Add a date and time for visitors to book.
          </p>

          <form onSubmit={handleCreateSlot}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              min={new Date().toLocaleDateString("en-CA")}
              required
            />

            <label htmlFor="startTime">Start time</label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />

            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>

            <button type="submit" className="primary-button">
              + Create time slot
            </button>
          </form>
        </aside>
      </section>

      <footer className="footer">
        <span>MeetSlot</span>
        <span>Simple scheduling, made easy.</span>
      </footer>

      {message && (
        <div
          className={`success-message toast-notification ${notificationType === "error" ? "toast-error" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon">
            {notificationType === "error" ? "!" : "✓"}
          </span>
          {message}
        </div>
      )}

      {error && !message && !loading && (
        <div className="success-message toast-notification toast-error" role="alert">
          {error}
        </div>
      )}
    </main>
  );
}

export default App;
