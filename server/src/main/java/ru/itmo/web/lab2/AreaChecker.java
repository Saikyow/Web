package ru.itmo.web.lab2;

import java.math.BigDecimal;


public final class AreaChecker {

    private static final BigDecimal TWO = BigDecimal.valueOf(2);

    private AreaChecker() {
    }

    public static boolean isHit(Point point) {
        BigDecimal x = point.x();
        BigDecimal y = point.y();
        BigDecimal r = point.r();
        BigDecimal halfR = r.divide(TWO);

        return inTriangle(x, y, halfR) || inRectangle(x, y, r, halfR) || inQuarterCircle(x, y, halfR);
    }

    // II четверть: треугольник (0,0), (-R/2,0), (0,R/2) — y <= x + R/2
    private static boolean inTriangle(BigDecimal x, BigDecimal y, BigDecimal halfR) {
        return x.signum() <= 0 && y.signum() >= 0 && y.compareTo(x.add(halfR)) <= 0;
    }

    // III четверть: прямоугольник x in [-R, 0], y in [-R/2, 0]
    private static boolean inRectangle(BigDecimal x, BigDecimal y, BigDecimal r, BigDecimal halfR) {
        return x.signum() <= 0 && y.signum() <= 0
                && x.compareTo(r.negate()) >= 0
                && y.compareTo(halfR.negate()) >= 0;
    }

    // IV четверть: четверть круга радиусом R/2 — x^2 + y^2 <= (R/2)^2
    private static boolean inQuarterCircle(BigDecimal x, BigDecimal y, BigDecimal halfR) {
        BigDecimal distanceSquared = x.multiply(x).add(y.multiply(y));
        return x.signum() >= 0 && y.signum() <= 0 && distanceSquared.compareTo(halfR.multiply(halfR)) <= 0;
    }
}
