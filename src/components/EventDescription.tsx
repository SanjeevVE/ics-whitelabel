
import React from 'react';
import { cn } from "@/lib/utils";

interface EventDescriptionProps {
  content: string;
  className?: string;
}

// This is a simple version. For a production app, you would use a library like react-markdown
// or a rich text renderer from a CMS like Contentful, Sanity, etc.
const EventDescription = ({ content, className }: EventDescriptionProps) => {
  return (
    <div 
      className={cn("prose prose-gray max-w-none", className)} 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

export default EventDescription;
