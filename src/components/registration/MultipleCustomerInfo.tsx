import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment";

interface EventCategory {
  id: string;
  date: string;
  category: Array<{
    name: string;
    gender: string;
  }>;
}

interface RunnerClub {
  id: string;
  name: string;
  isEducationInstitution?: boolean;
  isCompany?: boolean;
  isLocation?: boolean;
}

interface Participant {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  runnerClub: string;
  educationInstitution: string;
  company: string;
  bibDistributionLocation: string;
  dateOfBirth: string;
  tShirtSize: string;
  nameOfTheBib: string;
  bloodGroup: string;
  contactName: string;
  contactNumber: string;
  street: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  medicalIssue: string;
  categoryName: string;
  acceptedTerms: boolean;
  additionalTermsAndConditions: boolean;
  couponCode: string;
  addNewQuestion: string;
  enableWhatsApp: boolean;
  whatsAppNumber: string;
  membershipId: string;
  nameOnTheCertificate: string;
  isPriorityLineUp: boolean | null;
  timingSubmission: string;
  jatreDistance: string;
  garminLinks: string;
  timingSlot: string;
  teamName: string;
  teamContactPersonNumber: string;
  idCard: string;
  merchandiseId: number | null;
  eventId: string;
}

interface VerificationData {
  email?: string;
  phoneNumber?: string;
}

interface Props {
  registeredParticipants: Participant[];
  setRegisteredParticipants: React.Dispatch<
    React.SetStateAction<Participant[]>
  >;
  handleStore: (participants: Participant[]) => void;
  onParticipantsUpdate: (totalParticipants: number, allEmpty: boolean) => void;
  counts: Record<string, number>;
  findCoupon: (code: string) => void;
  formik: any;
  eventCategory: EventCategory;
  categoryNames: string[];
  categoryMinimumAge: Record<string, number>;
  customSlug: string;
  isMatched: boolean;
  matchedAgeBracket: string;
}

const TShirtSizeModal: React.FC<{
  show: boolean;
  handleClose: () => void;
  customSlug: string;
  eventCategory: EventCategory;
}> = ({ show, handleClose, customSlug, eventCategory }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          onClick={handleClose}
        />
        <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6'>
          <div className='flex items-center justify-between border-b border-gray-200 pb-3'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Size Chart
            </h3>
            <button
              onClick={handleClose}
              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <span className='sr-only'>Close</span>
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='mt-4'>{/* Size chart content would go here */}</div>
        </div>
      </div>
    </div>
  );
};

