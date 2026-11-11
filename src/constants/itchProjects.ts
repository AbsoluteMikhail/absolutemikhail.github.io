import gerasimCover from "@/assets/projects/jams/gerasim.webp";
import revengeOfTheCatCover from "@/assets/projects/jams/revenge-of-the-cat.webp";
import weekendJamCover from "@/assets/projects/jams/weekend-jam.jpg";
import forTheKingCover from "@/assets/projects/jams/for-the-king.jpg";
import handleWithCareCover from "@/assets/projects/jams/handle-with-care.webp";
import gerasimPreview from "@/assets/projects/jams/gerasim-preview.mp4";
import forTheKingPreview from "@/assets/projects/jams/for-the-king-preview.mp4";
import revengeOfTheCatPreview from "@/assets/projects/jams/revenge-of-the-cat-preview.mp4";
import weekendJamPreview from "@/assets/projects/jams/weekend-jam-preview.mp4";
import handleWithCarePreview from "@/assets/projects/jams/handle-with-care-preview.mp4";

export interface ItchProject {
  slug: string;
  title: string;
  genre: string;
  year: string;
  cover: string;
  previewUrl?: string;
  description: string;
  achievement: string;
  role: string;
  duration: string;
  url: string;
}

export const itchProjects: ItchProject[] = [
  {
    slug: "gerasim-protiv-besov",
    previewUrl: gerasimPreview,
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
    slug: "for-the-king",
    previewUrl: forTheKingPreview,
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
    slug: "revenge-of-the-cat",
    previewUrl: revengeOfTheCatPreview,
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
    slug: "weekend-jam-1",
    previewUrl: weekendJamPreview,
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
    slug: "handle-with-care",
    previewUrl: handleWithCarePreview,
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
