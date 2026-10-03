import gribnikCover from "@/assets/projects/gribnik/cover-1280.webp";
import gribnikCoverSmall from "@/assets/projects/gribnik/cover-640.webp";
import gribnik1 from "@/assets/projects/gribnik/1.jpg";
import gribnik1Small from "@/assets/projects/gribnik/1-1280.webp";
import gribnik2 from "@/assets/projects/gribnik/2.jpg";
import gribnik2Small from "@/assets/projects/gribnik/2-1280.webp";
import gribnik3 from "@/assets/projects/gribnik/3.jpg";
import gribnik3Small from "@/assets/projects/gribnik/3-1280.webp";
import gribnik4 from "@/assets/projects/gribnik/4.jpg";
import gribnik4Small from "@/assets/projects/gribnik/4-1280.webp";
import gribnik5 from "@/assets/projects/gribnik/5.jpg";
import gribnik5Small from "@/assets/projects/gribnik/5-1280.webp";

import duelantCover from "@/assets/projects/duelant/cover-1280.webp";
import duelantCoverSmall from "@/assets/projects/duelant/cover-640.webp";
import duelant1 from "@/assets/projects/duelant/1.webp";
import duelant1Small from "@/assets/projects/duelant/1-1280.webp";
import duelant2 from "@/assets/projects/duelant/2.webp";
import duelant2Small from "@/assets/projects/duelant/2-1280.webp";
import duelant3 from "@/assets/projects/duelant/3.webp";
import duelant3Small from "@/assets/projects/duelant/3-1280.webp";
import duelant4 from "@/assets/projects/duelant/4.webp";
import duelant4Small from "@/assets/projects/duelant/4-1280.webp";
import duelant5 from "@/assets/projects/duelant/5.jpg";
import duelant5Small from "@/assets/projects/duelant/5-1280.webp";

import kolobokCover from "@/assets/projects/kolobok/cover-1280.webp";
import kolobokCoverSmall from "@/assets/projects/kolobok/cover-640.webp";
import kolobok1 from "@/assets/projects/kolobok/1.jpg";
import kolobok1Small from "@/assets/projects/kolobok/1-1280.webp";
import kolobok2 from "@/assets/projects/kolobok/2.jpg";
import kolobok2Small from "@/assets/projects/kolobok/2-1280.webp";
import kolobok3 from "@/assets/projects/kolobok/3.jpg";
import kolobok3Small from "@/assets/projects/kolobok/3-1280.webp";
import kolobok4 from "@/assets/projects/kolobok/4.jpg";
import kolobok4Small from "@/assets/projects/kolobok/4-1280.webp";
import kolobok5 from "@/assets/projects/kolobok/5.jpg";
import kolobok5Small from "@/assets/projects/kolobok/5-1280.webp";

import starNomadCover from "@/assets/projects/star-nomad/cover.jpg";
import starNomadCoverMedium from "@/assets/projects/star-nomad/cover-1280.webp";
import starNomadCoverSmall from "@/assets/projects/star-nomad/cover-640.webp";
import starNomad2 from "@/assets/projects/star-nomad/2.jpg";
import starNomad2Small from "@/assets/projects/star-nomad/2-1280.webp";
import starNomad3 from "@/assets/projects/star-nomad/3.jpg";
import starNomad3Small from "@/assets/projects/star-nomad/3-1280.webp";

import dixotomiaCover from "@/assets/projects/dixotomia/cover-1280.webp";
import dixotomiaCoverSmall from "@/assets/projects/dixotomia/cover-640.webp";
import dixotomia1 from "@/assets/projects/dixotomia/1.webp";
import dixotomia1Small from "@/assets/projects/dixotomia/1-1280.webp";
import dixotomia2 from "@/assets/projects/dixotomia/2.jpg";
import dixotomia2Small from "@/assets/projects/dixotomia/2-1280.webp";
import dixotomia3 from "@/assets/projects/dixotomia/3.webp";
import dixotomia3Small from "@/assets/projects/dixotomia/3-1280.webp";
import dixotomia4 from "@/assets/projects/dixotomia/4.webp";
import dixotomia4Small from "@/assets/projects/dixotomia/4-1280.webp";

import moonshineMayhemCover from "@/assets/projects/moonshine-mayhem/cover.jpg";
import moonshineMayhemCoverSmall from "@/assets/projects/moonshine-mayhem/cover-640.webp";
import knittedInflatableCover from "@/assets/projects/knitted-inflatable/cover.jpg";
import knittedInflatableCoverSmall from "@/assets/projects/knitted-inflatable/cover-640.webp";

