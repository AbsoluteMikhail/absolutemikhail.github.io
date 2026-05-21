---
type: lesson
course: ue-cpp-blueprint-devs
title: Настоящий дебаг Unreal C++
description: Breakpoints, watches, callstack, UE_LOG и расследование реального gameplay бага.
block: Блок 6 - Debugging и Production Reality
video: 19
order: 19
pain: Я не понимаю как искать баги
mainIdea: Production programmer не угадывает проблемы - он их измеряет.
---

# Настоящий дебаг Unreal C++

## Главная боль

> Я не понимаю как искать баги.

## Зачем это существует?

Когда проект растет, угадывание перестает работать. Нужно уметь останавливать выполнение, смотреть состояние объектов, читать callstack и подтверждать гипотезы данными.

## Темы

- Breakpoints
- Watches
- Callstack
- Debugger
- Development Editor vs DebugGame Editor
- Inline optimization pitfalls
- UE_LOG
- Log categories
- OnScreenDebug

## Greybox Arena

- Debugging real crash
- Broken gameplay system investigation

## Где люди обычно ломаются?

- Лечат баги случайными изменениями
- Не смотрят callstack
- Используют только Print String
- Не заводят log categories
- Дебажат optimized code и не понимают странное поведение debugger'а

## Как это выглядит в production?

Production programmer строит debugging workflow: воспроизведение, breakpoint, state inspection, logs, hypothesis, verification. Проблема не "чувствуется", а измеряется.

## Главная мысль

Production programmer не угадывает проблемы - он их измеряет.
