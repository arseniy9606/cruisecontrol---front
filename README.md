# Расход топлива автомобилей при использовании круиз контроля

Учебный проект по курсу «Разработка Интернет Приложений», кафедра ИУ5, МГТУ им. Н. Э. Баумана, 2026.
Вариант 29, транспорт. Черников Арсений, ИУ5-55Б.

## Предметная область

Каталог автомобилей с расходом топлива и объёмом бака. ЛР5: гостевой SPA на React + TypeScript + Vite + React Router + React-Bootstrap. Данные берутся только из коллекции mock-объектов. Фото, видео и файлы по умолчанию находятся в самом проекте; backend, PostgreSQL, Redis и S3 не требуются.

## Репозитории и лабораторные работы

[Бэкенд](https://github.com/arseniy9606/cruisecontrol---back) · [Фронтенд](https://github.com/arseniy9606/cruisecontrol---front)

| № | Тема | Репозиторий | Ветка |
|---|---|---|---|
| 1 | Шаблонизация, Figma, MinIO | backend | [lab1-fuel_consumptions](https://github.com/arseniy9606/cruisecontrol---back/tree/lab1-fuel_consumptions) |
| 2 | PostgreSQL, GORM | backend | [lab2-fuel_consumptions](https://github.com/arseniy9606/cruisecontrol---back/tree/lab2-fuel_consumptions) |
| 3 | Веб-сервис, REST API | backend | [lab3-fuel_consumptions](https://github.com/arseniy9606/cruisecontrol---back/tree/lab3-fuel_consumptions) |
| 4 | JWT, Redis, Swagger | backend | [lab4-fuel_consumptions](https://github.com/arseniy9606/cruisecontrol---back/tree/lab4-fuel_consumptions) |
| 5 | SPA на React для гостя, mock | frontend | [fuel_consumptions-react-mock](https://github.com/arseniy9606/cruisecontrol---front/tree/fuel_consumptions-react-mock) |

Оформление по [примеру frontend-репозитория](https://github.com/Dovletov-Seyran/wells-risk-frontend/tree/criteria-react-mock).
Основа: [задание ЛР5](https://github.com/iu5git/Web/blob/main/README.md), [методические указания](https://github.com/iu5git/Web/blob/main/tutorials/lab5/README.md), лекции 8–10. В ЛР5 используются функциональные компоненты, props, useState и useEffect; Redux и пользовательский Context отсутствуют. Авторизация из лекции 10 относится к ЛР6.

## Запуск

Требуется Node.js 24 LTS и npm. После клонирования выберите ветку:

```sh
git switch fuel_consumptions-react-mock
npm ci
npm run dev
```

Открыть http://localhost:3000/fuel_consumptions.
Проверка типов: `npm run check`. Сборка: `npm run build`. Просмотр сборки: `npm run preview`.
Дополнительно можно запустить только frontend через `docker compose up --build`.

## Страницы и элементы управления

Вертикальный интерфейс шириной до 390 px, белый фон, жёлтый акцент #FFCC00, hover #F2C200 и тёмный текст #21201F, как в ЛР1. На компьютере колонка расположена по центру.

### Нижняя навигационная панель

Панель закреплена снизу; четыре пункта, «Войти» справа. Только две страницы доступны.

| Пункт | Поведение | Доступность |
|---|---|---|
| Лента | Первая карточка текущего отфильтрованного списка | Доступен |
| Добавление | Создание карточки | Недоступен в ЛР5 |
| Плитка | Каталог автомобилей | Доступен |
| Войти | Аутентификация | Недоступен в ЛР5 |

Активный пункт определяется адресом. Недоступные пункты — отключённые кнопки, маршрутов добавления и входа нет. Переходы между страницами выполняются без перезагрузки документа. Корневой и неизвестные адреса перенаправляются в плитку.

### Плитка — http://localhost:3000/fuel_consumptions

- Поля «От» и «До»: расход топлива в л/100 км, неотрицательные числа с шагом 0,1. Границы включаются в результат.
- «Найти»: отправка формы onSubmit, в том числе по Enter; применяет диапазон к mock-коллекции. До отправки массив не меняется.
- «Сбросить фильтр»: очищает оба поля и возвращает все карточки. Пустой диапазон также возвращает все mock-объекты.
- Если нижняя граница больше верхней, показано пояснение, поиск отключён. Пустой результат остаётся пустым.
- Карточка: фото, название, расход, объём бака и число лайков. Нажатие открывает ленту с выбранного автомобиля.

Значения применённого фильтра хранятся в App и сохраняются при переходах между страницами. Перезагрузка приложения восстанавливает исходную коллекцию.

### Лента — http://localhost:3000/fuel_consumptions/feed/1

- Один автомобиль: локальное видео с autoplay, muted, loop, playsInline и стандартными controls. Видео показано целиком через object-fit: contain.
- Расход топлива, объём бака, количество лайков, название и описание. Для гостя лайки только отображаются.
- «Больше»/«Меньше»: раскрывает/сворачивает описание через useState.
- «Следующий автомобиль»: открывает следующий элемент отфильтрованной коллекции, после последнего — первый. При смене карточки описание сворачивается.
- Для отсутствующего ID или пустого списка показано состояние внутри ленты с кнопкой «К плитке»; третья страница не создаётся.

### Изображение и видео по умолчанию

В mock-объекте ID 5 оба поля media пустые. В плитке используется `public/DefaultImage.jpg`, в ленте — `public/DefaultVideo.mp4`. Дополнительно обрабатывается ошибка загрузки непустого URL. Резервные файлы локальные; внешних адресов медиа нет. Видео по умолчанию — копия ролика седана, а не статичный постер. Источники автомобильных медиа сохранены в [CARS_MEDIA_CREDITS.md](public/fuel_consumptions/CARS_MEDIA_CREDITS.md).

Проверка: http://localhost:3000/fuel_consumptions/feed/5.

## Структура

```text
public/fuel_consumptions/       локальные фото и видео
public/DefaultImage.jpg         изображение по умолчанию
public/DefaultVideo.mp4         видео по умолчанию
src/main.tsx                   точка входа и BrowserRouter
src/App.tsx                    состояние фильтра, два маршрута, данные через props
src/Routes.ts                  тематические пути
src/MobileApp.css              оформление из ЛР1
src/modules/fuel_consumptions.ts типы карточки и диапазона
src/modules/mock.ts            коллекция FUEL_CONSUMPTIONS_MOCK
src/components/TabBar.tsx       React-Bootstrap Navbar и Nav
src/components/ConsumptionFilter.tsx форма фильтра, value и onApply
src/components/FuelConsumptionCard.tsx карточка в плитке
src/components/FuelImage.tsx    резервные пути и обработка ошибки фото
src/pages/FuelTilesPage.tsx     плитка и пустой результат
src/pages/FuelFeedPage.tsx      лента, useParams, useNavigate и useEffect
```

## Документация для защиты

[Отчёт со скриншотами](docs/lab5-report.docx) · [Расчёт на одном листе](docs/hardware.docx) · [Результаты проверки](docs/validation.md).

[Порядок показа и ответы](docs/defense.md). [Расчёт аппаратных требований](docs/hardware.md).
Во вкладке Network видны только документы, модули и локальные медиа: запросов fetch/XHR к веб-сервису нет. Запросы видео могут иметь код 206 Partial Content. Vite в режиме разработки добавляет собственное HMR-соединение.
