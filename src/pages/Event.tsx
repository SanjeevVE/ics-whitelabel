
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvent';
import MetaTags from '@/components/MetaTags';
import EventHeader from '@/components/EventHeader';
import EventDescription from '@/components/EventDescription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Event = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useEvent(id || '');
  
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
  
  if (error || !event) {
    return <div className="container mx-auto px-4 py-8 text-center">Error loading event: {error?.message || 'Event not found'}</div>;
  }

  return (
    <>
      <MetaTags
        title={`${event.title} | Your Event Platform`}
        description={`Register now for ${event.title} happening on ${event.date} at ${event.location}.`}
        imageUrl={event.coverImage}
        url={event.url}
      />
      
      <EventHeader
        title={event.title}
        coverImage={event.coverImage}
        categories={event.categories}
        date={event.date}
        location={event.location}
      />
      
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <EventDescription content={event.description} className="mb-8" />
        </div>
        
        <div className="lg:w-1/3">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Event Details</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium text-gray-700">Date & Time</p>
                  <p>{event.date}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700">Location</p>
                  <p>{event.location}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700">Categories</p>
                  <p>{event.categories.join(', ')}</p>
                </div>
              </div>
              
              <Button asChild className="w-full">
                <Link to={`/registration/${event.id}`}>Register Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Event;
