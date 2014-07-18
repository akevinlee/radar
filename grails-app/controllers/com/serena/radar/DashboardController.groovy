package com.serena.radar

class DashboardController {

    def beforeInterceptor = [action:this.&auth]

    def auth() {
        if(!session.user) {
            redirect(controller:"user", action:"login")
            return false
        }
    }

    def view() {
        render(view: "view")
    }

}

