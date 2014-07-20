package com.serena.radar

class Settings {
    String username
    String autoUrl = "http://localhost:8080/serena_ra"
    Integer refreshInterval = 10

    static constraints = {
        username unique: true, nullable: false
        autoUrl url: ["localhost(:(\\d{1,5}))?"], blank: false
        refreshInterval min: 5, max: 360
    }

    static boolean userExists(final String username) {
        if (Settings.findByUsername(username)) return true
        else return false
    }
}
