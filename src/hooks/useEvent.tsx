
import { useState, useEffect } from 'react';

// Mock data - in a real app, you would fetch this from your API/database
export const MOCK_EVENT = {
  id: 'event-1',
  title: 'Tech Conference 2025',
  coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  description: `
    <h2>Join us for the most exciting tech event of the year!</h2>
    <p>Our annual Tech Conference brings together the brightest minds in the industry to share knowledge, explore new technologies, and build connections.</p>
    
    <h3>What to expect:</h3>
    <ul>
      <li>Inspiring keynote speakers from leading tech companies</li>
      <li>Hands-on workshops on cutting-edge technologies</li>
      <li>Networking opportunities with industry professionals</li>
      <li>Product exhibitions from innovative startups</li>
    </ul>
    
    <h3>Schedule</h3>
    <p>The conference will run for three days:</p>
    <ul>
      <li><strong>Day 1:</strong> Opening keynote, panel discussions, welcome reception</li>
      <li><strong>Day 2:</strong> Technical workshops, breakout sessions, conference dinner</li>
      <li><strong>Day 3:</strong> Startup showcase, closing keynote, networking event</li>
    </ul>
    
    <p>Don't miss this opportunity to be part of the tech community's premier event!</p>
    
    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="People at conference" />
    
    <h3>Venue Information</h3>
    <p>The conference will be held at the Grand Tech Center, located in downtown with easy access to public transportation and hotels.</p>
  `,
  date: 'May 15-17, 2025',
  location: 'Grand Tech Center, San Francisco',
  categories: ['Technology', 'Conference', 'Networking'],
  url: 'https://example.com/events/tech-conference-2025'
};

export interface Event {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  date: string;
  location: string;
  categories: string[];
  url: string;
}

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API/database
        // const response = await fetch(`/api/events/${eventId}`);
        // const data = await response.json();
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setEvent(MOCK_EVENT);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
}

// This hook would be used to fetch multiple events in a real app
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API/database
        // const response = await fetch('/api/events');
        // const data = await response.json();
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setEvents([MOCK_EVENT]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
