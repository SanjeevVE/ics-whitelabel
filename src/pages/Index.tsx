
import React from 'react';
import { useEvents } from '@/hooks/useEvent';
import MetaTags from '@/components/MetaTags';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { events, loading, error } = useEvents();
  
  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center">Error loading events: {error.message}</div>;
  }

  return (
    <>
      <MetaTags
        title="Upcoming Events | Your Event Platform"
        description="Discover and register for the best upcoming events in your area."
        imageUrl="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
        url="https://youreventplatform.com"
      />
      
      <div className="bg-gradient-to-b from-primary-100 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Find and register for the most exciting events happening in your area. Connect with people who share your interests.
          </p>
          <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700">
            <Link to={loading ? "#" : `/event/${events[0]?.id || ''}`}>
              Browse Featured Event
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Upcoming Events</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
