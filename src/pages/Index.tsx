
import React from 'react';
import { useEvents } from '@/hooks/useEvent';
import MetaTags from '@/components/MetaTags';
import EventCard from '@/components/EventCard';

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Multi-Tenant Event Platform</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Discover amazing events, each with their own dedicated event site. Create and manage events with your own custom subdomain.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Events</h2>
        
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
              <EventCard 
                key={event.id} 
                event={event} 
                tenantMode={true}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Create Your Own Event Website</h2>
            <p className="text-lg text-gray-700 mb-8">
              Want to host your own event? Our platform makes it easy to create a dedicated event website with your own custom subdomain.
            </p>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
