---
type: course
slug: ue-cpp-blueprint-devs
title: UE C++ для Blueprint разработчиков
description: Курс про переход от BP spaghetti к мышлению gameplay programmer'а через практику на Greybox Arena.
format: Курс
project: Greybox Arena
tags: Unreal Engine, C++
topics: unreal-engine, cpp
status: Тестируется
order: 1
updated: 2026-10-13
---

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

## Материалы для справки

- [Программирование на C++ в Unreal Engine — Epic Games](https://dev.epicgames.com/documentation/en-us/unreal-engine/programming-with-cplusplus-in-unreal-engine): классы, система отражения, контейнеры и gameplay-архитектура.
- [Data Assets — Epic Games](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-assets-in-unreal-engine): отделение данных от игровой логики.

## Авторство и материалы

Здесь я собрал программу курса для Blueprint-разработчиков. Greybox Arena — сквозной учебный проект, на котором будем разбирать темы; страницы занятий пока опубликованы как анонсы.

Мой авторский учебный код и Blueprint-примеры Академии доступны под [0BSD](/academy-code-license.txt): их можно использовать и изменять, в том числе в коммерческих проектах, без обязательного упоминания автора. Тексты курса, медиа и сторонние ассеты эта лицензия не покрывает. Unreal Engine и документация принадлежат Epic Games и регулируются условиями их правообладателя. Источники сторонних компонентов будут указаны в тех уроках, где они используются.

## Вопросы и помощь

Вопросы по программе курса можно оставить в моём [Telegram-канале](contact:telegram-community).

Если нужна помощь с переходом от Blueprint к C++ или с архитектурой своего проекта, можно записаться ко мне на [личный менторинг](/#mentoring).
