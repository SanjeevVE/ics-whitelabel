
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { useEvent } from '@/hooks/useEvent';
import MetaTags from '@/components/MetaTags';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const { slug } = useParams<{ slug?: string }>();
  const { currentEvent } = useTenant();
  
  // For legacy routes
  const eventId = searchParams.get('eventId') || '';
  const { event, loading } = useEvent(eventId);
  
  // Use event from tenant context or direct fetch
  const activeEvent = currentEvent || event;
  
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Determine the return URLs based on whether we're in a subdomain context
  const homeUrl = slug ? `/${slug}` : "/";
  const eventUrl = slug ? `/${slug}` : activeEvent ? `/event/${activeEvent.id}` : "/";

  return (
    <>
      <MetaTags
        title="Registration Successful | Your Event Platform"
        description="Thank you for registering for our event. Your registration has been confirmed."
        imageUrl={activeEvent?.coverImage || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
        url={`${activeEvent?.url || ""}/success`}
      />
      
      <div className="min-h-[80vh] flex items-center justify-center bg-primary-50">
        <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Registration Successful!</h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Thank you for registering for {loading && !activeEvent ? 'our event' : activeEvent?.title}. We've sent a confirmation email with all the details.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Check your email inbox for a confirmation message</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Add the event to your calendar</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Follow us on social media for event updates</span>
              </li>
            </ul>
          </div>
          
          <p className="mb-6">Redirecting to homepage in {countdown} seconds...</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={eventUrl}>Back to Event</Link>
            </Button>
            <Button asChild>
              <Link to={homeUrl}>Explore More Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
