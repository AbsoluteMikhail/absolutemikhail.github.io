---
type: lesson
course: ue-cpp-blueprint-devs
title: Multiplayer mindset - сервер главный
description: Authority, ownership, replication basics и первое replicated HP в Greybox Arena.
block: Блок 5 - Multiplayer Minimum
video: 17
order: 17
pain: Multiplayer ломает весь проект
mainIdea: В multiplayer сервер - источник истины.
---

# Multiplayer mindset - сервер главный

:::warning
Если вы делаете только singleplayer - можете пропустить этот блок.
:::

## Главная боль

> Multiplayer ломает весь проект.

## Зачем это существует?

Multiplayer требует другого мышления: не каждый клиент имеет право менять gameplay state. Сервер становится источником истины, а клиенты показывают и запрашивают действия.

## Темы

- Authority
- Ownership
- Replication basics
- HasAuthority pitfalls
- GameMode nullptr on client
- GetLifetimeReplicatedProps
- Net/UnrealNetwork.h

## Greybox Arena

- Replicated HP
- Authoritative damage

## Где люди обычно ломаются?

- Меняют gameplay state на клиенте и ждут, что сервер поверит
- Используют `HasAuthority` без понимания ownership
- Пытаются получить GameMode на клиенте
- Забывают `GetLifetimeReplicatedProps`
- Реплицируют данные без понимания, кто должен ими владеть

## Как это выглядит в production?

Production multiplayer code начинается с вопроса: где живет истина? После этого проектируются replicated state, server commands, prediction/cosmetics и client reactions.

## Главная мысль

В multiplayer сервер - источник истины.
