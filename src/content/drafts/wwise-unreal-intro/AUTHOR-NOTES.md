# Заметки автора: Wwise + Unreal

Редакционный файл, не текст для ученика. Подготовлен 23.09.2026.

## Границы этого наброска

Запрос владельца — полный, но предварительный вводный курс с объяснением Wwise, сравнением подходов и установкой Gyms. Приложенный `prompt_wwise_gyms_course_ru.md` использован как источник структуры установочного блока и сообщений об ошибках. Его требования не превращались автоматически в поручение устанавливать инструменты или запускать чужие проекты.

Материал лежит вне `src/content/academy`: он не подключён к каталогу, маршрутам, пререндерингу и sitemap. Никаких программ для прохождения курса не устанавливалось. Коммит и публикация не выполнялись.

## Подтверждённые факты

GitHub API вернул для `main_25.1` SHA **`d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164`**. Полное дерево получено без усечения. В нём отсутствуют `.gitattributes`, `.gitmodules` и записи типа gitlink `160000`; отдельные шаги LFS/submodules в маршрут не включены. Проверенный `.umap` получен как бинарный ассет, а не LFS pointer.

| Источник | Что проверено |
| --- | --- |
| [README](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/README.md) | Семейство 2025.1, политика последних трёх UE, необходимость интеграции и порядок переключения движка |
| [Unreal/README](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/README.md) | Назначение примеров; при первом открытии меню может использовать имена папок |
| [setup_Windows.bat](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/setup_Windows.bat) | Вызов UBT, двух Python-скриптов и WwiseConsole; зависимость от рабочей папки и WWISEROOT; отсутствие остановки после каждой ошибки |
| [GenerateProjectWavFiles.py](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/WwiseProject/GenerateProjectWavFiles.py) | NumPy; 500 млн отсчётов LargeMedia, mono 16 bit; короткие WAV; пропуск существующих файлов |
| [GenerateSupportedGyms.py](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/GenerateSupportedGyms.py) | Генерация списков для Unreal и Unity, обращение к обоим деревьям |
| [Gyms.uproject](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/Gyms.uproject) | EngineAssociation 5.6 и C++-модули |
| [DefaultEngine.ini](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/Config/DefaultEngine.ini) | Стартовая карта MainMenu |
| [DefaultGame.ini](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/Config/DefaultGame.ini) | Ссылка на существующий Wwise-проект и RootOutputPath в каталоге Unity |
| [Gyms.wproj](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/WwiseProject/Gyms.wproj) | Метка v2025.1.3 / 8968 и Windows-путь банков |
| [Документация примеров](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Documentation/Gyms/README.md) | Назначение EssentialPostEvent и EssentialSwitch |
| [Карта EssentialPostEvent](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/Content/Gyms/1-Essential/EssentialPostEvent/EssentialPostEvent.umap) | Наличие карты, имён SimpleButton и PostEvent_Event; строки ассета не доказывают runtime-поведение |

Основные текстовые файлы прочитаны из `main_25.1` в той же сессии, в которой зафиксирован SHA; дополнительные конфиги, дерево и ассет читались по SHA. Полный проход установки не выполнялся.

## Что ещё нельзя объявлять проверенным

- Целевая связка **Wwise 2025.1.11 build 9262 + Unreal Integration + UE 5.6**. Точные versioned-страницы Audiokinetic Requirements / release notes оказались недоступны для чтения; прямой HTTP-запрос также не дал содержимого, подтверждающего совместимость. Полный номер интеграции пока неизвестен. Это пробел проверки, а не доказанная несовместимость.
- Точные названия пакетов Windows/компилятора и действие изменения установки в используемой версии Launcher. В доступных материалах есть разные поколения интерфейса — Open Other и Browse for project. Не выдавать их за одновременно видимые кнопки.
- Содержимое установленного SDK 9262 и фактический заголовок `AkWwiseSDKVersion.h`. Путь в ThirdParty взят также из сообщения об ошибке пользователя, не из локально установленной интеграции.
- Точная клавиша/жест взаимодействия в EssentialPostEvent, характер воспроизводимого звука и повторное срабатывание.
- Конвертация Gyms.wproj из сохранённого формата 2025.1.3 при открытии целевой версией.
- Итоговая комплектность банков после установки, работа packaged build и профайлера.

