'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Medal,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { pacers } from './data';

const raceDetails = [
  {
    title: '10 KM Run',
    reportingTime: '5:00 AM',
    startTime: '5:45 AM',
    distance: '10K',
    participants: '2,500+',
  },
  {
    title: '5 KM Run',
    reportingTime: '5:15 AM',
    startTime: '6:00 AM',
    distance: '5K',
    participants: '1,800+',
  },
  {
    title: '3 KM Fun Run',
    reportingTime: '5:30 AM',
    startTime: '6:15 AM',
    distance: '3K',
    participants: '1,200+',
  },
];

const map = {
  title: 'Complete Route Overview',
  description: 'Full course map showing all race distances and key landmarks',
  pdfPath: '/img/ics/SAP ROUTE MAPS 2025.pdf',
};
export default function RaceDayInfo() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      {/* Meta Data Layout Component */}
      <head>
        <title>
          SAP RUN 2025 - Race Day Information | Official Event Guide
        </title>
        <meta
          name='description'
          content='Complete race day information for SAP RUN 2025. Get route maps, start times, pacer details, and essential race day guidelines for 3K, 5K, and 10K runs.'
        />
        <meta
          name='keywords'
          content='SAP RUN 2025, race day info, running event, 5K 10K race, marathon pacers, race route map'
        />
        <meta
          property='og:title'
          content='SAP RUN 2025 - Race Day Information'
        />
        <meta
          property='og:description'
          content='Everything you need for race day success at SAP RUN 2025'
        />
        <meta property='og:type' content='website' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>

      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50'>
        {/* Hero Section */}
        <div className='relative bg-gradient-to-r from-blue-600 to-green-600 text-white overflow-hidden'>
          <div className='absolute inset-0 bg-black opacity-20'></div>
          <div className='relative container mx-auto px-6 py-20'>
            <div className='text-center max-w-4xl mx-auto'>
              <h1 className='text-5xl md:text-6xl font-bold mb-6'>
                SAP RUN 2025
              </h1>
              <p className='text-xl md:text-2xl mb-8 text-blue-100'>
                Race Day Information & Essential Guidelines
              </p>
              <div className='flex flex-wrap justify-center gap-4 text-sm'>
                <div className='flex items-center bg-white/20 px-4 py-2 rounded-full'>
                  <Calendar className='w-4 h-4 mr-2' />
                  August 3rd, 2025
                </div>
                <div className='flex items-center bg-white/20 px-4 py-2 rounded-full'>
                  <MapPin className='w-4 h-4 mr-2' />
                  KPTO, WhiteField, Bengaluru
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='container mx-auto px-6 py-12 space-y-16'>
          {/* Race Schedule */}
          <section className='bg-white rounded-2xl shadow-lg p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                Race Schedule & Timings
              </h2>
              <p className='text-gray-600'>
                Plan your race day with our detailed timing schedule
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {raceDetails.map((race, index) => (
                <div
                  key={index}
                  className='bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-gray-100'
                >
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-xl font-bold text-gray-800'>
                      {race.title}
                    </h3>
                    <Medal className='w-6 h-6 text-green-600' />
                  </div>

                  <div className='space-y-3'>
                    <div className='flex items-center text-gray-700'>
                      <Clock className='w-4 h-4 mr-3 text-blue-600' />
                      <span className='text-sm'>
                        Reporting: <strong>{race.reportingTime}</strong>
                      </span>
                    </div>
                    <div className='flex items-center text-gray-700'>
                      <Clock className='w-4 h-4 mr-3 text-green-600' />
                      <span className='text-sm'>
                        Start Time: <strong>{race.startTime}</strong>
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 pt-4 border-t border-gray-200'>
                    <span className='inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold'>
                      {race.distance} Distance
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='bg-white rounded-2xl shadow-lg overflow-hidden'>
            <div className='p-8'>
              <h2 className='text-3xl font-bold text-gray-800 mb-4 text-center'>
                Interactive Route Maps
              </h2>
              <p className='text-gray-600 text-center mb-8'>
                Explore detailed course maps and key information
              </p>
            </div>

            {/* Map Display */}
            <div className='px-4 pb-8'>
              <div className='relative bg-gray-50 rounded-xl overflow-hidden'>
                <div className='bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                  {/* Desktop View - Embedded Map */}
                  <div className='hidden sm:block w-full h-[60vh] sm:h-[70vh] md:aspect-video border border-gray-300 rounded-lg shadow-lg overflow-hidden'>
                    <iframe
                      src={map.pdfPath}
                      title='Route Map PDF'
                      className='w-full h-full'
                      loading='lazy'
                    />
                  </div>

                  {/* Mobile View - Button to Open PDF */}
                  <div className='block sm:hidden text-center py-8'>
                    <p className='text-gray-700 mb-4'>
                      Tap below to view the route map:
                    </p>
                    <a
                      href={map.pdfPath}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition'
                    >
                      Open Route Map
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Information */}
            <div className='px-4 pb-12 space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Course Highlights */}
                <div className='bg-blue-50 rounded-xl p-6'>
                  <h4 className='font-semibold text-gray-800 mb-3 flex items-center'>
                    <Info className='w-5 h-5 mr-2 text-blue-600' />
                    Course Highlights
                  </h4>
                  <ul className='space-y-2 text-sm text-gray-700'>
                    <li>• Scenic route through KPTO and surroundings</li>
                    <li>• 6 hydration stations placed every 1.5–2km</li>
                    <li>• Medical support at km 3, 5, 7, and finish line</li>
                    <li>• Cheering zones with live music and entertainment</li>
                    <li>• Photo opportunities at landmark points</li>
                  </ul>
                </div>

                {/* Course Conditions */}
                <div className='bg-green-50 rounded-xl p-6'>
                  <h4 className='font-semibold text-gray-800 mb-3'>
                    Course Conditions
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-600'>Surface:</span>
                      <p className='font-medium'>Paved roads & paths</p>
                    </div>
                    <div>
                      <span className='text-gray-600'>Weather:</span>
                      <p className='font-medium'>Cool morning start</p>
                    </div>
                    <div>
                      <span className='text-gray-600'>Difficulty:</span>
                      <p className='font-medium'>Beginner friendly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className='text-center pt-6'>
                <a
                  href={map.pdfPath}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <MapPin className='w-4 h-4 mr-2' />
                  Download Full Route Map (PDF)
                </a>
              </div>
            </div>
          </section>

          {/* Bib Collection */}
          <section className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8'>
            <div className='text-center max-w-3xl mx-auto'>
              <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                Bib Collection & Race Expo
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                <div className='bg-white rounded-xl p-6 shadow-sm'>
                  <Calendar className='w-8 h-8 text-purple-600 mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    Collection Dates
                  </h3>
                  <p className='text-gray-600'>August 1 & 2, 2025</p>
                  <p className='text-sm text-gray-500 mt-2'>
                    Two full days to collect at your convenience
                  </p>
                </div>

                <div className='bg-white rounded-xl p-6 shadow-sm'>
                  <Clock className='w-8 h-8 text-purple-600 mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>
                    Collection Hours
                  </h3>
                  <p className='text-gray-600'>10:00 AM - 6:00 PM</p>
                  <p className='text-sm text-gray-500 mt-2'>
                    Extended hours both days
                  </p>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>What to Bring</h3>
                <div className='flex flex-wrap justify-center gap-4'>
                  <span className='bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm'>
                    Registration Confirmation
                  </span>
                  <span className='bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm'>
                    Valid ID Proof
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
                Meet Our Professional Pacers
              </h2>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                Join our experienced pacers to achieve your target time. Each
                pacer brings unique strategies and years of running experience
                to help you succeed.
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {pacers.map((pacer) => (
                <div
                  key={pacer.number}
                  className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow flex flex-col items-center'
                >
                  {/* Pacer Image */}
                  <div className='w-full flex justify-center mb-2'>
                    <img
                      src={`/img/pacer/${pacer.image}`}
                      alt={pacer.name}
                      className='w-full max-w-[450px] h-auto object-cover border-2 border-white shadow-md rounded-lg'
                    />
                  </div>

                  {/* Pacer Info */}
                  <div className='bg-white rounded-lg p-4 w-full text-center'>
                    <p className='text-xs text-gray-700 italic leading-relaxed'>
                      &quot;{pacer.strategy}&quot;
                    </p>
                  </div>

                  {/* Pacer Tag */}
                  <div className='mt-4 text-center'>
                    <span className='inline-block mt-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full'>
                      10K Specialist
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Information */}
          <section className='bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                Important Race Day Guidelines
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='bg-white rounded-xl p-6'>
                <h3 className='font-semibold text-gray-800 mb-3'>
                  Pre-Race Preparation
                </h3>
                <ul className='text-sm text-gray-600 space-y-2'>
                  <li>• Arrive 45-60 minutes before your race start</li>
                  <li>• Warm up in designated areas</li>
                  <li>• Use restroom facilities early</li>
                  <li>• Stay hydrated but don&apos;t overdrink</li>
                </ul>
              </div>

              <div className='bg-white rounded-xl p-6'>
                <h3 className='font-semibold text-gray-800 mb-3'>
                  During the Race
                </h3>
                <ul className='text-sm text-gray-600 space-y-2'>
                  <li>• Follow pacer guidance and race marshals</li>
                  <li>• Utilize hydration stations properly</li>
                  <li>• Maintain your planned pace strategy</li>
                  <li>• Signal for medical help if needed</li>
                </ul>
              </div>

              <div className='bg-white rounded-xl p-6'>
                <h3 className='font-semibold text-gray-800 mb-3'>Post-Race</h3>
                <ul className='text-sm text-gray-600 space-y-2'>
                  <li>• Collect your medal and finisher items</li>
                  <li>• Cool down in recovery areas</li>
                  <li>• Enjoy post-race refreshments</li>
                  <li>• Share your achievement on social media</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
