# 4. Установка Gyms на Windows

В этом блоке подготовим официальный проект Audiokinetic Gyms и доберёмся до простого звукового примера. Gyms — набор небольших лабораторий и тестов; некоторые специально проверяют крайние случаи. Поэтому начинаем с Essential, а не со стресс-тестов.

**Статус черновика:** последовательность разобрана по исходникам, но установка на чистой машине ещё не пройдена. Сначала заполни [таблицу версий](03-versions.md). Указанные ниже пути Wwise относятся к целевому выпуску из исходной заметки; его совместимость с интеграцией нужно подтвердить в Launcher. Непроверенные детали интерфейса помечены явно.

## Подготовка

| Что понадобится | Для чего | Обязательно здесь | Официальный источник |
| --- | --- | --- | --- |
| Unreal Engine 5.6 | Открыть и запустить пример | Да | [Epic Games](https://www.unrealengine.com/download) |
| Visual Studio 2022 с C++ и Windows SDK | Собрать код проекта и плагинов | Да, инструменты сборки | [Microsoft](https://visualstudio.microsoft.com/vs/) |
| Audiokinetic Launcher | Установка компонентов и интеграции | Да в этом маршруте | [Audiokinetic](https://www.audiokinetic.com/download/) |
| Wwise Authoring, SDK и Unreal Integration | Подготовить звук и связать его с Unreal | Да | Через Launcher |
| Git for Windows | Скачать выбранную ветку Gyms | Да в основном маршруте; ZIP — альтернатива | [Git](https://git-scm.com/downloads/win) |
| Python 3.13 x64 и NumPy | Выполнить подготовительные скрипты Gyms | Да | [Python](https://www.python.org/downloads/windows/), [NumPy](https://numpy.org/install/) |

Совместимые установленные компоненты повторно ставить не нужно. Python требуется скриптам подготовки, а не для написания игровой логики. Компилятор нужен потому, что проект содержит C++-модули, даже если сам ты собираешься только нажать Play.

Используем такие примеры путей:

```text
Репозиторий:       C:\WwiseLabs\Gyms
Проект Unreal:    C:\WwiseLabs\Gyms\Unreal\Gyms.uproject
Проект Wwise:     C:\WwiseLabs\Gyms\WwiseProject\Gyms.wproj
Корень Unreal:    C:\Program Files\Epic Games\UE_5.6
Корень Wwise:     C:\Audiokinetic\Wwise_2025.1.11.9262
```

Путь установки Unreal можно сверить через параметры установленного движка в Epic Games Launcher и Проводник; путь Wwise — в карточке установленной версии и её папке. Подставляй реальные каталоги, включая пробелы. Unreal переносить из `Program Files` не требуется.

Для самой папки Gyms берём короткий путь без пробелов и кириллицы: проверенный setup передаёт путь `.uproject` сборщику без кавычек. Это ограничение конкретного скрипта, а не всей экосистемы Unreal.

Все команды дальше предназначены для **cmd**. Нажми **Win + R**, введи `cmd`, нажми Enter. Выполняй строки по одной. Если видишь приглашение `>>>`, ты попал внутрь Python: введи `exit()` и вернись в cmd.

## Шаг 1. Unreal и сборка C++

В Epic Games Launcher открой раздел Unreal Engine → Library, добавь установку версии 5.6 и дождись её завершения. Если эта версия уже установлена, запиши её путь.

Для UE 5.6 документация Epic указывает Visual Studio 2022 от 17.8, рекомендует 17.14; MSVC — `14.38.33130`; Windows SDK — минимум `10.0.19041.0`, рекомендуется `10.0.22621.0` или новее. Это значения страницы **для UE 5.6**, не универсальные требования ко всем UE. [Таблица Epic](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine?application_version=5.6).

Открой Visual Studio Installer → Modify у Visual Studio 2022. Для этого маршрута выбери **Desktop development with C++** и **Game development with C++**. В Individual components проверь MSVC v143 для x64/x86 нужной версии и Windows SDK. У новой установки VS набор по умолчанию может отличаться: версия IDE и версия компилятора — разные вещи.

Средства профилирования, AddressSanitizer и расширения отладки UE пригодятся позже; для первого прохода мы их не используем. Visual Studio Code не заменяет C++ toolchain. Первая успешная сборка будет окончательной проверкой, что все необходимые компоненты найдены.

Место на диске оценивай по выбранным пакетам в установщиках: размер проекта Gyms не включает движок, компилятор и их зависимости.

## Шаг 2. Скачать правильную ветку

Установи Git for Windows с официального сайта. Затем открой **новое** окно cmd и проверь команду:

```bat
git --version
mkdir C:\WwiseLabs
cd /d "C:\WwiseLabs"
git clone --branch main_25.1 --single-branch https://github.com/audiokinetic/Gyms.git Gyms
cd /d "C:\WwiseLabs\Gyms"
git branch --show-current
git rev-parse HEAD
```

`cd /d` меняет и диск, и папку. Клонирование копирует репозиторий, а `--branch` явно выбирает ветку. Последние две команды показывают её имя и точную ревизию. Назначение параметров: [git clone](https://git-scm.com/docs/git-clone).

Если `C:\WwiseLabs` уже существует, повторять `mkdir` не нужно. Если существует папка `Gyms`, не удаляй её ради инструкции: возьми другую новую папку и последовательно замени путь в командах.

Ожидаемая структура:

```text
Gyms\
  setup_Windows.bat
  GenerateSupportedGyms.py
  Unreal\Gyms.uproject
  WwiseProject\Gyms.wproj
  WwiseProject\GenerateProjectWavFiles.py
  Unity\
```

При подготовке разбиралась ревизия `d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164`. Если твой SHA другой, ветка успела измениться: сверь её README и setup. Для сопоставления с этим черновиком в **новой учебной копии** можно открыть указанное состояние:

```bat
git switch --detach d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164
```

Теперь Git находится на конкретном коммите, а не на обновляемой ветке. Последующий `git branch --show-current` будет пустым — это ожидаемо. Коммит фиксирует просмотренные исходники, а не гарантирует успешный запуск ещё не проверенной связки.

В полном дереве этой ревизии нет `.gitattributes`, `.gitmodules` и gitlink-записей submodules. Отдельные шаги Git LFS и submodules для неё не добавляем. Короткая альтернатива — открыть [ветку `main_25.1`](https://github.com/audiokinetic/Gyms/tree/main_25.1), проверить имя ветки над файлами, выбрать Code → Download ZIP и полностью извлечь архив. Следи, чтобы `setup_Windows.bat` лежал непосредственно в выбранном корне Gyms. Git-команды внутри ZIP-копии недоступны.

## Шаг 3. Wwise и его SDK

Установи Audiokinetic Launcher. На странице Wwise выбери выпуск, согласованный с интеграцией. В состав установки должны входить Authoring, **SDK (C++)** и Windows-библиотеки для совместимого компилятора. Инструкция выбора пакетов есть в [Installing Wwise through the Launcher](https://www.audiokinetic.com/en/library/Launcher_2023.2.4.3909/?id=install_wwise_through_launcher&source=InstallGuide); доступная страница относится к более старому Launcher, поэтому точные подписи Windows-пакетов выбранного выпуска ещё требуют сверки.

Если Wwise уже установлен, открывай изменение компонентов **его установки на странице Wwise**, у нужного номера версии. Изменение интеграции в карточке Unreal-проекта — другая операция.

**Integration Demo — набор примеров, он не заменяет SDK (C++).** В планируемой структуре контрольный заголовок находится здесь:

```text
C:\Audiokinetic\Wwise_2025.1.11.9262\SDK\include\AK\AkWwiseSDKVersion.h
```

Для конкретного пакета 9262 этот путь ещё нужно подтвердить после установки. Наличие одного заголовка не проверяет комплектность всех библиотек. Запиши путь установки и выбранные Windows-компоненты.

Иллюстрация для будущей версии: экран пакетов установленного Wwise с SDK и Windows-библиотеками.

## Шаг 4. Python и NumPy

Для воспроизводимого наброска выбран обычный **CPython 3.13.7 x64** из [официального выпуска](https://www.python.org/downloads/release/python-3137/). Это фиксированный пример, не рекомендация считать старый патч самым свежим. На странице Files нужен **Windows installer (64-bit)**, не embeddable package и не исходники. В классическом установщике включи добавление `python.exe` в PATH и оставь pip. Эти действия относятся к [обычному установщику Python 3.13](https://docs.python.org/3.13/using/windows.html), а не к другому интерфейсу Python Install Manager.

В новом окне cmd:

```bat
python --version
where python
python -c "import sys; print(sys.executable)"
python -m pip --version
python -m pip install "numpy==2.2.6"
python -c "import sys, numpy; print(sys.executable); print(numpy.__version__)"
```

Успех — Python показывает нужную версию и путь, а последняя строка выводит версию NumPy без ошибки. NumPy 2.2.6 [поддерживает Python 3.10–3.13](https://numpy.org/doc/2.3/release/2.2.6-notes.html); для CPython 3.13 Windows x64 проверено наличие [готового wheel](https://pypi.org/project/numpy/2.2.6/#files). Собирать NumPy из исходников не требуется.

`python -m pip` устанавливает пакет именно для вызванного Python. Это существенно: setup Gyms тоже вызывает команду `python`. Произвольный `pip` может относиться к другой установке.

Если Python не находится или открывается Store, сначала посмотри `where python` и проверь PATH выбранной установки. При нескольких Python не удаляй остальные наугад. Если отсутствует только pip, для обычной установки попробуй `python -m ensurepip --upgrade`, затем повтори проверку pip. Подробности диагностики — в [следующей главе](05-troubleshooting.md).

## Шаг 5. Привязать Unreal и интегрировать Wwise

Закрой Unreal Editor. Нажми правой кнопкой на `Unreal\Gyms.uproject` → **Switch Unreal Engine Version** → выбери установленный UE 5.6. В Windows 11 пункт может находиться в **Show more options**. В просмотренной ревизии уже указана 5.6; проверяем соответствие своей установке. Если пункт отсутствует, сначала проверь регистрацию установленного движка и файлов `.uproject`, а не меняй версию проекта наугад.

Далее открой страницу **Unreal Engine** в Audiokinetic Launcher и добавь существующий `C:\WwiseLabs\Gyms\Unreal\Gyms.uproject`. В документации разных Launcher используются названия **Browse for project…** и **Open Other**. Для добавления интеграции используется действие **Integrate Wwise in Project…**; при существующей интеграции ищи её изменение. Точную подпись Modify ещё нужно снять на целевом Launcher. [Страница Unreal Engine в руководстве Launcher](https://www.audiokinetic.com/en/public-library/Launcher_2025.2.0.5346/?id=unreal_engine&source=InstallGuide).

Выбери совместимый выпуск интеграции и существующий аудиопроект `C:\WwiseLabs\Gyms\WwiseProject\Gyms.wproj`, если мастер запрашивает его. Новый пустой Wwise-проект здесь не нужен. В исходной конфигурации Gyms уже записана относительная ссылка `../WwiseProject/Gyms.wproj`.

После завершения проверь вторую контрольную точку из практического кейса:

```text
C:\WwiseLabs\Gyms\Unreal\Plugins\WwiseSoundEngine\ThirdParty\include\AK\AkWwiseSDKVersion.h
```

SDK в установленном Wwise и SDK в `ThirdParty` проекта — разные места. Первый может существовать при отсутствующем втором. Отсутствие второго разбирается в главе ошибок; пустой файл вместо заголовка не исправляет интеграцию.

Иллюстрации для будущей версии: карточка Gyms с версиями UE/Wwise; экран выбора существующего `Gyms.wproj`.

## Шаг 6. Проверить WWISEROOT и выполнить setup

Открой cmd и проверь:

```bat
echo %WWISEROOT%
dir "%WWISEROOT%\Authoring\x64\Release\bin\WwiseConsole.exe"
```

`WWISEROOT` должен указывать на **корень нужной установки Wwise**, не на SDK и не на репозиторий. Если путь неверный или не определён, после проверки своей папки задай его для этого окна:

```bat
set "WWISEROOT=C:\Audiokinetic\Wwise_2025.1.11.9262"
dir "%WWISEROOT%\Authoring\x64\Release\bin\WwiseConsole.exe"
```

Это временная переменная текущего cmd, постоянные настройки Windows команда не меняет.

Перед запуском учти размер тестовых данных. Генератор создаёт `LargeMedia.wav` на 500 000 000 моноотсчётов по 16 бит: около **1 ГБ только PCM-данных**. Массивы NumPy занимают дополнительную оперативную память. Это не общий размер установки и не оценка времени. Расчёт сделан по [GenerateProjectWavFiles.py](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/WwiseProject/GenerateProjectWavFiles.py).

Запускаем из корня репозитория:

```bat
cd /d "C:\WwiseLabs\Gyms"
setup_Windows.bat
```

Ответы на вопросы батника вводятся отдельно, когда он их задаст:

```text
Use Unreal or Unity: unreal
Enter your Unreal Installation root path: C:\Program Files\Epic Games\UE_5.6
```

Нужен каталог `UE_5.6`, а не вложенная папка `Engine`, файл редактора или проект.

В просмотренном [setup_Windows.bat](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/setup_Windows.bat) для Unreal последовательно выполняются сборка `GymsEditor`, генерация WAV, формирование списков примеров и генерация SoundBanks. Скрипт не останавливается после каждой возможной ошибки. Финальное приглашение нажать клавишу означает окончание сценария, но не доказывает успех.

Проверь отдельно: сборка завершилась успешно; Python отработал без traceback; существует `WwiseProject\Originals\SFX\ShortMedia_3.wav`; создался `Unreal\SupportedGyms.md`; генерация банков не завершилась ошибкой. Присутствие WAV ещё не исключает повреждение после прерванного запуска.

## Шаг 7. Найти банки и открыть пример

У Gyms есть неожиданная особенность: в проверенной ревизии Windows-банки направлены в `Unity\Assets\WwiseData\Bank\Windows`, а Unreal использует тот же общий каталог через `RootOutputPath`. **Не удаляй папку Unity только потому, что проходишь пример в Unreal.** Это видно в [Gyms.wproj](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/WwiseProject/Gyms.wproj) и [DefaultGame.ini](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/Config/DefaultGame.ini). После интеграции перепроверь реальные настройки: мастер мог их изменить.

Открой `Unreal\Gyms.uproject` и дождись завершения загрузки. Стартовая карта — `/Game/MainMenu/MainMenu`, она задана в [DefaultEngine.ini](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Unreal/Config/DefaultEngine.ini).

Для первого опыта можно не зависеть от названий пунктов главного меню: в Content Browser открой `Content/Gyms/1-Essential/EssentialPostEvent`, затем карту `EssentialPostEvent` и нажми **Play**. В [документации Gyms](https://github.com/audiokinetic/Gyms/blob/d4dd88e5df3af627bc74e63fa2ea6bca2ac1a164/Documentation/Gyms/README.md) это пример отправки события с привязкой к объекту.

В ассете карты найдены `SimpleButton` и событие `PostEvent_Event`. Следующий шаг — взаимодействовать с кнопкой примера по подсказке на экране и услышать воспроизведение. **Точную клавишу/способ взаимодействия и характер звука ещё нужно подтвердить ручным запуском**: извлечение имён из `.umap` не заменяет прохождение сцены. Это конкретный незавершённый пункт черновика, а не повод придумывать управление.

Критерий успеха: после действия пример воспроизводит звук повторно, а в Output Log нет связанных с ним ошибок загрузки данных. Если редактор открылся, но звук не появился, переходи к [диагностике](05-troubleshooting.md).

## Контроль результата

- Записаны точные версии и SHA Gyms.
- Сборка `GymsEditor` прошла, SDK найден в проекте.
- NumPy доступен тому Python, который вызывает setup.
- Генерация WAV и банков завершилась без ошибок.
- Открывается карта `EssentialPostEvent`.
- Действие в примере даёт слышимый результат.

Последние два пункта должны быть подтверждены реальным запуском перед превращением главы в готовую инструкцию.
