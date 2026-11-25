package ru.itmo.web.lab2;

import com.fastcgi.FCGIInterface;
import java.util.Properties;

public final class Main {


    public static void main(String[] args) {
        FCGIInterface fcgi = new FCGIInterface();
        while (fcgi.FCGIaccept() >= 0) {
            long startNanos = System.nanoTime();
            Response response = processRequest(startNanos);
            byte[] bytes = response.toBytes();
            System.out.write(bytes, 0, bytes.length);
            System.out.flush();
        }
        // Библиотека молча возвращает -1, если не смогла открыть порт
        System.err.println("FastCGI-сервер остановлен: не задан -DFCGI_PORT или порт занят");
    }

    private static Response processRequest(long startNanos) {
        try {
            Properties params = FCGIInterface.request.params;
            return RequestHandler.handle(
                    params.getProperty("REQUEST_METHOD"),
                    params.getProperty("QUERY_STRING"),
                    startNanos);
        } catch (RuntimeException e) {
            // Подробности — в лог сервера, клиенту — общее сообщение
            System.err.println("Ошибка обработки запроса: " + e);
            e.printStackTrace(System.err);
            return RequestHandler.error(500, "Internal Server Error", "Внутренняя ошибка сервера");
        }
    }
}
