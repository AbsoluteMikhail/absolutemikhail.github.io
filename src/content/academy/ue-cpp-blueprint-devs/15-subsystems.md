---
type: lesson
course: ue-cpp-blueprint-devs
title: Subsystems - как перестать делать singleton помойки
description: GameInstanceSubsystem, WorldSubsystem и архитектура глобальных gameplay services.
block: Блок 4 - UE Engineering
video: 15
order: 15
pain: GameInstance превратился в мусорку
mainIdea: Global systems тоже должны иметь архитектуру.
---

# Subsystems - как перестать делать singleton помойки

## Главная боль

> GameInstance превратился в мусорку.

## Зачем это существует?

Глобальные системы нужны, но если складывать их в GameInstance или самодельные singletons, проект быстро теряет понятные lifecycle, ownership и зависимости.

## Темы

- GameInstanceSubsystem
- WorldSubsystem
- Gameplay services
- Manager architecture

## Greybox Arena

- Gameplay event service
- Arena-wide systems
- Centralized gameplay notifications

## Где люди обычно ломаются?

- Делают один global manager для всего
- Не различают lifetime GameInstance и World
- Хранят level-specific state в слишком долгоживущем объекте
- Используют singleton как способ не думать об ownership
- Создают hidden dependencies через global access

## Как это выглядит в production?

Production subsystem отвечает за конкретную область: inventory service, matchmaking service, gameplay event service, save service. У каждой системы есть понятный lifetime и зона ответственности.

## Главная мысль

Global systems тоже должны иметь архитектуру.
