package ru.itmo.web.lab2;

import java.nio.charset.StandardCharsets;

public record Response(int status, String reason, String body) {

    public byte[] toBytes() {
        int contentLength = body.getBytes(StandardCharsets.UTF_8).length;
        String response = "HTTP/1.1 " + status + " " + reason + "\r\n"
                + "Content-Type: application/json; charset=utf-8\r\n"
                + "Content-Length: " + contentLength + "\r\n"
                + "\r\n"
                + body;
        return response.getBytes(StandardCharsets.UTF_8);
    }
}
