package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import org.codehaus.groovy.grails.web.json.JSONObject

class TaskController {

    def view() {
        render(view: "view")
    }

    def approve() {
        render(view: 'index', model: [type: "approve", task: params.id])
    }

    def reject() {
        render(view: 'index', model: [type: "reject", task: params.id])
    }

    def submit() {
        def jsonBuilder = new groovy.json.JsonBuilder()

        def task = params.task
        def type = params.type
        def comment = params.comment

        if (type == "approve")
            log.info "approving task ${task} with comment ${comment}"
        else
            log.info "rejecting task ${task} with comment ${comment}"

        def depUrl = "${session.autoUrl}/rest/approval/task/${task}/close"
        log.debug "deployment automation query set to ${depUrl}; with JSON:"

        jsonBuilder (
                passFail: (type == "approve" ? "passed" : "failed"),
                comment: comment
        )
        log.debug jsonBuilder.toPrettyString()

        RestBuilder rest = new RestBuilder()
        def resp
        if (session.ALFSSOAuthNToken != null) {
            resp = rest.put(depUrl) {
                header 'ALFSSOAuthNToken', session.ALFSSOAuthNToken
                accept("application/json")
                contentType("application/json")
                json jsonBuilder.toString()
            }
        } else {
            resp = rest.put(depUrl) {
                auth(session.user.login, session.user.password)
                accept("application/json")
                contentType("application/json")
                json jsonBuilder.toString()
            }
        }
        if (resp.status == 401) {
            flash.error = message(code: 'task.authentication.error',
                    args: [resp.status, task, type])
            redirect(action: "view")
        } else if (resp.status != 200) {
            flash.error = message(code: 'task.error',
                    args: [resp.status, task, type])
            redirect(action: "view")
        } else {
            resp.json instanceof JSONObject
            flash.message = message(code: 'task.approved',
                    args: [task, type, resp.json.requestId])
            redirect(action: "view")
        }
    }

}
