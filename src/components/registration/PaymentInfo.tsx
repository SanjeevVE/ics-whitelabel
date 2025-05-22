"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/lib/apiConfig";
import { FormValues } from "./StepperBooking";

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

interface PaymentInfoProps {
  payAmount: number;
  formValues: FormValues;
  event: Event;
  coupons?: Array<{
    couponCode: string;
    discountAmount?: number;
    discountPercentage?: number;
  }>;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  payAmount,
  formValues,
  event,
  coupons = [],
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const findCategory = event?.category?.find(
    (item) => item?.name === formValues?.categoryName
  );

  const currday = new Date();
  const orderId = currday.getTime().toString();

  useEffect(() => {
    // Load Razorpay script
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

    // Store order ID in localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("orderId", orderId);
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderId]);

  const sendNotifications = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const response = await axios.post(
        `${baseUrl}/users/sendnotifications`,
        null,
        {
          params: {
            runnerId: formValues?.id,
            eventId: event?.id,
          },
        }
      );

      if (response.status === 200) {
        window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${formValues?.id}`;
        console.log("Notifications sent successfully:", response.data);
      } else {
        console.warn("Failed to send notifications:", response.data);
        setToastVariant("danger");
        setToastMessage("Failed to complete registration. Please try again.");
        setShowToast(true);
      }
    } catch (error: any) {
      console.error(
        "Error sending notifications:",
        error.response?.data?.error || error.message
      );
      setToastVariant("danger");
      setToastMessage("An error occurred. Please try again.");
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const launchPayment = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isProcessing) return;

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

    setIsProcessing(true);

    try {
      const options = {
        key: formValues.key_id,
        amount: formValues.amount,
        currency: "INR",
        name: formValues.eventName,
        description: formValues.categoryName,
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
          setIsProcessing(false);
          setShowToast(true);
          setToastVariant("success");
          setToastMessage("Payment successful...");

          window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${formValues?.id}`;
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            console.log("Payment modal closed");
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setIsProcessing(false);
        setToastVariant("danger");
        setToastMessage(`Payment failed: ${response.error.description}`);
        setShowToast(true);
      });

      razorpay.open();
    } catch (error) {
      console.error("Error opening Razorpay:", error);
      setIsProcessing(false);
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

  const handleButtonClick = (e: React.MouseEvent) => {
    if (isProcessing) return;
    
    if (formValues.payableAmount === 0 || formValues.payableAmount === null) {
      sendNotifications();
    } else {
      launchPayment(e);
    }
  };

  return (
    <>
      <style jsx>{`
        .table {
          white-space: nowrap;
        }
      `}</style>
      
      <div className='container text-center mt-5'>
        <div className="row justify-content-center">
          <h3>Order Preview</h3>
          <div className="col-sm-12 col-md-6 col-lg-5 col-xl-4 table-responsive mt-3 shadow-lg">
            <table className="table table-striped text-left mb-0">
              <tbody>
                <tr>
                  <th className='p-1'>Ticket Price:</th>
                  <td className='p-1 text-right'>
                    <b>₹ {findCategory?.amount}</b>
                  </td>
                </tr>

                {formValues?.membershipId && (
                  <tr>
                    <th className='p-1'>Membership Id:</th>
                    <td className='p-1 text-right'>
                      <b>{formValues?.membershipId}</b>
                    </td>
                  </tr>
                )}

                {formValues?.couponCode && (
                  <>
                    <tr>
                      <th className='p-1'>Coupon Code Applied:</th>
                      <td className='p-1 text-right'>
                        <b>{formValues?.couponCode}</b>
                      </td>
                    </tr>
                    <tr>
                      <th className='p-1'>Discount:</th>
                      <td className='p-1 text-right'>
                        <b>₹ {calculateDiscount()}</b>
                      </td>
                    </tr>
                  </>
                )}

                {(formValues?.applicationFee !== undefined && formValues.applicationFee > 0) && (
                  <>
                    <tr>
                      <th className='p-1'>Platform Charges:</th>
                      <td className='p-1 text-right'>
                        <b>₹ {formValues?.applicationFee}</b>
                      </td>
                    </tr>
                    <tr>
                      <th className='p-1'>GST On Platform Charges:</th>
                      <td className='p-1 text-right'>
                        <b>₹ {(formValues.applicationFee * 18 / 100).toFixed(2)}</b>
                      </td>
                    </tr>
                  </>
                )}

                <tr>
                  <th className='p-1'>Payment Gateway Charges (2%):</th>
                  <td className='p-1 text-right'>
                    <b>₹ {formValues?.platformFee}</b>
                  </td>
                </tr>

                <tr>
                  <th className='p-1'>GST On Payment Gateway Charges:</th>
                  <td className='p-1 text-right'>
                    <b>₹ {formValues?.gst}</b>
                  </td>
                </tr>

                <tr style={{ borderTop: "1px solid #000" }}>
                  <th className='p-1 fw-bold'>Estimated Total Payable*:</th>
                  <td className='p-1 text-right fw-bold text-success'>
                    ₹ {formValues?.payableAmount}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    <button 
                      className={`btn btn-lg ${
                        isProcessing || ((formValues.payableAmount ?? 0) > 0 && !scriptLoaded)
                          ? 'btn-secondary'
                          : 'btn-success'
                      }`}
                      onClick={handleButtonClick}
                      disabled={isProcessing || (((formValues.payableAmount ?? 0) > 0) && !scriptLoaded)}
                    >
                      {isProcessing ? (
                        "Processing..."
                      ) : (
                        formValues.payableAmount === 0 || formValues.payableAmount === null
                          ? "Complete Registration"
                          : "Proceed to Pay"
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className='mb-2'>
              <span className='text-danger' style={{ fontSize: '14px' }}>
                * Please note: This is a preliminary total. Your payment gateway may calculate processing fees slightly differently at checkout. The exact amount will be displayed before you confirm payment.
              </span>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div
            className={`position-fixed top-0 end-0 p-3`}
            style={{ zIndex: 1050 }}
          >
            <div
              className={`toast show bg-${toastVariant === 'success' ? 'success' : 'danger'} text-white`}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header">
                <strong className="me-auto">Registration</strong>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowToast(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="toast-body">{toastMessage}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentInfo;