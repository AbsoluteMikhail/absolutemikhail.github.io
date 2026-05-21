---
type: lesson
course: ue-cpp-blueprint-devs
title: Giant god classes убивают разработку
description: Почему Character.cpp превращается в неподдерживаемый монолит и как раскладывать gameplay по компонентам.
block: Блок 3 - Gameplay Programmer Thinking
video: 8
order: 8
pain: Character.cpp уже невозможно поддерживать
mainIdea: Gameplay systems должны расширяться без переписывания Character.
---

# Giant god classes убивают разработку

## Главная боль

> Character.cpp уже невозможно поддерживать.

## Зачем это существует?

На старте удобно писать все в Character: здоровье, оружие, интеракции, эффекты, UI-события. Но такой класс быстро становится god class, где любое изменение ломает соседние системы.

## Темы

- Composition over inheritance
- ActorComponent
- Include hell
- Circular dependencies
- Deep forward declaration
- When inheritance is still better

## Greybox Arena

Выносим в отдельные компоненты:

- Health
- Weapons
- Interaction

## Где люди обычно ломаются?

- Пихают каждую новую механику в Character
- Наследуют классы ради маленьких отличий поведения
- Получают circular dependencies между системами
- Держат слишком много include'ов в public headers
- Боятся компонентов и делают Character главным контроллером всего проекта

## Как это выглядит в production?

Production Character обычно держит базовую идентичность объекта и связывает системы. Конкретная gameplay-логика живет в компонентах, сервисах, data assets и отдельных systems.

## Главная мысль

Gameplay systems должны расширяться без переписывания Character.
