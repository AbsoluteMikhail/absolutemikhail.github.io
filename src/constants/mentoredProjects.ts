import guestOfAntiquityCover from "@/assets/projects/mentored/guest-of-antiquity.webp";
import phantasmaCover from "@/assets/projects/mentored/phantasma.gif";
import potatoDedCover from "@/assets/projects/mentored/potato-ded.webp";
import anyWorldCover from "@/assets/projects/mentored/any-world.webp";
import relsuCover from "@/assets/projects/mentored/relsu.jpg";
import silentObserverCover from "@/assets/projects/mentored/silent-observer.webp";

export interface MentoredProject {
  slug: string;
  title: string;
  genre: string;
  status: string;
  cover: string;
  description: string;
  contribution: string;
  url: string;
}

export const mentoredProjects: MentoredProject[] = [
  {
    slug: "silent-observer",
    title: "Silent Observer",
    genre: "Psychological Horror / Exploration",
    status: "В разработке · Демо в Steam",
    cover: silentObserverCover,
    description:
      "Психологический хоррор от первого лица: лифт открывает путь в разные миры, где нужно искать подсказки, решать головоломки и собирать фрагменты загадочной истории.",
    contribution: "Куратор проекта",
    url: "https://store.steampowered.com/app/3111430/Silent_Observer/?curator_clanid=45056388",
  },
  {
    slug: "relsu",
    title: "RELSU",
    genre: "Co-op Action Roguelite",
    status: "В релизе",
    cover: relsuCover,
    description:
      "Динамичный roguelite для одного–четырёх игроков: волны противников, боссы, случайные задания и уникальные деревья навыков.",
    contribution: "Ментор команды",
    url: "https://store.steampowered.com/app/3783850/RELSU/?curator_clanid=45056388",
  },
  {
    slug: "guest-of-antiquity",
    title: "Гость древности",
    genre: "Puzzle-platformer",
    status: "В релизе",
    cover: guestOfAntiquityCover,
    description:
      "Приключение в доисторических пещерах с системой копания, поиском артефактов и платформенными испытаниями.",
    contribution: "Наставник проекта",
    url: "https://andrey-surnachev.itch.io/guest-of-antiquity",
  },
  {
    slug: "phantasma",
    title: "Phantasma",
    genre: "Horror / Puzzle-platformer",
    status: "В релизе",
    cover: phantasmaCover,
    description:
      "Атмосферная история о мальчике, который попадает в логово людоедки и сталкивается со своими страхами.",
    contribution: "Ментор команды",
    url: "https://dralexfire.itch.io/phantasma",
  },
  {
    slug: "potato-ded",
    title: "Potato Ded",
    genre: "Action / Arcade",
    status: "Играбельный прототип",
    cover: potatoDedCover,
    description:
      "Весёлая аркада о деде Антоне, который с лопатой отправляется спасать урожай от гигантских майских жуков.",
    contribution: "Поддержка команды за 72 часа",
    url: "https://elpadlos.itch.io/potato-ded",
  },
  {
    slug: "any-world",
    title: "Any World",
    genre: "Open-world 3D Platformer",
    status: "В разработке",
    cover: anyWorldCover,
    description:
      "Большое приключение инопланетянина Оттиса по семи островам с разными стилями, механиками и музыкой.",
    contribution: "Менторство разработки",
    url: "https://ideagame.itch.io/any-world",
  },
];
