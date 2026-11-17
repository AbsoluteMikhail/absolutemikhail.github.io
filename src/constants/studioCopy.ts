import { profileExperience } from "@/content/proof";

export const studioCopy = {
  ru: {
    skip: "Перейти к содержимому", home: "GamePunk — главная", navigation: "Навигация студии", language: "Язык сайта",
    projects: "Проекты", studio: "Студия", contact: "Связаться", hero: ["ЕСТЬ ИДЕЯ", "БУДЕТ", "ГРОМКО."],
    description: "Делаем игры и другие штуки,", descriptionEnd: "которых нам самим не хватает.", viewProjects: "Смотреть проекты",
    independent: ["НЕЗАВИСИМАЯ", "СТУДИЯ"], collageAlt: "Малена с обложки «Рождённая помнить» в коллаже из рваной бумаги",
    stickerAlt: "Наклейка: Unreal Engine в стиле «Пятёрочки»", projectsKicker: "01 / ПРОЕКТЫ", projectsTitle: "Что мы натворили",
    gameTypes: ["Игра / дуэли", "Игра / хоррор"], cover: "Обложка игры",
    malena: "Малена", malenaType: "ИИ / эксперимент", malenaAlt: "Малена в зелёном платье среди ночных руин и цветов",
    moreGames: "Больше игр в Steam", manifestoKicker: "02 / МАНИФЕСТ", manifesto: ["СВОБОДА ДЕЛАТЬ", "ПО-СВОЕМУ."],
    manifestoCopy: "Всё начинается с идеи, которая не отпускает. Мы превращаем её в игру, инструмент или эксперимент. Пробуем странное. Ищем свой голос. Отвечаем за результат.",
    peopleKicker: "03 / ЛЮДИ", peopleTitle: "Панки не стареют", person: ["Михаил", "Ефремов"], personFull: "Михаил Ефремов",
    aboutPerson: "О Михаиле Ефремове", developer: "Senior Gameplay Programmer", credential: "Unreal Authorized Instructor", specialization: "Unreal Engine · C++ · Multiplayer", personalPage: "Личная страница",
    secondPerson: {
      name: ["Алексей", "Барцев"], fullName: "Алексей Барцев", role: "Продюсер · Геймдизайнер",
      credential: "Автор курса Xsolla Gamedev Academy", specialization: "Наставник Gamebox · Преподаватель геймдизайна",
      experience: "В разработке игр с 2013 года.",
      achievement: "Автор международного курса по геймдизайну с аккредитацией CPD. В 2025 году вместе с командой выиграл грант ИРИ на разработку игры.",
    },
    note: [`${profileExperience.unrealYears} лет с Unreal Engine.`, `${profileExperience.commercialYears}+ лет в коммерческой разработке.`], personAchievement: "Соло-победитель хакатона «Синеус» с прототипом «Дуэлянта».", archive: "Проекты Михаила", talk: ["ЕСТЬ О ЧЁМ", "ПОГОВОРИТЬ?"], write: "Написать нам",
    gameDialog: "БЛИЖЕ К ИГРЕ", closeGame: "Закрыть проект", openGame: "Подробнее об игре", gameVideo: "Видео игры", openVideoSeparately: "Открыть видео отдельно", fullProject: "Страница проекта", inDevelopment: "В разработке", released: "В релизе",
    footerNavigation: "Дополнительные ссылки", mikhail: "Абсолютный Михаил", academy: "Академия", privacy: "Конфиденциальность", terms: "Условия",
    analytics: "Настройки аналитики", signoff: "GamePunk / Сделано по-своему",
  },
  en: {
    skip: "Skip to content", home: "GamePunk — home", navigation: "Studio navigation", language: "Site language",
    projects: "Projects", studio: "Studio", contact: "Contact", hero: ["BIG IDEAS", "LOUD", "RESULTS."],
    description: "We make games and other things", descriptionEnd: "we wish existed.", viewProjects: "Explore our projects",
    independent: ["INDEPENDENT", "STUDIO"], collageAlt: "Malena from the Born to Remember cover in a torn-paper collage",
    stickerAlt: "Sticker: Unreal Engine styled as a Pyaterochka supermarket logo", projectsKicker: "01 / PROJECTS", projectsTitle: "What we’ve been up to",
    gameTypes: ["Thirty-second duels across eras, with AI companion Malena at your side.", "Mushroom hunting with a shotgun meets PSX-style horror."], cover: "Game cover:",
    malena: "Malena", malenaType: "An AI chatbot on Telegram with a personality and an art gallery of her own.", malenaAlt: "Malena in a green dress among moonlit ruins and flowers",
    moreGames: "More games on Steam", manifestoKicker: "02 / MANIFESTO", manifesto: ["THE FREEDOM TO", "DO IT OUR WAY."],
    manifestoCopy: "It starts with an idea that won’t let go. We turn it into a game, a tool, or an experiment. We try weird things. Find our own voice. And stand behind what we make.",
    peopleKicker: "03 / PEOPLE", peopleTitle: "Punks never get old", person: ["Mikhail", "Efremov"], personFull: "Mikhail Efremov",
    aboutPerson: "About Mikhail Efremov — in Russian", developer: "Senior Gameplay Programmer", credential: "Unreal Authorized Instructor", specialization: "Unreal Engine · C++ · Multiplayer", personalPage: "Personal page (in Russian)",
    secondPerson: {
      name: ["Alexey", "Bartsev"], fullName: "Alexey Bartsev", role: "Producer · Game Designer",
      credential: "Course author at Xsolla Gamedev Academy", specialization: "Gamebox mentor · Game design educator",
      experience: "Making games since 2013.",
      achievement: "Author of a CPD-accredited international game design course. In 2025, his team won a game development grant from the Internet Development Institute (IRI).",
    },
    note: [`${profileExperience.unrealYears} years with Unreal Engine.`, `${profileExperience.commercialYears}+ years in commercial development.`], personAchievement: "Solo winner of the Sineus hackathon with the DUELANT prototype.", archive: "Mikhail’s projects (in Russian)", talk: ["GOT SOMETHING", "IN MIND?"], write: "Get in touch",
    gameDialog: "TAKE A CLOSER LOOK", closeGame: "Close project", openGame: "Explore game", gameVideo: "Game video", openVideoSeparately: "Open video separately", fullProject: "Project page (in Russian)", inDevelopment: "In development", released: "Released",
    footerNavigation: "More links", mikhail: "Absolute Mikhail (in Russian)", academy: "Academy (in Russian)", privacy: "Privacy", terms: "Terms",
    analytics: "Analytics settings", signoff: "GamePunk / Made our way",
  },
} as const;

// English adaptations of the canonical short descriptions in constants/projects.ts.
export const studioGameDescriptions: Record<string, string> = {
  duelant: "High-stakes duels across eras, watched over by AI companion Malena. Blood, money, and 30 seconds to prove who’s the fastest shot.",
  gribnik: "Mushroom hunting with a shotgun meets PSX-style horror. Survive a strange forest where an old cyber-fridge is your only friend.",
};
