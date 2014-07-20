package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import grails.transaction.Transactional

@Transactional(readOnly = true)
class UserController {
    def scaffold = User

    def login() {}

    def authenticate() {
        session.autoUrl = params.url
        if (validateAutomationConnection(params.url, params.username, params.password, params.rememberMe)) {
            // if user doesn't exist
            def user = User.findByLogin(params.username)
            if (user == null) {
                // create them
                user = new User(login: params.username, name: params.username, password: params.password)
                user.save()
            }
            session.user = user

            // if user settings doesn't exist
            def settings = Settings.findByUsername(params.username)
            if (settings == null) {
                // create them
                settings = new Settings(username: params.username, autoUrl: params.url, refreshInterval: 10)
                settings.save()
            }
            session.autoUrl = settings.autoUrl
            session.refreshInterval = settings.refreshInterval

            flash.message = message(code: 'login.success', args: [params.username])
            redirect(controller: "dashboard", action: "view")
        } else {
            flash.message = message(code: 'login.authentication.error', args: [params.username])
            redirect(action: "login")
        }
    }

    def logout() {
        flash.message = message(code: 'logout.success', args: [session.user.name])
        session.user = null
        redirect(controller: "dashboard", action: "view")
    }

    def boolean validateAutomationConnection(final String url, final String username,
                                             final String password, final String rememberMe) {
        try {
            RestBuilder rest = new RestBuilder()
            def resp = rest.get(url + "/rest/state") {
                auth(username, password)
                header 'DirectSsoInteraction', 'true'
                accept("application/json")
                contentType("application/json")
            }
            return (resp.status >= 200 && resp.status < 300)
        } catch (Exception e) {
            return false
        }
    }

    // TODO: replace validateAutomationConnection with below...
    def boolean validAutomationUser(final String url, final String username, final String password,
                                       final String rememberMe) {
        boolean isSuccess = true
        def setupErrorMsg = message(code: "login.server.not.setup")
        def authErrorMsg  = message(code: "login.server.not.authenticated")

        RestBuilder rest = new RestBuilder()
        MultiValueMap<String, String> form = new LinkedMultiValueMap<String, String>()
        form.add("username", username)
        form.add("password", password)
        form.add("rememberMe", "false")
        form.add("Log In", "login")
        form.add("requestedHash", "")

        def resp = rest.post(url + "/tasks/LoginTasks/login") {
            contentType("application/x-www-form-urlencoded")
            body(form)
        }

        println resp.status
        println resp.text

        if (resp.text.contains(setupErrorMsg) || resp.text.contains(authErrorMsg) || resp.text.isEmpty())
            isSuccess = false
        return ((resp.status >= 200 && resp.status < 300) && isSuccess)

    }

}
