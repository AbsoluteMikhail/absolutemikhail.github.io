---
type: lesson
course: ue-cpp-blueprint-devs
title: UFUNCTION и Blueprint API нормального человека
description: Как делать C++ функции, которые нормально живут в Blueprint-графах.
block: Блок 2 - Object Model и GC
video: 7
order: 7
pain: Почему функция не появляется или работает странно?
mainIdea: Blueprint и C++ - это одна система, а не два разных мира.
---

# UFUNCTION и Blueprint API нормального человека

## Главная боль

> Почему функция не появляется или работает странно?

## Зачем это существует?

`UFUNCTION` делает C++ функцию частью Unreal reflection system и позволяет использовать ее в Blueprint, networking, events и editor tooling.

## Темы

- BlueprintCallable
- BlueprintPure
- Const correctness
- NativeEvent
- ImplementableEvent
- WorldContext
- Pure node pitfalls

## Greybox Arena

- BP extension hooks
- Utility gameplay functions
- Gameplay debug helpers

## Где люди обычно ломаются?

- Не понимают, почему функция не появилась в Blueprint
- Делают все функции `BlueprintPure`
- Смешивают gameplay command и query в одной ноде
- Не проектируют API как инструмент для будущего себя и других разработчиков

## Как это выглядит в production?

Production Blueprint API строится как понятный слой расширения C++ систем: чистые queries отдельно, команды отдельно, extension hooks явно названы.

## Главная мысль

Blueprint и C++ - это одна система, а не два разных мира.
