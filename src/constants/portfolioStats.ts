// Общий авторский архив включает ранние игры вне подборок сайта.
export const gameProjectCount = 21;

const lastTwoDigits = gameProjectCount % 100;
const lastDigit = gameProjectCount % 10;

export const gameProjectCountLabel = lastTwoDigits >= 11 && lastTwoDigits <= 14
  ? "игровых проектов"
  : lastDigit === 1
    ? "игровой проект"
    : lastDigit >= 2 && lastDigit <= 4
      ? "игровых проекта"
      : "игровых проектов";
