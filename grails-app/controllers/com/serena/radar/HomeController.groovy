package com.serena.radar

import grails.plugins.rest.client.RestBuilder

import com.serena.radar.Settings

class HomeController {

    def index() {
        if (Settings.settingsIsEmpty())
            redirect(controller: "settings", action: "setup")
        else {
            Settings settingsInstance = Settings.getSettings()
            render(view: "index", model: [settingsInstance: settingsInstance])
        }
    }

}

