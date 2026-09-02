---
type: lesson
course: data-driven-speed-modifiers
title: Data Assets спасли моё болото
description: Собираем в Blueprint систему модификаторов скорости, которая переживает пересечение зон, повторные эффекты и изменение правил без переписывания персонажа.
block: Практический кейс
video: 1
order: 1
pain: Каждый новый эффект скорости добавляет флаг, Branch и ещё один способ сломать восстановление значения.
mainIdea: Объекты мира только сообщают об эффекте, данные описывают его правила, а один компонент считает результат из актуального состояния.
youtube: https://youtu.be/Q8SXNGHKD8s
videoIntro: Лень читать — смотрите видео. Материал тот же, но подача отличается: в ролике больше живой демонстрации, а в статье проще вернуться к формулам, таблицам и шагам.
cover: /academy/data-driven-speed-modifiers/cover.jpg
coverAlt: Михаил в болоте рядом с рабочим столом и заголовком Data Assets спасли моё болото
---

## Задача с собеседования

Эту задачу я действительно получил на техническом интервью. Есть персонаж, болото, которое его замедляет, и враг, который накладывает временный debuff скорости.

Казалось бы, пара переменных — и всё готово.

А потом в игре появляются ускоряющие ботинки, ауры, второй вид яда и ещё три поверхности. Персонаж превращается в настоящую помойку:

- мы в болоте?
- отравлены?
- есть ускоряющие ботинки?
- какой эффект закончился первым?
- какую скорость вернуть после выхода из триггера?

Если каждый объект напрямую переписывает `Max Walk Speed`, результат зависит от порядка событий. Болото возвращает одну скорость, яд — другую, а игрок ломает всё простым переходом между двумя зонами.

Соберём систему, в которой итог принадлежит одному месту, а объекты мира только сообщают: «такой эффект начался» или «такой эффект закончился».

![Тестовая сцена: персонаж, болота и источник ядовитых снарядов](/academy/data-driven-speed-modifiers/final-result-overview.jpg)

## Сначала посмотрим на ожидаемый результат

Базовая скорость персонажа — `600`.

| Ситуация | Ожидаемая скорость | Что проверяем |
|---|---:|---|
| Нет эффектов | 600 | Базовое значение сохранено |
| Болото | 300 | `Multiplicative ×0.5` |
| Два пересекающихся болота | 300 | `Unique` не удваивает эффект |
| Яд вне болота | 580 | Временный `Additive -20` |
| Яд + болото | 280 | Разные типы комбинируются |

Все значения в таблице подтверждены кадрами тестовой сцены ниже. Отдельной ускоряющей зоны в сцене нет: `DA_SpeedUp` понадобится дальше как пример того, что ту же Blueprint-логику зоны легко превратить из замедляющей в ускоряющую простой заменой Data Asset.

Ни один объект мира не решает, какую итоговую скорость выставить. Болото не знает о яде, а яд не пытается восстановить «свою» старую скорость.

## Архитектура в одном экране

:::flow Data-Driven архитектура модификаторов
Болото | Ядовитый снаряд | Та же зона с другим Data Asset
PDA_SpeedModifier | F_ActiveModifier | BPC_SpeedManagerComponent
Character Movement: итоговая Max Walk Speed
:::

Здесь три разные ответственности:

1. `PDA_SpeedModifier` отвечает: **что это за эффект и по каким правилам он работает?**
2. `F_ActiveModifier` отвечает: **кто применил конкретный эффект и сколько времени ему осталось?**
3. `BPC_SpeedManagerComponent` отвечает: **что дают все активные эффекты вместе?**

Если смешать эти ответы в персонаже или в болоте, мы снова получим спагетти. Только теперь архитектурное.

:::note Проверка понимания
Почему болото не должно самостоятельно устанавливать итоговую скорость? Назовите хотя бы один сценарий, в котором такой подход даст неверный результат.
:::

## Шаг 1. Сначала правила, потом ноды

В Content Browser нажимаем **Add → Blueprint → Enumeration**. Этот asset хранит ограниченный набор именованных вариантов и не даёт случайно записать в настройку что-то кроме предусмотренных значений.

![Меню создания Blueprint Enumeration и Structure](/academy/data-driven-speed-modifiers/create-blueprint-types-menu.png)

