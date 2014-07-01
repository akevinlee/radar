package com.serena.radar

import grails.plugins.rest.client.RestBuilder

import com.serena.radar.Settings

class ApplicationsController {

    def index() {
        if (Settings.settingsIsEmpty())
            redirect(controller: "settings", action: "setup")

        Settings settingsInstance = Settings.getSettings()
        RestBuilder rest = new RestBuilder()
        def resp = rest.get(settingsInstance.sraUrl + "/rest/deploy/application") {
            auth(settingsInstance.sraUsername, settingsInstance.sraPassword)
            header 'DirectSsoInteraction', settingsInstance.useSSO.toString()
            accept("application/json")
            contentType("application/json")
        }
        if (resp.status == 401) {
            throw new Exception("Invalid user and/or password")
        } else if (resp.status != 200) {
            throw new Exception(resp.text)
        } else {
            println resp.toString()
            render(view: "index", model: [applications: resp.json])
        }
    }

}
