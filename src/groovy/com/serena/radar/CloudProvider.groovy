package com.serena.radar

public enum CloudProvider {
    NONE("None"),
    AMAZON("Amazon EC2")

    private final String value

    CloudProvider(String value) {
        this.value = value;
    }

    String toString() {
        value
    }

    String getKey() {
        name()
    }
}