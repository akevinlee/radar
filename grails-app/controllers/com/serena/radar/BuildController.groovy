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

        //def props = ""
        def params = "{\"parameter\": ["

        //{"parameter": [{"name":"FILE_LOCATION_AS_SET_IN_JENKINS", "file":"file0"}]}

        /*params.each(){
            if (it.key.startsWith('prop-')) {
                def propKey = it.key.minus("prop-")
                props += '"${propKey}": "${it.value}"'
            }
            if (it.key.startsWith('cver-')) {
                versions.push jsonBuilder (
                        versionSelector: "version/${it.value}",
                        componentId: it.key.minus("cver-")
                )
            }
        }

        if (props.length() > 0) {
            properties = { props }
        } else {
            properties = {}
        }
        */

        params = params + "]}"

        log.info "building job ${job}"

        def buildUrl = "${userSettingInstance.buildUrl}/jobs/${job}/buildWithParameters"
        log.info "build query set to ${buildUrl}; with JSON:"
        log.info params


        /*jsonBuilder (
                onlyChanged: (onlyChanged == "on" ? "true" : "false"),
                applicationProcessId: processId,
                snapshotId: snapshotId,
                scheduleCheckbox: (schedule == "on" ? true : false),
                applicationId: applicationId,
                environmentId: environmentId,
                description: description,
                properties: {},
                versions: versions
        )
        log.debug jsonBuilder.toPrettyString()
        */
        RestBuilder rest = new RestBuilder()
        def resp
        resp = rest.post(buildUrl) {
            auth(userSettingInstance.buildUsername, userSettingInstance.buildToken)
            accept("application/json")
            contentType("application/json")
            //json jsonBuilder.toString()
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
            redirect(controller: "dashboard", action: "view")
        }
    }

}
