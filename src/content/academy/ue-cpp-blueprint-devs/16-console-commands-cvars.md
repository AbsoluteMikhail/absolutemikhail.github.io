---
type: lesson
course: ue-cpp-blueprint-devs
title: Консольные команды и CVars - суперсила gameplay programmer'а
description: Runtime tuning, debug toggles и изменение gameplay без перекомпиляции.
block: Блок 4 - UE Engineering
video: 16
order: 16
pain: Любое изменение требует перекомпиляции
mainIdea: Gameplay programmer должен уметь менять игру на лету.
---

# Консольные команды и CVars - суперсила gameplay programmer'а

## Главная боль

> Любое изменение требует перекомпиляции.

## Зачем это существует?

Gameplay iteration ускоряется, когда параметры и debug behavior можно менять в runtime. Консольные команды и CVars превращают игру в измеряемую и настраиваемую систему.

## Темы

- Exec functions
- CheatManager
- Console commands
- CVars
- Runtime tuning
- Gameplay debugging

## Greybox Arena

- Runtime speed modifier
- Debug toggles
- Instant gameplay balancing

## Где люди обычно ломаются?

- Для каждой проверки меняют код и делают rebuild
- Не отделяют debug commands от shipped gameplay
- Не документируют полезные команды
- Хардкодят временные значения и забывают их убрать
- Не используют runtime toggles для поиска проблем

## Как это выглядит в production?

Production gameplay programmer умеет включать debug overlays, менять balance values, симулировать состояния и собирать данные без постоянной перекомпиляции.

## Главная мысль

Gameplay programmer должен уметь менять игру на лету.
