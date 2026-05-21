---
type: lesson
course: ue-cpp-blueprint-devs
title: Cast To Character - это не архитектура
description: Как перестать строить проект на цепочках Cast и перейти к interface-driven gameplay.
block: Блок 3 - Gameplay Programmer Thinking
video: 9
order: 9
pain: Весь проект - цепочка Cast'ов
mainIdea: Cast - временное решение. Interfaces - scalable solution.
---

# Cast To Character - это не архитектура

## Главная боль

> Весь проект - цепочка Cast'ов.

## Зачем это существует?

`Cast` полезен, когда ты точно работаешь с конкретным типом. Но если каждая система спрашивает "а ты точно мой конкретный класс?", проект становится жестко связанным и плохо расширяется.

## Темы

- Cast<T>
- CastChecked
- Interfaces
- UInterface/IInterface
- Execute_ pattern
- BP/C++ interface traps

## Greybox Arena

- Interaction system
- Damageable targets
- Interactable pickups
- Interface-driven gameplay

## Где люди обычно ломаются?

- Кастятся к конкретному Character вместо запроса capability
- Дублируют Cast-цепочки в каждом Actor и Blueprint
- Не понимают разницу между UObject interface и C++ interface частью
- Забывают про `Execute_` pattern
- Делают interface, но все равно зависят от конкретного класса

## Как это выглядит в production?

Production systems часто спрашивают не "ты какой класс?", а "ты умеешь получать damage?", "ты interactable?", "ты умеешь отдавать gameplay data?". Это делает механику расширяемой.

## Главная мысль

Cast - временное решение. Interfaces - scalable solution.
