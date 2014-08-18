package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional
import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional(readOnly = true)
class DeploymentController {

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
        def process = params.process
        def processId = params.processId
        def snapshot = params.snapshot
        def snapshotId = params.snapshotId
        def application = params.application
        def applicationId = params.applicationId
        def environment = params.environment
        def environmentId = params.environmentId
        def properties = {}
        def versions = []

        log.info "Deploying ${application} snapshot ${snapshot} to ${environment}"

        def depUrl = "${session.autoUrl}/rest/deploy/application/${applicationId}/runProcess"
        log.debug "Deployment Automation query set to ${depUrl}; with JSON:"

        def jsonBuilder = new groovy.json.JsonBuilder()
        jsonBuilder (
                onlyChanged: 'false',
                applicationProcessId: processId,
                snapshotId: snapshotId,
                scheduleCheckbox: 'false',
                applicationId: applicationId,
                environmentId: environmentId,
                description: "deployed from Serena Radar",
                properties: {},
                versions: []
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
