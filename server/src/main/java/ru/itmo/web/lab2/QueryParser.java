package ru.itmo.web.lab2;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;


public final class QueryParser {

    private QueryParser() {
    }

    public static Map<String, String> parse(String query) {
        if (query == null || query.isEmpty()) {
            throw new IllegalArgumentException("Не переданы параметры запроса");
        }

        Map<String, String> params = new HashMap<>();
        for (String pair : query.split("&")) {
            String[] parts = pair.split("=", 2);
            params.put(decode(parts[0]), parts.length == 2 ? decode(parts[1]) : "");
        }
        return params;
    }

    private static String decode(String value) {
        try {
            return URLDecoder.decode(value, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Некорректная кодировка параметров запроса");
        }
    }
}
