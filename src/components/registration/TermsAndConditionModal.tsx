"use client";

import React from "react";

type TermsAndPolicyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
};

const TermsAndConditionModal: React.FC<TermsAndPolicyModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  if (!isOpen) return null;

  const title = type === "terms" ? "Terms and Conditions" : "Privacy Policy";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {type === "terms" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Participant Responsibilities</h3>
              <p>
                By registering for an event, participants accept full responsibility for their health, safety, and conduct throughout the event. Compliance with all event rules and organizer instructions is mandatory.
              </p>

              <h3 className="text-lg font-semibold">2. Personal Information</h3>
              <p>
                Personal data is collected exclusively for event registration and communication. Information will not be shared or used for other purposes without the participant’s explicit consent.
              </p>

              <h3 className="text-lg font-semibold">3. Liability Waiver</h3>
              <p>
                Participants agree that the event platform is not liable for any injury, loss, or damage during the event. By joining, participants waive claims against the platform and its affiliates.
              </p>

              <h3 className="text-lg font-semibold">4. Registration and Payment</h3>
              <p>
                Registration is only confirmed upon successful payment. Refunds, if applicable, follow the organizer&rsquo;s policy. Payments are processed securely through third-party gateways.
              </p>

              <h3 className="text-lg font-semibold">5. Organizer Responsibility</h3>
              <p>
                The platform only provides registration and promotion support. Event planning, execution, and safety are the sole responsibility of the event organizer.
              </p>

              <h3 className="text-lg font-semibold">6. Event Changes or Cancellation</h3>
              <p>
                The platform may change event details or cancel listings if needed. It is not responsible for participant-incurred costs, such as travel or lodging.
              </p>

              <h3 className="text-lg font-semibold">7. Agreement to Terms</h3>
              <p>
                By registering, participants confirm that they have read, understood, and agreed to these terms. The platform may update the terms at any time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Information Collection</h3>
              <p>
                We collect personal details like name, email, phone number, and emergency contacts during event registration. This information is essential for managing event logistics.
              </p>

              <h3 className="text-lg font-semibold">2. Use of Information</h3>
              <p>
                Collected data is used for communication, event coordination, publishing results, and contacting participants in emergencies. It may also be used to share future event updates.
              </p>

              <h3 className="text-lg font-semibold">3. Information Sharing</h3>
              <p>
                We share necessary information only with service providers supporting the event (e.g., payment processors, timing systems). We do not sell personal data.
              </p>

              <h3 className="text-lg font-semibold">4. Data Security</h3>
              <p>
                Reasonable measures are taken to protect your personal information against unauthorized access or misuse.
              </p>

              <h3 className="text-lg font-semibold">5. Event Results and Media</h3>
              <p>
                Your name, bib number, and results may be publicly displayed. Event photos or videos may be used for promotional purposes. By participating, you consent to this usage.
              </p>

              <h3 className="text-lg font-semibold">6. Your Rights</h3>
              <p>
                You may request access to, correction, or deletion of your data. Consent for promotional use of your information can be withdrawn at any time.
              </p>

              <h3 className="text-lg font-semibold">7. Contact</h3>
              <p>
                For any concerns regarding your personal data or this policy, please contact our support team.
              </p>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionModal;
