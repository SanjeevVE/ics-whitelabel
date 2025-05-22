'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/lib/apiConfig';
import { FormValues } from './StepperBooking';

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
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const findCategory = event?.category?.find(
    (item) => item?.name === formValues?.categoryName
  );

  const currday = new Date();
  const orderId = currday.getTime().toString();

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^(\+91|91)?/, '');
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(cleanPhone);
  };

  const formatPhoneForWhatsApp = (phone: string): string => {
    let cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      console.error('Invalid phone number format:', phone);
      return phone;
    }

    return cleanPhone;
  };

  const formatPhoneForRazorpay = (phone: string): string => {
    let cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('91') && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.substring(2);
    }

    if (/^[6-9]\d{9}$/.test(cleanPhone)) {
      return `+91${cleanPhone}`;
    }

    return phone;
  };

  const validateFormData = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    const phoneNumber = formValues.mobileNumber || '';
    if (!phoneNumber) {
      errors.push('Phone number is required');
    } else if (!validatePhoneNumber(phoneNumber)) {
      errors.push(
        'Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)'
      );
    }

    if (!formValues.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!formValues.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!formValues.email?.trim()) {
      errors.push('Email is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setToastVariant('danger');
      setToastMessage(
        'Failed to load payment gateway. Please refresh the page and try again.'
      );
      setShowToast(true);
    };

    document.body.appendChild(script);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('orderId', orderId);
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderId]);

  const sendNotifications = async () => {
    if (isProcessing) return;

    const validation = validateFormData();
    if (!validation.isValid) {
      setToastVariant('danger');
      setToastMessage(
        `Please fix the following errors: ${validation.errors.join(', ')}`
      );
      setShowToast(true);
      return;
    }

    setIsProcessing(true);

    try {
      const runnerId = formValues?.id;

      const response = await axios.post(
        `${baseUrl}/users/sendnotifications`,
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
        console.log('Notifications sent successfully:', response.data);
        setToastVariant('success');
        setToastMessage('Registration completed successfully!');
        setShowToast(true);

        setTimeout(() => {
          window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${successUserId}`;
        }, 1500);
      } else {
        console.warn('Failed to send notifications:', response.data);
        setToastVariant('danger');
        setToastMessage('Failed to complete registration. Please try again.');
        setShowToast(true);
      }
    } catch (error: any) {
      console.error(
        'Error sending notifications:',
        error.response?.data?.error || error.message
      );

      let errorMessage = 'An error occurred. Please try again.';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setToastVariant('danger');
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const launchPayment = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isProcessing) return;

    const validation = validateFormData();
    if (!validation.isValid) {
      setToastVariant('danger');
      setToastMessage(
        `Please fix the following errors: ${validation.errors.join(', ')}`
      );
      setShowToast(true);
      return;
    }

    if (
      !scriptLoaded ||
      typeof window === 'undefined' ||
      !(window as any).Razorpay
    ) {
      console.error('Razorpay not loaded');
      setToastVariant('danger');
      setToastMessage(
        'Payment gateway not available. Please refresh the page.'
      );
      setShowToast(true);
      return;
    }

    setIsProcessing(true);

    try {
      const phoneNumber = formValues.mobileNumber || '';
      const formattedPhone = formatPhoneForRazorpay(phoneNumber);

      const options = {
        key: formValues.key_id,
        amount: formValues.amount,
        currency: 'INR',
        name: formValues.eventName,
        description: formValues.categoryName,
        image: formValues.thumbnail,
        order_id: formValues.paymentOrderId,
        prefill: {
          name: `${formValues.firstName} ${formValues.lastName}`,
          email: formValues.email,
          contact: formattedPhone,
        },
        notes: {
          address: `${formValues.address}, ${formValues.state}, ${formValues.country}, ${formValues.pincode}`,
        },
        theme: {
          color: '#3399cc',
        },
        handler: function (response: any) {
          console.log('Payment successful, response:', response);
          setIsProcessing(false);
          setShowToast(true);
          setToastVariant('success');
          setToastMessage('Payment successful! Redirecting...');

          setTimeout(() => {
            const successUserId = formValues?.id;
            window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${successUserId}`;
          }, 1500);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log('Payment modal closed');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setIsProcessing(false);
        setToastVariant('danger');
        setToastMessage(
          `Payment failed: ${response.error.description || 'Please try again'}`
        );
        setShowToast(true);
      });

      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      setIsProcessing(false);
      setToastVariant('danger');
      setToastMessage('Failed to initialize payment. Please try again.');
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

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isProcessing) return;

    if (formValues.payableAmount === 0 || formValues.payableAmount === null) {
      sendNotifications();
    } else {
      launchPayment(e);
    }
  };

  const phoneNumber = formValues.mobileNumber || '';
  const isPhoneValid = phoneNumber ? validatePhoneNumber(phoneNumber) : true;

  return (
    <div className="container mx-auto text-center mt-8">
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2 px-4">
          <h3 className="text-2xl font-semibold mb-6">Order Preview</h3>

          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                    Ticket Price
                  </th>
                  <td className="p-3 text-right font-semibold text-gray-900">
                    ₹ {findCategory?.amount}
                  </td>
                </tr>

                {formValues?.membershipId && (
                  <tr className="bg-white">
                    <th className="p-3 text-left text-sm font-medium text-gray-700">
                      Membership Id:
                    </th>
                    <td className="p-3 text-right font-semibold">
                      {formValues?.membershipId}
                    </td>
                  </tr>
                )}

                {formValues?.couponCode && (
                  <>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Coupon Code Applied:
                      </th>
                      <td className="p-3 text-right font-semibold">
                        {formValues?.couponCode}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th className="p-3 text-left text-sm font-medium text-gray-700">
                        Discount:
                      </th>
                      <td className="p-3 text-right font-semibold">
                        ₹ {calculateDiscount()}
                      </td>
                    </tr>
                  </>
                )}

                {formValues?.applicationFee !== undefined &&
                  formValues.applicationFee > 0 && (
                    <>
                      <tr className="bg-gray-50">
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          Platform Charges:
                        </th>
                        <td className="p-3 text-right font-semibold">
                          ₹ {formValues?.applicationFee}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          GST On Platform Charges:
                        </th>
                        <td className="p-3 text-right font-semibold">
                          ₹{' '}
                          {((formValues?.applicationFee * 18) / 100).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  )}

                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Payment Gateway Charges (2%):
                  </th>
                  <td className="p-3 text-right font-semibold">
                    ₹ {formValues?.platformFee}
                  </td>
                </tr>

                <tr className="bg-white">
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    GST On Payment Gateway Charges:
                  </th>
                  <td className="p-3 text-right font-semibold">
                    ₹ {formValues?.gst}
                  </td>
                </tr>

                <tr className="bg-gray-100 border-t-2 border-gray-400">
                  <th className="p-3 text-left text-sm font-bold text-gray-800">
                    Estimated Total Payable*:
                  </th>
                  <td className="p-3 text-right font-bold text-green-600">
                    ₹ {formValues?.payableAmount}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className="p-4 text-center">
                    <button
                      className={`px-6 py-3 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors ${
                        isProcessing ||
                        !isPhoneValid ||
                        ((formValues.payableAmount ?? 0) > 0 && !scriptLoaded)
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                      }`}
                      onClick={handleButtonClick}
                      disabled={
                        isProcessing ||
                        !isPhoneValid ||
                        ((formValues.payableAmount ?? 0) > 0 && !scriptLoaded)
                      }
                    >
                      {isProcessing
                        ? 'Processing...'
                        : formValues.payableAmount === 0 ||
                          formValues.payableAmount === null
                        ? 'Complete Registration'
                        : 'Proceed to Pay'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="p-3 text-xs text-red-600">
              * Please note: This is a preliminary total. Your payment gateway
              may calculate processing fees slightly differently at checkout.
              The exact amount will be displayed before you confirm payment.
            </div>
          </div>

          {showToast && (
            <div
              className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
                toastVariant === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-400'
                  : 'bg-red-100 text-red-800 border border-red-400'
              }`}
              role="alert"
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm font-medium">Registration</strong>
                <button
                  onClick={() => setShowToast(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close"
                >
                  <svg
                    className="h-4 w-4"
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
              <div className="mt-2 text-sm">{toastMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