Создаём перечисление `E_ModifierType` — способ участия эффекта в расчёте. Открываем новый asset, добавляем два значения и переименовываем их:

| Значение | Смысл | Пример |
|---|---|---|
| `Additive` | Фиксированное изменение | яд `-20`, ускорение `+150` |
| `Multiplicative` | Коэффициент от базового значения | болото `×0.5` |

Затем `E_StackPolicy` — что делать с повторным применением.

| Значение | Поведение | Пример |
|---|---|---|
| `Unique` | В расчёте участвует один эффект с этим ID | несколько зон одного болота |
| `Stack` | Каждое применение участвует в расчёте | несколько бонусов скорости |
| `Refresh` | Повторное применение обновляет время | яд от одного врага |

![Enum E_ModifierType с вариантами Additive и Multiplicative](/academy/data-driven-speed-modifiers/modifier-type-enum.jpg)

![Enum E_StackPolicy с вариантами Unique, Stack и Refresh](/academy/data-driven-speed-modifiers/stack-policy-enum.jpg)

Это не косметические настройки. Если не определить повторное применение заранее, правило незаметно расползётся по `BeginOverlap`, projectile и персонажу.

## Шаг 2. Описание эффекта в Data Asset

Создаём **Blueprint Class**, раскрываем список всех классов, находим родителя `PrimaryDataAsset` и называем новый класс `PDA_SpeedModifier`.

![Выбор PrimaryDataAsset как родительского класса Blueprint](/academy/data-driven-speed-modifiers/create-primary-data-asset.png)

| Поле | Назначение |
|---|---|
| `ModifierId` | Идентичность эффекта для правил уникальности |
| `ModifierType` | `Additive` или `Multiplicative` |
| `Value` | Сила эффекта |
| `Duration` | Время действия; `-1` в этой системе означает «без таймера» |
| `StackPolicy` | `Unique`, `Stack` или `Refresh` |

![PDA_SpeedModifier: пять полей описания эффекта и Duration со значением по умолчанию -1](/academy/data-driven-speed-modifiers/pda-speed-modifier-fields.jpg)

Теперь создаём экземпляры нашего шаблона: **Add → Miscellaneous → Data Asset**, затем выбираем класс `PDA_SpeedModifier`.

![Создание Data Asset через меню Miscellaneous](/academy/data-driven-speed-modifiers/create-data-asset-menu.png)

![Выбор PDA_SpeedModifier для нового Data Asset](/academy/data-driven-speed-modifiers/select-speed-modifier-data-asset.png)

Таким способом создаём три демонстрационных ассета:

| Data Asset | ID | Тип | Value | Duration | Policy |
|---|---|---|---:|---:|---|
| `DA_Swamp` | Swamp | Multiplicative | 0.5 | -1 | Unique |
| `DA_Poison` | Poison | Additive | -20 | 10 | Refresh |
| `DA_SpeedUp` | SpeedUp | Additive | +150 | -1 | Stack |

`Duration = -1` — наше соглашение, а не встроенная магия Unreal Engine.

### Data-Driven — не волшебная кнопка

Дизайнер может создавать комбинации уже поддержанного поведения: менять силу, длительность и policy. Но новый тип операции — например, нелинейная кривая или жёсткий cap — всё равно потребует расширить компонент.

Для простой ссылки на данные хватило бы обычного Data Asset. `PrimaryDataAsset` дополнительно даёт Primary Asset ID и поддержку Asset Bundles, но Asset Manager в этом уроке не нужен. Не будем топить практический маршрут в соседней большой теме.

:::note Проверка понимания
Какое изменение можно сделать только данными: поменять яд с `Refresh` на `Stack` или добавить новый тип расчёта по кривой? Почему?
:::

## Шаг 3. Runtime-состояние — отдельная сущность

Возвращаемся в **Add → Blueprint → Structure**, создаём структуру `F_ActiveModifier`, открываем её и добавляем три поля. В отличие от Data Asset, это будет runtime-запись конкретного применения эффекта:

| Поле | Что хранит |
|---|---|
| `ModifierData` | Ссылку на `PDA_SpeedModifier` |
| `SourceActor` | Конкретного владельца применения |
| `TimeRemaining` | Оставшееся время |

![Структура F_ActiveModifier: данные эффекта, источник и оставшееся время](/academy/data-driven-speed-modifiers/active-modifier-struct.jpg)

