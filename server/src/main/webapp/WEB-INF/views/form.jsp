<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="ru.itmo.web.lab2.ResultRow" %>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet"
        href="${pageContext.request.contextPath}/css/style.css">
  <title>Лабораторная работа №2</title>
</head>
<body>

<div id="header">
  <span>Выполнил: Погорельченко Фёдор Федорович</span>
  <span>Группа: P3212</span>
  <span>Вариант: 12694</span>
</div>


<div class="graph-from-container">

<div class="panel graph-panel">
  <canvas id="canvas"></canvas>
</div>

<div class="panel form-panel">
  <form id="pointForm"
        class="point-form"
        action="${pageContext.request.contextPath}/controller"
        method="get">
  <div>
    <label>X:</label>
    <input type="radio" id="x-5" value="-5" name="x">
    <label for="x-5">-5</label>
    <input type="radio" id="x-4" value="-4" name="x">
    <label for="x-4">-4</label>
    <input type="radio" id="x-3" value="-3" name="x">
    <label for="x-3">-3</label>
    <input type="radio" id="x-2" value="-2" name="x">
    <label for="x-2">-2</label>
    <input type="radio" id="x-1" value="-1" name="x">
    <label for="x-1">-1</label>
    <input type="radio" id="x0" value="0" name="x">
    <label for="x0">0</label>
    <input type="radio" id="x1" value="1" name="x">
    <label for="x1">1</label>
    <input type="radio" id="x2" value="2" name="x">
    <label for="x2">2</label>
    <input type="radio" id="x3" value="3" name="x">
    <label for="x3">3</label>
    <p class="point-form__error" id="xError"></p>
  </div>
  <div class="point-form__field">
    <label for="y">Y</label>
    <input
      class="point-form__y"
      id="y"
      type="text"
      name="y"
      maxlength="10"
      placeholder="От -3 до 5, не включая"
    >
    <p class="point-form__error" id="yError"></p>
  </div>
  <div>
    <label for="r">R:</label>
    <input
    id="r"
    name="r"
    type="text"
    class="point-form__y"
    maxlength="10"
    value="3"
    placeholder="(2, 5)">
    <p class="point-form__error" id="rError"></p>

  </div>
  <div>
    <button
      class="point-form__submit"
      type="submit"
    >
    Отправить форму
    </button>
    <p class="point-form__error" id="serverError"></p>
  </div>
</form>
</div>

</div>
<div class="panel results" id="result">
  <button
    id="clearResults"
    class="results__clear"
    type="button"
    >
    Очистить таблицу
  </button>
  <div class="results__scroll">
    <table class="results__table" id="resultTable">
      <caption class="results__caption">Таблица результатов</caption>

      <thead>
      <tr>
        <th class="results__heading" scope="col">X</th>
        <th class="results__heading" scope="col">Y</th>
        <th class="results__heading" scope="col">R</th>
        <th class="results__heading" scope="col">Результат попадания</th>
        <th class="results__heading" scope="col">Текущее время</th>
        <th class="results__heading" scope="col">Время выполнения</th>
      </tr>
      </thead>
      <tbody>
      <%
        @SuppressWarnings("unchecked")
        List<ResultRow> results = (List<ResultRow>) session.getAttribute("results");
        if (results != null) {
          for (ResultRow item : results) {
      %>
        <tr>
          <td><%= item.x() %></td>
          <td><%= item.y() %></td>
          <td><%= item.r() %></td>
          <td><%= item.hit() ? "Попадание" : "Промах" %></td>
          <td><%= item.currentTime() %></td>
          <td><%= item.executionTime() %></td>
        </tr>
      <%
          }
        }
      %>
      </tbody>
    </table>

  </div>

</div>

<script src="${pageContext.request.contextPath}/js/script.js"></script>
</body>
</html>
