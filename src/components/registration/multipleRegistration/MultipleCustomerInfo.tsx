'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { FormikProps } from 'formik';

interface Category {
  id: string;
  name: string;
  minimumAge: number;
  maximumAge: number;
  gender: string;
  distance: string;
  amount: number;
  displayAmount?: string;
  ageBracket: AgeBracket[];
  isRelay?: 'YES' | 'NO';
  teamLimit?: string;
}

interface AgeBracket {
  id: string;
  name: string;
  minimumAge: number;
  maximumAge: number;
  gender: string;
}

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
  isGroupRegistrations?: boolean;
  isGroupRegistration?: boolean;
  isRelay?: boolean;
  eventPicture?: string;
}

interface RunnerClub {
  id: string;
  name: string;
  isEducationInstitution?: boolean;
  isCompany?: boolean;
  isLocation?: boolean;
}

interface VerificationData {
  email?: string;
  phoneNumber?: string;
}

interface Participant {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string | Date;
  tShirtSize: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  contactName?: string;
  contactNumber?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  medicalIssue?: string;
  whatsAppNumber: string;
  enableWhatsApp: boolean;
  runnerClub?: string;
  educationInstitution?: string;
  company?: string;
  bibDistributionLocation?: string;
  nameOfTheBib?: string;
  nameOnTheCertificate?: string;
  membershipId?: string;
  isPriorityLineUp?: boolean | null;
  timingSubmission?: string;
  jatreDistance?: string;
  garminLinks?: string;
  timingSlot?: string;
  teamName?: string;
  teamContactPersonNumber?: string;
  idCard?: string;
  merchandiseId?: number | null;
  categoryName?: string;
  eventId?: string;
  couponCode?: string;
  acceptedTerms?: boolean;
  additionalTermsAndConditions?: boolean;
  addNewQuestion?: string;
}

interface MultipleCustomerInfoProps {
  eventCategory: Event;
  categoryMinimumAge: { default: number };
  formik: FormikProps<any>;
  categoryNames: string[];
  customSlug: string;
  matchedAgeBracket: string;
  isMatched: boolean;
  findCoupon: (couponCode: string) => void;
  onParticipantsUpdate: (totalParticipants: number, allEmpty: boolean) => void;
  handleStore: (participants: Participant[]) => void;
  registeredParticipants: Participant[];
  setRegisteredParticipants: (
    participants: Participant[] | ((prev: Participant[]) => Participant[])
  ) => void;
  counts: Record<string, number>;
  verificationData?: VerificationData;
  isEmailVerificationEnabled?: boolean;
  isSmsVerificationEnabled?: boolean;
}

