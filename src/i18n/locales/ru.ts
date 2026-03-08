const ru = {
  // Navigation & Sidebar
  nav: {
    dashboard: "Панель управления",
    patients: "Пациенты",
    clinics: "Клиники",
    modules: "Модули",
    appointments: "Записи",
    settings: "Настройки",
    reports: "Отчёты",
    pageNotReady: "Страница {{title}} ещё не существует!",
    logout: "Выйти",
    logoutConfirmTitle: "Вы уверены, что хотите выйти?",
    logoutConfirmDesc: "Вы будете отключены и перенаправлены на страницу входа.",
    cancel: "Отмена",
    logoutConfirm: "Да, выйти",
  },

  // Login
  login: {
    title: "Войти в аккаунт",
    description: "Введите ваш email для входа в аккаунт",
    email: "Электронная почта",
    password: "Пароль",
    placeholder: "m@example.com",
    forgotPassword: "Забыли пароль?",
    submit: "Войти",
    submitting: "Вход...",
    errorMissing: "Пожалуйста, заполните все поля.",
    errorFailed: "Ошибка входа. Проверьте ваши данные и попробуйте снова.",
    successTitle: "Вход выполнен успешно!",
    successDesc: "Перенаправление на главную...",
    failedTitle: "Ошибка входа",
    failedDesc: "Проверьте ваши данные.",
  },

  // Home / Dashboard
  home: {
    loading: "Загрузка данных...",
    error: "Ошибка загрузки данных",
    patients: "Пациенты",
    clinics: "Клиники",
    modules: "Модули",
    medications: "Лекарства",
    latestUsers: "Последние пользователи",
    updatedNow: "Обновлено только что.",
    firstName: "Имя",
    lastName: "Фамилия",
    email: "Электронная почта",
    phone: "Номер телефона",
    role: "Роль",
    view: "Просмотр",
    viewPatient: "Просмотр пациента",
    noData: "Данные профиля пользователя недоступны.",
    showing: "Показано {{count}} из {{total}} записей.",
  },

  // Settings
  settings: {
    title: "Настройки",
    language: "Язык",
    languageDesc: "Выберите предпочтительный язык. Интерфейс обновится сразу.",
  },

  // Not Found / 404
  notFound: {
    title: "404",
    subtitle: "Страница не найдена",
    back: "Перейти на панель управления",
  },

  // Error
  error: {
    title: "Что-то пошло не так",
    fallback: "Произошла непредвиденная ошибка",
    back: "Перейти на панель управления",
  },

  // Common
  common: {
    toggleSidebar: "Переключить боковую панель",
    sessionExpired: "Сеанс истёк. Пожалуйста, войдите снова.",
  },
  // Modules
  modules: {
  title: "Мои модули",
  cards: {
    exams: {
      title: "Экзамены",
      description: "Оценка компетенций, тесты знаний и клинические симуляции.",
    },
    questionnaires: {
      title: "Опросники",
      description: "Опросы удовлетворённости, регулярные оценки и медицинские анкеты.",
    },
    medications: {
      title: "Лекарства",
      description: "Управление назначениями, контроль дозировок и предупреждения об аллергии.",
    },
    sensors: {
      title: "Датчики",
      description: "Мониторинг медицинских устройств и жизненных показателей пациента в реальном времени.",
    },
    activities: {
      title: "Активности",
      description: "Планирование смен, семинары и обучение персонала.",
    },
  },
},
} as const;

export default ru;
