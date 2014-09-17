package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import org.codehaus.groovy.grails.web.json.JSONObject

class BuildController {

    def index() {
        UserSetting userSettingInstance = UserSetting.findByUsername(session.user.name)

        if (userSettingInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Build.index', default: 'Build Job'), session.user.name])
            respond view:'notFound'
        } else {
            //respond userSettingInstance, view:'index'
            render(view: 'index', model: [buildUrl: userSettingInstance.buildUrl, job: params.job])
        }
    }

    def view() {
        UserSetting userSettingInstance = UserSetting.findByUsername(session.user.name)

        if (userSettingInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Build.view', default: 'Build View'), session.user.name])
            respond view:'notFound'
        } else {
            respond userSettingInstance, view:'view'
        }

    }

    def submit() {

        UserSetting userSettingInstance = UserSetting.findByUsername(session.user.name)

        if (userSettingInstance == null) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'Build.submit', default: 'Build Submit'), session.user.name])
            respond view:'notFound'
        }

        def jsonBuilder = new groovy.json.JsonBuilder()

        def job = params.job

        def jobParams = []

        params.each(){
             if (it.key.startsWith('param-')) {
                log.info it
                jobParams.push jsonBuilder (
                        name: it.key.minus("param-"),
                        value: it.value
                )
            }
        }

        log.info "building job ${job}"

        def buildUrl = "${userSettingInstance.buildUrl}/job/${job}/buildWithParameters"
        log.debug "build query set to ${buildUrl}; with JSON:"

        jsonBuilder (
                parameter: jobParams
        )
        log.debug jsonBuilder.toPrettyString()

        RestBuilder rest = new RestBuilder()
        def resp
        resp = rest.post(buildUrl) {
            //auth(userSettingInstance.buildUsername, userSettingInstance.buildToken)
            accept("application/json")
            contentType("application/json")
            json jsonBuilder.toString()
        }
        if (resp.status == 401) {
            flash.error = message(code: 'build.authentication.error',
                    args: [resp.status, job])
            redirect(controller: "build", action: "view")
        } else if (resp.status != 201) {
            flash.error = message(code: 'build.error',
                    args: [resp.status, job])
            redirect(controller: "build", action: "view")
        } else {
            resp.json instanceof JSONObject
            flash.message = message(code: 'build.started',
                    args: [job, resp.json])
            redirect(controller: "build", action: "view")
        }
    }

}
