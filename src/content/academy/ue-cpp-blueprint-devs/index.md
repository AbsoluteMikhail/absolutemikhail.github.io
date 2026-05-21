---
type: course
slug: ue-cpp-blueprint-devs
title: UE C++ для Blueprint разработчиков
description: Курс про переход от BP spaghetti к мышлению gameplay programmer'а через практику на Greybox Arena.
project: Greybox Arena
tags: Unreal Engine, C++
status: Тестовый курс
order: 1
---

# UE C++ для Blueprint разработчиков

Главная цель курса - перестать писать BP spaghetti и начать мыслить как gameplay programmer.

Курс помогает:

- начать мыслить как gameplay programmer;
- понимать, как Unreal реально работает;
- перестать писать BP spaghetti;
- научиться строить масштабируемые gameplay systems.

## Сквозной проект - Greybox Arena

Это не "делаем игру". Не "делаем шутер". Не "делаем RPG".

Мы строим минималистичную gameplay sandbox сцену - gameplay systems playground.

Внутри Greybox Arena постепенно появляются:

- Character
- Weapon system
- Projectile system
- Health/Damage
- Interaction
- Gameplay Effects
- Dummy AI
- Pickups
- Debug tools
- Multiplayer support
- Data-driven configs

## Главная идея курса

> Вот простое решение. Вот почему оно начинает ломаться. Вот как это решают в production.

## Правило всего курса

Каждый урок отвечает на 4 вопроса:

1. Зачем это существует?
2. Какую проблему решает?
3. Где люди обычно ломаются?
4. Как это выглядит в production?

## Чем курс не является

Документация нужна для полного API, edge cases и полного списка specifier.

Этот курс - про мышление gameplay programmer'а.

## Как добавлять контент

Каждый урок курса лежит отдельным Markdown-файлом в папке `src/content/academy/ue-cpp-blueprint-devs`.

Картинки, архивы и дополнительные материалы лучше класть в `public/academy/ue-cpp-blueprint-devs`, а в тексте подключать так:

```md
![Скриншот Greybox Arena](/academy/ue-cpp-blueprint-devs/arena.jpg)
```

Для обычного оформления достаточно Markdown: заголовки, списки, цитаты, картинки, ссылки и блоки кода.
