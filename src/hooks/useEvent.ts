
import { useState, useEffect } from "react";

export const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventSlug) return;
        // Replace with your actual API call
        const response = await fetch(`/api/events/${eventSlug}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  return { event, isLoading };
};