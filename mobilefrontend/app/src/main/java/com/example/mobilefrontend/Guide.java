package com.example.mobilefrontend;

public class Guide {
    private int id;
    private String title;
    private String description;
    private String status;
    private int userId;

    public Guide(int id, String title, String description, String status, int userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.userId = userId;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public int getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return "Guide{id=" + id + ", title='" + title + "', description='" + description + "', status='" + status + "', userId=" + userId + "}";
    }
}