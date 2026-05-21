---
type: lesson
course: ue-cpp-blueprint-devs
title: Что Unreal делает с твоим кодом под капотом
description: UHT, reflection, GENERATED_BODY и generated.h без магического тумана.
block: Блок 1 - Ментальный сдвиг
video: 2
order: 2
pain: Что вообще делают GENERATED_BODY и макросы?
mainIdea: Сначала Unreal строит reflection system. Потом gameplay.
---

# Что Unreal делает с твоим кодом под капотом

## Главная боль

> Что вообще делают GENERATED_BODY и макросы?

## Зачем это существует?

Unreal должен знать о классах, свойствах и функциях больше, чем обычный C++ compiler. Для этого движок сначала строит reflection system.

## Темы

- UHT
- Reflection
- GENERATED_BODY
- generated.h
- Include dependencies
- Forward declarations
- Compile pipeline

## Greybox Arena

- Создаем базовый gameplay actor
- Специально устраиваем include hell
- Смотрим на compile dependency explosion

## Где люди обычно ломаются?

- Считают макросы просто синтаксическим шумом
- Не понимают, почему `generated.h` должен быть последним include
- Подключают лишние headers вместо forward declarations
- Не видят связь между includes и временем компиляции

## Как это выглядит в production?

Production-код держит public headers легкими, forward declarations используются осознанно, а зависимости между gameplay-модулями контролируются заранее.

## Главная мысль

Сначала Unreal строит reflection system. Потом gameplay.
