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
    doctors: "Doctors",
    clinicManagers: "Clinic Managers",
    manage: "Manage",
    statistics: "Statistics",
    clinicModules: "Clinic Modules",
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
    clinicManagers: "Clinic Managers",
    doctors: "Doctors",
    evaluations: "Evaluations",
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
  
  togglePatient: "Patient",
  toggleResearch: "Research Patient",

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

  // Clinic Managers
  clinicManagers: {
    description: "View and manage all clinic managers in the system",
    searchPlaceholder: "Search by name, email or phone...",
  },

  // Doctors
  doctors: {
    description: "View and manage all doctors in this clinic",
    searchPlaceholder: "Search by name, email or phone...",
    addNew: "Add New Doctor",
    registerTitle: "Register Doctor",
    registerButton: "Register",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    emailLabel: "Email",
    phoneNumberLabel: "Phone Number",
    firstNamePlaceholder: "",
    lastNamePlaceholder: "",
    emailPlaceholder: "",
    phoneNumberPlaceholder: "",
  },

  // Medications
  medications: {
    title: "Medications", 
    allMedications: "All Medications", 
    searchPlaceholder: "...Search for a medication", 
    sort: "Sort: A-Z", 
    noData: "No matching medications found", 
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
