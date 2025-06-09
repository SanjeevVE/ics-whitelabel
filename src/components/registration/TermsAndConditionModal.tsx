"use client";

import React from "react";

type TermsAndConditionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formik: any;
};

const TermsAndConditionModal: React.FC<TermsAndConditionModalProps> = ({
  isOpen,
  onClose,
  formik,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Terms and Conditions</h2>
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

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <h3 className="text-lg font-semibold">1. Participant Responsibilities</h3>
          <p>
            I declare that I am not suffering from any health condition, and I am physically and psychologically well prepared to participate in this run. I do not have any cardiorespiratory disease, physical defect, or injury, which would discourage my participation. I am participating voluntarily and under my own responsibility. Consequently, I exonerate the organizers, collaborators, sponsors, and any other participants of any liabilities for any physical or material damage that occurs to me during the event.
          </p>

          <h3 className="text-lg font-semibold">2. Personal Information</h3>
          <p>
            Personal data is collected exclusively for event registration and communication. Information will not be shared or used for other purposes without the participant’s explicit consent.
          </p>

          <h3 className="text-lg font-semibold">3. Liability Waiver</h3>
          <p>
            Participants agree that the event platform is not liable for any injury, loss, or damage during the event. By joining, participants waive claims against the platform and its affiliates.
          </p>

          <h3 className="text-lg font-semibold">4. Organizer Responsibility</h3>
          <p>
            The platform only provides registration and promotion support. Event planning, execution, and safety are the sole responsibility of the event organizer.
          </p>

          <h3 className="text-lg font-semibold">5. Event Changes or Cancellation</h3>
          <p>
            The platform may change event details or cancel listings if needed. It is not responsible for participant-incurred costs, such as travel or lodging.
          </p>

          <h3 className="text-lg font-semibold">6. Insurance Liability</h3>
          <p>
            SAP is organizing the event/run solely in the capacity of a facilitator. SAP shall not be held liable for procuring or maintaining any form of insurance coverage on behalf of any participant or runner. Each participant is individually responsible for securing their own insurance, whether health, accident, or liability, as deemed necessary for their participation in the event.
            <br /><br />
            By choosing to participate in the event/run, all participants expressly waive any and all claims against SAP, its employees, partners, and the general public for any injury, accident, loss, or damage that may arise during the course of the event.
            <br /><br />
            Furthermore, participant(s) acknowledge that they are physically fit and capable of participating in the event and voluntarily assume full responsibility for any risks associated with their participation.
          </p>


          <h3 className="text-lg font-semibold">7. Agreement to Terms</h3>
          <p>
            By registering, participants confirm that they have read, understood, and agreed to these terms. The platform may update the terms at any time.
          </p>
        </div>

        <div className="px-6 py-4 border-t flex items-start gap-2">
          <input
            type="checkbox"
            id="termsAndConditions"
            name="termsAndConditions"
            checked={formik.values.termsAndConditions}
            onChange={formik.handleChange}
            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              formik.touched.termsAndConditions && formik.errors.termsAndConditions
                ? "border-red-500"
                : ""
            }`}
          />
          <label htmlFor="termsAndConditions" className="text-sm text-gray-700">
            I have read and agree to the Terms and Conditions
          </label>
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionModal;
