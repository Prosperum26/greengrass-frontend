import React from "react";
import { EventCard } from "./EventCard";
import { eventsApi } from "../../../api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data } = await eventsApi.getAll({ page: 1, limit: 30 });
        setEvents(data?.data?.items || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    void loadEvents();
  }, []);

  const onRegister = async (eventId) => {
    try {
      await eventsApi.register(eventId);
      alert("Registered successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-display">Discover Events</h1>
          <p className="mt-2 text-ink/60">Find campus impact actions you can join today.</p>
        </div>
        <span className="text-sm font-bold text-ink/50">Sort: Recently Added</span>
      </div>

      {loading && <p className="text-ink/60">Loading events...</p>}
      {error && <p className="text-accent-hover">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegister}
            onDetail={(id) => navigate(`/events/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;