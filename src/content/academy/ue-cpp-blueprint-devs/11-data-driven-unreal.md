---
type: lesson
course: ue-cpp-blueprint-devs
title: Data-driven Unreal Engine
description: Как отделить данные от логики, чтобы баланс и настройки не требовали перекомпиляции.
block: Блок 3 - Gameplay Programmer Thinking
video: 11
order: 11
pain: Любой баланс требует перекомпиляции
mainIdea: Данные отдельно. Логика отдельно.
---

# Data-driven Unreal Engine

## Главная боль

> Любой баланс требует перекомпиляции.

## Зачем это существует?

Gameplay system должна быть стабильной, а данные должны меняться быстро. Если каждое изменение урона, скорости или cooldown требует C++ rebuild, итерация становится слишком дорогой.

## Темы

- USTRUCT
- DataAsset
- PrimaryDataAsset
- BP for data
- C++ for systems
- Static vs runtime data

## Greybox Arena

- Weapon configs
- Projectile configs
- Gameplay effect configs

## Где люди обычно ломаются?

- Хардкодят баланс прямо в C++ классах
- Делают Blueprint не только данными, но и местом всей логики
- Не различают immutable config и runtime state
- Дублируют одинаковые настройки в разных Actor'ах
- Не понимают, когда нужен `DataAsset`, а когда достаточно `USTRUCT`

## Как это выглядит в production?

Production gameplay code часто выглядит так: C++ описывает систему, DataAsset описывает конкретную конфигурацию, Blueprint помогает собрать authoring workflow для дизайнеров.

## Главная мысль

Данные отдельно. Логика отдельно.