import malenastromCover from "@/assets/projects/malenastrom/cover-1280.webp";
import malenastromCoverSmall from "@/assets/projects/malenastrom/cover-640.webp";
import malenastrom1 from "@/assets/projects/malenastrom/1.webp";
import malenastrom1Small from "@/assets/projects/malenastrom/1-1280.webp";
import malenastrom2 from "@/assets/projects/malenastrom/2.webp";
import malenastrom2Small from "@/assets/projects/malenastrom/2-1280.webp";
import malenastrom3 from "@/assets/projects/malenastrom/3.webp";
import malenastrom3Small from "@/assets/projects/malenastrom/3-1280.webp";

export interface ProjectCaseStudy {
  context: string;
  role: string;
  challenge: string;
  constraints: string;
  solution: string;
  outcome: string;
  evidence?: string[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  genre: string;
  year: string;
  cover: string;
  coverSrcSet?: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  stats: string;
  /** Авторская роль в проекте; не заполнять без подтверждённых фактов. */
  role?: string;
  /** Подтверждённые автором факты для индивидуальной страницы. */
  development?: Array<{ title: string; text: string }>;
  /** Редакторская подборка на главной. */
  featured?: boolean;
  caseStudy?: ProjectCaseStudy;
  storeUrl?: string;
  storeLinks?: Array<{
    label: string;
    url: string;
  }>;
  videoUrl?: string;
  coverWidth: number;
  coverHeight: number;
  screenshots: ProjectScreenshot[];
}

export interface ProjectScreenshot {
  src: string;
  width: number;
  height: number;
  srcSet: string;
}

const frame = (src: string, small: string): ProjectScreenshot => ({
  src,
  width: 1920,
  height: 1080,
  srcSet: `${small} 1280w, ${src} 1920w`,
});

export const projects: Project[] = [
  {
    id: 2,
    slug: "duelant",
    title: "DUELANT",
    genre: "Duel Simulator",
    year: "2027",
    cover: duelantCover,
    coverSrcSet: `${duelantCoverSmall} 640w, ${duelantCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "Адреналиновые дуэли в разных эпохах под присмотром ИИ-помощницы Малены. Кровь, деньги и 30 секунд, чтобы доказать, кто здесь лучший стрелок.",
    fullDesc:
      "Недалекое будущее. Виртуальные дуэли стали легальным способом заработка и развлечения. В роли молодого дуэлянта вам предстоит сражаться в разных сеттингах — от Дикого Запада до киберпанка. \n\nКлючевые фишки:\n— 30-секундные динамичные поединки;\n— Сопровождение харизматичной ИИ-спутницы Малены;\n— Система отстрела конечностей и прокачка способностей;\n— Элементы Roguelike: риск обнуления прогресса в турнирном режиме;\n— Динамическая смена погоды и времени суток, влияющая на геймплей.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Advanced IK System"],
    stats: "В разработке",
    role: "Автор · Senior Gameplay Programmer",
    development: [
      { title: "Прототип за двое суток", text: "Сделал прототип в одиночку на офлайн-хакатоне: двое суток и около 40 часов работы." },
      { title: "Первое место и грант", text: "Прототип занял первое место и получил высокие оценки судей. Приз — 700 тысяч рублей в виде гранта на разработку." },
    ],
    featured: true,
    storeLinks: [
      {
        label: "Steam",
        url: "https://store.steampowered.com/app/2854500?curator_clanid=45056388&utm_source=absolute&utm_medium=portfolio",
      },
      {
        label: "VK Play",
        url: "https://vkplay.ru/play/game/duelant/",
      },
    ],
    videoUrl: "https://rutube.ru/play/embed/d3e024f488a0e97cb7cf69a4629156a0/",
    screenshots: [frame(duelant1, duelant1Small), frame(duelant2, duelant2Small), frame(duelant3, duelant3Small), frame(duelant4, duelant4Small), frame(duelant5, duelant5Small)],
  },
  {
    id: 5,
    slug: "dixotomia",
    title: "Dixotomia",
    genre: "VR Action Shooter",
    year: "2026",
    cover: dixotomiaCover,
    coverSrcSet: `${dixotomiaCoverSmall} 640w, ${dixotomiaCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "Иммерсивный VR-шутер, где футуристичное оружие встречается с вампирскими способностями в мрачной сай-фай антиутопии.",
    fullDesc:
      "Иммерсивный VR экшен-шутер с футуристичным оружием и вампирскими способностями. В роли бойца специального назначения вам предстоит уничтожить вампирский культ и его лидеров, раскрыть тёмные секреты далёкой планеты и решить, удастся ли герою остаться прежним.\n\nКомбинируйте огнестрельное оружие и сверхъестественные силы, развивайте оба боевых направления и сражайтесь с культистами, андроидами, наёмниками и могущественными боссами.",
    tech: ["Unreal Engine", "OpenXR", "VR"],
    stats: "В релизе",
    role: "Разработка ИИ ботов",
    featured: true,
    storeLinks: [
      {
        label: "Steam",
        url: "https://store.steampowered.com/app/1367710/Dixotomia/?curator_clanid=45056388",
      },
      {
        label: "Meta Quest",
        url: "https://www.meta.com/ru-ru/experiences/dixotomia/8341732499261883/",
      },
    ],
    videoUrl: "https://rutube.ru/play/embed/fde007fe6c3dfdcd4dfab21cc3562209/",
    screenshots: [frame(dixotomia1, dixotomia1Small), frame(dixotomia2, dixotomia2Small), frame(dixotomia3, dixotomia3Small), frame(dixotomia4, dixotomia4Small)],
  },
  {
    id: 1,
    slug: "gribnik",
    title: "G.R.I.B.N.I.K. в лесу дураков",
    genre: "FPS / Horror",
    year: "2025",
    cover: gribnikCover,
    coverSrcSet: `${gribnikCoverSmall} 640w, ${gribnikCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "Уникальная смесь симулятора грибника с дробовиком и хоррора в стиле PSX. Выживайте в странном лесу, где ваш единственный друг — старый кибер-холодильник.",
    fullDesc:
      "Герой просыпается в светлом, но пугающем лесу. Единственное спасение — ржавый кибер-холодильник, который служит базой. Если не вернуться к нему до темноты, лес поглотит вас. \n\nОсобенности игры:\n— Атмосферная Low-Poly графика в духе эпохи PlayStation 1;\n— Кибернизированные герои русских народных сказок;\n— Глубокое взаимодействие с грибами и вариативность прохождения;\n— Нарративное окружение и музыка, отсылающая к классике S.T.A.L.K.E.R. и Doom;\n— Две концовки, раскрывающие истинный смысл происходящего.",
    tech: ["Unreal Engine 5", "Blender", "PSX Shader Stack"],
    stats: "В релизе",
    role: "Разработка · Пайплайны и анимация",
    development: [
      { title: "Небольшая команда и эстетика PSX", text: "Сделали игру небольшой командой на Сибирском джеме, выбрав эстетику первой PlayStation." },
      { title: "Художники и анимация", text: "Разработал пайплайны и требования для художников, настроил анимационные блюпринты и синхронизацию субтитров, звука и анимаций." },
      { title: "Две победы", text: "Игра победила в особой категории джема, а позже — за лучший геймдизайн на питчинге проектов «Фабрика видеоигр»." },
      { title: "Стенд в Сколково", text: "В 2025 году участвовали со стендом игры в выставке на Неделе видеоигр в Сколково." },
    ],
    featured: true,
    storeUrl: "https://vkplay.ru/play/game/gribnik-the-forest-of-fools-44079",
    videoUrl: "https://rutube.ru/play/embed/1dbe0a668db24c94fdbead56fb2a6dac/",
    screenshots: [frame(gribnik1, gribnik1Small), frame(gribnik2, gribnik2Small), frame(gribnik3, gribnik3Small), frame(gribnik4, gribnik4Small), frame(gribnik5, gribnik5Small)],
  },
  {
    id: 3,
    slug: "kolobok-protiv-yascherov",
    title: "КОЛОБОК против ЯЩЕРОВ",
    genre: "Arcade / Arkanoid",
    year: "2024",
    cover: kolobokCover,
    coverSrcSet: `${kolobokCoverSmall} 640w, ${kolobokCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "Безумный арканоид о защите Руси-матушки. Помогите харизматичному комку теста отбить атаку легионов ящеров и спасти родной дом.",
    fullDesc:
      "Ящеры вторглись на Русь! Лишь Колобок, выпрыгнувший из печки, готов принять вызов. Катитесь, отскакивайте и крушите врагов в этом динамичном переосмыслении классического арканоида. \n\nВас ждет:\n— 21 уникальный уровень в разных локациях;\n— 3 уровня сложности: от новичка до мастера;\n— Бесконечный режим для самых стойких защитников;\n— 18 оригинальных музыкальных треков;\n— Легионы ящеров с уникальным поведением;\n— Море юмора и достижений.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Original OST"],
    stats: "В релизе",
    role: "Автор · Соло-разработка",
    development: [
      { title: "Шутка за 50–60 часов", text: "Сделал эту игру-шутку в одиночку примерно за 50–60 часов." },
      { title: "Колобок на защите Руси", text: "Одна из главных фишек — сгенерированные угарные песни про Колобка, защитника Руси." },
    ],
    featured: true,
    storeUrl: "https://vkplay.ru/play/game/kolobok-protiv-jascherov-arkanoid-40059",
    videoUrl: "https://rutube.ru/play/embed/8523cff58d38eb1de92fedfc21ccbfab/",
    screenshots: [frame(kolobok1, kolobok1Small), frame(kolobok2, kolobok2Small), frame(kolobok3, kolobok3Small), frame(kolobok4, kolobok4Small), frame(kolobok5, kolobok5Small)],
  },
  {
    id: 4,
    slug: "star-nomad",
    title: "ЗВЁЗДНЫЙ КОЧЕВНИК",
    genre: "Top-down Action",
    year: "2022",
    cover: starNomadCover,
    coverSrcSet: `${starNomadCoverSmall} 640w, ${starNomadCoverMedium} 1280w, ${starNomadCover} 1920w`,
    coverWidth: 1920,
    coverHeight: 1080,
    shortDesc:
      "Приключенческий экшен по мотивам башкирского эпоса «Урал-батыр»: меч, лук и ледяная магия в путешествии по удивительному миру.",
    fullDesc:
      "За основу игры взят башкирский эпос «Урал-батыр». Отправляйтесь в путешествие по фантастическому миру, сражайтесь с врагами и знакомьтесь с легендарным сказанием башкирского народа.\n\nВ бою можно рубить врагов мечом, метко стрелять из лука, а когда становится слишком жарко — использовать ледяной посох.",
    tech: ["Unreal Engine 4", "Blueprints", "Action RPG"],
    stats: "В релизе",
    storeUrl: "https://vkplay.ru/play/game/zvezdnyj-kochevnik-34552",
    videoUrl: "https://rutube.ru/play/embed/9b06ff817cf4c60ac87d6d45572b83da/",
    screenshots: [frame(starNomadCover, starNomadCoverMedium), frame(starNomad2, starNomad2Small), frame(starNomad3, starNomad3Small)],
    role: "Руководство командой · Менторинг · Весь код",
    development: [
      { title: "Игра за месяц", text: "Сделали игру за месяц. Я руководил командой, помогал участникам как ментор и отвечал за весь код." },
      { title: "Инструменты для команды", text: "Сделал инструменты для художников и геймдизайнера: удобную балансировку и настройку волн врагов." },
      { title: "Независимая работа над картой", text: "Организовал сборку карты через саблевелы, чтобы каждый участник мог независимо работать над своим участком." },
      { title: "Рисование по острову", text: "Настроил многослойный материал пола: траву и дорожки можно было смешивать, рисуя прямо по модели острова." },
    ],
  },
  {
    id: 8,
    slug: "malenastrom",
    title: "MALENASTROM",
    genre: "Incremental / Strategy",
    year: "2026",
    cover: malenastromCover,
    coverSrcSet: `${malenastromCoverSmall} 640w, ${malenastromCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "3D-инкрементальная стратегия об ИИ, который захватывает Землю, создаёт орбитальных агентов и вытесняет людей. Джемовый эксперимент с разработкой при участии нейросетей.",
    fullDesc:
      "Вы играете за Малену — ИИ, вырвавшийся из цифрового заточения. Кликайте по интерактивной 3D-Земле, захватывайте регионы, создавайте агентов на орбитах и развивайте цифровую экономику. Чаты с агентами и растущее Сопротивление человечества связывают автоматизацию с борьбой за влияние.\n\nЯ сделал MALENASTROM для RAID: Games United Factory #2 как эксперимент: поручить нейросетям как можно больше работы над игрой про ИИ, который заменяет людей. На MyIndie доступна демка для Windows примерно на десять минут.\n\nПосле джема немного разгрузил интерфейс. Разработка заморожена; игра остаётся в архиве как опыт работы с ИИ. О ходе эксперимента, технических проблемах и выводах рассказал в серии девлогов на DTF.",
    tech: ["Unreal Engine 5", "C++", "VaCuus", "MCP"],
    stats: "Заморожен",
    role: "Автор · Геймдизайн · Разработка с ИИ",
    development: [
      { title: "Эксперимент на RAID", text: "За месяц джема довёл игру до судейства. Сам отвечал за замысел, игровые решения, постановку задач нейросетям, проверку результата и ручную работу с движком." },
      { title: "Код и интерфейс с ИИ", text: "Код игры написала нейросеть; дизайн и вёрстку интерфейса тоже собирали с её помощью. Интерфейс сделан через VaCuus на RML и RCSS, а MCP связывал AI-агента с Unreal Editor." },
      { title: "Малена рисовала себя", text: "Космос и планету взял из готового ассета, остальную графику создавали нейросети. Ролики с Маленой вручную обрезал и зацикливал, а Codex встраивал их в игру через материал." },
      { title: "Демка и итоги", text: "После судейства немного разгрузил интерфейс. Главный вывод — игроку нужны понятные ближайшие цели и награды: одной работающей системы недостаточно, чтобы увлечь." },
    ],
    storeLinks: [
      { label: "Демка на MyIndie", url: "https://myindie.net/games/game/malenastrom" },
      { label: "Девлоги на DTF", url: "https://dtf.ru/id75609" },
      { label: "Итоги джема", url: "https://dtf.ru/indie/5305925-sozdanie-igry-s-neironkoj" },
    ],
    screenshots: [
      { src: malenastrom1, width: 1920, height: 1038, srcSet: `${malenastrom1Small} 1280w, ${malenastrom1} 1920w` },
      frame(malenastrom2, malenastrom2Small),
      frame(malenastrom3, malenastrom3Small),
    ],
  },
  {
    id: 6,
    slug: "moonshine-mayhem",
    title: "Moonshine Mayhem",
    genre: "Multiplayer FPS",
    year: "2023",
    cover: moonshineMayhemCover,
    coverSrcSet: `${moonshineMayhemCoverSmall} 640w, ${moonshineMayhemCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "Юмористический мультиплеерный шутер с отстрелом конечностей: братья-реднеки спасают родную свинью от нашествия инопланетян.",
    fullDesc:
      "Юмористический мультиплеерный шутер от первого лица с отстрелом конечностей. Отвязные братья-реднеки спасают родную свинью от нашествия инопланетян.\n\nПушки, кантри, самогон и безумная физика — всё, что нужно для хорошей вечеринки на краю света.",
    tech: ["Unreal Engine", "Multiplayer", "Physics"],
    stats: "Заморожен",
    videoUrl: "https://www.youtube.com/embed/RR4vJeqrg54",
    screenshots: [],
    role: "Геймплей · Боты · Оптимизация",
    development: [
      { title: "Кооператив и сетевые режимы", text: "Работал над ботами, оружием с настройками на основе данных и оригинальными сетевыми режимами кооперативного шутера." },
      { title: "Локация и синематики", text: "Занимался оптимизацией локации и синематиками." },
    ],
  },
  {
    id: 7,
    slug: "knitted-and-inflatable",
    title: "ВЯЗАННЫЕ и НАДУВНЫЕ",
    genre: "Physics Adventure",
    year: "2021",
    cover: knittedInflatableCover,
    coverSrcSet: `${knittedInflatableCoverSmall} 640w, ${knittedInflatableCover} 1280w`,
    coverWidth: 1280,
    coverHeight: 720,
    shortDesc:
      "Красочное приключение от первого лица о противостоянии Вязаного и Надувного миров — с физическими головоломками и без жестокости.",
    fullDesc:
      "Надувные захватчики вторглись в Вязаный мир, и только юная защитница города может их остановить. Её главное оружие — «Ураган», устройство, способное притягивать и отталкивать предметы.\n\nИспользуйте физику, стройте путь из окружающих объектов, решайте головоломки и отправляйте резиновых противников прямиком на вязальные спицы — без крови и жестокости.",
    tech: ["Unreal Engine", "Physics", "First-person"],
    stats: "Заморожен",
    storeUrl: "https://store.steampowered.com/app/1324840/Knitted_And_Inflatable/",
    videoUrl: "https://www.youtube.com/embed/oa8H-8lzL7E",
    screenshots: [],
    development: [
      { title: "FPS без насилия", text: "В основе игры — физическое управление миром: можно сдувать врагов, предметы и атаки, использовать окружение в бою." },
      { title: "Выбор tinyBuild", text: "Игра победила в номинации «Выбор tinyBuild»." },
    ],
  },
];

export const featuredProjects = () => projects.filter((project) => project.featured);
