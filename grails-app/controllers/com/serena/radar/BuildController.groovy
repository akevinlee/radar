package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import org.codehaus.groovy.grails.web.json.JSONObject

class BuildController {

    def index() {
        render(view: "index")
    }

    def view() {
        render(view: "view")
    }

    def submit() {
        def jsonBuilder = new groovy.json.JsonBuilder()

        def job = params.job

        //def props = ""
        def params = ""

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

        log.debug properties.toString()
        log.debug versions.toString()*/

        log.info "building job ${job}"

        def buildUrl = "${session.buildUrl}/job/${job}/buildWithParameters"
        log.debug "build query set to ${buildUrl}; with JSON:"


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
            //auth(session.user.login, session.user.password)
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
        }

        resp.json instanceof JSONObject
        flash.message = message(code: 'build.started',
                args: [job, resp.json])
        redirect(controller: "dashboard", action: "view")
    }

}
