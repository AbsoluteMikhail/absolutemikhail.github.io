---
type: lesson
course: ue-cpp-blueprint-devs
title: Делегаты - переход от BP spaghetti к production коду
description: Event-driven gameplay, multicast delegates и развязка систем без прямых зависимостей.
block: Блок 3 - Gameplay Programmer Thinking
video: 10
order: 10
pain: Все системы знают друг о друге
mainIdea: Production gameplay architecture - event-driven.
---

# Делегаты - переход от BP spaghetti к production коду

## Главная боль

> Все системы знают друг о друге.

## Зачем это существует?

Когда одна система напрямую дергает вторую, третью и четвертую, код становится хрупким. Делегаты позволяют системе сообщать о событии, не зная всех подписчиков.

## Темы

- Delegates
- Multicast delegates
- Event-driven architecture
- Decoupling systems

## Greybox Arena

- OnHealthChanged
- UI reactions
- Gameplay reactions
- Arena event notifications

## Где люди обычно ломаются?

- Делают прямые вызовы между всеми системами
- Не отписываются от событий в правильный момент
- Используют delegates как скрытый global call
- Путают gameplay events и cosmetic reactions
- Держат UI и gameplay logic слишком близко друг к другу

## Как это выглядит в production?

Production-код строит gameplay flow вокруг событий: health changed, weapon fired, pickup collected, arena phase changed. Подписчики реагируют, но source event не знает, кто именно слушает.

## Главная мысль

Production gameplay architecture - event-driven.
