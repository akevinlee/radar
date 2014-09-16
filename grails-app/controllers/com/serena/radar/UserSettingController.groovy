package com.serena.radar

import grails.transaction.Transactional

@Transactional(readOnly = true)
class UserSettingController {

    static allowedMethods = [update:['PUT', 'POST']]

    def index() {
        redirect(action: 'edit')
    }

    def edit() {
        UserSettings userSettingsInstance = UserSettings.findByUsername(session.user.name)

        if (userSettingsInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Setting.edit', default: 'Settings'), session.user.name])
            respond view:'notFound'
        } else {
            respond userSettingsInstance, view:'edit'
        }
    }

    def validate(UserSettings userSettingsInstance) {
        if (userSettingsInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Setting.edit', default: 'Settings'), session.user.name])
            respond view:'notFound'
            return
        }

        if (userSettingsInstance.hasErrors()) {
            respond userSettingsInstance.errors, view:'edit'
            return
        }

    }

    @Transactional
    def update(UserSettings userSettingsInstance) {
        if (userSettingsInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Setting.edit', default: 'Settings'), session.user.name])
            respond view:'notFound'
            return
        }

        if (userSettingsInstance.hasErrors()) {
            respond userSettingsInstance.errors, view:'edit'
            return
        }

        userSettingsInstance.save flush:true

        log.info userSettingsInstance.buildUrl

        if (userSettingsInstance.buildUrl) session.buildUrl = userSettingsInstance.buildUrl
        if (userSettingsInstance.buildUsername) session.buildUsername = userSettingsInstance.buildUsername
        if (userSettingsInstance.buildToken) session.buildToken = userSettingsInstance.buildToken
        session.autoUrl = userSettingsInstance.autoUrl
        if (userSettingsInstance.sbmUrl) session.sbmUrl = userSettingsInstance.sbmUrl
        session.refreshInterval = userSettingsInstance.refreshInterval

        flash.message = message(code: 'setting.update.success')

        redirect(controller: "dashboard", action: "view")
    }

}
