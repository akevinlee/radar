package com.serena.radar

class SecurityFilters {

    def filters = {
        loginCheck(controller: '*', action: '*') {
            before = {
                if (controllerName == "user" && (actionName == "login" || actionName == "authenticate")) {
                    return true
                }
                if (!session.user) {
                    redirect(controller: "user", action: "login")
                    return false
                }
            }
        }
    }
}
