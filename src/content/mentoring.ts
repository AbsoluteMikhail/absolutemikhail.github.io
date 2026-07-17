export type MentoringIcon = "consultation" | "project" | "architecture";

export interface MentoringPackage {
  icon: MentoringIcon;
  title: string;
  price: string;
  duration: string;
  preparation: string;
  result: string;
  description: string;
  features: string[];
  buttonText: string;
  telegramMessage: string;
  popular: boolean;
}

export const mentoringPackages: MentoringPackage[] = [
  {
    icon: "consultation",
    title: "Консультация",
    price: "1 000 ₽",
    duration: "60 минут",
    preparation: "До встречи: цель и до трёх вопросов",
    result: "После встречи: список следующих шагов",
    description:
      "Точечно разберём ваш вопрос по Unreal Engine, C++, Blueprint или разработке игры.",
    features: [
      "Найдём причину конкретной технической проблемы.",
      "Обсудим карьеру, портфолио или подготовку к собеседованию.",
      "Оценим идею и выберем следующий шаг в разработке.",
    ],
    buttonText: "Выбрать консультацию",
    telegramMessage: "Привет! Хочу записаться на консультацию по Unreal Engine.",
    popular: false,
  },
  {
    icon: "project",
    title: "Разбор проекта",
    price: "3 000 ₽",
    duration: "60 минут",
    preparation: "До встречи: проект, код или Blueprint-графы",
    result: "После встречи: запись, конспект и план работ",
    description:
      "Вы приходите со своим проектом и получаете понятный план дальнейших действий.",
    features: [
      "Разберём код, Blueprint-графы и структуру проекта.",
      "Найдём архитектурные ошибки, узкие места и лишнюю сложность.",
      "Составим план: что исправить сейчас, что отложить, что удалить.",
    ],
    buttonText: "Разобрать проект",
    telegramMessage: "Привет! Хочу записаться на разбор проекта.",
    popular: true,
  },
  {
    icon: "architecture",
    title: "Архитектурная сессия",
    price: "5 000 ₽",
    duration: "60 минут",
    preparation: "До встречи: контекст, ограничения и текущая схема",
    result: "После встречи: запись, схема решения и карта рисков",
    description:
      "Спроектируем сложную систему и проверим ключевые технические решения до реализации.",
    features: [
      "GAS, подсистемы, сетевая игра, плагины и Mass Framework.",
      "Проектирование игровых систем для рабочего проекта.",
      "Ревью сложных модулей, зависимостей и технических рисков.",
    ],
    buttonText: "Обсудить архитектуру",
    telegramMessage: "Привет! Хочу записаться на архитектурную сессию.",
    popular: false,
  },
];
