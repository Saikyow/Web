package ru.itmo.web.lab2;


import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String r = request.getParameter("r");

        boolean hasPointParam = x != null || y != null || r != null;
        if (hasPointParam) {
            request.getRequestDispatcher("/area-check")
                    .forward(request, response);
        }else {
            request.getRequestDispatcher("/WEB-INF/views/form.jsp")
                    .forward(request, response);
        }
    }



}
