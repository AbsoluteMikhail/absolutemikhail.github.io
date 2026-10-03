// Общий авторский архив включает ранние игры вне подборок сайта.
export const gameProjectCount = 21;

const lastTwoDigits = gameProjectCount % 100;
const lastDigit = gameProjectCount % 10;

export const projectCountLabel = lastTwoDigits >= 11 && lastTwoDigits <= 14
  ? "проектов"
  : lastDigit === 1
    ? "проект"
    : lastDigit >= 2 && lastDigit <= 4
      ? "проекта"
      : "проектов";

export const gameProjectCountLabel = `${projectCountLabel === "проект" ? "игровой" : "игровых"} ${projectCountLabel}`;
