package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional

@Transactional(readOnly = true)
class SettingsController {

    static allowedMethods = [update: "PUT"]

    def index() {
        redirect(action: 'edit')
    }

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
        session.autoUrl = settingsInstance.autoUrl

        flash.message = message(code: 'setting.validate.success')

        redirect(controller: "dashboard", action: "view")
    }

}
