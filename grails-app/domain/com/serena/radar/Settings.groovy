package com.serena.radar

class Settings {
    String sraUrl = "http://localhost:8080/serena_ra"
    String sraUsername = "admin"
    String sraPassword = "admin"
    Boolean useProxy = false
    //Boolean useSSO = false
    Integer refreshInterval = 10

    boolean singleEntry = true

    static constraints = {
        sraUrl url: ["localhost(:(\\d{1,5}))?"], blank: false
        sraUsername size: 2..20, blank: false
        sraPassword blank: true
        refreshInterval min: 5, max: 360
        singleEntry nullable: false, validator: { val, obj ->
            if(val && obj.id != getSettings()?.id && Settings.count > 0){
                return "Settings already exists in database"
            }
        }
    }

    static getSettings() {
        if (Settings.count != 0)
            return Settings.list()?.first()
        else
            return new Settings()
    }

    static boolean settingsIsEmpty() {
        if (Settings.count == 0)
            return true
        else
            return false
    }
}
