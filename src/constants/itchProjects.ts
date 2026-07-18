import gerasimCover from "@/assets/projects/jams/gerasim.png";
import revengeOfTheCatCover from "@/assets/projects/jams/revenge-of-the-cat.png";
import weekendJamCover from "@/assets/projects/jams/weekend-jam.jpg";
import forTheKingCover from "@/assets/projects/jams/for-the-king.jpg";
import handleWithCareCover from "@/assets/projects/jams/handle-with-care.png";

export interface ItchProject {
  title: string;
  genre: string;
  year: string;
  cover: string;
  description: string;
  achievement: string;
  role: string;
  duration: string;
  url: string;
}

export const itchProjects: ItchProject[] = [
  {
    title: "ГЕРАСИМ против БЕСОВ",
    genre: "Survival / Adventure",
    year: "2024",
    cover: gerasimCover,
    description:
      "Атмосферный экшен по мотивам вологодских легенд со святыми припасами и автоматическими атаками.",
    achievement: "Геймдев-хакатон СИНЕУС",
    role: "Программирование",
    duration: "Командой за 2 дня",
    url: "https://mikhaile.itch.io/gerasimvsbesi",
  },
  {
    title: "ЗА КОРОЛЯ",
    genre: "Strategy / Management",
    year: "2022",
    cover: forTheKingCover,
    description:
      "Стратегия с непрямым управлением, строительством базы, наймом воинов и помощью соседним деревням.",
    achievement: "GameBox Jam Level 1",
    role: "Соло-разработка",
    duration: "Сделано за 8 дней",
    url: "https://mikhaile.itch.io/fortheking",
  },
  {
    title: "Revenge of the Cat",
    genre: "3D Adventure",
    year: "2021",
    cover: revengeOfTheCatCover,
    description:
      "Короткая комедийная игра о коте, который должен за три минуты выгнать демона из дома.",
    achievement: "6-е место на theBatya Game Jam",
    role: "Соло-разработка",
    duration: "Сделано за 72 часа",
    url: "https://mikhaile.itch.io/revenge-of-the-cat",
  },
  {
    title: "Weekend Jam #1",
    genre: "FPS / Survival",
    year: "2021",
    cover: weekendJamCover,
    description:
      "Стелс-бродилка с гравипушкой: роботы охотятся за игроком, а игрок — за спасительным порталом.",
    achievement: "Приз зрительских симпатий",
    role: "Соло-разработка",
    duration: "Сделано за 2 дня",
    url: "https://mikhaile.itch.io/weekend-jam-1",
  },
  {
    title: "Handle With Care",
    genre: "Physics / Simulation",
    year: "2021",
    cover: handleWithCareCover,
    description:
      "Хардкорный физический симулятор доставки грузов на нестабильной летающей платформе.",
    achievement: "58-е место по теме на Ludum Dare 49",
    role: "Командная разработка",
    duration: "Создано с нуля",
    url: "https://liss1024.itch.io/handle-with-care",
  },
];