const TermsAndConditionsPopover: React.FC<{
  showPopover: boolean;
  onClose: () => void;
}> = ({ showPopover, onClose }) => {
  if (!showPopover) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
          onClick={onClose}
        />
        <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 max-h-96 overflow-y-auto'>
          <div className='flex items-center justify-between border-b border-gray-200 pb-3'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Terms and Conditions
            </h3>
            <button
              onClick={onClose}
              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <span className='sr-only'>Close</span>
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='mt-4 space-y-4'>
            <h1 className='text-xl font-semibold mb-4'>
              NovaRace Event Terms and Conditions
            </h1>
            <p className='text-sm text-gray-600'>
              Welcome to NovaRace! Before participating in any of our events,
              please read and agree to the following terms and conditions:
            </p>

            <div className='space-y-4'>
              <div>
                <h2 className='text-base font-medium'>
                  Participant Responsibilities:
                </h2>
                <ul className='list-disc list-inside text-sm text-gray-600 mt-2 space-y-1'>
                  <li>
                    By registering for an event on NovaRace, participants
                    acknowledge and accept that they are solely responsible for
                    their own safety, health, and actions during the event.
                  </li>
                  <li>
                    Participants must comply with the rules, regulations, and
                    guidelines set by the event organizer.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className='text-base font-medium'>Personal Information:</h2>
                <ul className='list-disc list-inside text-sm text-gray-600 mt-2 space-y-1'>
                  <li>
                    NovaRace collects personal information for the sole purpose
                    of event registration and communication.
                  </li>
                  <li>
                    Participants&apos; personal information will not be shared,
                    sold, or used for any other purposes without explicit
                    consent.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className='text-base font-medium'>Liability Waiver:</h2>
                <ul className='list-disc list-inside text-sm text-gray-600 mt-2 space-y-1'>
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
            </div>

            <p className='text-sm text-gray-600 mt-4'>
              By registering for a NovaRace event, participants confirm that
              they have read, understood, and agreed to these terms and
              conditions.
            </p>

            <p className='text-sm text-gray-600'>
              If you have any questions, please contact us at{" "}
              <a
                href='mailto:support@novarace.in'
                className='text-blue-600 hover:text-blue-800'
              >
                support@novarace.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultipleCustomerInfo: React.FC<Props> = ({
  registeredParticipants,
  setRegisteredParticipants,
  handleStore,
  onParticipantsUpdate,
  counts,
  findCoupon,
  formik,
  eventCategory,
  categoryNames,
  categoryMinimumAge,
  customSlug,
  isMatched,
  matchedAgeBracket,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showTermsPopover, setShowTermsPopover] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [runnerClub, setRunnerClub] = useState<RunnerClub[]>([]);
  const [institution, setInstitution] = useState<RunnerClub[]>([]);
  const [company, setCompany] = useState<RunnerClub[]>([]);
  const [bibDistributionLocation, setBibDistributionLocation] = useState<
    RunnerClub[]
  >([]);
  const [showOthersField, setShowOthersField] = useState(false);
  const [showSchoolOthersField, setShowSchoolOthersField] = useState(false);
  const [showCompanyOthersField, setShowCompanyOthersField] = useState(false);
  const [showBibOthersField, setShowBibOthersField] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupPhoto, setShowPopupPhoto] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const IndianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const categoryCounts = Object.fromEntries(
    Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([index, count]) => [
        eventCategory?.category[Number(index)]?.name,
        count,
      ])
  );

  const totalParticipants = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );
  const allCategoriesEmpty = Object.values(counts).every(
    (count) => count === 0
  );
  const usedTimeSlots = registeredParticipants.map((item) => item.timingSlot);

  const calculateAge = useMemo(() => {
    return (dateOfBirth: string) => {
      const birthDate = new Date(dateOfBirth);
      const currentDate = eventCategory ? new Date(eventCategory.date) : null;
      let age: number;

      if (currentDate) {
        age = currentDate.getFullYear() - birthDate.getFullYear();
      } else {
        return 0;
      }

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
  }, [eventCategory?.date]);

  const [age, setAge] = useState(calculateAge(formik.values.dateOfBirth));

  const handleDateChange = useCallback(
    (date: Date) => {
      formik.setFieldTouched("dateOfBirth", true);
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
      formik.setFieldValue("dateOfBirth", utcDate);

      const newAge = calculateAge(date.toString());
      setAge(newAge);
    },
    [formik.setFieldValue, calculateAge]
  );

  const createGenderObject = (categories: EventCategory["category"]) => {
    const genderObject: Record<string, string> = {};
    categories?.forEach((category) => {
      genderObject[category.name] = category.gender;
    });
    return genderObject;
  };

  const genderObject = createGenderObject(eventCategory?.category);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/users/getAllRunnerClub");
      const sortedData = response.data.sort((a: RunnerClub, b: RunnerClub) => {
        if (a.name === "Others") return 1;
        if (b.name === "Others") return -1;
        return a.name.localeCompare(b.name);
      });

      setInstitution(
        sortedData?.filter(
          (item: RunnerClub) => item?.isEducationInstitution === true
        )
      );
      setRunnerClub(
        sortedData?.filter(
          (item: RunnerClub) =>
            item?.isEducationInstitution !== true &&
            item?.isCompany !== true &&
            item?.isLocation !== true
        )
      );
      setCompany(
        sortedData?.filter((item: RunnerClub) => item?.isCompany === true)
      );
      setBibDistributionLocation(
        sortedData?.filter((item: RunnerClub) => item?.isLocation === true)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOptions(
      runnerClub.filter((runner) => runner?.name.toLowerCase().includes(term))
    );
  };

  const handleOptionSelect = (value: string) => {
    formik.setFieldValue("runnerClub", value);
    setShowOthersField(value === "OTHERS");
    setIsDropdownOpen(false);
  };
  const handleSearchSchool = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSchoolOptions(
      institution?.filter((runner) => runner?.name.toLowerCase().includes(term))
    );
  };

  const handleOptionSelectSchool = (value: string) => {
    formik.setFieldValue("educationInstitution", value);
    setShowSchoolOthersField(value === "OTHERS");
    setIsSchoolDropdownOpen(false);
  };

  const handleSearchCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCompanyOptions(
      company?.filter((runner) => runner?.name.toLowerCase().includes(term))
    );
  };

  const handleOptionSelectCompany = (value: string) => {
    formik.setFieldValue("company", value);
    setShowCompanyOthersField(value === "OTHERS");
    setIsCompanyDropdownOpen(false);
  };

  const handleSearchBibLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredBibLocationOptions(
      bibDistributionLocation?.filter((runner) =>
        runner?.name.toLowerCase().includes(term)
      )
    );
  };

  const handleOptionSelectBibLocation = (value: string) => {
    formik.setFieldValue("bibDistributionLocation", value);
    setShowBibOthersField(value === "OTHERS");
    setIsBibLocationDropdownOpen(false);
  };

  const addParticipant = (participantData: Participant) => {
    setRegisteredParticipants((prev) => [...prev, participantData]);
  };

  const handleSaveParticipants = async () => {
    await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((acc: Record<string, boolean>, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    if (Object.keys(formik.errors).length > 0) {
      console.log("Validation errors:", formik.errors);
      return;
    }

    const newParticipant: Participant = {
      ...formik.values,
      categoryName: formik.values.categoryName || "",
    };

    if (editingIndex !== null) {
      setRegisteredParticipants((prev) =>
        prev.map((p, index) =>
          index === editingIndex ? { ...p, ...newParticipant } : p
        )
      );
    } else {
      addParticipant(newParticipant);
    }

    const nextCount =
      editingIndex !== null
        ? registeredParticipants.length
        : registeredParticipants.length + 1;
    if (nextCount < totalParticipants) {
      formik.resetForm({
        values: {
          ...formik.initialValues,
          eventId: eventCategory?.id || "",
          categoryName: selectedCategory || "",
          couponCode: formik.values.couponCode,
          teamName: formik.values.teamName,
          teamContactPersonNumber: formik.values.teamContactPersonNumber,
        },
      });
    }

    setModalOpen(false);
    setEditingIndex(null);
  };

  const handleEdit = (participant: Participant, index: number) => {
    setEditingIndex(index);
    setSelectedCategory(participant.categoryName);
    setModalOpen(true);
    formik.setValues(participant);
  };

  const handleDelete = (indexToDelete: number, category: string) => {
    setRegisteredParticipants((prev) =>
      prev.filter((participant, index) => index !== indexToDelete)
    );

    formik.resetForm({
      values: {
        ...formik.initialValues,
        eventId: eventCategory?.id || "",
        categoryName: selectedCategory || "",
        couponCode: formik.values.couponCode,
        teamName: formik.values.teamName,
        teamContactPersonNumber: formik.values.teamContactPersonNumber,
      },
    });
  };

  useEffect(() => {
    const eventId = eventCategory ? eventCategory?.id : null;
    formik.setFieldValue("eventId", eventId);
  }, [eventCategory]);

  useEffect(() => {
    if (selectedCategory) {
      formik.setFieldValue("categoryName", selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    onParticipantsUpdate(totalParticipants, allCategoriesEmpty);
  }, [totalParticipants, allCategoriesEmpty, onParticipantsUpdate]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredOptions(runnerClub);
    setFilteredSchoolOptions(institution);
    setFilteredCompanyOptions(company);
    setFilteredBibLocationOptions(bibDistributionLocation);
  }, [runnerClub, institution, company, bibDistributionLocation]);

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
          formik.setFieldTouched("bibDistributionLocation", true);
        }
        setIsBibLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof handleStore === "function") {
      handleStore(registeredParticipants);
    } else {
      console.error("handleStore is not a function", handleStore);
    }
  }, [registeredParticipants, handleStore]);

  useEffect(() => {
    onParticipantsUpdate(
      registeredParticipants.length,
      Object.values(counts).every((count) => count === 0)
    );
  }, [registeredParticipants, counts, onParticipantsUpdate]);

  useEffect(() => {
    if (formik.values.isPriorityLineUp) {
      formik.setValues((prevValues: Participant) => ({
        ...prevValues,
        timingSubmission: prevValues.timingSubmission || "",
        jatreDistance: prevValues.jatreDistance || "",
        garminLinks: prevValues.garminLinks || "",
      }));
    } else {
      formik.setValues((prevValues: Participant) => ({
        ...prevValues,
        timingSubmission: "",
        jatreDistance: "",
        garminLinks: "",
      }));
    }
  }, [formik.values.isPriorityLineUp]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Multiple Customer Information
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        </div>

        <div className='mt-8'>
          <h3 className='text-xl font-semibold mb-4'>

          </h3>
          {registeredParticipants.length > 0 ? (
            <div className='space-y-4'>
              {registeredParticipants.map((participant, index) => (
                <div
                  key={index}
                  className='border border-gray-200 rounded-lg p-4'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-medium'>
                        {participant.firstName} {participant.lastName}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {participant.email}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {participant.categoryName}
                      </p>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleEdit(participant, index)}
                        className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(index, participant.categoryName)
                        }
                        className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No participants registered yet.</p>
          )}
        </div>
      </div>

      <TShirtSizeModal
        show={show}
        handleClose={handleClose}
        customSlug={customSlug}
        eventCategory={eventCategory}
      />

      <TermsAndConditionsPopover
        showPopover={showTermsPopover}
        onClose={() => setShowTermsPopover(false)}
      />
    </div>
  );
};

export default MultipleCustomerInfo;
