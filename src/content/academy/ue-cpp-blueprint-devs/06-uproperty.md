---
type: lesson
course: ue-cpp-blueprint-devs
title: UPROPERTY без API-энциклопедии
description: Какие specifier реально нужны gameplay programmer'у и как делать удобный editor API.
block: Блок 2 - Object Model и GC
video: 6
order: 6
pain: Какие specifier реально нужны?
mainIdea: Gameplay programmer делает удобный editor API.
---

# UPROPERTY без API-энциклопедии

## Главная боль

> Какие specifier реально нужны?

## Зачем это существует?

`UPROPERTY` связывает C++ поле с reflection, editor workflow, serialization, Blueprint API и GC.

## Темы

- EditAnywhere
- VisibleAnywhere
- BlueprintReadOnly
- Instanced
- AllowPrivateAccess
- EditCondition
- Categories

## Greybox Arena

- Editable weapon settings
- Gameplay tuning
- Clean editor workflow

## Где люди обычно ломаются?

- Открывают все поля через `EditAnywhere`
- Не различают edit access и Blueprint read/write access
- Делают неструктурированные категории в Details panel
- Превращают C++ API в беспорядочную панель настроек

## Как это выглядит в production?

Gameplay programmer проектирует editor API так, чтобы дизайнер мог настраивать систему безопасно, быстро и без знания внутренностей класса.

## Главная мысль

Gameplay programmer делает удобный editor API.
