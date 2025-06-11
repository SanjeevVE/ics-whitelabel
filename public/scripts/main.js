console.log('Main script loaded successfully');
window.onerror = function(message, source, lineno, colno, error) {
  if (source && (
    source.includes('main.js') || 
    source.includes('search.js') || 
    source.includes('init_embed.js')
  )) {
    console.error('Suppressed external script error:', {
      message,
      source,
      lineno,
      colno,
      error,
    });
    return true; 
  }

  if (typeof originalOnError === 'function') {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

const originalOnError = window.onerror;
