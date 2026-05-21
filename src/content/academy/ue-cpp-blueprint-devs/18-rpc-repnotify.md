---
type: lesson
course: ue-cpp-blueprint-devs
title: RPC и RepNotify без магии
description: Server RPC, Client RPC, Multicast, RepNotify и разница между cosmetic и gameplay replication.
block: Блок 5 - Multiplayer Minimum
video: 18
order: 18
pain: RunOnServer ничего не делает
mainIdea: Не все должно реплицироваться одинаково.
---

# RPC и RepNotify без магии

:::warning
Если вы делаете только singleplayer - можете пропустить этот блок.
:::

## Главная боль

> RunOnServer ничего не делает.

## Зачем это существует?

RPC и RepNotify решают разные задачи. RPC передает намерение или событие, replicated properties синхронизируют состояние, а RepNotify помогает реагировать на изменение этого состояния.

## Темы

- Server RPC
- Client RPC
- Multicast
- RepNotify
- Cosmetic vs gameplay
- Reliable abuse

## Greybox Arena

- Replicated weapon fire
- Replicated FX
- Cosmetic hit reactions

## Где люди обычно ломаются?

- Вызывают Server RPC с объекта, которым клиент не владеет
- Делают все RPC reliable
- Реплицируют cosmetic effects как gameplay state
- Используют Multicast там, где нужен replicated state
- Не разделяют "команда", "состояние" и "визуальная реакция"

## Как это выглядит в production?

Production multiplayer code проектирует network path отдельно для gameplay truth, player input, cosmetics и UI. Не все данные идут одним механизмом.

## Главная мысль

Не все должно реплицироваться одинаково.