// T-Shirt Size Modal Component
const TShirtSizeModal: React.FC<{
  show: boolean;
  handleClose: () => void;
  customSlug: string;
  eventCategory: Event;
}> = ({ show, handleClose, customSlug, eventCategory }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full'>
          <div className='bg-blue-600 px-4 py-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg leading-6 font-medium text-white'>
                Size Chart
              </h3>
              <button
                onClick={handleClose}
                className='text-white hover:text-gray-200'
              >
                <span className='sr-only'>Close</span>
                <svg
                  className='h-6 w-6'
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
          </div>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Size
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Chest (inches)
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Length (inches)
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {[
                    { size: 'XS', chest: '34', length: '26' },
                    { size: 'S', chest: '36', length: '27' },
                    { size: 'M', chest: '38', length: '28' },
                    { size: 'L', chest: '40', length: '29' },
                    { size: 'XL', chest: '42', length: '30' },
                    { size: 'XXL', chest: '44', length: '31' },
                    { size: 'XXXL', chest: '46', length: '32' },
                  ].map((item, index) => (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {item.size}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.chest}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {item.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terms and Conditions Modal Component
const TermsAndConditionsModal: React.FC<{
  showPopover: boolean;
  onClose: () => void;
}> = ({ showPopover, onClose }) => {
  if (!showPopover) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-96 overflow-y-auto'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h1 className='text-xl font-semibold text-gray-900'>
                NovaRace Event Terms and Conditions
              </h1>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600'
              >
                <span className='sr-only'>Close</span>
                <svg
                  className='h-6 w-6'
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

            <div className='space-y-4 text-sm text-gray-700'>
              <p>
                Welcome to NovaRace! Before participating in any of our events,
                please read and agree to the following terms and conditions:
              </p>

              <div className='space-y-3'>
                <div>
                  <h2 className='text-base font-medium text-gray-900 mb-2'>
                    Participant Responsibilities:
                  </h2>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>
                      By registering for an event on NovaRace, participants
                      acknowledge and accept that they are solely responsible
                      for their own safety, health, and actions during the
                      event.
                    </li>
                    <li>
                      Participants must comply with the rules, regulations, and
                      guidelines set by the event organizer.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='text-base font-medium text-gray-900 mb-2'>
                    Personal Information:
                  </h2>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>
                      NovaRace collects personal information for the sole
                      purpose of event registration and communication.
                    </li>
                    <li>
                      Participants&apos; personal information will not be shared,
                      sold, or used for any other purposes without explicit
                      consent.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='text-base font-medium text-gray-900 mb-2'>
                    Liability Waiver:
                  </h2>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>
                      Participants understand and agree that NovaRace is not
                      liable for any injuries, damages, losses, or expenses that
                      may occur during the event.
                    </li>
                    <li>
                      Participants waive any claims against NovaRace and its
                      affiliates in connection with their participation in the
                      event.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='text-base font-medium text-gray-900 mb-2'>
                    Registration and Payment:
                  </h2>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>
                      Event registration is complete only upon receipt of
                      payment, and refunds are subject to the event organizer&apos;s
                      policies.
                    </li>
                    <li>
                      NovaRace does not store or handle payment information
                      directly. All transactions are securely processed through
                      third-party payment gateways.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='text-base font-medium text-gray-900 mb-2'>
                    Organizer Responsibility:
                  </h2>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>
                      NovaRace acts solely as a platform to facilitate event
                      registration and promotion. We do not assume
                      responsibility for the organization, conduct, or safety of
                      any events listed on our platform.
                    </li>
                    <li>
                      Event organizers are solely responsible for the planning,
                      execution, and safety measures of their respective events.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='text-base font-medium text-gray-900 mb-2'>
                    Event Changes or Cancellation:
                  </h2>
                  <ul className='list-disc pl-6 space-y-1'>
                    <li>
                      NovaRace reserves the right to modify event details,
                      including dates, times, and locations, at its discretion.
                    </li>
                    <li>
                      In the event of cancellation, NovaRace is not responsible
                      for any costs incurred by participants, such as travel or
                      accommodation expenses.
                    </li>
                  </ul>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <p>
                  By registering for a NovaRace event, participants confirm that
                  they have read, understood, and agreed to these terms and
                  conditions. NovaRace reserves the right to update or modify
                  these terms as needed. Participants are encouraged to review
                  the terms regularly for any changes.
                </p>
                <p className='mt-2'>
                  If you have any questions or concerns, please contact us at{' '}
                  <a
                    href='mailto:support@novarace.in'
                    className='text-blue-600 hover:text-blue-800'
                  >
                    support@novarace.in
                  </a>
                  .
                  <br />
                  Thank you for being part of the NovaRace community!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultipleCustomerInfo: React.FC<MultipleCustomerInfoProps> = ({
  eventCategory,
  categoryMinimumAge,
  formik,
  categoryNames,
  customSlug,
  matchedAgeBracket,
  isMatched,
  findCoupon,
  onParticipantsUpdate,
  handleStore,
  registeredParticipants,
  setRegisteredParticipants,
  counts,
  verificationData,
  isEmailVerificationEnabled = false,
  isSmsVerificationEnabled = false,
}) => {
  // State management
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [showTShirtModal, setShowTShirtModal] = useState(false);
  const [showTermsPopover, setShowTermsPopover] = useState(false);

  // Dropdown states
  const [runnerClub, setRunnerClub] = useState<RunnerClub[]>([]);
  const [institution, setInstitution] = useState<RunnerClub[]>([]);
  const [company, setCompany] = useState<RunnerClub[]>([]);
  const [bibDistributionLocation, setBibDistributionLocation] = useState<
    RunnerClub[]
  >([]);

  // Search and dropdown states
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<RunnerClub[]>([]);
  const [filteredSchoolOptions, setFilteredSchoolOptions] = useState<
    RunnerClub[]
  >([]);
  const [filteredCompanyOptions, setFilteredCompanyOptions] = useState<
    RunnerClub[]
  >([]);
  const [filteredBibLocationOptions, setFilteredBibLocationOptions] = useState<
    RunnerClub[]
  >([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isBibLocationDropdownOpen, setIsBibLocationDropdownOpen] =
    useState(false);

  // Others field states
  const [showOthersField, setShowOthersField] = useState(false);
  const [showSchoolOthersField, setShowSchoolOthersField] = useState(false);
  const [showCompanyOthersField, setShowCompanyOthersField] = useState(false);
  const [showBibOthersField, setShowBibOthersField] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Constants
  const tShirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
  ];

  const allTimeSlots = [
    '6:00 PM - 8:00 PM',
    '8:00 PM - 10:00 PM',
    '10:00 PM - 12:00 AM',
    '12:00 AM - 2:00 AM',
    '2:00 AM - 4:00 AM',
    '4:00 AM - 6:00 AM',
  ];

  // Calculate total participants and category counts
  const totalParticipants = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );
  const allCategoriesEmpty = Object.values(counts).every(
    (count) => count === 0
  );

  const categoryCounts = Object.fromEntries(
    Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([index, count]) => [
        eventCategory?.category[parseInt(index)]?.name,
        count,
      ])
  );

  // Age calculation function
  const calculateAge = useMemo(() => {
    return (dateOfBirth: string | Date) => {
      if (!dateOfBirth) return 0;
      const birthDate = new Date(dateOfBirth);
      const currentDate = eventCategory
        ? new Date(eventCategory.date)
        : new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      if (
        currentDate &&
        (currentDate.getMonth() < birthDate.getMonth() ||
          (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate()))
      ) {
        return age - 1;
      }
      return age;
    };
  }, [eventCategory?.date, eventCategory]);

  const [age, setAge] = useState(calculateAge(formik.values.dateOfBirth));

  // Handle date change
  const handleDateChange = useCallback(
    (date: string) => {
      formik.setFieldTouched('dateOfBirth', true);
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(
        adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
      );
      const utcDate = new Date(
        Date.UTC(
          adjustedDate.getFullYear(),
          adjustedDate.getMonth(),
          adjustedDate.getDate()
        )
      );
      formik.setFieldValue('dateOfBirth', utcDate);

      const newAge = calculateAge(date);
      setAge(newAge);
    },
    [formik, calculateAge]
  );

  // Create gender object
  const createGenderObject = (categories?: Category[]) => {
    const genderObject: Record<string, string> = {};
    categories?.forEach((category) => {
      genderObject[category.name] = category.gender;
    });
    return genderObject;
  };

  const genderObject = createGenderObject(eventCategory?.category);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockRunnerClubs: RunnerClub[] = [
          {
            id: '1',
            name: 'Others',
            isEducationInstitution: false,
            isCompany: false,
            isLocation: false,
          },
          {
            id: '2',
            name: 'Running Club A',
            isEducationInstitution: false,
            isCompany: false,
            isLocation: false,
          },
          {
            id: '3',
            name: 'School A',
            isEducationInstitution: true,
            isCompany: false,
            isLocation: false,
          },
          {
            id: '4',
            name: 'Company A',
            isEducationInstitution: false,
            isCompany: true,
            isLocation: false,
          },
          {
            id: '5',
            name: 'Location A',
            isEducationInstitution: false,
            isCompany: false,
            isLocation: true,
          },
        ];

        const sortedData = mockRunnerClubs.sort((a, b) => {
          if (a.name === 'Others') return 1;
          if (b.name === 'Others') return -1;
          return a.name.localeCompare(b.name);
        });

        setInstitution(
          sortedData.filter((item) => item.isEducationInstitution === true)
        );
        setRunnerClub(
          sortedData.filter(
            (item) =>
              !item.isEducationInstitution &&
              !item.isCompany &&
              !item.isLocation
          )
        );
        setCompany(sortedData.filter((item) => item.isCompany === true));
        setBibDistributionLocation(
          sortedData.filter((item) => item.isLocation === true)
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Set event ID effect
  useEffect(() => {
    const eventId = eventCategory ? eventCategory.id : null;
    formik.setFieldValue('eventId', eventId);
  }, [eventCategory, formik]);

  // Set category name effect
  useEffect(() => {
    if (selectedCategory) {
      // Get existing categories
      const existingCategories = formik.values.categoryName;
      
      if (Array.isArray(existingCategories)) {
        // If it's already an array, check if the category is already included
        if (!existingCategories.includes(selectedCategory)) {
          formik.setFieldValue('categoryName', [...existingCategories, selectedCategory]);
        }
      } else if (typeof existingCategories === 'string' && existingCategories) {
        // If it's a string and not empty, convert to array
        if (existingCategories !== selectedCategory) {
          formik.setFieldValue('categoryName', [existingCategories, selectedCategory]);
        }
      } else {
        // If it's empty or null, set as a single value
        formik.setFieldValue('categoryName', [selectedCategory]);
      }
    }
  }, [selectedCategory, formik]);

  // Verification data effect
  useEffect(() => {
    if (isEmailVerificationEnabled && verificationData?.email) {
      formik.setFieldValue('email', verificationData.email);
    }
    if (isSmsVerificationEnabled && verificationData?.phoneNumber) {
      formik.setFieldValue('mobileNumber', verificationData.phoneNumber);
    }

    // Set touched states
    if (formik.values.mobileNumber !== '' && !formik.touched.mobileNumber) {
      formik.setFieldTouched('mobileNumber', true);
    }
    if (formik.values.whatsAppNumber !== '' && !formik.touched.whatsAppNumber) {
      formik.setFieldTouched('whatsAppNumber', true);
    }
    if (formik.values.contactNumber !== '' && !formik.touched.contactNumber) {
      formik.setFieldTouched('contactNumber', true);
    }
    if (formik.values.dateOfBirth !== '' && !formik.touched.dateOfBirth) {
      formik.setFieldTouched('dateOfBirth', true);
    }
    if (formik.values.idCard !== '' && !formik.touched.idCard) {
      formik.setFieldTouched('idCard', true);
    }
    if (formik.values.gender !== '' && !formik.touched.gender) {
      formik.setFieldTouched('gender', true);
    }

    formik.validateForm();
  }, [
    isEmailVerificationEnabled,
    isSmsVerificationEnabled,
    verificationData,
    formik.values.mobileNumber,
    formik.values.whatsAppNumber,
    formik.values.contactNumber,
    formik.values.dateOfBirth,
    formik.values.gender,
    formik.values.idCard,
    formik,
  ]);

  // Update participants count effect - with debounce to prevent infinite loops
  useEffect(() => {
    // Use a ref to track if this is the first render
    const timeoutId = setTimeout(() => {
      onParticipantsUpdate(totalParticipants, allCategoriesEmpty);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [totalParticipants, allCategoriesEmpty, onParticipantsUpdate]);

  // Store participants effect - with debounce to prevent infinite loops
  useEffect(() => {
    if (typeof handleStore === 'function' && registeredParticipants.length > 0) {
      const timeoutId = setTimeout(() => {
        handleStore(registeredParticipants);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [registeredParticipants, handleStore]);

  // Search handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOptions(
      runnerClub.filter((runner) => runner.name.toLowerCase().includes(term))
    );
  };

  const handleOptionSelect = (value: string) => {
    formik.setFieldValue('runnerClub', value);
    setShowOthersField(value === 'OTHERS');
    setIsDropdownOpen(false);
  };

  const handleSearchSchool = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSchoolOptions(
      institution.filter((runner) => runner.name.toLowerCase().includes(term))
    );
  };

  const handleOptionSelectSchool = (value: string) => {
    formik.setFieldValue('educationInstitution', value);
    setShowSchoolOthersField(value === 'OTHERS');
    setIsSchoolDropdownOpen(false);
  };

  const handleSearchCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCompanyOptions(
      company.filter((runner) => runner.name.toLowerCase().includes(term))
    );
  };

  const handleOptionSelectCompany = (value: string) => {
    formik.setFieldValue('company', value);
    setShowCompanyOthersField(value === 'OTHERS');
    setIsCompanyDropdownOpen(false);
  };

  const handleSearchBibLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredBibLocationOptions(
      bibDistributionLocation.filter((runner) =>
        runner.name.toLowerCase().includes(term)
      )
    );
  };

  const handleOptionSelectBibLocation = (value: string) => {
    formik.setFieldValue('bibDistributionLocation', value);
    setShowBibOthersField(value === 'OTHERS');
    setIsBibLocationDropdownOpen(false);
  };

  // Update filtered options when data changes
  useEffect(() => {
    setFilteredOptions(runnerClub);
    setFilteredSchoolOptions(institution);
    setFilteredCompanyOptions(company);
    setFilteredBibLocationOptions(bibDistributionLocation);
  }, [runnerClub, institution, company, bibDistributionLocation]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsSchoolDropdownOpen(false);
        setIsCompanyDropdownOpen(false);
        if (!isBibLocationDropdownOpen) {
          formik.setFieldTouched('bibDistributionLocation', true);
        }
        setIsBibLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formik, isBibLocationDropdownOpen]);

  // Priority lineup effect
  useEffect(() => {
    if (formik.values.isPriorityLineUp) {
      formik.setValues((prevValues: Participant) => ({
        ...prevValues,
        timingSubmission: prevValues.timingSubmission || '',
        jatreDistance: prevValues.jatreDistance || '',
        garminLinks: prevValues.garminLinks || '',
      }));
    } else {
      formik.setValues((prevValues: Participant) => ({
        ...prevValues,
        timingSubmission: '',
        jatreDistance: '',
        garminLinks: '',
      }));
    }
  }, [formik.values.isPriorityLineUp, formik]);

  // Utility functions
  const getEmptyParticipant = (): Participant => ({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    dateOfBirth: '',
    tShirtSize: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: 'India',
    whatsAppNumber: '',
    enableWhatsApp: false,
  });

  const validateParticipant = (participant: Participant): string[] => {
    const errors: string[] = [];

    if (!participant.firstName) errors.push('First Name is required');
    if (!participant.lastName) errors.push('Last Name is required');
    if (!participant.email) errors.push('Email is required');
    if (!participant.email.includes('@')) errors.push('Invalid email format');
    if (!participant.mobileNumber) errors.push('Mobile Number is required');
    if (!participant.gender) errors.push('Gender is required');
    if (!participant.dateOfBirth) errors.push('Date of Birth is required');
    if (!participant.tShirtSize) errors.push('T-Shirt Size is required');
    if (!participant.address) errors.push('Address is required');
    if (!participant.city) errors.push('City is required');
    if (!participant.pincode) errors.push('Pincode is required');
    if (!participant.state) errors.push('State is required');
    if (!participant.whatsAppNumber) errors.push('WhatsApp Number is required');

    return errors;
  };

  const addParticipant = () => {
    const currentParticipant = { ...formik.values };
    const errors = validateParticipant(currentParticipant);

    if (errors.length > 0) {
      alert('Please fill all required fields:\n' + errors.join('\n'));
      return;
    }

    setRegisteredParticipants((prev) => [...prev, currentParticipant]);

    // Reset form for next participant
    formik.resetForm();
    formik.setValues(getEmptyParticipant());
    setCurrentParticipantIndex((prev) => prev + 1);
    setSelectedCategory('');
    setAge(0);
  };

  const editParticipant = (index: number) => {
    const participant = registeredParticipants[index];
    formik.setValues(participant);
    setEditingIndex(index);
    setIsEditing(true);
    setSelectedCategory(participant.categoryName || '');
    setAge(calculateAge(participant.dateOfBirth));
  };

  const updateParticipant = () => {
    const updatedParticipant = { ...formik.values };
    const errors = validateParticipant(updatedParticipant);

    if (errors.length > 0) {
      alert('Please fill all required fields:\n' + errors.join('\n'));
      return;
    }

    if (editingIndex !== null) {
      setRegisteredParticipants((prev) => {
        const updated = [...prev];
        updated[editingIndex] = updatedParticipant;
        return updated;
      });
    }

    // Reset editing state
    setIsEditing(false);
    setEditingIndex(null);
    formik.resetForm();
    formik.setValues(getEmptyParticipant());
    setSelectedCategory('');
    setAge(0);
  };

  const removeParticipant = (index: number) => {
    setRegisteredParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    formik.setFieldValue('couponCode', code);
    if (code && typeof findCoupon === 'function') {
      findCoupon(code);
    }
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  // Check if current participant is eligible for selected category
  const isEligibleForCategory = (categoryName: string) => {
    const category = eventCategory?.category.find(
      (cat) => cat.name === categoryName
    );
    if (!category) return false;

    const participantAge = age;
    const participantGender = formik.values.gender;

    const ageEligible =
      participantAge >= category.minimumAge &&
      participantAge <= category.maximumAge;
    const genderEligible =
      category.gender === 'BOTH' || category.gender === participantGender;

    return ageEligible && genderEligible;
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Participant Registration
        </h2>
        <p className='text-gray-600'>
          {isEditing
            ? 'Edit Participant Information'
            : 'Add Participant Information'}
        </p>
      </div>

      {/* Registered Participants Summary */}
      {registeredParticipants.length > 0 && (
        <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-semibold mb-3'>
            Registered Participants ({registeredParticipants.length})
          </h3>
          <div className='space-y-2'>
            {registeredParticipants.map((participant, index) => (
              <div
                key={index}
                className='flex items-center justify-between bg-white p-3 rounded border'
              >
                <div className='flex-1'>
                  <span className='font-medium'>
                    {participant.firstName} {participant.lastName}
                  </span>
                  <span className='text-gray-500 ml-2'>
                    ({participant.categoryName})
                  </span>
                  <span className='text-sm text-gray-400 ml-2'>
                    {participant.email}
                  </span>
                </div>
                <div className='flex space-x-2'>
                  <button
                    type='button'
                    onClick={() => editParticipant(index)}
                    className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => removeParticipant(index)}
                    className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={formik.handleSubmit} className='space-y-6'>
        {/* Category Selection */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value=''>Select Category</option>
              {categoryNames.map((categoryName, index) => (
                <option key={index} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Personal Information */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold mb-4'>Personal Information</h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name *
              </label>
              <input
                type='text'
                name='firstName'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.firstName && formik.errors.firstName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.firstName)}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name *
              </label>
              <input
                type='text'
                name='lastName'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.lastName && formik.errors.lastName
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.lastName)}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email *
              </label>
              <input
                type='email'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isEmailVerificationEnabled}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isEmailVerificationEnabled ? 'bg-gray-100' : ''
                } ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.email)}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Mobile Number *
              </label>
              <input
                type='tel'
                name='mobileNumber'
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isSmsVerificationEnabled}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSmsVerificationEnabled ? 'bg-gray-100' : ''
                } ${
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.mobileNumber)}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Gender *
              </label>
              <select
                name='gender'
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.gender && formik.errors.gender
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              >
                <option value=''>Select Gender</option>
                <option value='MALE'>Male</option>
                <option value='FEMALE'>Female</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.gender)}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Date of Birth *
              </label>
              <input
                type='date'
                name='dateOfBirth'
                value={
                  formik.values.dateOfBirth
                    ? new Date(formik.values.dateOfBirth)
                        .toISOString()
                        .split('T')[0]
                    : ''
                }
                onChange={(e) => handleDateChange(e.target.value)}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.dateOfBirth)}
                </p>
              )}
              {age > 0 && (
                <p className='text-sm text-gray-600 mt-1'>Age: {age} years</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                T-Shirt Size *
                <button
                  type='button'
                  onClick={() => setShowTShirtModal(true)}
                  className='ml-2 text-blue-500 hover:text-blue-700 text-xs'
                >
                  Size Chart
                </button>
              </label>
              <select
                name='tShirtSize'
                value={formik.values.tShirtSize}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.tShirtSize && formik.errors.tShirtSize
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              >
                <option value=''>Select Size</option>
                {tShirtSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {formik.touched.tShirtSize && formik.errors.tShirtSize && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.tShirtSize)}
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                WhatsApp Number *
              </label>
              <input
                type='tel'
                name='whatsAppNumber'
                value={formik.values.whatsAppNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.whatsAppNumber && formik.errors.whatsAppNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.whatsAppNumber &&
                formik.errors.whatsAppNumber && (
                  <p className='text-red-500 text-xs mt-1'>
                    {String(formik.errors.whatsAppNumber)}
                  </p>
                )}
            </div>

            <div className='flex items-center'>
              <input
                type='checkbox'
                name='enableWhatsApp'
                checked={formik.values.enableWhatsApp}
                onChange={formik.handleChange}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label className='ml-2 block text-sm text-gray-700'>
                Enable WhatsApp notifications
              </label>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold mb-4'>Address Information</h3>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Address *
              </label>
              <textarea
                name='address'
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formik.touched.address && formik.errors.address
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                required
              />
              {formik.touched.address && formik.errors.address && (
                <p className='text-red-500 text-xs mt-1'>
                  {String(formik.errors.address)}
                </p>
              )}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  City *
                </label>
                <input
                  type='text'
                  name='city'
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.city && formik.errors.city
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  required
                />
                {formik.touched.city && formik.errors.city && (
                  <p className='text-red-500 text-xs mt-1'>
                    {String(formik.errors.city)}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Pincode *
                </label>
                <input
                  type='text'
                  name='pincode'
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.pincode && formik.errors.pincode
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  required
                />
                {formik.touched.pincode && formik.errors.pincode && (
                  <p className='text-red-500 text-xs mt-1'>
                    {String(formik.errors.pincode)}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  State *
                </label>
                <select
                  name='state'
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formik.touched.state && formik.errors.state
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  required
                >
                  <option value=''>Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {formik.touched.state && formik.errors.state && (
                  <p className='text-red-500 text-xs mt-1'>
                    {String(formik.errors.state)}
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Country
                </label>
                <input
                  type='text'
                  name='country'
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100'
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Emergency Contact (Optional)
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Emergency Contact Name
              </label>
              <input
                type='text'
                name='emergencyContactName'
                value={formik.values.emergencyContactName || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Emergency Contact Number
              </label>
              <input
                type='tel'
                name='emergencyContactNumber'
                value={formik.values.emergencyContactNumber || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Medical Information (Optional)
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Blood Group
              </label>
              <select
                name='bloodGroup'
                value={formik.values.bloodGroup || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Medical Conditions
              </label>
              <textarea
                name='medicalConditions'
                value={formik.values.medicalConditions || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={3}
                placeholder='Any medical conditions, allergies, or medications...'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Coupon Code */}
        <div className='border-t pt-6'>
          <h3 className='text-lg font-semibold mb-4'>Coupon Code (Optional)</h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Coupon Code
              </label>
              <input
                type='text'
                name='couponCode'
                value={formik.values.couponCode || ''}
                onChange={handleCouponCodeChange}
                onBlur={formik.handleBlur}
                placeholder='Enter coupon code'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className='border-t pt-6'>
          <div className='flex items-start'>
            <input
              type='checkbox'
              name='acceptedTerms'
              checked={formik.values.acceptedTerms || false}
              onChange={formik.handleChange}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1'
              required
            />
            <label className='ml-2 block text-sm text-gray-700'>
              I accept the{' '}
              <button
                type='button'
                onClick={() => setShowTermsPopover(true)}
                className='text-blue-600 hover:text-blue-800 underline'
              >
                Terms and Conditions
              </button>
              *
            </label>
          </div>
          {formik.touched.acceptedTerms && formik.errors.acceptedTerms && (
            <p className='text-red-500 text-xs mt-1'>
              {String(formik.errors.acceptedTerms)}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className='border-t pt-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            {isEditing ? (
              <>
                <button
                  type='button'
                  onClick={updateParticipant}
                  className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  Update Participant
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setIsEditing(false);
                    setEditingIndex(null);
                    formik.resetForm();
                    formik.setValues(getEmptyParticipant());
                    setSelectedCategory('');
                    setAge(0);
                  }}
                  className='px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500'
                >
                  Cancel Edit
                </button>
              </>
            ) : (
              <button
                type='button'
                onClick={addParticipant}
                disabled={!selectedCategory || !formik.values.acceptedTerms}
                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Add Participant
              </button>
            )}

            {registeredParticipants.length > 0 && !isEditing && (
              <button
                type='submit'
                className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                Proceed to Payment ({registeredParticipants.length} participant
                {registeredParticipants.length !== 1 ? 's' : ''})
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Category Eligibility Warning */}
      {selectedCategory &&
        age > 0 &&
        !isEligibleForCategory(selectedCategory) && (
          <div className='mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md'>
            <p className='text-yellow-800'>
              <strong>Warning:</strong> Based on your age ({age}) and gender (
              {formik.values.gender}), you may not be eligible for the selected
              category &quot;{selectedCategory}&quot;. Please verify the category
              requirements.
            </p>
          </div>
        )}

      {/* Modals */}
      <TShirtSizeModal
        show={showTShirtModal}
        handleClose={() => setShowTShirtModal(false)}
        customSlug={customSlug}
        eventCategory={eventCategory}
      />

      <TermsAndConditionsModal
        showPopover={showTermsPopover}
        onClose={() => setShowTermsPopover(false)}
      />
    </div>
  );
};

export default MultipleCustomerInfo;
