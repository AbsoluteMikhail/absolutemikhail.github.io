# Превью ссылок

| Страница | Изображение 1200 × 630 |
| --- | --- |
| GamePunk `/` | `public/studio-social.png` |
| GamePunk `/en/` | `public/studio-social-en.png` |
| Михаил `/mikhail/` | `public/snippet.jpg` |
| Академия `/academy/` | `public/academy-social.jpg` |

Главные страницы и Михаил получают метаданные из `src/lib/resolvePageMetadata.ts`;
Академия — из `src/lib/academyRoutes.ts`. Каталог, направления и материалы без
обложек используют изображение Академии. Собственная обложка урока или курса
имеет приоритет. `og:image` и `twitter:image` одинаковы в браузере и статическом HTML.

Макет личного превью: `/snippet/?capture`, `src/pages/OGSnippet.tsx`.
Макет GamePunk: `/snippet/?view=studio&capture` (RU) и
`/snippet/?view=studio&lang=en&capture` (EN), `src/components/StudioSnippet.tsx`
и `src/components/studio-snippet.css`. Логотип, Малена, наклейка и тексты —
из тех же исходников, что на главной студии. Экспортировать обе версии в PNG.
Макет Академии: `/snippet/?view=academy&capture`,
`src/components/AcademySnippet.tsx` и `src/components/academy-snippet.css`.
Для обновления JPEG открыть макет с viewport 1200 × 630, дождаться шрифтов и
сохранить скриншот viewport в соответствующий файл `public/`. Параметр `capture`
убирает курсор, прокрутку и резерв под скроллбар. Изменение макета само по себе
не обновляет сохранённый JPEG; после экспорта выполнить сборку и проверить
метатеги в `dist/` (саму папку `dist/` не редактировать).
