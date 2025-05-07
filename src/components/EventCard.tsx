
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CategoryBadge from './CategoryBadge';
import type { Event } from '@/hooks/useEvent';

interface EventCardProps {
  event: Event;
  tenantMode?: boolean;
}

const EventCard = ({ event, tenantMode = false }: EventCardProps) => {
  // Determine the link based on whether we're using tenant mode
  const eventLink = tenantMode ? 
    `/${event.slug}` :  // For tenant/subdomain mode
    `/event/${event.id}`; // For regular mode
    
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.coverImage})` }}
      />
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {event.categories.map((category) => (
            <CategoryBadge key={category} name={category} />
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        
        <div className="flex flex-col text-gray-600 gap-2 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{event.date}</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{event.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link to={eventLink}>View Event Site</Link>
        </Button>
        
        {tenantMode && (
          <div className="text-sm text-gray-500 w-full text-center">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {event.slug}.youreventplatform.com
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
