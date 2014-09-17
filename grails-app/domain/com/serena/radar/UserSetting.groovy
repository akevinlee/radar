package com.serena.radar

class UserSetting {
    String username
    String autoUrl
    String buildUrl
    String buildUsername
    String buildToken
    Integer refreshInterval = 10

    static constraints = {
        username unique: true, nullable: false, blank: false
        autoUrl blank: false, nullable: false
        buildUrl blank: true, nullable: true
        buildUsername blank: true, nullable: true
        buildToken blank: true, nullable: true
        refreshInterval min: 5, max: 360
    }

    static boolean userExists(final String username) {
        if (UserSetting.findByUsername(username)) return true
        else return false
    }
}
