# Лабораторная работа №2: веб-программирование

Выполнил: Погорельченко Фёдор Федорович, группа P3212, вариант 12694.

Это HTML-страница и FastCGI-сервер на Java, которые определяют, попадает ли точка `(X, Y)` в область на плоскости при заданном `R`.

---

## Как это работает

```text
Браузер ── GET /fcgi-bin/server.jar?x=..&y=..&r=.. ──▶ Apache httpd ── FastCGI ──▶ java -jar server.jar
   ▲                                                      │                              │
   │                                                      │ отдаёт index.html,           │ валидация,
   └──────────────── JSON ◀───────────────────────────────┘ style.css, script.js         │ проверка попадания
```

1. Клиент (`script.js`) проверяет X, Y и R. Если данные верны, он отправляет AJAX-запрос через `fetch` методом **GET**, страница при этом не перезагружается.
2. Apache отдаёт статику сам. Запросы к `/fcgi-bin/server.jar` модуль `mod_fastcgi` передаёт по протоколу FastCGI на Java-сервер (`FastCgiExternalServer ... -host localhost:20000 -nph`).
3. Java-сервер в цикле `while (new FCGIInterface().FCGIaccept() >= 0)` принимает запросы, читает `QUERY_STRING`, заново валидирует параметры, считает попадание и отвечает JSON.
4. Из-за флага `-nph` Apache не разбирает ответ, поэтому Java сама пишет полный HTTP-ответ: строку `HTTP/1.1 200 OK`, заголовки, пустую строку и JSON.
5. Клиент добавляет результат в таблицу, рисует точку на canvas и сохраняет результат в `localStorage`. Поэтому история сохраняется между запросами и после перезагрузки страницы.

### Ответ сервера

Успех, `200 OK`:

```json
{"x":-1,"y":-0.5,"r":2,"hit":true,"currentTime":"2026-11-10T18:00:00.123Z","executionTimeNs":41250}
```

Невалидные данные, `400 Bad Request`:

```json
{"error":"Y должен быть в интервале (-3; 5)"}
```

Любой метод, кроме GET, получает `405 Method Not Allowed`.

`executionTimeNs` — время обработки запроса, которое сервер замеряет через `System.nanoTime()`.

---

## Вариант

### Область (R > 0, границы включаются)

| Четверть | Фигура | Условие |
|---|---|---|
| I (x > 0, y > 0) | пусто | — |
| II (x ≤ 0, y ≥ 0) | треугольник (0,0), (−R/2,0), (0,R/2) | `y <= x + R/2` |
| III (x ≤ 0, y ≤ 0) | прямоугольник | `x >= -R && y >= -R/2` |
| IV (x ≥ 0, y ≤ 0) | четверть круга радиуса R/2 | `x² + y² <= (R/2)²` |

### Поля формы

| Поле | Тип | Значения |
|---|---|---|
| X | radio | −5, −4, −3, −2, −1, 0, 1, 2, 3 |
| Y | text | интервал (−3; 5) без концов; разделитель точка или запятая; не длиннее 10 символов |
| R | select | 1, 1.5, 2, 2.5, 3 |

Длина Y ограничена 10 символами и на клиенте (`maxlength`), и на сервере. Это нужно, чтобы через значения вроде `4.99999999999999999999` нельзя было обойти проверку. На сервере все сравнения выполняются в `BigDecimal`, поэтому граничные значения не проходят из-за погрешности `double`.

---

## Структура проекта

```text
.
├── index.html, style.css, script.js   # клиент (статика для Apache)
├── httpd/httpd.conf                   # конфиг Apache на основе шаблона преподавателя
└── server/                            # FastCGI-сервер на Java (Gradle)
    ├── build.gradle
    ├── libs/fastcgi-lib.jar           # библиотека со страницы лабы
    └── src/main/java/ru/itmo/web/lab2/
        ├── Main.java                  # цикл FCGIaccept, запись ответа
        ├── RequestHandler.java        # метод → параметры → валидация → JSON
        ├── QueryParser.java           # разбор QUERY_STRING
        ├── PointValidator.java        # серверная валидация (BigDecimal)
        ├── AreaChecker.java           # проверка попадания
        ├── Point.java                 # точка (x, y, r)
        └── Response.java              # HTTP-ответ: статус, заголовки, JSON
```

