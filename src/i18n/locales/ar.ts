const ar = {
  // Navigation & Sidebar
  nav: {
    dashboard: "لوحة التحكم",
    patients: "المرضى",
    clinics: "العيادات",
    modules: "الوحدات",
    medications: "الأدوية",
    settings: "الإعدادات",
    reports: "التقارير",
    doctors: "الأطباء",
    clinicManagers: "مديرو العيادات",
    manage: "إدارة",
    statistics: "إحصائيات",
    clinicModules: "وحدات العيادة",
    pageNotReady: "صفحة {{title}} غير موجودة بعد!",
    logout: "تسجيل الخروج",
    logoutConfirmTitle: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    logoutConfirmDesc: "سيتم تسجيل خروجك وإعادة توجيهك إلى شاشة تسجيل الدخول.",
    cancel: "إلغاء",
    logoutConfirm: "نعم، تسجيل الخروج",
  },

  // Login
  login: {
    title: "تسجيل الدخول إلى حسابك",
    description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    placeholder: "m@example.com",
    forgotPassword: "نسيت كلمة المرور؟",
    submit: "تسجيل الدخول",
    submitting: "جارٍ تسجيل الدخول...",
    errorMissing: "يرجى ملء جميع الحقول.",
    errorFailed: "فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.",
    successTitle: "تم تسجيل الدخول بنجاح!",
    successDesc: "جارٍ إعادة التوجيه إلى الصفحة الرئيسية...",
    failedTitle: "فشل تسجيل الدخول",
    failedDesc: "يرجى التحقق من بياناتك.",
  },

  // Home / Dashboard
  home: {
    loading: "جارٍ تحميل البيانات...",
    error: "خطأ في تحميل البيانات",
    patients: "المرضى",
    clinics: "العيادات",
    modules: "الوحدات",
    medications: "الأدوية",
    clinicManagers: "مديرو العيادات",
    doctors: "الأطباء",
    evaluations: "التقييمات",
    latestUsers: "أحدث المستخدمين",
    updatedNow: "تم التحديث الآن.",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    role: "الدور",
    view: "عرض",
    viewPatient: "عرض المريض",
    noData: "لا تتوفر بيانات ملف تعريف المستخدم.",
    showing: "عرض {{count}} من أصل {{total}} إدخالات.",
  },

  // Patients
  patients: {
  title: "إدارة المرضى",
  description: "عرض وإدارة جميع سجلات المرضى في النظام",
  addNew: "إضافة مريض جديد",
  searchPlaceholder: "البحث بالاسم، البريد الإلكتروني، الهوية أو الهاتف...",
  tableTitle: "قائمة المرضى المسجلين",
  noResults: "لم يتم العثور على مرضى يطابقون بحثك.",
  columnName: "الاسم الكامل",
  columnEmail: "البريد الإلكتروني",
  columnPhone: "رقم الهاتف",
  columnStatus: "الحالة / الدور",
  columnActions: "إجراءات",
  loading: "جاري تحميل سجلات المرضى...",
  columnId: "رقم الهوية",
  columnLastVisit: "آخر زيارة",
  statusActive: "نشط",
  statusPending: "قيد المراجعة",
  statusFollowUp: "قيد المتابعة",
  view: "عرض التفاصيل",

  errFirstName: "الاسم الأول حقل مطلوب",
  errLastName: "اسم العائلة حقل مطلوب",
  errEmail: "البريد الإلكتروني غير صحيح",
  errPhone: "يجب إدخال 10 أرقام",
  errPassMin: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  errPassMatch: "كلمات المرور غير متطابقة",
  
  registerTitle: "التسجيل",
  registerButton: "تسجيل",

  firstNameLabel: "الاسم الأول",
  lastNameLabel: "اسم العائلة",
  emailLabel: "البريد الإلكتروني",
  phoneNumberLabel: "رقم الهاتف",
  passwordLabel: "كلمة المرور",
  confirmPasswordLabel: "تأكيد كلمة المرور",

  firstNamePlaceholder: "",
  lastNamePlaceholder: "",
  emailPlaceholder: "",
  phoneNumberPlaceholder: "",
  passwordPlaceholder: "********",
  confirmPasswordPlaceholder: "********",
},
  // Clinic Managers
  clinicManagers: {
    description: "عرض وإدارة جميع مديري العيادات في النظام",
    searchPlaceholder: "البحث بالاسم أو البريد الإلكتروني أو الهاتف...",
  },

  // Doctors
  doctors: {
    description: "عرض وإدارة جميع الأطباء في العيادة",
    searchPlaceholder: "البحث بالاسم أو البريد الإلكتروني أو الهاتف...",
  },

    // Medications
  medications: {
    title: "الأدوية", 
    allMedications: "جميع الأدوية", 
    searchPlaceholder: "البحث عن دواء...", 
    sort: "فرز: أ-ي",
    noData: "لم يتم العثور على أدوية مطابقة", 
  },

  // Settings
  settings: {
    title: "الإعدادات",
    language: "اللغة",
    languageDesc: "اختر لغتك المفضلة. سيتم تحديث الواجهة فوراً.",
  },

  // Not Found / 404
  notFound: {
    title: "404",
    subtitle: "الصفحة غير موجودة",
    back: "العودة إلى لوحة التحكم",
  },

  // Error
  error: {
    title: "حدث خطأ ما",
    fallback: "حدث خطأ غير متوقع",
    back: "العودة إلى لوحة التحكم",
  },

  // Common
  common: {
    toggleSidebar: "تبديل الشريط الجانبي",
    sessionExpired: "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",
  },
  // Modules
  modules: {
  title: "وحداتي",
  cards: {
    exams: {
      title: "الاختبارات",
      description: "تقييم الكفاءة، اختبارات المعرفة، والمحاكاة السريرية.",
    },
    questionnaires: {
      title: "الاستبيانات",
      description: "استطلاعات الرضا، تقييمات دورية، واستبيانات طبية.",
    },
    medications: {
      title: "الأدوية",
      description: "إدارة الوصفات، متابعة الجرعات، وتنبيهات الحساسية.",
    },
    sensors: {
      title: "المستشعرات",
      description: "مراقبة فورية للأجهزة الطبية والعلامات الحيوية للمريض.",
    },
    activities: {
      title: "الأنشطة",
      description: "جدولة المناوبات، ورش عمل، وتدريب الطاقم.",
    },
  },
},
} as const;

export default ar;
