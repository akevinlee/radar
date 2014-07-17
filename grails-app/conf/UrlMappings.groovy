class UrlMappings {

	static mappings = {
        // proxy all REST requests through the server rather than client
        "/proxy/$method?"(controller: "automationProxy") {
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
        "500"(view:'/error')
	}
}
