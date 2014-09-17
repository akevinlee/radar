package com.serena.radar

import grails.transaction.Transactional

@Transactional(readOnly = true)
class UserSettingController {

    static allowedMethods = [update: "PUT"]

    def index() {
        redirect(action: 'edit')
    }

    def edit() {
        UserSetting userSettingInstance = UserSetting.findByUsername(session.user.name)

        if (userSettingInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'UserSetting.edit', default: 'Settings'), session.user.name])
            respond view:'notFound'
        } else {
            log.debug("editing user " + userSettingInstance.username)
            respond userSettingInstance, view:'edit'
        }
    }

    @Transactional
    def update(UserSetting userSettingInstance) {
        if (userSettingInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'UserSetting.edit', default: 'Settings'), session.user.name])
            respond view:'notFound'
            return
        }

        if (userSettingInstance.hasErrors()) {
            respond userSettingInstance.errors, view:'edit'
            return
        }

        log.debug("saving user settings for " + userSettingInstance.username)
        userSettingInstance.save flush:true

        session.autoUrl = userSettingInstance.autoUrl
        session.refreshInterval = userSettingInstance.refreshInterval

        flash.message = message(code: 'setting.update.success')

        redirect(controller: "dashboard", action: "view")
    }

}
