package com.serena.radar

import grails.converters.JSON
import grails.plugins.rest.client.RestBuilder
import grails.transaction.Transactional

@Transactional(readOnly = true)
class BuildProxyController {

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

        UserSetting userSettingInstance = UserSetting.findByUsername(session.user.name)
        def buildUrl = userSettingInstance.buildUrl;
        log.info "Build request = ${buildUrl}${restQuery}"

        RestBuilder rest = new RestBuilder()
        def resp
        resp = rest.get(buildUrl + restQuery) {
            //auth(session.user.login, session.user.password)
            accept("application/json")
            contentType("application/json")
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
            case "jobs":
                return "/api/json?tree=jobs[name]"
            case "all-jobs":
                return "/api/json?depth=2&tree=jobs[name,description,url,buildable,nextBuildNumber]"
            default:
                return ""
        }
    }

}
