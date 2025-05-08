"use client";
import RegistrationForm from "@/components/registration/RegistrationForm";
import StepperBooking from "@/components/registration/StepperBooking";

export default function RegistrationPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Race Registration</h1>
      <StepperBooking />
      <RegistrationForm />
    </div>
  );
}
