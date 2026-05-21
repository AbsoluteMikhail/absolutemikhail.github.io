---
type: lesson
course: ue-cpp-blueprint-devs
title: Настройка UE C++ окружения без боли
description: Как собрать рабочий C++ workflow в Unreal и перестать бояться билдов.
block: Блок 1 - Ментальный сдвиг
video: 1
order: 1
pain: UE C++ выглядит нестабильным и страшным
mainIdea: Unreal C++ - это workflow, а не просто язык.
---

# Настройка UE C++ окружения без боли

## Главная боль

> UE C++ выглядит нестабильным и страшным.

## Зачем это существует?

Перед тем как писать gameplay systems, нужно привести окружение в состояние, где build, rebuild и запуск из IDE предсказуемы.

## Темы

- Rider / Visual Studio setup
- Visual Assist / Rider advantages
- Build configurations
- Live Coding vs Full Rebuild
- Почему Live Coding иногда врет
- Когда Live Coding использовать нельзя
- Compile from IDE
- Compile button trap

## Greybox Arena

- Создаем проект
- Делаем первый C++ Actor
- Получаем первый successful build
- Специально провоцируем Live Coding fail

## Где люди обычно ломаются?

- Путают Editor compile и полноценный rebuild
- Верят Live Coding после изменения header-файлов
- Не понимают, какая build configuration сейчас используется
- Лечат ошибки пересозданием проекта вместо чистого rebuild

## Как это выглядит в production?

Production workflow строится вокруг IDE, понятных build configurations и дисциплины rebuild'ов. Compile button в редакторе - вспомогательный инструмент, а не главный способ разработки.

## Главная мысль

Unreal C++ - это workflow, а не просто язык.
