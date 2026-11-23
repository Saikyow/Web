package ru.itmo.web.lab2;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;


public final class PointValidator {

    private static final Pattern NUMBER = Pattern.compile("-?\\d+(\\.\\d+)?");
    private static final int MAX_NUMBER_LENGTH = 10;

    private static final BigDecimal R_MIN = dec("2");
    private static final BigDecimal R_MAX = dec("5");
    private static final List<BigDecimal> ALLOWED_X = List.of(
            dec("-5"), dec("-4"), dec("-3"), dec("-2"), dec("-1"), dec("0"), dec("1"), dec("2"), dec("3"));
    private static final BigDecimal Y_MIN = dec("-3");
    private static final BigDecimal Y_MAX = dec("5");

    private PointValidator() {
    }

    public static Point validate(Map<String, String> params) {
        BigDecimal x = parseNumber(params, "x");
        BigDecimal y = parseNumber(params, "y");
        BigDecimal r = parseNumber(params, "r");

        if (!containsValue(ALLOWED_X, x)) {
            throw new IllegalArgumentException("X должен быть одним из значений: -5, -4, -3, -2, -1, 0, 1, 2, 3");
        }
        if (y.compareTo(Y_MIN) <= 0 || y.compareTo(Y_MAX) >= 0) {
            throw new IllegalArgumentException("Y должен быть в интервале (-3; 5)");
        }
        if (r.compareTo(R_MIN) <= 0 || r.compareTo(R_MAX) >= 0) {
            throw new IllegalArgumentException(
                    "R должен быть в интервале (2; 5)");
        }

        return new Point(x, y, r);
    }

    private static BigDecimal parseNumber(Map<String, String> params, String name) {
        String raw = params.get(name);
        if (raw == null || raw.isEmpty()) {
            throw new IllegalArgumentException("Параметр " + name + " не передан");
        }
        if (raw.length() > MAX_NUMBER_LENGTH) {
            throw new IllegalArgumentException("Параметр " + name + " длиннее " + MAX_NUMBER_LENGTH + " символов");
        }
        String normalized = raw.replace(',', '.');
        if (!NUMBER.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Параметр " + name + " должен быть числом");
        }
        return new BigDecimal(normalized);
    }


    private static boolean containsValue(List<BigDecimal> allowed, BigDecimal value) {
        return allowed.stream().anyMatch(candidate -> candidate.compareTo(value) == 0);
    }

    private static BigDecimal dec(String value) {
        return new BigDecimal(value);
    }
}
