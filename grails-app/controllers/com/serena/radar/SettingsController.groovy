package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SettingsController {

    static allowedMethods = [update: "PUT"]

    def index() {
        redirect(action: 'edit')
    }

    /*def setup() {
        Settings settingsInstance = Settings.getSettings()
        render(view: "edit", model: [settingsInstance: settingsInstance])
    }*/

    def edit() {
        respond Settings.findByUsername(session.user.name)
    }

    def validate(Settings settingsInstance) {
        if (settingsInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Settings.label', default: 'Settings'), settingsInstance.id])
            respond settingsInstance, view:'edit'
            return
        }

        if (settingsInstance.hasErrors()) {
            respond settingsInstance.errors, view:'edit'
            return
        }

        /*
        // validate connectivity
       try {
           validateAutomationConnection(settingsInstance)
           flash.message = message(code: 'setting.validate.success')
           respond settingsInstance, view:'edit'
       } catch (Exception ex) {
           log.error "Error: failed to validate Automation connection - ${ex.message}"
           flash.error = message(code: 'setting.validate.failure', args: [ex.message])
           respond settingsInstance, view:'edit'
       }*/

    }

    @Transactional
    def update(Settings settingsInstance) {
        if (settingsInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Settings.label', default: 'Settings'), settingsInstance.id])
            respond settingsInstance, view:'edit'
            return
        }

        if (settingsInstance.hasErrors()) {
            respond settingsInstance.errors, view:'edit'
            return
        }

        settingsInstance.save flush:true

        session.refreshInterval = settingsInstance.refreshInterval
        session.sraUrl = settingsInstance.sraUrl

        flash.message = message(code: 'setting.validate.success')

        redirect(controller: "dashboard", action: "view")
    }

    static validateAutomationConnection(Settings settingsInstance) throws Exception {
        RestBuilder rest = new RestBuilder()
        def resp = rest.get(settingsInstance.sraUrl + "/rest/state") {
            auth(settingsInstance.sraUsername, settingsInstance.sraPassword)
            header 'DirectSsoInteraction', 'true'
            accept("application/json")
            contentType("application/json")
        }
        if (resp.status == 401) {
            throw new Exception("Invalid user and/or password")
        } else if (resp.status != 200) {
            throw new Exception(resp.text)
        }
    }

}
