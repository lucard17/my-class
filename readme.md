## Описание

Это вторая итерация решения.\
Route GET `/lessons` всё также реализован в соответствии с [ТЗ](technical_specification.md) / [Google Docs](https://docs.google.com/document/d/15f83XqAHbN_1AOf_8XR7sZ4pxhe5WoHNIaa31AipqpU).
Доработан запрос и структура таблиц, добавлены триггеры для заполнения таблиц ускоряющих получение данных.\
При количестве записей 2_000_000, запрос с параметрами отрабатывает порядка 500ms что намного лучше чем в первой итерации (более 30s).\
Думаю что улучшить этот показатель можно за счет партицирования таблицы lessons.

Для проверки производительности запроса написаны `seed` функции вставляющие тестовые данные в таблицы.
Количество данных можно регулировать в файле `dev.seeds.config.js`, на текущий момент настройки следующие.
Занятий 2_000_000, студентов 20_000, преподавателей 5_000.
Данные генерируются с использованием `@faker-js/faker`.
Генерация `seed` происходит довольно долго, но весь процесс сопровождается логами.
`@faker-js/faker` специально вставлен в dependencies чтобы не было нужды создавать доп. контейнеры.

## Запуск проекта

Выполнение команд подразумевается из корневой директории проекта

```bash
docker compose up --build db api
```

При этом создадутся 2 контейнера:

-   `nikolaev-pg` - контейнер для postgreSQL, в БД сразу создадутся таблицы из тестового дампа
-   `nikolaev-api` - контейнер с сервером на express, который будет слушать `5005` (`API_PORT`) порт

\*В терминал будут выводиться логи из контейнеров

## Заполнение тестовыми данными

```bash
docker compose exec api npm run knex:seed:run:dev
```

## Примеры запросов

```
http://localhost:5005/lessons
```

```
http://localhost:5005/lessons?date=2019-09-01&teacherIds=1,2,3&studentsCount=1,5&page=1
```

```
http://localhost:5005/lessons?teacherIds=1,2,3&studentsCount=1,5&page=1
```

```
http://localhost:5005/lessons?date=2019-09-02,2019-09-01&teacherIds=1,2,3&studentsCount=1,5&lessonsPerPage=1&page=2
```

```
http://localhost:5005/lessons?date=2023-01-01,2023-02-01&status=1&lessonsPerPage=100
```

\*Также приложил файл коллекции для [postman](my-class-dev.postman_collection.json)

## Удаление контейнеров, образов и данных

```bash
docker compose down --rmi local -v
```

## При разработке использовались:

### Для транспиляции ts в js:

```bash
npm run ts:watch
```

### Для запуска и отладки dev контейнера:

```bash
docker-compose up api-dev
```

### Для перезапуска server.js в dev контейнере:

```bash
npm run watch
```

\*Запускает nodemon, который при изменениях в `dist` будет отправлять `GET` запрос `http://localhost:5010/restart` в `api-dev` контейнер, используя curl

### Для подключение к postgreSQL:

Для подключения к БД можно использовать плагин для [VS Code](https://code.visualstudio.com/) [PostgreSQL](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-postgresql-client2)\
Данные для настройки подключения:\
HOST: `localhost`, PORT: `5430`, DB: `my_class`, USER: `postgres`, PASSWORD: `postgres`
