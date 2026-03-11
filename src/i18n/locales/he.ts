const he = {
  // Navigation & Sidebar
  nav: {
    dashboard: "לוח בקרה",
    patients: "מטופלים",
    clinics: "מרפאות",
    modules: "מודולים",
    medications: "תרופות",
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
  view: "צפייה בפרטים",

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
  // Medications
  medications: {
    title: "תרופות", 
    allMedications: "כל התרופות", 
    searchPlaceholder: "חיפוש תרופה...", 
    sort: "'מיון: א'-ת",
    noData: "לא נמצאו תרופות מתאימות", 
  },

  // Patient Medications
   patientMeds: {
    title: "התרופות שלי",
    addMedication: "הוסף תרופה",
    searchPlaceholder: "חיפוש תרופות...",
    standardDosage: "מינון סטנדרטי",
    intakeLogTitle: "יומן קבלת תרופות",
    refreshData: "רענון נתונים",
    regularDosage: "מינון רגיל",
    activeStatus: "פעיל",
    newPrescription: "מרשם חדש",
    configureSchedule: "הגדרת לוח זמנים",
    medicationLabel: "תרופה",
    timelineLabel: "לוח זמנים",
    dosageLabel: "מינון",
    startDate: "תאריך התחלה",
    endDate: "תאריך סיום",
    amount: "כמות",
    unit: "יחידה",
    frequencyLabel: "תדירות",
    frequencyOptions: {
      once: "חד פעמי",
      daily: "יומי",
      weekly: "שבועי",
      monthly: "חודשי"},
    timesPerDay: "כמה פעמים ביום",
    addSlot: "הוסף זמן",
    finalize: "סיום מרשם",
    cancel: "ביטול",
    questions: {
      whichDays: "באילו ימים בשבוע?",
      whichWeeks: "באילו שבועות של החודש?"},
    units: {
       ml: "מ'ל",
       mg: "מ'ג",
       tabs: "טבליות"},
    days: {
    monday: "שני", tuesday: "שלישי", wednesday: "רביעי", 
    thursday: "חמישי", friday: "שישי", saturday: "שבת", sunday: "ראשון"},
    weeks: {
    1: "שבוע 1", 2: "שבוע 2", 3: "שבוע 3", 4: "שבוע 4"},
    deleteConfirm: {
    title: "האם אתה בטוח?",
    description: "פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את התרופה מרשומת המטופל.",
    cancel: "ביטול",
    confirm: "מחק תרופה"},
    filters: {
      dateFrom: "מתאריך:",
      medication: "תרופה:",
      allMeds: "כל התרופות"},
    table: {
      intakeDate: "תאריך נטילה",
      intakeTime: "שעת נטילה",
      medId: "מזהה תרופה",
      medName: "שם תרופה",
      form: "צורה",
      dosage: "מינון"}
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
  // Modules
  modules: {
    title: "המודולות שלי",
    cards: {
      exams: {
        title: "מבחנים",
        description: ".בדיקת כשירות, מבחני ידע, וסימולציות קלינית",
      },
      questionnaires: {
        title: "שאלונים",
        description: ".סקרי שביעות רצון, הערכות תקופתיות ושאלונים רפואיים",
      },
      medications: {
        title: "תרופות",
        description: ".ניהול מרשמים, מעקב מינונים, והתראות על רגישויות",
      },
      sensors: {
        title: "חיישנים",
        description: ".ניטור בזמן אמת של מכשור רפואי ומדדי מטופלים",
      },
      activities: {
        title: "פעילויות",
        description: ".תזמון תורנויות, סדנאות והדרכות צוות",
      },
    },
  },
} as const;

export default he;
