package com.serena.radar

import grails.plugins.rest.client.RestBuilder

import com.serena.radar.Settings

class DashboardController {

    def view() {
        if (Settings.settingsIsEmpty())
            redirect(controller: "settings", action: "setup")
        else {
            Settings settingsInstance = Settings.getSettings()
            render(view: "view", model: [settingsInstance: settingsInstance])
        }
    }

}

