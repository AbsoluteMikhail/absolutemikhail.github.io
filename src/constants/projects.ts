import gribnikCover from "@/assets/projects/gribnik/cover.jpg";
import gribnik1 from "@/assets/projects/gribnik/1.jpg";
import gribnik2 from "@/assets/projects/gribnik/2.jpg";
import gribnik3 from "@/assets/projects/gribnik/3.jpg";
import gribnik4 from "@/assets/projects/gribnik/4.jpg";
import gribnik5 from "@/assets/projects/gribnik/5.jpg";

import duelantCover from "@/assets/projects/duelant/cover.jpg";
import duelant1 from "@/assets/projects/duelant/1.jpg";
import duelant2 from "@/assets/projects/duelant/2.jpg";
import duelant3 from "@/assets/projects/duelant/3.jpg";
import duelant4 from "@/assets/projects/duelant/4.jpg";
import duelant5 from "@/assets/projects/duelant/5.jpg";

import kolobokCover from "@/assets/projects/kolobok/cover.jpg";
import kolobok1 from "@/assets/projects/kolobok/1.jpg";
import kolobok2 from "@/assets/projects/kolobok/2.jpg";
import kolobok3 from "@/assets/projects/kolobok/3.jpg";
import kolobok4 from "@/assets/projects/kolobok/4.jpg";
import kolobok5 from "@/assets/projects/kolobok/5.jpg";

export interface Project {
  id: number;
  title: string;
  genre: string;
  year: string;
  cover: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  stats: string;
  storeUrl?: string;
  storeLinks?: Array<{
    label: string;
    url: string;
  }>;
  videoUrl: string;
  screenshots: string[];
}

export const projects: Project[] = [
  {
    id: 2,
    title: "DUELANT",
    genre: "Duel Simulator",
    year: "2027",
    cover: duelantCover,
    shortDesc:
      "Адреналиновые дуэли в разных эпохах под присмотром ИИ-помощницы Малены. Кровь, деньги и 30 секунд, чтобы доказать, кто здесь лучший стрелок.",
    fullDesc:
      "Недалекое будущее. Виртуальные дуэли стали легальным способом заработка и развлечения. В роли молодого дуэлянта вам предстоит сражаться в разных сеттингах — от Дикого Запада до киберпанка. \n\nКлючевые фишки:\n— 30-секундные динамичные поединки;\n— Сопровождение харизматичной ИИ-спутницы Малены;\n— Система отстрела конечностей и прокачка способностей;\n— Элементы Roguelike: риск обнуления прогресса в турнирном режиме;\n— Динамическая смена погоды и времени суток, влияющая на геймплей.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Advanced IK System"],
    stats: "В разработке",
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
    screenshots: [duelant1, duelant2, duelant3, duelant4, duelant5],
  },
  {
    id: 1,
    title: "G.R.I.B.N.I.K. в лесу дураков",
    genre: "FPS / Horror",
    year: "2025",
    cover: gribnikCover,
    shortDesc:
      "Уникальная смесь симулятора грибника с дробовиком и хоррора в стиле PSX. Выживайте в странном лесу, где ваш единственный друг — старый кибер-холодильник.",
    fullDesc:
      "Герой просыпается в светлом, но пугающем лесу. Единственное спасение — ржавый кибер-холодильник, который служит базой. Если не вернуться к нему до темноты, лес поглотит вас. \n\nОсобенности игры:\n— Атмосферная Low-Poly графика в духе эпохи PlayStation 1;\n— Кибернизированные герои русских народных сказок;\n— Глубокое взаимодействие с грибами и вариативность прохождения;\n— Нарративное окружение и музыка, отсылающая к классике S.T.A.L.K.E.R. и Doom;\n— Две концовки, раскрывающие истинный смысл происходящего.",
    tech: ["Unreal Engine 5", "Blender", "PSX Shader Stack"],
    stats: "В релизе",
    storeUrl: "https://vkplay.ru/play/game/gribnik-the-forest-of-fools-44079",
    videoUrl: "https://rutube.ru/play/embed/1dbe0a668db24c94fdbead56fb2a6dac/",
    screenshots: [gribnik1, gribnik2, gribnik3, gribnik4, gribnik5],
  },
  {
    id: 3,
    title: "КОЛОБОК против ЯЩЕРОВ",
    genre: "Arcade / Arkanoid",
    year: "2024",
    cover: kolobokCover,
    shortDesc:
      "Безумный арканоид о защите Руси-матушки. Помогите харизматичному комку теста отбить атаку легионов ящеров и спасти родной дом.",
    fullDesc:
      "Ящеры вторглись на Русь! Лишь Колобок, выпрыгнувший из печки, готов принять вызов. Катитесь, отскакивайте и крушите врагов в этом динамичном переосмыслении классического арканоида. \n\nВас ждет:\n— 21 уникальный уровень в разных локациях;\n— 3 уровня сложности: от новичка до мастера;\n— Бесконечный режим для самых стойких защитников;\n— 18 оригинальных музыкальных треков;\n— Легионы ящеров с уникальным поведением;\n— Море юмора и достижений.",
    tech: ["Unreal Engine 5", "Niagara VFX", "Original OST"],
    stats: "В релизе",
    storeUrl: "https://vkplay.ru/play/game/kolobok-protiv-jascherov-arkanoid-40059",
    videoUrl: "https://rutube.ru/play/embed/8523cff58d38eb1de92fedfc21ccbfab/",
    screenshots: [kolobok1, kolobok2, kolobok3, kolobok4, kolobok5],
  },
];
