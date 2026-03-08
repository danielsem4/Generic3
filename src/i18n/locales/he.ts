const he = {
  // Navigation & Sidebar
  nav: {
    dashboard: "לוח בקרה",
    patients: "מטופלים",
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
