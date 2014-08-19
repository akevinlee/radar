package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional
import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional(readOnly = true)
class DeployController {

    def index() {
        render(view: 'index')
    }

    def snapshot() {
        render(view: 'index', model: [type: "snapshot"])
    }

    def version() {
        render(view: 'index', model: [type: "version"])
    }

    def deploy() {
        def jsonBuilder = new groovy.json.JsonBuilder()

        def onlyChanged = params.onlyChanged
        def schedule = params.schedule
        def process = params.process
        def processId = params.processId
        def snapshot = params.snapshot
        def snapshotId = params.snapshotId
        def application = params.application
        def applicationId = params.applicationId
        def environment = params.environment
        def environmentId = params.environmentId
        def description = params.description
        def props = ""
        def properties = ""
        def versions = []

        params.each(){
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

        println properties.toString()
        println versions.toString()

        if (snapshot != null)
            println "Deploying ${application} snapshot ${snapshot} to ${environment}"
        else
            println "Deploying ${application} component versions ${versions} to ${environment}"

        def depUrl = "${session.autoUrl}/rest/deploy/application/${applicationId}/runProcess"
        println "Deployment Automation query set to ${depUrl}; with JSON:"


        jsonBuilder (
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

        RestBuilder rest = new RestBuilder()
        def resp = rest.put(depUrl) {
            auth(session.user.login, session.user.password)
            accept("application/json")
            contentType("application/json")
            json jsonBuilder.toString()
        }
        if (resp.status == 401) {
            flash.error = message(code: 'deployment.authentication.error',
                    args: [resp.status, application, process, environment])
            redirect(action: "index")
        } else if (resp.status != 200) {
            flash.error = message(code: 'deployment.error',
                    args: [resp.status, application, process, environment])
            redirect(action: "index")
        }
        resp.json instanceof JSONObject
        flash.message = message(code: 'deployment.started',
                args: [application, process, environment, resp.json.requestId])
        redirect(controller: "dashboard", action: "view")
    }

}
