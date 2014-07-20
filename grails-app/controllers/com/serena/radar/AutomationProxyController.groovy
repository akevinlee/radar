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
        if (restQuery == "")
            render([error: "invalid or empty REST query: ${restQuery}"] as JSON)

        RestBuilder rest = new RestBuilder()
        def resp = rest.get(session.autoUrl + restQuery) {
            auth(session.user.login, session.user.password)
            header 'DirectSsoInteraction', 'true'
            accept("application/json")
            contentType("application/json")
        }
        if (resp.status == 401) {
            response.status = resp.status
            render([error: "401 error: unable to authenticate REST query"] as JSON)
        } else
        if (resp.status != 200) {
            response.status = resp.status
            render([error: "${response.status} error -  unable to execute REST query"] as JSON)
        }
        render(resp.json as JSON)
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
                return "/rest/deploy/application?sortType=asc"
            case "all-components":
                return "/rest/deploy/component?sortType=asc"
            case "all-global-environments":
                return "/rest/deploy/globalEnvironment?sortType=asc"
            case "all-resources":
                return "/rest/resource/resource/tree?orderField=name&sortType=asc"
            case "all-agents":
                return "/rest/agent?&orderField=name&sortType=asc"
            case "current-activity":
                return "/rest/workflow/currentActivity?orderField=startDate&sortType=desc"
            default:
                return ""
        }
    }

}
