"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { getEventBySlug } from "@/lib/backendApis";

interface Event {
  id: string;
  eventName: string;
  isGroupRegistrations: boolean;
  slug: string;
}

interface Category {
  id: string;
  isRelay: string;
}

const StepperBooking = dynamic(
  () => import("@/components/registration/StepperBooking"),
  { ssr: false }
);
const MultipleBooking = dynamic(
  () => import("@/components/registration/MultipleBooking"),
  { ssr: false }
);

const LoadingComponents = () => {
  return (
    <div className='w-full flex justify-center items-center py-20'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600'></div>
    </div>
  );
};

export default function RegistrationPage() {
  const [event, setEvent] = useState<Event| null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    const fetchEventData = async () => {
      if (!slug) return;
      try {
        setLoading(true);

        const eventSlug = Array.isArray(slug) ? slug[0] : slug;
        const response = await getEventBySlug(eventSlug);
        if (response) {
          setEvent(response.data);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [slug]);

  if (loading) {
    return <LoadingComponents />;
  }
  const shouldShowMultiplebooking =
    event?.isGroupRegistrations || selectedCategory?.isRelay === "YES";
  return (
    <div className='container mx-auto md:px-4 md:py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-center mb-8'>
        {shouldShowMultiplebooking
          ? "Group Registration"
          : "Event Registration"}
      </h1>

      <Suspense fallback={<LoadingComponents />}>
        {shouldShowMultiplebooking ? (
          <MultipleBooking event={event} selectedCategory={selectedCategory} />
        ) : (
          <StepperBooking
            event={event}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
      </Suspense>
    </div>
  );
}
