package com.serena.radar

public enum CloudProvider {
    AMAZON("Amazon EC2"),
    AZURE("Microsoft Azure"),
    VSPHERE("VMware vSphere")

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