`Data Asset` описывает неизменяемые правила. Активная запись хранит состояние конкретного применения.

### Почему SourceActor обязателен

Персонаж может стоять сразу в двух болотах. Data Asset у них один, но источники разные. При выходе из первого болота нужно удалить именно его запись, не снимая эффект второго.

У projectile обратная тонкость: каждый снаряд — новый Actor. Если передавать сам projectile, каждое попадание будет выглядеть новым источником и `Refresh` не найдёт предыдущий яд. Поэтому для серии снарядов передаём их общего `Owner` — врага или spawner.

Одна переменная, а сколько архитектурной работы делает.

:::warning Важно
`SourceActor` — это не обязательно Actor, который физически коснулся персонажа. Это стабильная идентичность владельца применения, выбранная под правила эффекта.
:::

## Шаг 4. Один компонент владеет результатом

Добавляем персонажу `BPC_SpeedManagerComponent`.

На `BeginPlay` компонент:

1. получает `CharacterMovementComponent`;
2. сохраняет исходный `Max Walk Speed` в `DefaultSpeed`;
3. начинает с пустого `ActiveModifiers`.

На этом же Event Graph уже виден вызов `ModifierTick` из `Event Tick`. Пока оставляем его как заготовку и возвращаемся к нему после того, как соберём функции поиска, добавления, удаления и пересчёта.

:::blueprintue EventGraph компонента BPC_SpeedManagerComponent
https://blueprintue.com/render/yzc8wvn8/
/academy/data-driven-speed-modifiers/component-event-graph.jpg
EventGraph компонента: BeginPlay и вызов ModifierTick из Event Tick
:::

### FindModifierIndex

Функция ищет активную запись по паре:

```text
ModifierData + SourceActor
```

Один `ModifierId` не различит два источника. Один `SourceActor` не различит два разных эффекта от одного владельца. Нужна пара.

:::blueprintue FindModifierIndex
https://blueprintue.com/render/zrxh6i0t/
/academy/data-driven-speed-modifiers/find-modifier-index.jpg
Функция FindModifierIndex
:::

### RecalculateSpeed

Мы не пытаемся «отменять последнее изменение». Каждый раз считаем результат заново из актуального массива:

```text
FinalSpeed = max(0, DefaultSpeed × MultiplicativeMultiplier + AdditiveSum)
```

Аккумуляторы начинаются так:

```text
MultiplicativeMultiplier = 1
AdditiveSum = 0
```

Если множитель начать с нуля, после умножения скорость всегда останется нулевой.

Для `Unique` функция держит локальный **Set** уже обработанных `ModifierId`. `Set` — это контейнер уникальных значений: один и тот же ID нельзя добавить в него дважды. Поэтому он удобно отвечает на вопрос «этот тип эффекта уже участвовал в расчёте?».

Создаём локальную переменную `UsedModifierIds` типа `Name`, открываем меню контейнера справа от типа и выбираем **Set** вместо одиночного значения или массива.

![Выбор контейнера Set для локальной переменной UsedModifierIds](/academy/data-driven-speed-modifiers/create-used-modifier-ids-set.png)

Все применения по-прежнему остаются в массиве со своими источниками, но в расчёте болото участвует один раз.

Это ключевой приём:

- **храним** применения по источникам;
- **считаем** уникальный эффект один раз по ID.

Порядок операций здесь является частью дизайна. При базе `600`, болоте `×0.5` и яде `-20` получаем:

```text
600 × 0.5 - 20 = 280
```

Если бы сначала применили яд, а потом умножили результат, было бы `290`. Ни один вариант не «истинный по движку» — команда должна выбрать правило и закрепить его тестом. `DA_SpeedUp` показывает ещё одно преимущество системы: та же зона может начать ускорять персонажа без нового Blueprint-кода, если заменить назначенный Data Asset.

:::blueprintue RecalculateSpeed
https://blueprintue.com/render/hztfjdxy/
/academy/data-driven-speed-modifiers/recalculate-speed.jpg
Функция RecalculateSpeed
:::

### ApplySpeed

`RecalculateSpeed` вычисляет число и не меняет состояние. `ApplySpeed` получает это число и записывает его в `Max Walk Speed`.

Так чистый расчёт отделён от side effect, а функцию проще проверять.

