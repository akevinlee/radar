package com.serena.radar

import grails.converters.JSON
import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional
import groovy.json.JsonBuilder
import groovyx.net.http.Method
import groovyx.net.http.ContentType
import org.codehaus.groovy.grails.web.json.JSONObject
import groovyx.net.http.HTTPBuilder

import static groovyx.net.http.Method.PUT
import static groovyx.net.http.ContentType.JSON

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

        def url = "${session.autoUrl}/rest/deploy/application/${applicationId}/runProcess"
        println url

        def depRequest = new HTTPBuilder(url)
        //depRequest.auth.basic("admin", "admin")
        //http.headers['Authorization'] = 'Basic '+"admin:admin".bytes.encodeBase64()

        def postBody = [onlyChange: false,
                        applicationProcessId: processId,
                        snapshotId: snapshotId,
                        scheduleCheckbox: false,
                        applicationId: applicationId,
                        environmentId: environmentId,
                        description: "deployed from Serena Radar"
                        ] // will be url-encoded

        def jsonBuilder = new groovy.json.JsonBuilder()
        jsonBuilder (
            onlyChanged: 'false',
            applicationProcessId: '${processId}',
            snapshotId: '${snapshotId}',
            scheduleCheckbox: false,
            applicationId: '${applicationId}',
            environmentId: '${environmentId}',
            description: "deployed from Serena Radar",
            properties: {},
            versions: []
        )
        println(jsonBuilder.toPrettyString())

        /*body(["onlyChange": false, "applicationProcessId": processId, "snapshotId": snapshotId,
              "scheduleCheckbox": false, "applicationId": applicationId, "environmentId": environmentId,
              "description": "", "properties": properties, "versions": versions ] as JSON) */

        def builder = new JsonBuilder(properties)
        depRequest.request(Method.PUT, ContentType.JSON) { req ->
            headers.accept = "application/json"
            headers.authorization = 'Basic '+"admin:admin".bytes.encodeBase64()
            body = jsonBuilder

            response.success = { resp, json ->
                println "Success! ${resp.status}"
                println json
                render(view: 'status', model: [requestId: json.requestId])
            }

            response.failure = { resp ->
                println "Request failed with status ${resp.status}"
            }
        }
        /*body: postBody,
                requestContentType: JSON ) { resp, json ->

            println "POST Success: ${resp.status}"
            if (resp.status == 401) {
                response.status = resp.status
                render([error: "401 error: unable to authenticate REST query"] as JSON)
            } else
            if (resp.status != 200) {
                response.status = resp.status
                render([error: "${response.status} error -  unable to execute REST query"] as JSON)
            }
            println(json)
            println(json.requestId)
            render(view: 'status', model: [requestId: json.requestId])
        }
        /*
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
        println(jsonResp.requestId)*/
        //render(view: 'status', model: [requestId: json.requestId])
    }
}
