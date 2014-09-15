package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import grails.transaction.Transactional

@Transactional(readOnly = true)
class UserController {
    def grailsApplication

    @Transactional
    def login() {

        if (grailsApplication.config.radar.useSSO) {
            log.info "checking for SSO token"

            // do we have an SSO token
            if (request.getHeader("ALFSSOAuthNToken") != null) {
                // decode it
                def ALFSSOAuthNToken = new String(request.getHeader("ALFSSOAuthNToken"))
                def decodedToken = new String(request.getHeader("ALFSSOAuthNToken").decodeBase64())
                log.info "found SSO token ${ALFSSOAuthNToken}"

                // to extract user
                def samlAssertion = new XmlSlurper().parseText(decodedToken).declareNamespace(saml: 'urn:oasis:names:tc:SAML:1.0:assertion');
                def ssoUser = samlAssertion.'saml:AuthenticationStatement'.'saml:Subject'.'saml:NameIdentifier'.text();
                log.info "extracted user ${ssoUser} from SSO token"

                // create proxy session user
                User user = new User(login: ssoUser, name: ssoUser, password: "")
                session.user = user
                session.ALFSSOAuthNToken = ALFSSOAuthNToken

                // if user settings doesn't exist
                def settings = UserSettings.findByUsername(ssoUser)
                if (settings == null) {
                    // create them
                    log.info "user settings for ${ssoUser} does not exist in database, creating..."
                    settings = new UserSettings(username: ssoUser,
                            autoUrl: grailsApplication.config.radar.default.autoURL,
                            refreshInterval: grailsApplication.config.radar.default.refresh)
                    settings.save()
                }
                if (settings.buildUrl) session.buildUrl = settings.buildUrl
                if (settings.buildUsername) session.buildUsername = settings.buildUsername
                if (settings.buildToken) session.buildToken = settings.buildToken

                session.autoUrl = settings.autoUrl
                session.refreshInterval = settings.refreshInterval

                log.info "redirecting to default view..."
                flash.message = message(code: 'login.success', args: [ssoUser])
                redirect(controller: "dashboard", action: "view")
            } else {
                log.info "no SSO token found, redirecting to login page..."
            }
        }

        // set default Automation Server URL
        if (session.autoUrl == null)
            session.autoUrl = grailsApplication.config.radar.default.autoURL
    }

    @Transactional
    def authenticate() {
        session.autoUrl = params.url
        if (validateAutomationConnection(params.url, params.username, params.password)) {
            // create proxy session user
            User user = new User(login: params.username, name: params.username, password: params.password)
            session.user = user

            // if user settings doesn't exist
            def settings = UserSettings.findByUsername(params.username)
            if (settings == null) {
                // create them
                log.info "user settings for ${user} does not exist in database, creating..."
                settings = new UserSettings(username: params.username, autoUrl: params.url,
                        sbmUrl: grailsApplication.config.radar.default.sbmUrl,
                        refreshInterval: grailsApplication.config.radar.default.refresh)
                settings.save()
            }
            if (settings.buildUrl) session.buildUrl = settings.buildUrl
            if (settings.buildUsername) session.buildUsername = settings.buildUsername
            if (settings.buildToken) session.buildToken = settings.buildToken
            session.autoUrl = settings.autoUrl
            session.refreshInterval = settings.refreshInterval

            log.info "redirecting to default view..."
            flash.message = message(code: 'login.success', args: [params.username])
            redirect(controller: "dashboard", action: "view")
        } else {
            log.info "user ${user} has failed authentication, redirecting back to login page..."
            flash.message = message(code: 'login.authentication.error', args: [params.username])
            redirect(action: "login")
        }
    }

    def logout() {
        if (session.ALFSSOAuthNToken != null) {
            log.info "logging out user ${session.user} from SSO"
            session.invalidate()
            redirect(uri: "/logout-sso.jsp")
        } else {
            log.info "logging out user ${session.user}"
            flash.message = message(code: 'logout.success', args: [session.user.name])
            session.user = null
            redirect(controller: "dashboard", action: "view")
        }
    }

    def boolean validateAutomationConnection(final String url, final String username,
                                             final String password) {
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

        //println resp.status
        //println resp.text

        if (resp.text.contains(setupErrorMsg) || resp.text.contains(authErrorMsg) || resp.text.isEmpty())
            isSuccess = false
        return ((resp.status >= 200 && resp.status < 300) && isSuccess)

    }

}
