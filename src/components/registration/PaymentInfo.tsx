"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/lib/apiConfig";

interface Category {
  id: string;
  name: string;
  amount: number;
}

interface Event {
  id: string;
  slug: string;
  category: Category[];
  emailBanner?: string;
}

interface Coupon {
  couponCode: string;
  discountAmount?: number;
  discountPercentage?: number;
}

interface FormValues {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  state: string;
  country: string;
  pincode: string;
  categoryName: string;
  key_id: string;
  amount: number;
  paymentOrderId: string;
  eventName: string;
  category: string;
  thumbnail: string;
  membershipId?: string;
  couponCode?: string;
  payableAmount: number;
  applicationFee: number;
  platformFee: number;
  gst: number;
  gstOnPlatformCharges?: number;
}

interface PaymentInfoProps {
  payAmount: number;
  formValues: FormValues;
  event: Event;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  payAmount,
  formValues,
  event,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const findCategory = event?.category?.find(
    (item) => item?.name === formValues?.categoryName
  );

  const currday = new Date();
  const orderId = currday.getTime().toString();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setToastVariant("danger");
      setToastMessage(
        "Failed to load payment gateway. Please refresh the page and try again."
      );
      setShowToast(true);
    };

    document.body.appendChild(script);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("orderId", orderId);
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [orderId]);

  const sendNotifications = async () => {
    try {
      const runnerId = formValues?.id;

      const response = await axios.post(
        `${baseUrl}users/sendnotifications`,
        null,
        {
          params: {
            runnerId: runnerId,
            eventId: event?.id,
          },
        }
      );

      if (response.status === 200) {
        const successUserId = formValues?.id;
        window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${successUserId}`;
        console.log("Notifications sent successfully:", response.data);
      } else {
        console.warn("Failed to send notifications:", response.data);
        setToastVariant("danger");
        setToastMessage("Failed to complete registration. Please try again.");
        setShowToast(true);
      }
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (typeof error === "object" && error !== null) {
        if ("response" in error && typeof (error as any).response === "object" && (error as any).response !== null) {
          errorMessage = (error as any).response?.data?.error || errorMessage;
        } else if ("message" in error) {
          errorMessage = (error as any).message || errorMessage;
        }
      }
      console.error("Error sending notifications:", errorMessage);
      setToastVariant("danger");
      setToastMessage(errorMessage);
      setShowToast(true);
    }
  };

  const launchPayment = (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      !scriptLoaded ||
      typeof window === "undefined" ||
      !(window as any).Razorpay
    ) {
      console.error("Razorpay not loaded");
      setToastVariant("danger");
      setToastMessage(
        "Payment gateway not available. Please refresh the page."
      );
      setShowToast(true);
      return;
    }

    try {
      const options = {
        key: formValues.key_id,
        amount: formValues.amount,
        currency: "INR",
        name: formValues.eventName,
        description: formValues.category,
        image: formValues.thumbnail,
        order_id: formValues.paymentOrderId,
        prefill: {
          name: `${formValues.firstName} ${formValues.lastName}`,
          email: formValues.email,
          contact: formValues.mobileNumber,
        },
        notes: {
          address: `${formValues.address}, ${formValues.state}, ${formValues.country}, ${formValues.pincode}`,
        },
        theme: {
          color: "#3399cc",
        },
        handler: function (response: any) {
          console.log("Payment successful, response:", response);
          setShowToast(true);
          setToastVariant("success");
          setToastMessage("Payment successful...");

          const successUserId = formValues?.id;
          window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${successUserId}`;
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setToastVariant("danger");
        setToastMessage(`Payment failed: ${response.error.description}`);
        setShowToast(true);
      });

      razorpay.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      setToastVariant("danger");
      setToastMessage("Failed to initialize payment. Please try again.");
      setShowToast(true);
    }
  };

  const calculateDiscount = () => {
    if (!formValues?.couponCode) return 0;

    return (
      Math.round(
        (Number(findCategory?.amount || 0) +
          Number(formValues?.applicationFee || 0) +
          Number(formValues?.gstOnPlatformCharges || 0) -
          Number(formValues?.amount || 0)) *
          100
      ) / 100
    ).toFixed(2);
  };

  return (
    <div className='container mx-auto text-center mt-8'>
      <div className='flex justify-center'>
        <div className='w-full md:w-2/3 lg:w-1/2 px-4'>
          <h3 className='text-2xl font-semibold mb-6'>Order Preview</h3>

          <div className='overflow-x-auto shadow-lg rounded-lg'>
            <table className='min-w-full table-auto border-collapse'>
              <tbody className='divide-y divide-gray-200'>
                <tr className='bg-gray-50'>
                  <th className='p-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap'>
                    Ticket Price
                  </th>
                  <td className='p-3 text-right font-semibold text-gray-900'>
                    ₹ {findCategory?.amount}
                  </td>
                </tr>

                {formValues?.membershipId && (
                  <tr className='bg-white'>
                    <th className='p-3 text-left text-sm font-medium text-gray-700'>
                      Membership Id:
                    </th>
                    <td className='p-3 text-right font-semibold'>
                      {formValues?.membershipId}
                    </td>
                  </tr>
                )}

                {formValues?.couponCode && (
                  <>
                    <tr className='bg-gray-50'>
                      <th className='p-3 text-left text-sm font-medium text-gray-700'>
                        Coupon Code Applied:
                      </th>
                      <td className='p-3 text-right font-semibold'>
                        {formValues?.couponCode}
                      </td>
                    </tr>
                    <tr className='bg-white'>
                      <th className='p-3 text-left text-sm font-medium text-gray-700'>
                        Discount:
                      </th>
                      <td className='p-3 text-right font-semibold'>
                        ₹ {calculateDiscount()}
                      </td>
                    </tr>
                  </>
                )}

                {formValues?.applicationFee > 0 && (
                  <>
                    <tr className='bg-gray-50'>
                      <th className='p-3 text-left text-sm font-medium text-gray-700'>
                        Platform Charges:
                      </th>
                      <td className='p-3 text-right font-semibold'>
                        ₹ {formValues?.applicationFee}
                      </td>
                    </tr>
                    <tr className='bg-white'>
                      <th className='p-3 text-left text-sm font-medium text-gray-700'>
                        GST On Platform Charges:
                      </th>
                      <td className='p-3 text-right font-semibold'>
                        ₹ {((formValues?.applicationFee * 18) / 100).toFixed(2)}
                      </td>
                    </tr>
                  </>
                )}

                <tr className='bg-gray-50'>
                  <th className='p-3 text-left text-sm font-medium text-gray-700'>
                    Payment Gateway Charges (2%):
                  </th>
                  <td className='p-3 text-right font-semibold'>
                    ₹ {formValues?.platformFee}
                  </td>
                </tr>

                <tr className='bg-white'>
                  <th className='p-3 text-left text-sm font-medium text-gray-700'>
                    GST On Payment Gateway Charges:
                  </th>
                  <td className='p-3 text-right font-semibold'>
                    ₹ {formValues?.gst}
                  </td>
                </tr>

                <tr className='bg-gray-100 border-t-2 border-gray-400'>
                  <th className='p-3 text-left text-sm font-bold text-gray-800'>
                    Estimated Total Payable*:
                  </th>
                  <td className='p-3 text-right font-bold text-green-600'>
                    ₹ {formValues?.payableAmount}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className='p-4 text-center'>
                    <button
                      className='px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors'
                      onClick={(e) => {
                        if (formValues.payableAmount === 0) {
                          sendNotifications();
                        } else {
                          launchPayment(e);
                        }
                      }}
                      disabled={formValues.payableAmount > 0 && !scriptLoaded}
                    >
                      {formValues.payableAmount === 0 ||
                      formValues.payableAmount === null
                        ? "Complete Registration"
                        : "Proceed to Pay"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className='p-3 text-xs text-red-600'>
              * Please note: This is a preliminary total. Your payment gateway
              may calculate processing fees slightly differently at checkout.
              The exact amount will be displayed before you confirm payment.
            </div>
          </div>

          {showToast && (
            <div
              className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
                toastVariant === "success"
                  ? "bg-green-100 text-green-800 border border-green-400"
                  : "bg-red-100 text-red-800 border border-red-400"
              }`}
              role='alert'
            >
              <div className='flex items-center justify-between'>
                <strong className='text-sm font-medium'>Registration</strong>
                <button
                  onClick={() => setShowToast(false)}
                  className='text-gray-500 hover:text-gray-700 focus:outline-none'
                  aria-label='Close'
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <div className='mt-2 text-sm'>{toastMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
