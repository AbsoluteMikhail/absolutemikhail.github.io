---
type: lesson
course: ue-cpp-blueprint-devs
title: Почему Unreal удаляет твои объекты
description: UObject, GC, UPROPERTY, ownership и почему pointer внезапно становится проблемой.
block: Блок 2 - Object Model и GC
video: 5
order: 5
pain: Все стало nullptr спустя 30 секунд
mainIdea: Если не понимать ownership - проект начнет ломаться случайным образом.
---

# Почему Unreal удаляет твои объекты

## Главная боль

> Все стало nullptr спустя 30 секунд.

## Зачем это существует?

Unreal управляет жизнью UObject через garbage collector. Если объект не достижим через корректную ownership graph, движок имеет право его удалить.

## Темы

- UObject
- GC
- UPROPERTY
- Ownership
- Dangling pointers
- IsValid
- WeakObjectPtr

## Greybox Arena

- UObject gameplay effects
- Temporary runtime buffs
- Intentional GC fail

## Где люди обычно ломаются?

- Хранят UObject pointer без `UPROPERTY`
- Не понимают, кто владеет runtime-объектом
- Путают `nullptr`, pending kill и валидный объект
- Используют raw pointer там, где нужен weak reference

## Как это выглядит в production?

Production-код явно показывает ownership: через компоненты, actor references, subsystems, UPROPERTY-поля и осознанные weak references.

## Главная мысль

Если не понимать ownership - проект начнет ломаться случайным образом.
