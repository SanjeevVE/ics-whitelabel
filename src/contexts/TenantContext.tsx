
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEvents, Event } from '@/hooks/useEvent';

interface TenantContextType {
  currentTenant: string | null;
  currentEvent: Event | null;
  loading: boolean;
  error: Error | null;
}

const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  currentEvent: null,
  loading: true,
  error: null
});

export const useTenant = () => useContext(TenantContext);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const { events, loading, error } = useEvents();

  useEffect(() => {
    // Extract subdomain from hostname
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname.includes('127.0.0.1');
    
    let subdomain = null;
    if (isLocalhost) {
      // For local development, use the first part of the pathname as the tenant identifier
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1 && pathParts[1]) {
        subdomain = pathParts[1];
      }
    } else {
      // In production, extract the subdomain from the hostname
      const hostParts = hostname.split('.');
      if (hostParts.length > 2) {
        subdomain = hostParts[0];
      }
    }
    
    setCurrentTenant(subdomain);
    
    // Once events are loaded, find the matching event
    if (!loading && events.length > 0 && subdomain) {
      const matchedEvent = events.find(event => event.slug === subdomain);
      setCurrentEvent(matchedEvent || null);
    }
  }, [loading, events]);

  return (
    <TenantContext.Provider value={{ 
      currentTenant, 
      currentEvent,
      loading, 
      error 
    }}>
      {children}
    </TenantContext.Provider>
  );
};
