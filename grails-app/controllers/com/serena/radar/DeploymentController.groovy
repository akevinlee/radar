package com.serena.radar

import grails.converters.JSON
import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional
import org.codehaus.groovy.grails.web.json.JSONObject

@Transactional(readOnly = true)
class DeploymentController {

    static allowedMethods = [submit: "POST"]

    def index() {
        render(view: 'index')
    }

    def submit() {
        def processId = params.process
        def snapshotId = params.snapshot
        def applicationId = params.application
        def environmentId = params.environment
        def properties = {}
        def versions = []
        RestBuilder rest = new RestBuilder()
        def resp = rest.post("http://localhost:8080/serena_ra/rest/deploy/application/208f4922-3dc8-4b23-aa09-e6125fe8ab7b/runProcess") {
            auth(session.user.login, session.user.password)
            accept("application/json")
            contentType("application/json")
            body(["onlyChange": false, "applicationProcessId": processId, "snapshotId": snapshotId, "scheduleCheckbox": false, "applicationId": applicationId, "environmentId": environmentId, "description": "", "properties": properties, "versions": versions ] as JSON)
        }
        if (resp.status == 401) {
            response.status = resp.status
            render([error: "401 error: unable to authenticate REST query"] as JSON)
        } else
        if (resp.status != 200) {
            response.status = resp.status
            render([error: "${response.status} error -  unable to execute REST query"] as JSON)
        }
        def jsonResp = resp.json as JSON
        println(resp)
        println(jsonResp.requestId)
        render(view: 'status', model: [requestId: jsonResp.requestId])
    }
}
