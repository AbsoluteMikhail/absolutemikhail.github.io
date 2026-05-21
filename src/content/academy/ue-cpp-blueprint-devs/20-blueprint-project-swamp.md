---
type: lesson
course: ue-cpp-blueprint-devs
title: Почему BP-проект превращается в болото
description: Финальный разбор проблем BP-проектов и рефактор Greybox Arena к production C++ мышлению.
block: Блок 6 - Debugging и Production Reality
video: 20
order: 20
pain: Проект вроде работает, но поддерживать его невозможно
mainIdea: Production C++ - это не сложный код. Это системы, которые не разваливаются через месяц.
---

# Почему BP-проект превращается в болото

## Главная боль

> Проект вроде работает, но поддерживать его невозможно.

## Зачем это существует?

Blueprint отлично помогает быстро собирать gameplay, но без архитектурного мышления проект превращается в систему скрытых зависимостей, hard refs, Tick abuse и огромных графов.

## Темы

- Cast chains
- Tick abuse
- Hard refs
- Giant actors
- Circular includes
- Gameplay in widgets
- Replication spam
- No ownership thinking

## Финал Greybox Arena

Рефактор:

- Giant systems -> components
- Direct calls -> delegates/interfaces
- Hard refs -> soft refs
- Tick spam -> event-driven systems

## Где люди обычно ломаются?

- Считают, что проблема в Blueprint как инструменте, а не в архитектуре
- Пишут gameplay в widgets
- Связывают все через direct references
- Не думают об ownership и lifetime
- Откладывают рефактор до момента, когда система уже не двигается

## Как это выглядит в production?

Production C++ не обязан быть сложным. Он должен давать понятные границы систем, контролируемые зависимости, измеримое поведение и возможность расширять проект без переписывания всего.

## Финальная мысль

Production C++ - это не сложный код. Это системы, которые не разваливаются через месяц.
