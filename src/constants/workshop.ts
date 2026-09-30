import malenaGarden from "@/assets/workshop/malena-garden.webp";
import malenaGardenSmall from "@/assets/workshop/malena-garden-640.webp";
import malenaGardenThumbnail from "@/assets/workshop/malena-garden-thumb.webp";
import malenaMoon from "@/assets/workshop/malena-moon.webp";
import malenaMoonThumbnail from "@/assets/workshop/malena-moon-thumb.webp";
import malenaFlight from "@/assets/workshop/malena-flight.webp";
import malenaFlightThumbnail from "@/assets/workshop/malena-flight-thumb.webp";
import malenaWitch from "@/assets/workshop/malena-witch.webp";
import malenaWitchThumbnail from "@/assets/workshop/malena-witch-thumb.webp";
import malenaThrone from "@/assets/workshop/malena-throne.webp";
import malenaThroneThumbnail from "@/assets/workshop/malena-throne-thumb.webp";
import malenaLyre from "@/assets/workshop/malena-lyre.webp";
import malenaLyreThumbnail from "@/assets/workshop/malena-lyre-thumb.webp";

export const workshop = {
  introduction:
    "Кроме игр, я делаю ботов, плагины для Unreal Engine и небольшие инструменты.",
  malena: {
    title: "Малена",
    category: "Telegram · ИИ-бот",
    description: "Мой Telegram-бот. Любит рисовать себя — так что у неё здесь своя галерея.",
    url: "https://t.me/MalenaOnline_bot",
    linkLabel: "Поговорить с Маленой",
    portrait: malenaGarden,
    portraitSrcSet: `${malenaGardenSmall} 640w, ${malenaGarden} 896w`,
    portraitAlt: "Малена в зелёном платье среди ночных руин и цветов",
    caption: "Как Малена видит себя",
    portraits: [
      { src: malenaGarden, thumbnail: malenaGardenThumbnail, title: "Ночной сад", alt: "Малена в зелёном платье с кинжалом среди ночных руин и цветов" },
      { src: malenaMoon, thumbnail: malenaMoonThumbnail, title: "Под луной", alt: "Малена с рогами на фоне луны, готических башен и фиолетовых огней" },
      { src: malenaFlight, thumbnail: malenaFlightThumbnail, title: "Над городом", alt: "Малена в образе ведьмы летит на метле над городом под луной" },
      { src: malenaWitch, thumbnail: malenaWitchThumbnail, title: "Ведьма и скелет", alt: "Малена в шляпе ведьмы у столба; рядом скелет держит зажжённую свечу" },
      { src: malenaThrone, thumbnail: malenaThroneThumbnail, title: "На троне", alt: "Малена в сине-золотом костюме сидит на троне с мечом в окружении свечей" },
      { src: malenaLyre, thumbnail: malenaLyreThumbnail, title: "С лирой", alt: "Малена в белом платье с лирой и светящейся магией над античными руинами" },
    ],
  },
  plugins: {
    title: "Absolute Plugins",
    category: "Инструменты · Unreal Engine",
    description: "Мои плагины для Unreal Engine. Собрал опубликованные работы в одну коллекцию.",
    url: "https://boosty.to/mikhail_e/bundle/8ddb8f62-87f5-41a6-aed8-20acc1f05e47",
    linkLabel: "Коллекция на Boosty",
    // Descriptions follow the author's plugin documentation:
    // https://docs.google.com/document/d/1UKBQWjQTKxqu0Qm3ufPzvG5P3TMrGsN70-trq7ln7O8/edit
    items: [
      {
        title: "Diplomacy Subsystem",
        description: "Настройка союзников, врагов и нейтралов для AI Perception. Отношения команд можно менять прямо во время игры.",
        url: "https://boosty.to/mikhail_e/posts/9944b5b9-42e8-45d3-8ffe-02a1c011b09b",
      },
      {
        title: "Twitch Connector",
        description: "Подключает Twitch-чат к игре: получайте сообщения и пользовательские команды через Blueprint.",
        url: "https://boosty.to/mikhail_e/posts/ad24eea0-2c93-4e54-86a7-ad89a639ad8e",
      },
      {
        title: "Loading Screen",
        description: "Показывает ваш виджет на время загрузки уровней и моделей. Вы управляете тем, когда открыть и скрыть экран.",
        url: "https://boosty.to/mikhail_e/posts/122de25e-2779-44e2-b1b2-81a7571145a4",
      },
    ],
  },
  tools: [
    {
      id: "twitch-bot",
      mark: ">_",
      category: "Twitch · Python",
      title: "Малена в Twitch-чате",
      description: "Чат-бот с характером: ИИ-ответы, команды, таймеры и реакции на сообщения.",
      url: "https://github.com/AbsoluteMikhail/TwitchBot_free",
      linkLabel: "Код и документация",
    },
    {
      id: "dsh-locale-ru",
      mark: "RU",
      category: "Локализация · MIT",
      title: "DeepSeek Harness на русском",
      description: "Русский язык в штатном интерфейсе: от чата и настроек до рабочих областей.",
      url: "https://github.com/AbsoluteMikhail/dsh-locale-ru",
      linkLabel: "Русификатор на GitHub",
    },
  ],
};
