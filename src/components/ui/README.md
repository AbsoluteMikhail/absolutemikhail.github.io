# Общее оформление

Цвета и эффекты заданы в `src/index.css`, шрифты и шкалы Tailwind — в `tailwind.config.ts`.
Здесь собраны повторяющиеся элементы сайта. Их текущие варианты сохраняют существующий дизайн.

| Элемент | Где менять |
| --- | --- |
| Кнопки и ссылки, оформленные как кнопки | `button.tsx`: `Button`, `buttonStyles` |
| Кнопки выбора формата менторинга | `button.tsx`: `mentoringButtonStyles` |
| Кнопки с иконкой: закрытие, пауза | `icon-button.tsx`: `IconButton` |
| Заголовки секций второго уровня | `section-title.tsx`: `SectionTitle` |
| Плашки над заголовками | `section-badge.tsx`: `SectionBadge` |
| Поведение модальных окон | `modal.tsx`: `Modal` |

## Кнопки

`Button` сохраняет обычные атрибуты кнопки и передаёт `ref`; по умолчанию `type="button"`.
Варианты: `primary`, `outline`, `secondary`, `subtle`, `text`, `unstyled`.
Размеры: `sm`, `md`, `lg`, `menu`, `none`. Для `text` обычно нужен `size="none"`.
Эффект основной кнопки: `scale` по умолчанию, `shadow` или `none`.

```tsx
<Button size="sm" onClick={open}>Связаться</Button>

<a href="#production" className={buttonStyles({ className: "box-glow" })}>
  Мой опыт
</a>

<Link to="/projects" className={buttonStyles({ variant: "secondary", size: "lg" })}>
  Все проекты
</Link>
```

Переход остаётся ссылкой, действие — кнопкой. `ContactMessenger` принимает те же
`variant`, `size`, `effect` и `className`; вручную собирать его основное оформление не нужно.
`unstyled` предназначен для самостоятельного общего набора стилей, как
`mentoringButtonStyles`, а не для копирования длинной строки классов между секциями.

`IconButton` требует `aria-label`; варианты `surface`, `quiet`, `outline` сохраняют
нынешние размеры и оформление кнопок закрытия и паузы.

## Заголовки и плашки

```tsx
<SectionBadge tone="accent" size="md">Отзывы</SectionBadge>
<SectionTitle className="mb-6">Отзывы игроков</SectionTitle>
```

`SectionTitle` выводит `h2`: основной размер — `text-3xl md:text-5xl`,
`size="compact"` — `text-2xl md:text-3xl`. Содержание и переносы строк задаёт секция.

`SectionBadge` поддерживает `tone="primary" | "accent"`, `size="sm" | "md"`
и необязательную иконку. Оба компонента принимают обычные атрибуты соответствующего
элемента и параметры Framer Motion; анимации автоматически не добавляются.

## Граница общего и локального

Общие цвета, типографику и состояния меняем здесь. Расположение, внешние отступы,
ширину и намеренные особенности конкретной секции задаём через `className`.
`cn` объединяет классы и разрешает конфликты Tailwind. Новый повторяющийся вариант
нужно добавить здесь; уникальную композицию страницы не требуется превращать в универсальный компонент.
