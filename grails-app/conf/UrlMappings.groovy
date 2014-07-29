import grails.util.Environment

class UrlMappings {

	static mappings = {
        // proxy all REST requests through the server rather than client
        "/proxy/$method?"(controller: "automationProxy", parseRequest: false) {
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
