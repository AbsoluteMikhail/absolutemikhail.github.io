# Absolute Mikhail | GameDev & UE5 Mentoring

Персональный сайт-портфолио разработчика игр и ментора по Unreal Engine 5.

## О проекте

Данный проект представляет собой современное портфолио, созданное для демонстрации игровых проектов, достижений и услуг по менторству в сфере GameDev.

**Сайт доступен по адресу**: [https://absolutemikhail.github.io](https://absolutemikhail.github.io)

## Что умеет сайт

- Основная страница-портфолио с информацией об авторе, проектах, достижениях, отзывами и блоком менторинга.
- Отдельная страница всех проектов: `/projects`.
- Служебные страницы: `/music`, `/twitch`, `/og-snippet`.
- Скрытый раздел Academy для документации к курсам: `/academy`.

Раздел Academy не добавлен в основную навигацию сайта и доступен по прямому адресу. Он предназначен для конспектов, структуры курсов, материалов к видео и документации к учебным проектам.

## Технологический стек

Проект построен с использованием следующих технологий:

- **Vite** — быстрая сборка проекта
- **TypeScript** — строгая типизация
- **React** — UI библиотека
- **Tailwind CSS** — стилизация
- **shadcn/ui** — компоненты интерфейса
- **Framer Motion** — анимации

## Разработка

Для запуска проекта локально выполните следующие шаги:

1. Клонируйте репозиторий:
   ```sh
   git clone https://github.com/absolutemikhail/absolutemikhail.github.io.git
   ```
2. Установите зависимости:
   ```sh
   npm install
   ```
3. Запустите сервер для разработки:
   ```sh
   npm run dev
   ```

4. Соберите production-версию:
   ```sh
   npm run build
   ```

## Academy

Academy - это простой Markdown-first docs-раздел внутри текущего React/Vite сайта.

Контент курсов лежит в:

```txt
src/content/academy/
```

Публичные картинки, архивы и другие материалы для курсов лежат в:

```txt
public/academy/
```

Текущие Academy-материалы:

```txt
src/content/academy/ue-cpp-blueprint-devs/
src/content/academy/useful-ue/
```

Они доступны по адресам:

```txt
/academy/ue-cpp-blueprint-devs
/academy/useful-ue
```

Чтобы добавить новый курс:

1. Создайте папку `src/content/academy/course-slug/`.
2. Добавьте `index.md` с `type: course`.
3. Добавьте уроки отдельными `.md` файлами с `type: lesson`.
4. Картинки и файлы положите в `public/academy/course-slug/`.

Уроки поддерживают YouTube-видео через поле `youtube` во frontmatter. Для страниц с несколькими видео есть Markdown-блок `:::youtube`.

Подробная инструкция находится в [src/content/academy/README.md](./src/content/academy/README.md).

## Лицензия

© 2026 Absolute Mikhail. Все права защищены.

Просмотр кода разрешен всем, однако любое использование, копирование или изменение кода запрещено без явного согласия владельца. Подробности см. в файле [LICENSE](./LICENSE).
