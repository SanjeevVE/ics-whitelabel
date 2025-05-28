"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const StepperBooking = dynamic(
  () => import("@/components/registration/StepperBooking"),
  { ssr: false }
);

const LoadingComponent = () => (
  <div className='w-full flex justify-center items-center py-20'>
    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
  </div>
);

export default function RegisterPage() {
  return (
    <div className='container mx-auto md:px-4 md:py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-center mb-8'>
        Event Registration
      </h1>

      <Suspense fallback={<LoadingComponent />}>
        <StepperBooking />
      </Suspense>
    </div>
  );
}
