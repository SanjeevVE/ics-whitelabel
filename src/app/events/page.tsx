"use client";

import { useState, useEffect } from "react";
import EventList from "@/components/events/EventList";
import Loader from "@/components/common/Loader";
import { fetchEvents } from "@/lib/backendApis";
import { Event } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAllEvents = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await fetchEvents({
        showOnWebsite: true,
      });

      setEvents(response.data || []);
    } catch (error: any) {
      setError(error.message || "Failed to fetch events");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  return (
    <section className='py-12 px-4'>
      <div className='container mx-auto'>
        <div className='mb-12 text-center'>
          <h1 className='text-3xl md:text-4xl font-bold mb-4'>
            Upcoming Race Events
          </h1>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Find your next adventure with NovaRace! Browse and register for
            marathons, cycling, and other events in India. Get ready to push
            your limits!
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className='text-center text-red-500 p-6 bg-red-50 rounded-lg'>
            <p>{error}</p>
            <button
              onClick={getAllEvents}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Try Again
            </button>
          </div>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </section>
  );
}
