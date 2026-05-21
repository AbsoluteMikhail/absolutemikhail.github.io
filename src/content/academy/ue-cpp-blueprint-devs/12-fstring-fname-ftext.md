---
type: lesson
course: ue-cpp-blueprint-devs
title: FString, FName и FText - три строки, три разных мира
description: Почему Unreal использует разные строковые типы и где каждый из них нужен.
block: Блок 4 - UE Engineering
video: 12
order: 12
pain: Почему Unreal не использует std::string
mainIdea: Не все строки одинаковы.
---

# FString, FName и FText - три строки, три разных мира

## Главная боль

> Почему Unreal не использует std::string.

## Зачем это существует?

В Unreal строка может быть изменяемым текстом, быстрым идентификатором или локализуемым UI-текстом. Один тип не закрывает все эти задачи одинаково хорошо.

## Темы

- FString
- FName internals
- FText
- Localization
- Hashing
- Performance

## Greybox Arena

- Gameplay tags
- Debug labels
- Arena UI text

## Где люди обычно ломаются?

- Используют `FString` для идентификаторов
- Показывают игроку `FName` или техническую строку
- Используют `FString` там, где нужен локализуемый `FText`
- Не понимают цену частых string operations
- Путают debug text и player-facing text

## Как это выглядит в production?

Production-код разделяет намерение: `FName` для стабильных имен и ключей, `FString` для технических строк и операций, `FText` для текста, который видит игрок.

## Главная мысль

Не все строки одинаковы.