:::blueprintue ApplySpeed
https://blueprintue.com/render/upk4tva1/
/academy/data-driven-speed-modifiers/apply-speed.jpg
Функция ApplySpeed
:::

### AddModifier

Функция принимает `ModifierData` и `SourceActor`, проверяет ссылки и применяет policy:

- `Unique` — повтор того же применения не добавляется; разные источники хранятся, повторный ID исключается при расчёте;
- `Stack` — создаётся новая запись;
- `Refresh` — найденной записи возвращается полный `Duration`, а при отсутствии создаётся новая.

После изменения массива вызывается `ApplySpeed`.

:::blueprintue AddModifier
https://blueprintue.com/render/dyqp9tye/
/academy/data-driven-speed-modifiers/add-modifier.jpg
Функция AddModifier
:::

### RemoveModifier

Функция находит запись по Data Asset и источнику, удаляет именно её и вызывает полный пересчёт.

Мы не прибавляем обратно `20` и не делим текущую скорость на `0.5`. Поэтому результат не зависит от порядка, в котором закончились эффекты.

:::blueprintue RemoveModifier
https://blueprintue.com/render/dbm-dgoz/
/academy/data-driven-speed-modifiers/remove-modifier.jpg
Функция RemoveModifier
:::

### ModifierTick

Временные эффекты уменьшают `TimeRemaining`. Закончившиеся записи удаляются, а флаг `NeedSpeedRecalculation` запоминает, что после прохода нужно один раз вызвать `ApplySpeed`.

Массив проходим в обратном порядке: при прямом удалении индексы сдвигаются и можно пропустить следующий элемент.

Для демонстрации подойдёт `Tick Interval = 0.1`. Погрешность окончания эффекта — до одного интервала. В production-варианте можно включать Timer только при наличии временных эффектов.

![Настройка Tick Interval компонента на 0.1 секунды](/academy/data-driven-speed-modifiers/component-tick-interval.png)

:::blueprintue ModifierTick: время жизни эффектов и безопасное удаление
https://blueprintue.com/render/-k6qvr5y/
/academy/data-driven-speed-modifiers/modifier-tick.jpg
ModifierTick: обратный проход, обновление времени и один пересчёт после удаления
:::

Теперь возвращаемся к Event Graph, который видели в начале шага: подключаем `Event Tick` к `ModifierTick` и передаём `Delta Seconds`. Так функция действительно будет обслуживать временные эффекты с заданным интервалом компонента.

:::note Проверка понимания
Почему полный пересчёт устойчивее, чем попытка «вернуть старую скорость»? Что произойдёт, если яд закончится, пока персонаж остаётся в болоте?
:::

## Шаг 5. Объекты мира остаются тонкими

### Болото и та же логика для других зон

На `BeginOverlap`:

1. берём `Other Actor`;
2. находим `BPC_SpeedManagerComponent` через `Get Component By Class`;
3. проверяем ссылку;
4. вызываем `AddModifier`, передавая Data Asset и `Self` как источник.

На `EndOverlap` вызываем `RemoveModifier` с той же парой.

:::blueprintue BP_Swamp: применение и снятие эффекта
https://blueprintue.com/render/twk3uix1/
/academy/data-driven-speed-modifiers/swamp-overlap.jpg
BP_Swamp: применение и снятие эффекта
:::

В ролике `OverlapAll` используется ради быстрого прототипа. В настоящем проекте лучше создать отдельный collision channel/profile и фильтровать нужных акторов.

В тестовой сцене есть только болото. Но если назначить этой же зоне `DA_SpeedUp`, она станет ускоряющей без изменений в overlap-графе — меняются данные, а не код.

### Ядовитый снаряд

Projectile находит компонент и передаёт `DA_Poison`. В `SourceActor` уходит `Owner` снаряда, поэтому повторное попадание того же spawner или врага обновляет один эффект. После применения снаряд можно уничтожить.

:::blueprintue BP_PoisonProjectail: применение временного яда
https://blueprintue.com/render/1yweiiji/
/academy/data-driven-speed-modifiers/poison-projectile-owner.jpg
Ядовитый projectile передаёт свой Owner как SourceActor модификатора
:::

