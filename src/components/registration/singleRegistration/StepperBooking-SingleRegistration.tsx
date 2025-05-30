import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import CustomerInfo from '@/components/registration/singleRegistration/CustomerInfo';
import PaymentInfo from '@/components/registration/PaymentInfo';
import {
  getEventBySlug,
  getEarlyBirdCoupon,
  registerUserForEvent,
} from '@/lib/backendApis';

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
  emailBanner?: string;
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
  couponCode?: string;
  couponType: string;
  discount: number;
  eventId: string;
  expiryDate: string;
  isActive?: boolean;
  expiresAt?: string;
}

export interface FormValues {
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
  couponCode?: string;
  runnerClub?: string;
  company: string;
  bibDistributionLocation: string;
  nameOfTheBib?: string;
  bloodGroup?: string;
  educationInstitution: string;
  medicalConditions?: string;
  termsAndConditions: boolean;
  hearAboutUs?: string;
  race: string;
  distance: string;
  eventTag: string;
  eventStatus: string;
  age?: number;
  platformFee?: number;
  id?: string;
  key_id?: string;
  amount?: number;
  paymentOrderId?: string;
  orderId?: string;
  paymentId?: string;
  paymentStatus?: string;
  paymentSignature?: string;
  paymentMode?: string;
  isPriorityLineUp?: boolean;
  jatreDistance?: string;
  timingSubmission?: string;
  garminLinks?: string;
  thumbnail?: string;
  membershipId?: string;
  payableAmount?: number;
  applicationFee?: number;
  gst?: number;
  gstOnPlatformCharges?: number;
  whatsAppNumber: string;
  enableWhatsApp: boolean;
}

const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventSlug) return;

        const response = await getEventBySlug(eventSlug);
        if (response && response.data) {
          setEvent({
            ...response.data,
            emailBanner: response.data.emailBanner,
          });
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  return { event, isLoading, error };
};

