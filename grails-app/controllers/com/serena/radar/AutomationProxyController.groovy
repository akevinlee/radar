package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import grails.converters.JSON;
import grails.transaction.Transactional

@Transactional(readOnly = true)
class AutomationProxyController {

    def get(final String url) {
        String method = params.method
        String restQuery // the query which has been passed or we can infer via method
        if (method != null)
            restQuery = getRestQuery(method)
        else
            restQuery = URLDecoder.decode(url, "UTF-8")
        if (restQuery == "") {
            flash.error = message(code: 'proxy.rest.query.error')
            render(controller: "error", view: "serverError")
        }

        log.info "Automation request = ${session.autoUrl}${restQuery}"

        RestBuilder rest = new RestBuilder()
        def resp

        if (session.ALFSSOAuthNToken != null) {
            log.debug "using SSO token"
            resp = rest.get(session.autoUrl + restQuery) {
                header 'ALFSSOAuthNToken', session.ALFSSOAuthNToken
                accept("application/json")
                contentType("application/json")
            }
        } else {
            log.debug "using Basic authentication: ${session.user.login}/${session.user.password}"
            resp = rest.get(session.autoUrl + restQuery) {
                auth(session.user.login, session.user.password)
                accept("application/json")
                contentType("application/json")
            }
        }
        if (resp.status == 401) {
            flash.error = message(code: 'proxy.authentication.error', args: [resp.status])
            render(controller: "error", view: "serverError")
        } else
        if (resp.status != 200) {
            flash.error = message(code: 'proxy.server.error', args: [resp.status])
            render(controller: "error", view: "serverError")
        } else {
            render(resp.json as JSON)
        }
    }

    def put() {

    }

    def post() {

    }

    def delete() {

    }

    static getRestQuery(final String method) {
        switch (method) {
            case "all-applications":
                return "/rest/deploy/application?sortType=asc";
            case "all-components":
                return "/rest/deploy/component?sortType=asc";
            case "all-global-environments":
                return "/rest/deploy/globalEnvironment?sortType=asc";
            case "all-resources":
                return "/rest/resource/resource/tree?orderField=name&sortType=asc";
            case "all-agents":
                return "/rest/agent?&orderField=name&sortType=asc";
            case "current-activity":
                return "/rest/workflow/currentActivity?orderField=startDate&sortType=desc";
            case "tasks-for-user-count":
                return "/rest/approval/task/tasksForUserCount";
            case "tasks-for-user":
                return "/rest/approval/task/tasksForUser?orderField=startDate&sortType=desc";
            default:
                return ""
        }
    }

}
