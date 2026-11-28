<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <link rel="stylesheet"
          href="${pageContext.request.contextPath}/css/style.css">
    <meta charset="UTF-8">
    <title>Результат проверки</title>
</head>
<body>
    <h1>Результат проверки</h1>

    <table>
        <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Результат</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${requestScope.x}</td>
                <td>${requestScope.y}</td>
                <td>${requestScope.r}</td>
                <td>${requestScope.hit ? 'Попадание' : 'Промах'}</td>
            </tr>
        </tbody>
    </table>



    <a href="${pageContext.request.contextPath}/controller">
        Вернуться к форме
    </a>
</body>
</html>