const useEarlyBirdCoupon = (eventId: string | undefined) => {
  const [earlyBirdCoupon, setEarlyBirdCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEarlyBirdCoupon = async () => {
      try {
        if (!eventId) return;

        setIsLoading(true);
        const response = await getEarlyBirdCoupon(eventId);

        if (!response || Array.isArray(response) || !('data' in response)) {
          throw new Error('Failed to fetch early bird coupon data');
        }

        if (
          response.data &&
          response.data.isActive === true &&
          response.data.expiresAt &&
          new Date(response.data.expiresAt) > new Date()
        ) {
          setEarlyBirdCoupon(response.data);
        } else {
          setEarlyBirdCoupon(null);
        }
      } catch (error) {
        console.log('Error fetching early bird coupon:', error);
        setEarlyBirdCoupon(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarlyBirdCoupon();
  }, [eventId]);

  return { earlyBirdCoupon, isLoading };
};

const BlockingLoader: React.FC = () => (
  <div className='fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'>
    <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600'></div>
  </div>
);

const calculateAge = (
  dateOfBirth: string,
  eventDate: string | undefined
): number => {
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

const registerUser = async (
  formData: FormData,
  setFormValues: React.Dispatch<React.SetStateAction<FormValues | null>>,
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  currentStep: number,
  formik: any,
  setCouponError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await registerUserForEvent(formData);

    if (!response) {
      throw new Error('No response received from server');
    }

    let responseData;

    try {
      if (typeof response.json === 'function') {
        if (!response.ok) {
          const errorData = await response.json();
          if (
            errorData.error &&
            errorData.error.toLowerCase().includes('coupon')
          ) {
            setCouponError(errorData.error);
            throw new Error(errorData.error);
          }
          throw new Error(
            errorData.error ||
              `Registration failed with status: ${response.status}`
          );
        }
        responseData = await response.json();
      } else {
        responseData = response;

        if (
          responseData.error &&
          responseData.error.toLowerCase().includes('coupon')
        ) {
          setCouponError(responseData.error);
          throw new Error(responseData.error);
        }
      }
    } catch (jsonError: any) {
      if (
        jsonError.message &&
        jsonError.message.toLowerCase().includes('coupon')
      ) {
        setCouponError(jsonError.message);
        throw jsonError;
      }
      throw new Error('Failed to parse server response');
    }

    if (!responseData) {
      throw new Error('No data received from server');
    }

    setCouponError(null);

    if (responseData?.data) {
      setFormValues(responseData.data);
      setFormSubmitted(true);
      setCurrentStep(currentStep + 1);

      const updatedValues = {
        ...formik.values,
        ...responseData.data,
      };

      formik.setValues(updatedValues);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (responseData.id || responseData.orderId) {
        setFormValues({ ...formik.values, ...responseData });
        setFormSubmitted(true);
        setCurrentStep(currentStep + 1);
        formik.setValues({ ...formik.values, ...responseData });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Invalid response format from server');
      }
    }
    return responseData;
  } catch (error: any) {
    if (!error.message?.toLowerCase().includes('coupon')) {
      toast.error(error?.message || 'Registration failed');
    }
    throw error;
  }
};

interface StepperBookingProps {
  event?: any;
  selectedCategory?: any;
  setSelectedCategory?: any;
}

const StepperBooking: React.FC<StepperBookingProps> = (props) => {
  const { slug } = useParams();
  const eventSlug = typeof slug === 'string' ? slug : '';
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [categoryMinimumAge, setCategoryMinimumAge] = useState<number>(0);
  const [categoryMaximumAge, setCategoryMaximumAge] = useState<number>(0);
  const [gender, setGender] = useState<string>('');
  const [matchedAgeBracket, setMatchedAgeBracket] = useState<string>('');
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [couponError, setCouponError] = useState<string | null>(null);
  const { event, isLoading: isEventLoading, error } = useEvent(eventSlug);
  const { earlyBirdCoupon } = useEarlyBirdCoupon(event?.id);

  const getInitialFormValues = (
    event: Event | null,
    earlyBirdCoupon: Coupon | null
  ): FormValues => ({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    dateOfBirth: '',
    eventId: event?.id || null,
    eventName: event?.eventName || '',
    eventType: event?.eventType || '',
    eventSlug: event?.slug || '',
    registrationOpenDate: event?.regOpenDate || null,
    registrationCloseDate: event?.regCloseDate || null,
    eventDate: event?.date || null,
    location: event?.location || '',
    tShirtSize: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: event?.location?.split(', ').pop() || '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    categoryName: '',
    couponCode: earlyBirdCoupon?.couponCode || '',
    runnerClub: 'None',
    company: 'None',
    bibDistributionLocation: '',
    nameOfTheBib: '',
    bloodGroup: '',
    educationInstitution: '',
    medicalConditions: '',
    termsAndConditions: false,
    hearAboutUs: '',
    race: event?.race?.[0] || '',
    distance: '',
    eventTag: event?.tag || '',
    eventStatus: event?.status || '',
    platformFee: 0,
    whatsAppNumber: '',
    enableWhatsApp: false,
  });

  type FormikValues = FormValues;

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^(?!0|(\+91))\d{10}$/, {
        message: 'Mobile Number should be 10 digits without 0 or +91 prefix',
      }),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.date()
      .max(new Date(), 'Date of Birth must be in the past')
      .required('Date of Birth is required'),
    tShirtSize: Yup.string().required('T-Shirt Size is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string().required('Pincode is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    emergencyContactName: Yup.string().required(
      'Emergency Contact Name is required'
    ),
    emergencyContactNumber: Yup.string()
      .required('Emergency Contact Number is required')
      .test(
        'not-same-as-mobile',
        'Contact number and emergency contact number cannot be the same.',
        function (value) {
          return value !== this.parent.mobileNumber;
        }
      ),
    categoryName: Yup.string().required('Category Name is required'),
    termsAndConditions: Yup.boolean()
      .oneOf([true], 'You must agree to the terms')
      .required('Terms acceptance is required'),
  });

  const formik = useFormik<FormikValues>({
    enableReinitialize: true,
    initialValues: getInitialFormValues(event, earlyBirdCoupon),
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        setCouponError(null);

        const age = calculateAge(values.dateOfBirth, event?.date);
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            ![
              'eventId',
              'eventName',
              'eventType',
              'eventSlug',
              'registrationOpenDate',
              'registrationCloseDate',
              'eventDate',
              'location',
              'race',
              'eventTag',
              'eventStatus',
              'nameOfTheBib',
            ].includes(key)
          ) {
            formData.append(key, String(value));
          }
        });

        formData.append('age', age.toString());

        formData.append(
          'nameOfTheBib',
          values.nameOfTheBib || `${values.firstName} ${values.lastName}`
        );

        if (event) {
          formData.append('eventId', String(event.id));
          formData.append('eventName', String(event.eventName));
          formData.append('eventType', String(event.eventType || ''));
          formData.append('eventSlug', String(event.slug));
          formData.append(
            'registrationOpenDate',
            String(event.regOpenDate || '')
          );
          formData.append(
            'registrationCloseDate',
            String(event.regCloseDate || '')
          );
          formData.append('eventDate', String(event.date || ''));
          formData.append('location', String(event.location || ''));
          formData.append('race', String(values.race || event.race?.[0] || ''));
          formData.append('eventTag', String(event.tag || ''));
          formData.append('eventStatus', String(event.status || ''));
        }

        try {
          const response = await registerUser(
            formData,
            setFormValues,
            setFormSubmitted,
            setCurrentStep,
            currentStep,
            formik,
            setCouponError
          );

          if (response) {
            const responseData = response.data || response;
            const updatedValues: FormValues = {
              ...values,
              ...responseData,
              couponCode: responseData.couponCode || values.couponCode || '',
              runnerClub:
                responseData.runnerClub || values.runnerClub || 'None',
              company: responseData.company || values.company || 'None',
              nameOfTheBib:
                responseData.nameOfTheBib ||
                values.nameOfTheBib ||
                `${values.firstName} ${values.lastName}`,
              bibDistributionLocation:
                responseData.bibDistributionLocation ||
                values.bibDistributionLocation ||
                '',
              bloodGroup: responseData.bloodGroup || values.bloodGroup || '',
              educationInstitution:
                responseData.educationInstitution ||
                values.educationInstitution ||
                '',
              medicalConditions:
                responseData.medicalConditions ||
                values.medicalConditions ||
                '',
              hearAboutUs: responseData.hearAboutUs || values.hearAboutUs || '',
              platformFee: responseData.platformFee || 0,
              eventId: event?.id || null,
              eventName: event?.eventName || '',
              eventType: event?.eventType || '',
              eventSlug: event?.slug || '',
              registrationOpenDate: event?.regOpenDate || null,
              registrationCloseDate: event?.regCloseDate || null,
              eventDate: event?.date || null,
              location: event?.location || '',
              race: event?.race?.[0] || '',
              eventTag: event?.tag || '',
              eventStatus: event?.status || '',
            };

            setFormValues(updatedValues);
            setFormSubmitted(true);
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            formik.setValues(updatedValues);
          }
        } catch (registerError: any) {
          if (registerError.message?.toLowerCase().includes('coupon')) {
            setCouponError(registerError.message);
            toast.error(registerError.message || 'Invalid coupon code');
          } else {
            toast.error(
              registerError?.message || 'Registration process failed'
            );
          }
        }
      } catch (error: any) {
        toast.error(error?.message || 'Registration failed');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (couponError) {
      setCouponError(null);
    }
  }, [formik.values.couponCode]);

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
        formik.setFieldValue('distance', selectedCategory.distance || '');
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
        const matchedBracket = selectedCategory?.ageBracket?.find((bracket) => {
          const isAgeInRange =
            age >= bracket.minimumAge && age <= bracket.maximumAge;
          const isGenderMatch =
            bracket.gender === 'BOTH' ||
            bracket.gender === gender.toUpperCase();
          return isAgeInRange && isGenderMatch;
        });

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
    setMatchedAgeBracket('');
  }, [formik.values.categoryName]);

  useEffect(() => {
    if (earlyBirdCoupon?.couponCode) {
      formik.setFieldValue('couponCode', earlyBirdCoupon.couponCode);
    }
  }, [earlyBirdCoupon]);

  const isMatched = matchedAgeBracket.startsWith('You are registering');

  const handleCustomerInfoSubmit = async () => {
    setButtonClicked(true);

    if (
      earlyBirdCoupon?.couponCode &&
      formik.values.couponCode !== earlyBirdCoupon.couponCode
    ) {
      formik.setFieldValue('couponCode', earlyBirdCoupon.couponCode);
    }

    const errors = await formik.validateForm();

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
  };

  useEffect(() => {
    setErrorList(Object.keys(formik.errors));
  }, [formik.errors]);

  const steps = [
    {
      title: 'Personal Details',
      stepNo: '1',
    },
    {
      title: 'Payment Details',
      stepNo: '2',
    },
    {
      title: 'Order Confirmation',
      stepNo: '3',
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return event ? (
          <CustomerInfo
            eventCategory={event}
            categoryMinimumAge={categoryMinimumAge}
            formik={formik}
            categoryNames={categoryNames}
            customSlug={event.slug}
            matchedAgeBracket={matchedAgeBracket}
            isMatched={isMatched}
            coupon={earlyBirdCoupon}
            earlyBird={earlyBirdCoupon}
            couponError={couponError}
          />
        ) : null;

      case 1:
        return formValues && event ? (
          <PaymentInfo
            formValues={formValues}
            payAmount={event.category?.[0]?.amount}
            event={event}
          />
        ) : null;

      default:
        return null;
    }
  };

  if (isEventLoading || loading) return <BlockingLoader />;

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center p-8 max-w-md'>
          <h2 className='text-xl font-bold text-red-600 mb-4'>Error</h2>
          <p className='text-gray-700'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <div className='w-full mb-8 flex justify-center'>
        <div className='flex items-center w-full max-w-3xl'>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index < currentStep
                      ? 'bg-blue-600 text-white border-blue-600'
                      : index === currentStep
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {index < currentStep ? '✓' : step.stepNo}
                </div>
                <div className='text-xs mt-1 text-center'>{step.title}</div>
              </div>

              {index < steps.length - 1 && (
                <div className='flex-1 h-0.5 mx-2 bg-gray-300'>
                  <div
                    className='h-full bg-blue-600'
                    style={{ width: index < currentStep ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className='mb-10 bg-white rounded-lg shadow-md'>
        {renderStepContent()}
      </div>

      <div className='mt-8 flex flex-col md:flex-row gap-4'>
        {buttonClicked && errorList.length > 0 && currentStep === 0 && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4 w-full'>
            <h3 className='text-red-700 font-medium mb-2'>
              Please correct the following errors:
            </h3>
            <ul className='list-disc pl-5'>
              {errorList.map((field, index) => (
                <li className='text-red-600 text-sm' key={index}>
                  {formik.errors[field as keyof typeof formik.errors]
                    ? String(formik.errors[field as keyof typeof formik.errors])
                    : `${field} is required`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {couponError && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4 w-full'>
            <h3 className='text-red-700 font-medium mb-2'>Coupon Error</h3>
            <p className='text-red-600 text-sm'>{couponError}</p>
          </div>
        )}

        <div className='flex gap-4 ml-auto'>
          {currentStep === 0 ? (
            <button
              className='px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50'
              onClick={handleCustomerInfoSubmit}
              disabled={loading}
              type='button'
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StepperBooking;
