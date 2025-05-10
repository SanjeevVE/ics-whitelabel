"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

import CustomerInfo from "@/components/registration/CustomerInfo";
import PaymentInfo from "@/components/registration/PaymentInfo";
import OrderSubmittedInfo from "@/components/registration/OrderSubmittedInfo";

// Custom hooks
const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventSlug) return;
        // Replace with your actual API call
        const response = await fetch(`/api/events/${eventSlug}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  return { event, isLoading };
};

const useCoupons = (eventId?: string) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [findEarlyBirdCoupon, setFindEarlyBirdCoupon] = useState<any>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!eventId) return;
        // Replace with your actual API call
        const response = await fetch(`/api/coupons?eventId=${eventId}`);
        const data = await response.json();
        setCoupons(data);
        
        // Find early bird coupon if any
        const earlyBird = data.find((coupon: any) => coupon.couponType === "EARLY_BIRD");
        setFindEarlyBirdCoupon(earlyBird || null);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [eventId]);

  return { coupons, findEarlyBirdCoupon };
};

// Loading component
const BlockingLoader = () => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Helper function to calculate age
const calculateAge = (dateOfBirth: string, eventDate?: string): number => {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const compareDate = eventDate ? new Date(eventDate) : new Date();
  
  let age = compareDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = compareDate.getMonth() - birthDate.getMonth();
  
  // If birthday hasn't occurred yet this year, subtract one year
  if (monthDiff < 0 || (monthDiff === 0 && compareDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to register user
const registerUser = async (formData: FormData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

type StepperBookingProps = {
  setSelectedCategory?: (category: any) => void;
  variant?: "default" | "institution" | "general-b";
};

const StepperBooking: React.FC<StepperBookingProps> = ({
  setSelectedCategory,
  variant = "default",
}) => {
  const { slug } = useParams<{ slug: string }>();
  const eventSlug = typeof slug === "string" ? slug : "";

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [categoryMinimumAge, setCategoryMinimumAge] = useState(0);
  const [categoryMaximumAge, setCategoryMaximumAge] = useState(0);
  const [gender, setGender] = useState("");
  const [matchedAgeBracket, setMatchedAgeBracket] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);

  const { event, isLoading: isEventLoading } = useEvent(eventSlug);
  const { coupons, findEarlyBirdCoupon } = useCoupons(event?.id);

  useEffect(() => {
    if (event?.category && event.category.length > 0) {
      const names = event.category.map((category: any) => category.name);
      setCategoryNames(names);
    }
  }, [event]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    mobileNumber: Yup.string().required("Mobile Number is required"),
    categoryName: Yup.string().required("Category Name is required"),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date()
      .max(new Date(), "Date of Birth must be in the past")
      .required("Date of Birth is required"),
    tShirtSize: Yup.string().required("T-Shirt Size is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    pincode: Yup.string().required("Pincode is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    emergencyContactName: Yup.string().required("Emergency Contact Name is required"),
    emergencyContactNumber: Yup.string().required("Emergency Contact Number is required"),
    termsAndConditions: Yup.boolean()
      .oneOf([true], "You must agree to the terms")
      .required("You must agree to the terms"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      gender: "",
      runnerClub: "None",
      educationInstitution: "",
      company: "None",
      bibDistributionLocation: "",
      dateOfBirth: "",
      tShirtSize: "",
      nameOfTheBib: "",
      bloodGroup: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      medicalConditions: "",
      categoryName: "",
      termsAndConditions: false,
      couponCode: findEarlyBirdCoupon?.couponCode || "",
      hearAboutUs: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);

        const age = calculateAge(values.dateOfBirth, event?.date);

        const formData = new FormData();
        for (const key in values) {
          if (key === "idCard" && values[key]) {
            formData.append("idCard", values[key]);
          } else {
            const value = values[key];
            if (value === null || value === undefined) {
              continue;
            }
            formData.append(key, String(value));
          }
        }

        formData.append("age", age.toString());
        formData.append("nameOfTheBib", values.nameOfTheBib || values.firstName);

        const response = await registerUser(formData);

        if (response && response.data) {
          setFormValues(response.data);
          setFormSubmitted(true);
          setCurrentStep(currentStep + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.error || "Registration failed");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.categoryName && event) {
      const cat = event.category?.find(
        (item: any) => item?.name === formik.values.categoryName
      );
      if (setSelectedCategory && cat) {
        setSelectedCategory(cat);
      }
    }
  }, [formik.values.categoryName, event, setSelectedCategory]);

  useEffect(() => {
    if (event && formik.values.categoryName) {
      const selectedCategory = event.category?.find(
        (cat: any) => cat.name === formik.values.categoryName
      );
      if (selectedCategory) {
        setCategoryMinimumAge(selectedCategory.minimumAge);
        setCategoryMaximumAge(selectedCategory.maximumAge);
        setGender(selectedCategory.gender);
        formik.setFieldValue("distance", selectedCategory.distance);
      }
    }
  }, [event, formik.values.categoryName]);

  useEffect(() => {
    const age =
      formik.values.dateOfBirth &&
      calculateAge(formik.values.dateOfBirth, event?.date);
    const gender = formik.values.gender;

    if (
      event?.category &&
      formik.values.categoryName &&
      formik.values.dateOfBirth
    ) {
      const selectedCategory = event.category.find(
        (cat: any) => cat.name === formik.values.categoryName
      );

      if (selectedCategory && selectedCategory.ageBracket) {
        const matchedBracket = selectedCategory.ageBracket.find((bracket: any) => {
          const isAgeInRange =
            age >= bracket.minimumAge && age <= bracket.maximumAge;
          const isGenderMatch =
            bracket.gender === "BOTH" ||
            bracket.gender === gender.toUpperCase();
          return isAgeInRange && isGenderMatch;
        });

        if (matchedBracket) {
          setMatchedAgeBracket(
            `You are registering in the ${matchedBracket.name} category of ${formik.values.categoryName}`
          );
        } else {
          setMatchedAgeBracket(
            `You are ineligible for ${formik.values.categoryName}. Please choose a different category`
          );
        }
      }
    }
  }, [
    formik.values.dateOfBirth,
    formik.values.gender,
    event,
    formik.values.categoryName,
  ]);

  const isMatched = matchedAgeBracket?.startsWith("You are registering in");

  const handleRegisterClick = () => {
    setButtonClicked(true);
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      } else {
        formik.setTouched({
          ...formik.touched,
          ...Object.keys(errors).reduce((acc: Record<string, boolean>, key) => {
            acc[key] = true;
            return acc;
          }, {}),
        });
      }
    });
  };

  useEffect(() => {
    const updatedErrors = Object.keys(formik.errors);
    setErrorList(updatedErrors);
  }, [formik.errors]);

  const steps = [
    {
      title: "Personal Details",
      stepNo: "1",
      content: (
        <CustomerInfo
          eventCategory={event}
          categoryMinimumAge={categoryMinimumAge}
          formik={formik}
          categoryNames={categoryNames}
          customSlug={event?.slug}
          matchedAgeBracket={matchedAgeBracket}
          isMatched={isMatched}
          findCoupon={findEarlyBirdCoupon}
        />
      ),
    },
    {
      title: "Payment Details",
      stepNo: "2",
      content: (
        <PaymentInfo
          formValues={formValues}
          payAmount={event?.category?.[0]?.amount}
          event={event}
          coupons={coupons}
        />
      ),
    },
    {
      title: "Order Confirmation",
      stepNo: "3",
      content: (
        <OrderSubmittedInfo
          formValues={formValues}
          eventName={event?.eventName}
          event={event}
        />
      ),
    },
  ];

  const renderStep = () => {
    const { content } = steps[currentStep];
    return <>{content}</>;
  };

  if (isEventLoading || loading) {
    return <BlockingLoader />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between border-b pb-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                currentStep >= index ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <div
                className={`
                w-8 h-8 flex items-center justify-center rounded-full mr-2
                ${
                  currentStep >= index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }
              `}
              >
                {step.stepNo}
              </div>
              <span className="hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">{renderStep()}</div>

      <div className="flex justify-center mt-10">
        <div className="w-full md:w-1/2">
          {currentStep === 0 && (
            <div>
              {buttonClicked && errorList.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <ul className="list-disc pl-5">
                    {errorList.map((field, index) => (
                      <li className="text-red-600 text-sm" key={index}>
                        {formik.errors[field]
                          ? String(formik.errors[field])
                          : `${field} is required`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300 font-medium"
                onClick={handleRegisterClick}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Register Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepperBooking;