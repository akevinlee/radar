package com.serena.radar

class UserSettings {
    String username
    String autoUrl = "http://localhost:8080/serena_ra"
    String sbmUrl = "http://localhost/tmtrack/tmtrack.dll?"
    SBMShell sbmShell
    String sbmReleaseReport
    BuildProvider buildProvider
    String buildUrl = "http://localhost:8080/jenkins"
    String buildUsername
    String buildToken
    CloudProvider cloudProvider
    String cloudUsername
    String cloudToken
    Integer refreshInterval = 10

    static constraints = {
        username unique: true, nullable: false, blank: false
        autoUrl blank: false, nullable: false
        sbmUrl blank: true, nullable: true
        sbmShell nullable: true, blank: true
        sbmReleaseReport blank: true, nullable: true
        buildProvider nullable: true, blank: true
        buildUrl blank: true, nullable: true
        buildUsername blank: true, nullable: true
        buildToken blank: true, nullable: true
        cloudProvider nullable: true, blank: true
        cloudUsername blank: true, nullable: true
        cloudToken blank: true, nullable: true
        refreshInterval min: 5, max: 360
    }

    static boolean userExists(final String username) {
        if (UserSettings.findByUsername(username)) return true
        else return false
    }
}
