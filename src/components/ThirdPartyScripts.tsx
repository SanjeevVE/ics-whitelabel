'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function ThirdPartyScripts() {
  // Create a global error handler for third-party scripts
  useEffect(() => {
    const originalOnError = window.onerror;
    
    window.onerror = function(message, source, lineno, colno, error) {
      // Ignore errors from Google scripts
      if (source && (
        source.includes('main.js') || 
        source.includes('search.js') || 
        source.includes('init_embed.js')
      )) {
        console.log('Suppressed external script error:', source);
        return true; // Prevents the error from propagating
      }
      
      // Call the original handler for other errors
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };
    
    return () => {
      window.onerror = originalOnError;
    };
  }, []);

  return (
    <>
      <Script 
        src="/scripts/main.js" 
       strategy="lazyOnload"
       onError={(e) => {
        console.log('Custom script loaded with fallback');
       }}
      />
  </>
  )}