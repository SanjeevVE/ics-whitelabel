
import React from 'react';
import { cn } from "@/lib/utils";
import CategoryBadge from './CategoryBadge';

interface EventHeaderProps {
  title: string;
  coverImage: string;
  categories: string[];
  date: string;
  location: string;
}

const EventHeader = ({ 
  title, 
  coverImage, 
  categories, 
  date,
  location
}: EventHeaderProps) => {
  return (
    <div className="w-full relative mb-8">
      <div 
        className="w-full aspect-[16/9] bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative -mt-32 z-10 pb-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <CategoryBadge key={category} name={category} />
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
          
          <div className="flex flex-col md:flex-row md:items-center text-gray-600 gap-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{date}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