На helios всё лежит в `~/httpd-root/`:

```text
~/httpd-root/
├── httpd.conf
├── mutex-dir/              # служебные файлы Apache (директива Mutex)
├── public/                 # index.html, style.css, script.js (DocumentRoot)
├── fcgi-bin/server.jar     # FastCGI-сервер
├── error.log, access.log, httpd.pid
└── server.log              # вывод Java-сервера
```

---

## Инструкция по запуску

Логин на helios: `s504864`. Выданный portbase: `19999`. Apache слушает `19999` (portbase), Java-сервер (FastCGI) — `20000` (portbase + 1).

### 1. Выбор портов

Порты из шаблона (24000/24001) не используем: у каждого студента свой portbase. Перед запуском проверьте, что порты свободны:

```bash
sockstat -4l | grep -E '19999|20000'   # пустой вывод — порты свободны
```

Если порт занят, Java-сервер сразу завершится с сообщением «не задан -DFCGI_PORT или порт занят».

### 2. Сборка (локально)

Нужны JDK 17+ и Gradle. `fastcgi-lib.jar` уже лежит в `server/libs/`.

```bash
cd server
gradle jar
```

В результате появится `server/build/libs/server.jar`: это fat-jar, внутри которого уже лежит `fastcgi-lib`. Байткод собирается под Java 17 (`options.release = 17`), поэтому jar запустится на helios.

### 3. Настройка httpd.conf

В `httpd/httpd.conf`:

1. Логин `s504864` уже подставлен.
2. Если меняли порты: `Listen 19999` и `ServerName helios.cs.ifmo.ru:19999` — порт Apache; `-host localhost:20000` в строке `FastCgiExternalServer` — порт Java-сервера.

По сравнению с шаблоном преподавателя изменены только две вещи:
- `DocumentRoot` указывает на `~/httpd-root/public` вместо `/var/www`;
- в `FastCgiExternalServer` вместо `hello-world.jar` стоит `server.jar`.

### 4. Загрузка на helios (scp)

```bash
ssh -p 2222 s504864@se.ifmo.ru "mkdir -p ~/httpd-root/mutex-dir ~/httpd-root/public ~/httpd-root/fcgi-bin"

scp -P 2222 index.html style.css script.js s504864@se.ifmo.ru:~/httpd-root/public/
scp -P 2222 httpd/httpd.conf               s504864@se.ifmo.ru:~/httpd-root/
scp -P 2222 server/build/libs/server.jar   s504864@se.ifmo.ru:~/httpd-root/fcgi-bin/
```

### 5. Запуск на helios

```bash
ssh -p 2222 s504864@se.ifmo.ru
cd ~/httpd-root

# FastCGI-сервер в фоне, лог в server.log
nohup java -DFCGI_PORT=20000 -jar fcgi-bin/server.jar > server.log 2>&1 &

# Apache от своего пользователя
httpd -f ~/httpd-root/httpd.conf -k start
```

Проверка прямо на helios:

```bash
curl -i "http://localhost:19999/fcgi-bin/server.jar?x=-1&y=-0.5&r=2"
```

Остановка:

```bash
httpd -f ~/httpd-root/httpd.conf -k stop
pkill -u $USER -f server.jar
```

Если что-то не работает, смотрите `~/httpd-root/error.log` и `~/httpd-root/server.log`.

### 6. Открыть страницу локально (проброс порта)

На своём компьютере выполните:

```bash
ssh -p 2222 -N -L 8080:localhost:19999 s504864@se.ifmo.ru
```

Затем откройте в браузере `http://localhost:8080/`. Запрос с локального порта 8080 через ssh-туннель попадёт на порт 19999 на helios, то есть в ваш Apache.

---

## Используемые технологии

- HTML5, CSS3, JavaScript (Canvas API, Fetch API, LocalStorage)
- Java 17, FastCGI (`fastcgi-lib.jar`), Gradle
- Apache httpd 2.4 + `mod_fastcgi`
