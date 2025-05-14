import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import CustomerInfo from "@/components/registration/CustomerInfo";
import PaymentInfo from "@/components/registration/PaymentInfo";
import OrderSummary from "@/components/registration/OrderSubmittedInfo";
import { baseUrl } from '@/lib/apiConfig';
import { getEventBySlug} from '@/lib/api';
import { getAllCoupons } from '@/lib/useCoupons';

interface Event {
  id: string;
  eventName: string;
  eventType: string;
  slug: string;
  regOpenDate: string;
  regCloseDate: string;
  date: string;
  location: string;
  race: string[];
  tag: string;
  status: string;
  category: Category[];
}

interface Category {
  id: string;
  name: string;
  minimumAge: number;
  maximumAge: number;
  gender: string;
  distance: string;
  amount: number;
  ageBracket: AgeBracket[];
}

interface AgeBracket {
  id: string;
  name: string;
  minimumAge: number;
  maximumAge: number;
  gender: string;
}

interface Coupon {
  id: string;
  couponCode: string;
  couponType: string;
  discount: number;
  eventId: string;
  expiryDate: string;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string;
  eventId: string | null;
  eventName: string;
  eventType: string;
  eventSlug: string;
  registrationOpenDate: string | null;
  registrationCloseDate: string | null;
  eventDate: string | null;
  location: string;
  tShirtSize: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  categoryName: string;
  couponCode: string;
  runnerClub: string;
  company: string;
  bibDistributionLocation: string;
  nameOfTheBib: string;
  bloodGroup: string;
  educationInstitution: string;
  medicalConditions: string;
  termsAndConditions: boolean;
  hearAboutUs: string;
  race: string;
  distance: string;
  eventTag: string;
  eventStatus: string;
  age?: number;
}

/**
 * Custom hook to fetch event data by slug
 */
const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventSlug) return;

        const response = await getEventBySlug(eventSlug);
        if (!response || !response.data) {
          throw new Error("Failed to fetch event data");
        }
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  return { event, isLoading, error };
};

const useCoupons = (eventId: string | undefined) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [findEarlyBirdCoupon, setFindEarlyBirdCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!eventId) return;
        const response = await getAllCoupons(eventId);
        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }
        const data = await response.json();
        setCoupons(data);

        const earlyBird = data.find(
          (coupon: Coupon) => coupon.couponType === "EARLY_BIRD"
        );
        setFindEarlyBirdCoupon(earlyBird || null);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [eventId]);

  return { coupons, findEarlyBirdCoupon };
};

