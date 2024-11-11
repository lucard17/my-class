## Описание

На данном этапе реализован route GET `/lessons`.
Все параметры обрабатываются в соответствии с [ТЗ](technical_specification.md) / [Google Docs](https://docs.google.com/document/d/15f83XqAHbN_1AOf_8XR7sZ4pxhe5WoHNIaa31AipqpU).

Добавил миграции для создания pkey в таблицах `lesson_teachers` и `lesson_students`.

На мой взгляд текущая реализация не является конечной.\
Я заметил что в отправленном дампе присутствует библиотека `plpgsql`.\
Это жжж не с проста!) 🐝🐻🐝

Думаю что в контексте того что в базе хранятся не десятки, а миллионы занятий, над sql запросом нужно еще поработать.

В процессе выполнения, решил отойти немного от наезженного пути и создать проект на `TS`,\
т.к в основном мы используем `JS` + `jsDoc` + `TS`, чтобы получить преимущества типизации, но сохранить простоту написания кода для новых разработчиков.

Так же решил воспользоваться системой миграций предлагаемой [knex.js](https://knexjs.org/guide/migrations),\
т.к обычно мы использовали самописную систему миграций, исходя из подребностей проекта.

## Запуск проекта

```bash
docker-compose up db api
```

При этом создадутся 2 контейнера:

-   `pg` - контейнер для postgreSQL, в БД сразу создадутся таблицы из тестового дампа
-   `api` - контейнер с сервером на express, который будет слушать `5000` (`API_PORT`) порт

\*В терминал будут выводиться логи из контейнеров

## Подключение к postgresql

Для подключения к БД можно истользовать плагин для [VS Code](https://code.visualstudio.com/) [PostgreSQL](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-postgresql-client2)\
Данные для настройки подключения HOST: `localhost`, PORT: `5430`, DB: `my_class`, USER: `postgres`, PASSWORD: `postgres`

## Примеры запросов

```
http://localhost:5000/lessons
```

```
http://localhost:5000/lessons?date=2019-09-01&teacherIds=1,2,3&studentsCount=1,5&page=1
```

```
http://localhost:5000/lessons?teacherIds=1,2,3&studentsCount=1,5&page=1
```

```
http://localhost:5000/lessons?date=2019-09-02,2019-09-01&teacherIds=1,2,3&studentsCount=1,5&lessonsPerPage=1&page=2
```

\*Также приложил файл коллекции для postman

## Удаление контейнеров, образов и данных

```bash
docker compose down --rmi local -v
```

## При разработке использовались:

#### Для транспиляции ts в js:

```bash
npm run ts:watch
```

#### Для запуска и отладки dev контейнера:

```bash
docker-compose up api-dev
```

#### Для перезапуска сервера при внесении изменений

```bash
npm run watch
```

\*Запускает nodemon, который при изменениях в `dist` будет отправлять `GET` запрос  `http://localhost:5001/restart` в `api-dev` контейнер, используя curl
