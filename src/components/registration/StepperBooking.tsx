import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import CustomerInfo from "@/components/registration/CustomerInfo";
import PaymentInfo from "@/components/registration/PaymentInfo";
import OrderSubmittedInfo from "@/components/registration/OrderSubmittedInfo";
import { getEventBySlug } from "../../lib/api";

const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventSlug) return;

        const result = await getEventBySlug(eventSlug);
        setEvent(result.data);
        console.log("Event data:", result.data);
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

const useCoupons = (eventId?: string) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [findEarlyBirdCoupon, setFindEarlyBirdCoupon] = useState<any>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!eventId) return;
        const response = await fetch(`/api/coupons?eventId=${eventId}`);
        const data = await response.json();
        setCoupons(data);

        const earlyBird = data.find(
          (coupon: any) => coupon.couponType === "EARLY_BIRD"
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

const BlockingLoader = () => (
  <div className='fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'>
    <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600'></div>
  </div>
);

const calculateAge = (dateOfBirth: string, eventDate?: string): number => {
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
    const response = await fetch("/api/register", {
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

  const { event, isLoading: isEventLoading, error } = useEvent(eventSlug);
  const { coupons, findEarlyBirdCoupon } = useCoupons(event?.id);

  const getInitialFormValues = (event: any, findEarlyBirdCoupon: any) => ({
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
    emergencyContactNumber: event?.secondaryContactNumber || "",
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
      mobileNumber: Yup.string().required("Mobile Number is required"),
      gender: Yup.string().required("Gender is required"),
      dateOfBirth: Yup.date()
        .max(new Date(), "Invalid Date")
        .required("DOB is required"),
      tShirtSize: Yup.string().required("T-Shirt Size is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      pincode: Yup.string().required("Pincode is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      emergencyContactName: Yup.string().required(
        "Emergency Contact Name is required"
      ),
      emergencyContactNumber: Yup.string().required(
        "Emergency Contact Number is required"
      ),
      categoryName: Yup.string().required("Category Name is required"),
      termsAndConditions: Yup.boolean()
        .oneOf([true], "You must agree")
        .required(),
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
      const names = event.category.map((cat: any) => cat.name);
      setCategoryNames(names);
    }
  }, [event]);

  useEffect(() => {
    if (event && formik.values.categoryName) {
      const selectedCategory = event.category?.find(
        (cat: any) => cat.name === formik.values.categoryName
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

    const selectedCategory = event?.category?.find(
      (cat: any) => cat.name === formik.values.categoryName
    );

    if (selectedCategory?.ageBracket?.length > 0) {
      const matched = selectedCategory.ageBracket.find((bracket: any) => {
        const inAgeRange =
          age >= bracket.minimumAge && age <= bracket.maximumAge;
        const genderMatch =
          bracket.gender === "BOTH" ||
          bracket.gender === formik.values.gender.toUpperCase();
        return inAgeRange && genderMatch;
      });

      if (matched) {
        setMatchedAgeBracket(
          `You are registering in the ${matched.name} category of ${formik.values.categoryName}`
        );
      } else {
        setMatchedAgeBracket(
          `You are ineligible for ${formik.values.categoryName}. Please choose another category.`
        );
      }
    }
  }, [
    formik.values.dateOfBirth,
    formik.values.gender,
    event,
    formik.values.categoryName,
  ]);

  const isMatched = matchedAgeBracket.startsWith("You are registering");

  const handleRegisterClick = () => {
    setButtonClicked(true);
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit();
      } else {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    });
  };

  useEffect(() => {
    console.log("Formik values changed:", formik.values);
  }, [formik.values]);

  useEffect(() => {
    setErrorList(Object.keys(formik.errors));
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

  if (isEventLoading || loading) return <BlockingLoader />;

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <div className='mb-10'>{steps[currentStep].content}</div>
    </div>
  );
};

export default StepperBooking;