const BlockingLoader: React.FC = () => (
  <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const calculateAge = (dateOfBirth: string, eventDate: string | undefined): number => {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  const compareDate = eventDate ? new Date(eventDate) : new Date();
  let age = compareDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = compareDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && compareDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const registerUser = async (formData: FormData) => {
  try {
    const response = await fetch(`${baseUrl}users/register`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const StepperBooking: React.FC = () => {
  const { slug } = useParams();
  const eventSlug = typeof slug === "string" ? slug : "";

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [categoryMinimumAge, setCategoryMinimumAge] = useState<number>(0);
  const [categoryMaximumAge, setCategoryMaximumAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("");
  const [matchedAgeBracket, setMatchedAgeBracket] = useState<string>("");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<string[]>([]);  
  const { event, isLoading: isEventLoading, error } = useEvent(eventSlug);
  const { coupons, findEarlyBirdCoupon } = useCoupons(event?.id);

  const getInitialFormValues = (event: Event | null, findEarlyBirdCoupon: Coupon | null): FormValues => ({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    eventId: event?.id || null,
    eventName: event?.eventName || "",
    eventType: event?.eventType || "",
    eventSlug: event?.slug || "",
    registrationOpenDate: event?.regOpenDate || null,
    registrationCloseDate: event?.regCloseDate || null,
    eventDate: event?.date || null,
    location: event?.location || "",
    tShirtSize: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: event?.location?.split(", ").pop() || "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    categoryName: "",
    couponCode: findEarlyBirdCoupon?.couponCode || "",
    runnerClub: "None",
    company: "None",
    bibDistributionLocation: "",
    nameOfTheBib: "",
    bloodGroup: "",
    educationInstitution: "",
    medicalConditions: "",
    termsAndConditions: false,
    hearAboutUs: "",
    race: event?.race?.[0] || "",
    distance: "",
    eventTag: event?.tag || "",
    eventStatus: event?.status || "",
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialFormValues(event, findEarlyBirdCoupon),
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNumber: Yup.string()
        .required("Mobile Number is required")
        .matches(/^(?!0|(\+91))\d{10}$/, {
          message: "Mobile Number should be 10 digits without 0 or +91 prefix",
        }),
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
      emergencyContactName: Yup.string().required(
        "Emergency Contact Name is required"
      ),
      emergencyContactNumber: Yup.string()
        .required("Emergency Contact Number is required")
        .test(
          "not-same-as-mobile",
          "Contact number and emergency contact number cannot be the same.",
          function(value) {
            return value !== this.parent.mobileNumber;
          }
        ),
      categoryName: Yup.string().required("Category Name is required"),
      termsAndConditions: Yup.boolean()
        .oneOf([true], "You must agree to the terms")
        .required("Terms acceptance is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        const age = calculateAge(values.dateOfBirth, event?.date);

        const formData = new FormData();
        for (const key in values) {
          const value = values[key as keyof typeof values];
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        }

        formData.append("age", age.toString());
        formData.append(
          "nameOfTheBib",
          values.nameOfTheBib || values.firstName
        );

        const eventSpecificFields = [
          "eventId",
          "eventName",
          "eventType",
          "eventSlug",
          "registrationOpenDate",
          "registrationCloseDate",
          "eventDate",
          "location",
          "race",
          "eventTag",
          "eventStatus",
        ];

        eventSpecificFields.forEach((field) => {
          const value = values[field as keyof typeof values];
          if (value !== null && value !== undefined) {
            formData.append(field, String(value));
          }
        });

        const response = await registerUser(formData);

        if (response?.data) {
          const updatedValues = {
            ...values,
            ...response.data,
            couponCode: response.data.couponCode || values.couponCode,
            runnerClub: response.data.runnerClub || values.runnerClub,
            company: response.data.company || values.company,
            eventId: event?.id,
            eventName: event?.eventName,
            eventType: event?.eventType,
            eventSlug: event?.slug,
            registrationOpenDate: event?.regOpenDate,
            registrationCloseDate: event?.regCloseDate,
            eventDate: event?.date,
            location: event?.location,
            race: event?.race?.[0],
            eventTag: event?.tag,
            eventStatus: event?.status,
          };

          setFormValues(response.data);
          setFormSubmitted(true);
          setCurrentStep(currentStep + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });

          formik.setValues(updatedValues);
        }
      } catch (error: any) {
        toast.error(error?.message || "Registration failed");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (event && event.category) {
      const names = event.category.map((cat) => cat.name);
      setCategoryNames(names);
    }
  }, [event]);

  useEffect(() => {
    if (event && formik.values.categoryName) {
      const selectedCategory = event.category?.find(
        (cat) => cat.name === formik.values.categoryName
      );
      if (selectedCategory) {
        setCategoryMinimumAge(selectedCategory.minimumAge);
        setCategoryMaximumAge(selectedCategory.maximumAge);
        setGender(selectedCategory.gender);
        formik.setFieldValue("distance", selectedCategory.distance || "");
      }
    }
  }, [event, formik.values.categoryName]);

  useEffect(() => {
    const age = formik.values.dateOfBirth
      ? calculateAge(formik.values.dateOfBirth, event?.date)
      : 0;
    const gender = formik.values.gender;

    if (
      event?.category &&
      formik.values.categoryName &&
      formik.values.dateOfBirth
    ) {
      const selectedCategory = event.category.find(
        (cat) => cat.name === formik.values.categoryName
      );

      if ((selectedCategory?.ageBracket ?? []).length > 0) {
        const matchedBracket = selectedCategory?.ageBracket?.find(
          (bracket) => {
            const isAgeInRange =
              age >= bracket.minimumAge && age <= bracket.maximumAge;
            const isGenderMatch =
              bracket.gender === "BOTH" ||
              bracket.gender === gender.toUpperCase();
            return isAgeInRange && isGenderMatch;
          }
        );

        if (matchedBracket) {
          setMatchedAgeBracket(
            `You are registering in the ${matchedBracket.name} category of ${formik.values.categoryName}`
          );
        } else {
          setMatchedAgeBracket(
            `You are ineligible for ${formik.values.categoryName}. Please choose another category.`
          );
        }
      }
    }
  }, [
    formik.values.dateOfBirth,
    formik.values.gender,
    formik.values.categoryName,
    event,
  ]);

  useEffect(() => {
    setMatchedAgeBracket("");
  }, [formik.values.categoryName]);

  const isMatched = matchedAgeBracket.startsWith("You are registering");

  const handleNextStep = () => {
    setButtonClicked(true);
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setFormValues({
          ...formik.values,
          age: calculateAge(formik.values.dateOfBirth, event?.date),
        });
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key as keyof typeof errors] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    });
  };

  const handleRegisterClick = () => {
    setButtonClicked(true);
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      } else {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key as keyof typeof errors] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setErrorList(Object.keys(formik.errors));
  }, [formik.errors]);


  const steps = [
    {
      title: "Personal Details",
      stepNo: "1",
    },
    {
      title: "Payment Details",
      stepNo: "2",
    },
    {
      title: "Order Confirmation",
      stepNo: "3",
    },
  ];

  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return (
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
        );
      case 1:
        return formValues && event && (
          <PaymentInfo
            formValues={formValues}
            payAmount={event.category?.[0]?.amount}
            event={event}
            coupons={coupons}
          />
        );
      case 2:
        return formValues && (
          <OrderSummary
            formValues={formValues}
            eventName={event?.eventName}
            event={event}
          />
        );
      default:
        return null;
    }
  };

  if (isEventLoading || loading) return <BlockingLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="w-full mb-8 flex justify-center">
        <div className="flex items-center w-full max-w-3xl">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : index === currentStep
                    ? 'border-blue-600 text-blue-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : step.stepNo}
                </div>
                <div className="text-xs mt-1">{step.title}</div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-300">
                  <div 
                    className="h-full bg-blue-600" 
                    style={{ width: index < currentStep ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
        {renderStepContent()}
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4">
        {buttonClicked && errorList.length > 0 && currentStep === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 w-full">
            <h3 className="text-red-700 font-medium mb-2">
              Please correct the following errors:
            </h3>
            <ul className="list-disc pl-5">
              {errorList.map((field, index) => (
                <li className="text-red-600 text-sm" key={index}>
                  {formik.errors[field as keyof typeof formik.errors]
                    ? String(formik.errors[field as keyof typeof formik.errors])
                    : `${field} is required`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 ml-auto">
          {currentStep > 0 && (
            <button
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={handlePrevStep}
              type="button"
            >
              Back
            </button>
          )}

          {currentStep === 0 ? (
            <button
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              onClick={handleNextStep}
              disabled={loading}
              type="button"
            >
              Next
            </button>
          ) : currentStep === 1 ? (
            <button
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              onClick={handleRegisterClick}
              disabled={loading}
              type="button"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StepperBooking;