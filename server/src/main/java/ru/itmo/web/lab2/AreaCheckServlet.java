package ru.itmo.web.lab2;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/area-check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Point point;
        long startTime = System.nanoTime();

        if (request.getDispatcherType() != DispatcherType.FORWARD) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        Map<String, String> params = new HashMap<>();
        params.put("x", request.getParameter("x"));
        params.put("y", request.getParameter("y"));
        params.put("r", request.getParameter("r"));

        try {
            point = PointValidator.validate(params);
        } catch (IllegalArgumentException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, e.getMessage());
            return;
        }
        boolean hit = AreaChecker.isHit(point);

        String xStr = point.x().toPlainString();
        String yStr = point.y().toPlainString();
        String rStr = point.r().toPlainString();
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        String executionTime = String.format("%.3f мс", (System.nanoTime() - startTime) / 1_000_000.0);

        HttpSession session = request.getSession();

        ResultRow row = new ResultRow(xStr, yStr, rStr, hit, currentTime, executionTime);

        @SuppressWarnings("unchecked")
        List<ResultRow> results = (List<ResultRow>) session.getAttribute("results");
        if (results == null) {
            results = new ArrayList<>();
            session.setAttribute("results", results);
        }
        results.add(0, row);

        request.setAttribute("x", xStr);
        request.setAttribute("y", yStr);
        request.setAttribute("r", rStr);
        request.setAttribute("hit", hit);

        request.getRequestDispatcher("/WEB-INF/views/result.jsp")
                .forward(request, response);
    }
}