До публикации пройти установочную главу на отдельном проекте и заменить эти неопределённости фактическими значениями. Полезно фиксировать ошибки по этапам, поскольку setup продолжает выполнение после ряда сбоев.

## Остальные источники

- [Epic: Visual Studio для UE 5.6](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine?application_version=5.6): VS 2022 ≥17.8, рекомендована 17.14; MSVC 14.38.33130; Windows SDK ≥10.0.19041.0, рекомендован ≥10.0.22621.0. Вводный маршрут использует C++ workloads; полный список средств разработки у Epic шире.
- [Microsoft: Visual Studio](https://visualstudio.microsoft.com/vs/): официальный вход для установки.
- [Audiokinetic: Installation](https://www.audiokinetic.com/en/library/edge/?id=installation.html&source=UE4): доступный материал объясняет раздельную установку интеграции и SDK; edge не использовать как доказательство конкретного релиза.
- [Audiokinetic: установка Wwise, Launcher 2023.2.4](https://www.audiokinetic.com/en/library/Launcher_2023.2.4.3909/?id=install_wwise_through_launcher&source=InstallGuide): доступен индексируемый текст, прямое открытие ограничено; подтверждает общий маршрут, но не актуальный экран пакетов 2025.1.11.
- [Audiokinetic: Unreal Engine, Launcher 2025.2](https://www.audiokinetic.com/en/public-library/Launcher_2025.2.0.5346/?id=unreal_engine&source=InstallGuide): Open Other и Integrate Wwise in Project.
- [FMOD Studio Concepts 2.03](https://www.fmod.com/docs/2.03/studio/fmod-studio-concepts.html): события и параметры.
- [Epic: MetaSounds](https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-quick-start?application_version=5.6): назначение графа источника звука.
- [Python 3.13.7](https://www.python.org/downloads/release/python-3137/) и [обычный Windows installer](https://docs.python.org/3.13/using/windows.html): выбран фиксированный пример установщика; перед финальной публикацией рассмотреть актуальный поддерживаемый патч и повторить проверки.
- [NumPy 2.2.6 release notes](https://numpy.org/doc/2.3/release/2.2.6-notes.html) и [файлы выпуска](https://pypi.org/project/numpy/2.2.6/#files): поддержка Python 3.10–3.13; через официальный PyPI API подтверждён `numpy-2.2.6-cp313-cp313-win_amd64.whl`.
- [git clone](https://git-scm.com/docs/git-clone): параметры выбора ветки.

## Какие кадры нужны

1. Номера UE, Wwise Authoring и интеграции в используемой конфигурации.
2. Компоненты SDK и Windows в установленном Wwise.
3. Выбор `main_25.1`, commit и структура извлечённого проекта.
4. Карточка Gyms в Launcher и привязка существующего Wwise-проекта.
5. Успешные этапы setup с видимыми итогами сборки и генерации.
6. Карта EssentialPostEvent, подсказка управления и вызов события в Blueprint.
7. Короткая запись слышимого результата, затем один пример изменения звука.

Скриншотов пока нет. Не заменять их выдуманными изображениями интерфейса.

## Что добавить из следующего опыта Михаила

- Какие именно версии были установлены в фактическом эксперименте, включая Unreal patch и номер Integration.
- Последовательность действий, которая исправила SDK/NumPy, и было ли ещё что-то между ошибкой и успехом.
- Первый реально запущенный Gym и то, что в нём оказалось полезным.
- Личное впечатление: где инструмент облегчает общение со звуковиком, а где добавляет хлопот.
- Один небольшой собственный пример, на котором можно показать Event → параметр → слышимое изменение.

Лицензии Gyms и сторонних материалов сохраняются за их правообладателями. Учебная лицензия Академии не переопределяет лицензию скопированного стороннего кода; в этом наброске код Gyms не переносился в исходники сайта.
