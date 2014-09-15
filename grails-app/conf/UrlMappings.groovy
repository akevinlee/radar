import grails.util.Environment

class UrlMappings {

	static mappings = {
        // proxy all Automation REST requests through the server rather than client
        "/autoproxy/$method?"(controller: "automationProxy") {
            action = [GET: "get", PUT: "put", DELETE: "delete", POST: "post"]
        }

        // proxy all Build REST requests through the server rather than client
        "/buildproxy/$method?"(controller: "buildProxy") {
            action = [GET: "get", PUT: "put", DELETE: "delete", POST: "post"]
        }

        // used to notify RADAR something has happened - not used yet
        "/notify" (controller: 'Notify', parseRequest: false) {
            action = [ POST: "save"]
        }

        // default controller
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/" ( controller:'Dashboard', action:'view' )

        "404"(controller: "error", action: "notFound")
        if (Environment.current == Environment.PRODUCTION) {
            "500"(controller: "error", action: "serverError")
        }
        else {
            "500"(controller: "error", action: "devError")
        }
	}
}