`Owner` не появляется автоматически только потому, что Actor был создан через `SpawnActor`: у ноды [Spawn Actor from Class](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Game/SpawnActorfromClass) этот вход может остаться пустым. На узле создания снаряда нужно раскрыть Advanced Pins и явно передать `Self` spawner в `Owner` — либо вызвать `Set Owner` сразу после создания.

:::blueprintue BP_Spawner: создание projectile и назначение Owner
https://blueprintue.com/render/we8pj4_7/
/academy/data-driven-speed-modifiers/bp-spawner.jpg
BP_Spawner явно назначает себя владельцем созданного projectile
:::

В примере `BP_Spawner` после создания снаряда вызывает `Set Owner`: созданный projectile подключён к `Target`, а `Self` spawner — к `New Owner`. Теперь `Get Owner` внутри projectile возвращает стабильный источник для политики `Refresh`.

## Шаг 6. Не верим системе на слово

Пройдите тесты именно в комбинациях:

| Действие | Ожидание |
|---|---:|
| Стоим без эффектов | 600 |
| Входим в пересечение двух болот | 300 |
| Выходим только из первого болота | 300 |
| Выходим из второго | 600 |
| Получаем яд | 580 |
| С ядом входим в болото | 280 |
| Ждём окончание яда в болоте | 300 |
| Получаем повторный яд от того же Owner | сила остаётся -20, время снова 10 секунд |

Если поменять у яда только `StackPolicy` с `Refresh` на `Stack`, компонент трогать не придётся. Последовательные попадания должны дать `580 → 560 → 540`.

Вот здесь Data-Driven подход перестаёт быть красивым словом и становится наблюдаемым свойством системы.

### Кадры проверки

![Базовое состояние: скорость 600](/academy/data-driven-speed-modifiers/result-base-600.jpg)

![Одно болото: скорость 300](/academy/data-driven-speed-modifiers/result-swamp-300.jpg)

![Два пересекающихся болота: скорость остаётся 300](/academy/data-driven-speed-modifiers/result-two-swamps-300.jpg)

![Яд и болото одновременно: скорость 280](/academy/data-driven-speed-modifiers/result-poison-swamp-280.jpg)

## Самостоятельная практика: DA_Frozen

Создайте четвёртый эффект со следующими требованиями:

- уменьшает базовую скорость на 25%;
- повторное попадание того же врага обновляет время;
- два разных врага могут поддерживать независимые экземпляры;
- скорость никогда не становится отрицательной;
- после окончания одного экземпляра учитываются оставшиеся эффекты.

### Критерии готовности

1. До сборки записано ожидаемое поведение для одного и двух `SourceActor`.
2. Эффект создаётся новым Data Asset без изменений в персонаже и объектах мира.
3. Повтор от одного владельца обновляет срок, но не силу.
4. Два владельца имеют независимое runtime-состояние.
5. Сценарий проверен вместе с болотом и ядом.
6. Если текущая модель не выражает нужное правило, вы можете точно назвать недостающую часть логики.

:::tip Упражнение со смыслом
Цель не в том, чтобы ещё раз механически протянуть провода. Сначала предскажите результат, затем соберите данные и проверьте, совпала ли архитектура с ожиданием.
:::

## Когда этого достаточно, а когда нужен GAS

Такой компонент подходит небольшому или среднему проекту, если набор операций ограничен, правила прозрачны и сложные сетевые предсказания не требуются.

Скорость — только учебный пример. Тот же шаблон переносится на здоровье, выносливость, защиту или силу атаки и может вырасти в `StatsComponent`.

Если нужны abilities, attributes, Gameplay Effects, Gameplay Tags, репликация и предсказание как единая система, пора смотреть в сторону Gameplay Ability System. GAS не отменяет идеи урока: данные, активные экземпляры, источники и stacking rules там тоже нужно понимать.

## Главное, что нужно унести

Мы построили не «болото, которое меняет `Max Walk Speed`».

Мы построили систему, где объект мира сообщает о применении, Data Asset описывает параметры, runtime-структура хранит конкретное состояние, а компонент владеет правилами и результатом.

Небольшое болото. Очень полезный архитектурный урок.

## Материалы для справки

- [Data Assets in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/data-assets-in-unreal-engine)
- [Asset Management in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine)
- [Basic Components in Unreal Engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/basic-components-in-unreal-engine)
- [Understanding the Gameplay Ability System](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-the-unreal-engine-gameplay-ability-system)
