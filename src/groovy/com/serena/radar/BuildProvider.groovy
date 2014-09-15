package com.serena.radar

public enum BuildProvider {
    NONE("None"),
    JENKINS("Jenkins")

    private final String value

    BuildProvider(String value) {
        this.value = value;
    }

    String toString() {
        value
    }

    String getKey() {
        name()
    }
}