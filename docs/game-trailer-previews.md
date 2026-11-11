# Превью трейлеров в карточках игр

Короткие фрагменты опубликованных игровых трейлеров. Подготовлены 2026-11-11
для карточек на `/games/`, главной и в общем архиве; исходные полные ролики не включены в сайт.

| Файл в `src/assets/projects/` | Источник | Фрагмент |
| --- | --- | --- |
| `duelant/preview.mp4` | [Steam: DUELANT](https://store.steampowered.com/app/2854500/), «Геймплейный трейлер», movie ID 257021136 | 00:04–00:16 |
| `gribnik/preview.mp4` | [VK Play: Грибник](https://vkplay.ru/play/game/gribnik-the-forest-of-fools-44079/), встроенное [VK Видео](https://vk.com/video-222952364_456239088) | 01:34–01:46, по выбору автора |
| `kolobok/preview.mp4` | [VK Play: Колобок](https://vkplay.ru/play/game/kolobok-protiv-jascherov-arkanoid-40059/), встроенное [VK Видео](https://vk.com/video-222952364_456239069) | 00:10–00:20, ближний бой |
| `star-nomad/preview.mp4` | [VK Play: Звёздный кочевник](https://vkplay.ru/play/game/zvezdnyj-kochevnik-34552/), `newVideo` из публичного `/catalog/v1/game/zvezdnyj-kochevnik-34552/highlights?lang=ru` на `api.vkplay.ru`, videoId 7589859903605 | 00:55–01:07 |
| `dixotomia/preview.mp4` | [Steam](https://store.steampowered.com/app/1367710/), «Gameplay Trailer / August 2025», movie ID 257188609 | 00:16–00:28 |
| `knitted-inflatable/preview.mp4` | [Steam](https://store.steampowered.com/app/1324840/), «Development Trailer», movie ID 256836025 | 00:33–00:45 |
| `moonshine-mayhem/preview.mp4` | [Авторский трейлер](https://www.youtube.com/watch?v=RR4vJeqrg54) | 01:07–01:19 |
| `jams/gerasim-preview.mp4` | [Ролик со страницы itch.io](https://www.youtube.com/watch?v=zNo9DHUuYIw) | 01:06–01:18 |
| `jams/for-the-king-preview.mp4` | [Авторский ролик](https://www.youtube.com/watch?v=eRp6UE9UATM) | 12:36–12:48, отряд в бою |
| `jams/revenge-of-the-cat-preview.mp4` | [Авторский ролик](https://www.youtube.com/watch?v=qxOLSyOrkJM) | 01:00–01:12 |
| `jams/weekend-jam-preview.mp4` | [Авторский ролик](https://www.youtube.com/watch?v=8Xa3TwfkD2g) | 01:54–02:06, столкновение с роботами |
| `jams/handle-with-care-preview.mp4` | [Трейлер со страницы itch.io](https://www.youtube.com/watch?v=UZeuJG4gMCY) | 00:29–00:41 |

Формат: MP4, H.264, 640×360, 24 fps, 10–12 секунд, без звуковой дорожки.
Пример подготовки из скачанного исходника:

```sh
ffmpeg -ss 4 -i source.mp4 -t 12 -an -vf "scale=640:360,fps=24,setsar=1" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart preview.mp4
```

URL файлов CDN могут истечь: для обновления получать их заново со страницы
площадки. В данных сайта хранится импорт локального `preview.mp4`, а не временная
ссылка. У Кочевника `videoId` и ID картинки CDN различаются.

Общий `useGamePreview` загружает ролик только при наведении мыши или фокусе
клавиатурой на устройствах с точным указателем и hover. На сенсорных устройствах,
при reduced motion и ошибках воспроизведения остаётся обложка. Уход курсора,
потеря фокуса, скрытие вкладки и уход карточки за экран останавливают превью.
Одновременно воспроизводится только одна карточка. Навигация и открытие
проектных диалогов сохраняются. В разделе «Проекты под моим наставничеством»
видео-превью намеренно не используются: остаются исходные обложки.

Без превью остаётся MALENASTROM (в проверенных публичных материалах нет
отдельного игрового ролика).
При появлении исходников достаточно добавить `previewUrl` в каталог.

Медиа не входят в лицензию исходного кода сайта.
