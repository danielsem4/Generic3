const he = {
  // Navigation & Sidebar
  nav: {
    dashboard: "לוח בקרה",
    patient: "מטופלים",
    clinics: "מרפאות",
    modules: "מודולים",
    appointments: "תורים",
    settings: "הגדרות",
    reports: "דוחות",
    pageNotReady: "דף {{title}} עדיין לא קיים!",
    logout: "התנתקות",
    logoutConfirmTitle: "האם אתה בטוח שברצונך להתנתק?",
    logoutConfirmDesc: "תנותק מהמערכת ותועבר למסך ההתחברות.",
    cancel: "ביטול",
    logoutConfirm: "כן, התנתק",
  },

  // Login
  login: {
    title: "התחברות לחשבון שלך",
    description: "הזן את האימייל שלך למטה כדי להתחבר לחשבונך",
    email: "אימייל",
    password: "סיסמה",
    placeholder: "m@example.com",
    forgotPassword: "שכחת את הסיסמה?",
    submit: "התחברות",
    submitting: "מתחבר...",
    errorMissing: "אנא מלא את כל השדות.",
    errorFailed: "ההתחברות נכשלה. אנא בדוק את פרטי ההתחברות ונסה שוב.",
    successTitle: "ההתחברות הצליחה!",
    successDesc: "מעביר לדף הבית...",
    failedTitle: "ההתחברות נכשלה",
    failedDesc: "אנא בדוק את פרטי ההתחברות.",
  },

  // Home / Dashboard
  home: {
    loading: "טוען נתונים...",
    error: "שגיאה בטעינת נתונים",
    patients: "מטופלים",
    clinics: "מרפאות",
    modules: "מודולים",
    medications: "תרופות",
    latestUsers: "משתמשים אחרונים",
    updatedNow: "עודכן כעת.",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    email: "אימייל",
    phone: "מספר טלפון",
    role: "תפקיד",
    view: "צפייה",
    viewPatient: "צפה במטופל",
    noData: "אין נתוני פרופיל משתמש זמינים.",
    showing: "מציג {{count}} מתוך {{total}} רשומות.",
  },

  // Patients
patients: {
  title: "ניהול מטופלים",
  description: "צפייה וניהול כל רשומות המטופלים במערכת",
  addNew: "הוספת מטופל חדש",
  searchPlaceholder: "חיפוש לפי שם, אימייל, ת.ז או טלפון...",
  tableTitle: "רשימת מטופלים רשומים",
  noResults: "לא נמצאו מטופלים התואמים את החיפוש שלך.",
  columnName: "שם מלא",
  columnEmail: "כתובת אימייל",
  columnPhone: "מספר טלפון",
  columnStatus: "סטטוס / תפקיד",
  columnActions: "פעולות",
  loading: "טוען רשומות מטופלים...",
  columnId: "תעודת זהות",
  columnLastVisit: "ביקור אחרון",
  statusActive: "פעיל",
  statusPending: "ממתין לבדיקה",
  statusFollowUp: "במעקב",

  errFirstName: "שם פרטי הוא שדה חובה",
  errLastName: "שם משפחה הוא שדה חובה",
  errEmail: "כתובת אימייל לא תקינה",
  errPhone: "חובה להזין 10 ספרות",
  errPassMin: "הסיסמה חייבת להכיל 6 תווים",
  errPassMatch: "הסיסמאות אינן זהות",
  
  registerTitle: "הרשמה",
  registerButton: "הרשם",

  firstNameLabel: "שם פרטי",
  lastNameLabel: "שם משפחה",
  emailLabel: "אימייל",
  phoneNumberLabel: "טלפון",
  passwordLabel: "סיסמה",
  confirmPasswordLabel: "אימות סיסמה",

  firstNamePlaceholder: "",
  lastNamePlaceholder: "",
  emailPlaceholder: "",
  phoneNumberPlaceholder: "",
  passwordPlaceholder: "********",
  confirmPasswordPlaceholder: "********",
},

  // Settings
  settings: {
    title: "הגדרות",
    language: "שפה",
    languageDesc: "בחר את השפה המועדפת עליך. הממשק יתעדכן מיד.",
  },

  // Not Found / 404
  notFound: {
    title: "404",
    subtitle: "הדף לא נמצא",
    back: "חזרה ללוח הבקרה",
  },

  // Error
  error: {
    title: "משהו השתבש",
    fallback: "אירעה שגיאה בלתי צפויה",
    back: "חזרה ללוח הבקרה",
  },

  // Common
  common: {
    toggleSidebar: "החלף סרגל צד",
    sessionExpired: "פג תוקף ההפעלה. אנא התחבר שוב.",
  },
} as const;

export default he;
