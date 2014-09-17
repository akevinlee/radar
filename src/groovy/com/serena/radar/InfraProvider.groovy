package com.serena.radar

public enum InfraProvider {
    NONE("None"),
    AMAZON("Amazon EC2")

    private final String value

    InfraProvider(String value) {
        this.value = value;
    }

    String toString() {
        value
    }

    String getKey() {
        name()
    }
}