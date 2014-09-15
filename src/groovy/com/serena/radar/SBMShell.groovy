package com.serena.radar

public enum SBMShell {
    SBM("Default"),
    SRP("Serena Request Center"),
    SWC("Serena Work Center")

    private final String value

    SBMShell(String value) {
        this.value = value;
    }

    String toString() {
        value
    }

    String getKey() {
        name()
    }
}