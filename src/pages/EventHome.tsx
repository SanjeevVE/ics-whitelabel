
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import MetaTags from '@/components/MetaTags';
import EventHeader from '@/components/EventHeader';
import EventDescription from '@/components/EventDescription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const EventHome = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentEvent, loading, error } = useTenant();
  
  // If we're on a subdomain but there's no matching event, show error
  if (!loading && !currentEvent && slug) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">Event not found: {error?.message || 'This event doesn\'t exist'}</p>
        <Button asChild>
          <a href="/">Return to Platform Home</a>
        </Button>
      </div>
    );
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 aspect-[16/9] w-full rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentEvent) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <MetaTags
        title={`${currentEvent.title} | Your Event Platform`}
        description={`Register now for ${currentEvent.title} happening on ${currentEvent.date} at ${currentEvent.location}.`}
        imageUrl={currentEvent.coverImage}
        url={currentEvent.url}
      />
      
      <EventHeader
        title={currentEvent.title}
        coverImage={currentEvent.coverImage}
        categories={currentEvent.categories}
        date={currentEvent.date}
        location={currentEvent.location}
      />
      
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <EventDescription content={currentEvent.description} className="mb-8" />
        </div>
        
        <div className="lg:w-1/3">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Event Details</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium text-gray-700">Date & Time</p>
                  <p>{currentEvent.date}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700">Location</p>
                  <p>{currentEvent.location}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700">Categories</p>
                  <p>{currentEvent.categories.join(', ')}</p>
                </div>
              </div>
              
              <Button asChild className="w-full">
                <a href={`/${currentEvent.slug}/registration`}>Register Now</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EventHome;
