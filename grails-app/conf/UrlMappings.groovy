class UrlMappings {

	static mappings = {
        "/notify" (controller: 'Notify', parseRequest: false) {
            action = [ POST: "save"]
        }
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        //"/"(view:"/index")
        "/" ( controller:'Dashboard', action:'index' )
        "500"(view:'/error')
	}
}
