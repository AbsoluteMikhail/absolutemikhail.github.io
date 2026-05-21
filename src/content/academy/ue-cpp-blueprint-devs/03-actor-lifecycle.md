---
type: lesson
course: ue-cpp-blueprint-devs
title: Никогда не пиши gameplay код в конструкторе UE
description: Actor lifecycle, BeginPlay, CreateDefaultSubobject, NewObject и editor-time ловушки.
block: Блок 1 - Ментальный сдвиг
video: 3
order: 3
pain: Почему в Editor все ломается?
mainIdea: Constructor создает объект. BeginPlay запускает игру.
---

# Никогда не пиши gameplay код в конструкторе UE

## Главная боль

> Почему в Editor все ломается?

## Зачем это существует?

Unreal создает объекты не только во время игры. Конструктор может выполняться в editor-time, при загрузке asset'ов и при создании Class Default Object.

## Темы

- Actor lifecycle
- Constructor
- PostInitializeComponents
- BeginPlay
- CreateDefaultSubobject
- NewObject
- Editor-time execution
- Ownership intro

## Greybox Arena

- Character
- HealthComponent
- Intentional constructor fail
- Correct runtime initialization

## Где люди обычно ломаются?

- Пишут runtime gameplay logic в constructor
- Создают runtime-объекты через неправильный API
- Не различают default subobjects и объекты, созданные во время игры
- Удивляются, что код сработал еще до Play

## Как это выглядит в production?

Constructor отвечает за дефолтную структуру объекта. Runtime-логика живет в BeginPlay, PostInitializeComponents или явно вызванных initialization-функциях.

## Главная мысль

Constructor создает объект. BeginPlay запускает игру.
