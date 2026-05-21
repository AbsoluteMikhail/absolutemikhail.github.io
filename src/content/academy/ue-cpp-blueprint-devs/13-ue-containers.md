---
type: lesson
course: ue-cpp-blueprint-devs
title: Почему std::vector может ломать Unreal
description: TArray, TMap, TSet, UObject references и контейнеры как часть gameplay performance.
block: Блок 4 - UE Engineering
video: 13
order: 13
pain: Зачем Epic сделали свои контейнеры?
mainIdea: Контейнеры - часть gameplay performance.
---

# Почему std::vector может ломать Unreal

## Главная боль

> Зачем Epic сделали свои контейнеры?

## Зачем это существует?

Контейнеры Unreal связаны с reflection, GC, serialization, memory tracking и editor tooling. STL может быть нормальным C++, но не всегда нормальным Unreal C++.

## Темы

- TArray
- TMap
- TSet
- RemoveSwap
- GC visibility
- UObject refs in containers
- STL vs UE

## Greybox Arena

- Active projectile arrays
- Nearby enemy tracking
- Gameplay effect collections

## Практика

- RemoveAt vs RemoveSwap
- Где порядок важен
- Где порядок не важен

## Где люди обычно ломаются?

- Хранят UObject references в контейнерах, невидимых для GC
- Используют `RemoveAt` в горячих местах, где порядок не нужен
- Не понимают стоимость поиска, удаления и reallocations
- Смешивают STL и UE containers без причины
- Не думают о container choice как о gameplay decision

## Как это выглядит в production?

Production gameplay programmer выбирает контейнер под доступ, удаление, порядок, GC visibility и hot path performance, а не просто "мне нужен список".

## Главная мысль

Контейнеры - часть gameplay performance.
