# Academy Content Guide

Эта папка содержит контент скрытого раздела `/academy`.

Раздел работает как простой docs-движок: React-код один раз рисует направления, карточки материалов, меню и типографику, а курсы и уроки добавляются обычными Markdown-файлами.

## Направления и форматы

Направление отвечает на вопрос «о чём материал», а формат — «что это». Сейчас в Academy есть четыре направления:

- `cpp` — C++;
- `unreal-engine` — Unreal Engine;
- `ai` — Нейросети;
- `tools` — Инструменты и IT.

Один материал может относиться сразу к нескольким направлениям. Например, курс по C++ в Unreal Engine указывает `topics: unreal-engine, cpp`.

Поле `format` содержит видимое название формата: `Курс`, `Подборка`, а в будущем — `Статья`, `Гайд`, `Сравнение`, `Проект` или `Серия`.

## Быстрая структура

```txt
src/content/academy/
  README.md
  course-slug/
    index.md
    01-first-lesson.md
    02-second-lesson.md

public/academy/
  course-slug/
    image.jpg
    project-files.zip
```

## Как добавить новый курс

1. Создай папку курса внутри `src/content/academy`.

   ```txt
   src/content/academy/my-new-course/
   ```

2. Добавь в нее `index.md`. Это главная страница курса.

   ```md
   ---
   type: course
   slug: my-new-course
   title: Название курса
   description: Короткое описание курса для карточки и шапки.
   format: Курс
   project: Название сквозного проекта
   tags: Unreal Engine, C++, Gameplay
   topics: unreal-engine, cpp
   status: В работе
   order: 2
   ---

   # Название курса

   Основное описание курса.

   ## Для кого курс

   - Пункт 1
   - Пункт 2
   ```

3. Открой `/academy`. Карточка курса появится автоматически.

## Как добавить урок

Создай `.md` файл в папке курса:

```txt
src/content/academy/my-new-course/01-first-lesson.md
```

Минимальный шаблон урока:

```md
---
type: lesson
course: my-new-course
title: Название урока
description: Короткое описание урока.
block: Блок 1 - Название блока
video: 1
order: 1
pain: Главная боль, которую решает урок
mainIdea: Главная мысль урока.
youtube: https://youtu.be/VIDEO_ID
---

# Название урока

## Главная боль

> Формулировка боли.

## Зачем это существует?

Текст урока.

## Темы

- Тема 1
- Тема 2
- Тема 3
```

После этого урок появится:

- в списке уроков курса;
- в левом сайдбаре;
- по адресу `/academy/my-new-course/01-first-lesson`.

## Frontmatter-поля

Frontmatter - это блок между `---` в начале файла.

Для курса:

- `type: course` - обязательный тип документа.
- `slug` - URL курса. Пример: `ue-cpp-blueprint-devs`.
- `title` - название курса.
- `description` - описание для карточки и шапки.
- `format` - видимый формат материала. Например: `Курс` или `Подборка`.
- `project` - сквозной проект курса, если есть. Пример: `Greybox Arena`.
- `tags` - теги карточки курса через запятую. Пример: `Unreal Engine, C++, Gameplay`.
- `topics` - направления Academy через запятую. Допустимые значения: `cpp`, `unreal-engine`, `ai`, `tools`.
- `status` - статус курса. Например: `В работе`, `Тестовый курс`, `Опубликован`.
- `order` - порядок курса на `/academy`.

Для урока:

- `type: lesson` - обязательный тип документа.
- `course` - slug курса, к которому относится урок.
- `title` - название урока.
- `description` - короткое описание.
- `block` - блок/модуль курса. Уроки с одинаковым `block` группируются вместе.
- `video` - номер видео или внешний номер урока.
- `order` - порядок урока внутри курса.
- `pain` - главная боль урока.
- `mainIdea` - главная мысль урока.
- `youtube` - ссылка на основное YouTube-видео урока. Если поле есть, видео автоматически появится в шапке урока.

## Markdown-разметка

Поддерживается базовая разметка:

````md
# H1
## H2
### H3

Обычный текст с **жирным**, *курсивом* и `inline code`.

- Список
- Еще пункт

1. Нумерованный список
2. Еще пункт

> Цитата или главная мысль.

```cpp
UPROPERTY(EditAnywhere)
float Damage = 10.0f;
```

[Ссылка](https://example.com)
![Картинка](/academy/course-slug/image.jpg)
````

## Callout-блоки

Можно добавлять выделенные блоки:

```md
:::note
Обычная заметка.
:::

:::tip
Практический совет.
:::

:::warning
Важное предупреждение.
:::
```

## YouTube-видео

Основное видео урока лучше добавлять в frontmatter:

```md
---
type: lesson
course: my-new-course
title: Название урока
youtube: https://youtu.be/VIDEO_ID
---
```

Так видео автоматически появится перед текстом урока в адаптивном `16:9` контейнере.

Если на странице нужно несколько видео, используй Markdown-блок:

```md
:::youtube Название видео
https://youtu.be/VIDEO_ID
:::
```

Поддерживаются обычные ссылки YouTube:

- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`

## Картинки и файлы

Контентные ассеты лучше класть в `public/academy/<course-slug>/`.

Пример:

```txt
public/academy/ue-cpp-blueprint-devs/greybox-arena.jpg
public/academy/ue-cpp-blueprint-devs/project-files.zip
```

Использование в Markdown:

```md
![Greybox Arena](/academy/ue-cpp-blueprint-devs/greybox-arena.jpg)

[Скачать проект](/academy/ue-cpp-blueprint-devs/project-files.zip)
```

## Адреса страниц

Если курс лежит здесь:

```txt
src/content/academy/ue-cpp-blueprint-devs/index.md
```

то страница курса будет:

```txt
/academy/ue-cpp-blueprint-devs
```

Если урок лежит здесь:

```txt
src/content/academy/ue-cpp-blueprint-devs/01-ue-cpp-environment.md
```

то страница урока будет:

```txt
/academy/ue-cpp-blueprint-devs/01-ue-cpp-environment
```

## Важные ограничения

- Таблицы пока не рендерятся как таблицы.
- MDX-компоненты пока не подключены, только Markdown и custom callout-синтаксис.
- Если нужен новый тип блока, например YouTube embed или Download button, его нужно добавить в renderer: `src/components/academy/MarkdownContent.tsx`.
- Ссылки на Academy специально не добавлены в основную навигацию сайта. Раздел доступен по прямому адресу.
