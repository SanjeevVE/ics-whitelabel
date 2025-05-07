
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { useEvent } from '@/hooks/useEvent';
import MetaTags from '@/components/MetaTags';
import RegistrationForm from '@/components/RegistrationForm';
import { Button } from '@/components/ui/button';

const Registration = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const { currentEvent } = useTenant();
  
  // If we're accessing through the legacy route (/registration/:id)
  const eventId = id || '';
  const { event, loading, error } = useEvent(eventId);
  
  // Determine which event to use - from tenant context or direct fetch
  const activeEvent = currentEvent || event;
  const isLoading = loading && !currentEvent;
  const activeError = error && !currentEvent;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-2xl mx-auto">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/2"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (activeError || !activeEvent) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="mb-4">Error loading event: {error?.message || 'Event not found'}</p>
        <Button asChild>
          <Link to="/">Return to Events</Link>
        </Button>
      </div>
    );
  }

  const backUrl = slug ? `/${slug}` : `/event/${activeEvent.id}`;

  return (
    <>
      <MetaTags
        title={`Register for ${activeEvent.title} | Your Event Platform`}
        description={`Complete your registration for ${activeEvent.title} happening on ${activeEvent.date}.`}
        imageUrl={activeEvent.coverImage}
        url={`${activeEvent.url}/registration`}
      />
      
      <div className="bg-primary-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link to={backUrl}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Event
              </Link>
            </Button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Register for {activeEvent.title}</h1>
          <p className="text-gray-600 mb-8">{activeEvent.date} • {activeEvent.location}</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <RegistrationForm eventId={activeEvent.id} />
      </div>
    </>
  );
};

export default Registration;
