---
type: lesson
course: ue-cpp-blueprint-devs
title: Tick убивает проекты. Вот почему
description: Почему polling ломает производительность и как переходить на timers, delegates и event-driven код.
block: Блок 1 - Ментальный сдвиг
video: 4
order: 4
pain: FPS внезапно начинает умирать
mainIdea: Production gameplay code почти никогда не живет в Tick.
---

# Tick убивает проекты. Вот почему

## Главная боль

> FPS внезапно начинает умирать.

## Зачем это существует?

Tick выглядит простым способом "проверять каждый кадр", но быстро превращает gameplay logic в постоянный polling.

## Темы

- Tick abuse
- Polling vs event-driven
- Timers
- Delegates intro
- BlueprintPure hidden cost
- GetAllActorsOfClass disaster

## Greybox Arena

- Rotating dummy target
- Periodic arena events
- Tick refactor -> timers/delegates

## Где люди обычно ломаются?

- Используют Tick для проверок, которые должны быть событиями
- Дергают дорогие BlueprintPure nodes в графах
- Вызывают `GetAllActorsOfClass` как обычную gameplay-операцию
- Не видят цену "маленькой проверки" на каждом Actor каждый кадр

## Как это выглядит в production?

Production gameplay code предпочитает события, delegates, timers и явные state transitions. Tick остается для редких случаев, где реально нужна per-frame логика.

## Главная мысль

Production gameplay code почти никогда не живет в Tick.
