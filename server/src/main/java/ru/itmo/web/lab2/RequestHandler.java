package ru.itmo.web.lab2;

import java.time.Instant;
import java.util.Map;

public final class RequestHandler {

    private RequestHandler() {
    }

    public static Response handle(String method, String query, long startNanos) {
        if (!"GET".equals(method)) {
            return error(405, "Method Not Allowed", "Поддерживается только метод GET");
        }

        try {
            Map<String, String> params = QueryParser.parse(query);
            Point point = PointValidator.validate(params);
            boolean hit = AreaChecker.isHit(point);
            return success(point, hit, startNanos);
        } catch (IllegalArgumentException e) {
            return error(400, "Bad Request", e.getMessage());
        }
    }

    private static Response success(Point point, boolean hit, long startNanos) {
        String currentTime = Instant.now().toString();
        long executionTimeNs = System.nanoTime() - startNanos;
        String body = "{"
                + "\"x\":" + point.x().toPlainString() + ","
                + "\"y\":" + point.y().toPlainString() + ","
                + "\"r\":" + point.r().toPlainString() + ","
                + "\"hit\":" + hit + ","
                + "\"currentTime\":\"" + currentTime + "\","
                + "\"executionTimeNs\":" + executionTimeNs
                + "}";
        return new Response(200, "OK", body);
    }

    public static Response error(int status, String reason, String message) {
        return new Response(status, reason, "{\"error\":\"" + message + "\"}");
    }
}
