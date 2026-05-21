---
type: lesson
course: ue-cpp-blueprint-devs
title: Твоя игра жрет 8 ГБ ОЗУ из-за hard references
description: Hard refs, soft refs, async loading и почему dependency chains убивают scalability.
block: Блок 4 - UE Engineering
video: 14
order: 14
pain: Проект грузит пол контента в память
mainIdea: Hard references убивают scalability.
---

# Твоя игра жрет 8 ГБ ОЗУ из-за hard references

## Главная боль

> Проект грузит пол контента в память.

## Зачем это существует?

Hard reference гарантирует, что asset нужен прямо сейчас, но большие dependency chains могут незаметно тащить в память половину проекта.

## Темы

- Hard refs
- Soft refs
- TSoftObjectPtr
- Async loading
- Asset Manager intro
- Dependency chains

## Greybox Arena

- Async weapon loading
- Lightweight arena startup
- MemReport comparison

## Где люди обычно ломаются?

- Ставят прямые ссылки на тяжелые assets в часто используемые классы
- Не проверяют Reference Viewer
- Не различают class reference и asset reference
- Загружают cosmetic content вместе с core gameplay
- Начинают думать о памяти только перед релизом

## Как это выглядит в production?

Production-код явно разделяет core dependencies и optional content. Soft references, async loading и Asset Manager помогают контролировать, что и когда попадает в память.

## Главная мысль

Hard references убивают scalability.
