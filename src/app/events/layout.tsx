import type { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "Events | NovaRace",
  description: "Find and register for the best running, cycling, and adventure events across India",
};

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <a href="/" className="font-bold text-2xl text-blue-600">
              NovaRace
            </a>



            {/* Mobile Menu Button (Static in layout) */}
            <button className="md:hidden text-gray-800">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

     
    </div>
  );
}