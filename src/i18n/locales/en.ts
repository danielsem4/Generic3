const en = {
  // Navigation & Sidebar
  nav: {
    dashboard: "Dashboard",
    patients: "Patients",
    clinics: "Clinics",
    modules: "Modules",
    medications: "Medications",
    settings: "Settings",
    reports: "Reports",
    pageNotReady: "{{title}} page does not exist yet!",
    logout: "Logout",
    logoutConfirmTitle: "Are you sure you want to logout?",
    logoutConfirmDesc: "You will be signed out and redirected to the login screen.",
    cancel: "Cancel",
    logoutConfirm: "Yes, logout",
  },

  // Login
  login: {
    title: "Login to your account",
    description: "Enter your email below to login to your account",
    email: "Email",
    password: "Password",
    placeholder: "m@example.com",
    forgotPassword: "Forgot your password?",
    submit: "Login",
    submitting: "Logging in...",
    errorMissing: "Please fill in all fields.",
    errorFailed: "Login failed. Please check your credentials and try again.",
    successTitle: "Login successful!",
    successDesc: "Redirecting to home...",
    failedTitle: "Login failed",
    failedDesc: "Please check your credentials.",
  },

  // Home / Dashboard
  home: {
    loading: "Loading data...",
    error: "Error loading data",
    patients: "Patients",
    clinics: "Clinics",
    modules: "Modules",
    medications: "Medications",
    latestUsers: "Latest users",
    updatedNow: "Updated just now.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    role: "Role",
    view: "View",
    viewPatient: "View patient",
    noData: "No user profile data available.",
    showing: "Showing {{count}} of {{total}} total entries.",
  },

  // Patients - English
patients: {
  title: "Patient Management",
  description: "View and manage all patient records in the system",
  addNew: "Add New Patient",
  searchPlaceholder: "Search by name, email, ID or phone...",
  tableTitle: "Registered Patients List",
  noResults: "No patients found matching your search.",
  columnName: "Full Name",
  columnEmail: "Email Address",
  columnPhone: "Phone Number",
  columnStatus: "Status / Role",
  columnActions: "Actions",
  loading: "Loading patient records...",
  columnId: "ID Number",
  columnLastVisit: "Last Visit",
  statusActive: "Active",
  statusPending: "Pending Review",
  statusFollowUp: "In Follow-up",
  view: "View Details",

  errFirstName: "First name is required",
  errLastName: "Last name is required",
  errEmail: "Invalid email address",
  errPhone: "Phone number must be 10 digits",
  errPassMin: "Password must be at least 6 characters",
  errPassMatch: "Passwords do not match",
  
  registerTitle: "Registration",
  registerButton: "Register",
  
  firstNameLabel: "First Name",
  lastNameLabel: "Last Name",
  emailLabel: "Email",
  phoneNumberLabel: "Phone Number",
  passwordLabel: "Password",
  confirmPasswordLabel: "Confirm Password",

  firstNamePlaceholder: "",
  lastNamePlaceholder: "",
  emailPlaceholder: "",
  phoneNumberPlaceholder: "",
  passwordPlaceholder: "********",
  confirmPasswordPlaceholder: "********",
},

  // Medications
  medications: {
    title: "Medications", 
    allMedications: "All Medications", 
    searchPlaceholder: "...Search for a medication", 
    sort: "Sort: A-Z", 
    noData: "No matching medications found", 
  },

  // patient medications
  patientMeds: {
    title: "My Medications",
    addMedication: "Add Medication",
    searchPlaceholder: "Search medications...",
    standardDosage: "Standard Dosage",
    intakeLogTitle: "Medication Intake Log",
    refreshData: "Refresh Data",
    regularDosage: "Regular Dosage",
    activeStatus: "Active",
    newPrescription: "New Prescription",
    configureSchedule: "Configure medication schedule and dosage.",
    medicationLabel: "Medication",
    timelineLabel: "Timeline",
    dosageLabel: "Dosage",
    startDate: "Start Date",
    endDate: "End Date",
    amount: "Amount",
    unit: "Unit",
    frequencyLabel: "Frequency & Schedule",
    frequencyOptions: {
      once: "Once",
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly"},
    timesPerDay: "Times Per Day",
    addSlot: "Add Slot",
    finalize: "Finalize Prescription",
    cancel: "Cancel",
    questions: {
      whichDays: "Which Days of the Week?",
      whichWeeks: "Which Weeks of the Month?"},
    units: {
       ml: "ml",
       mg: "mg",
       tabs: "Tablet(s)"},
    days: {
    monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", 
    thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday"},
    weeks: {
    1: "1st Week", 2: "2nd Week", 3: "3rd Week", 4: "4th Week"},
    deleteConfirm: {
    title: "Are you absolutely sure?",
    description: "This action cannot be undone. This will permanently delete the medication from the patient's record.",
    cancel: "Cancel",
    confirm: "Delete Medication"},
    filters: {
      dateFrom: "Date From:",
      medication: "Medication:",
      allMeds: "All Medications"},
    table: {
      intakeDate: "Intake Date",
      intakeTime: "Intake Time",
      medId: "Med ID",
      medName: "Med Name",
      form: "Form",
      dosage: "Dosage"}
  },
  
  // Settings
  settings: {
    title: "Settings",
    language: "Language",
    languageDesc: "Select your preferred language. The interface will update immediately.",
  },

  // Not Found / 404
  notFound: {
    title: "404",
    subtitle: "Page not found",
    back: "Go to Dashboard",
  },

  // Error
  error: {
    title: "Something went wrong",
    fallback: "An unexpected error occurred",
    back: "Go to Dashboard",
  },

  // Common
  common: {
    toggleSidebar: "Toggle sidebar",
    sessionExpired: "Session expired. Please log in again.",
  },

  // Modules
modules: {
  title: "My Modules",
  cards: {
    exams: {
      title: "Exams",
      description: "Competency assessment, knowledge tests, and clinical simulations.",
    },
    questionnaires: {
      title: "Questionnaires",
      description: "Satisfaction surveys, periodic assessments, and medical questionnaires.",
    },
    medications: {
      title: "Medications",
      description: "Prescription management, dose monitoring, and allergy alerts.",
    },
    sensors: {
      title: "Sensors",
      description: "Real-time monitoring of medical devices and patient vital signs.",
    },
    activities: {
      title: "Activities",
      description: "Shift scheduling, workshops, and staff training.",
    },
  },
},

} as const;

export default en;
