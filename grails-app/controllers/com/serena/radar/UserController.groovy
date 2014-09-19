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

        def useSSO = grailsApplication.config.radar.useSSO.toBoolean()

        if (useSSO) {
            log.debug "checking for SSO token..."

            // do we have an SSO token
            if (request.getHeader("ALFSSOAuthNToken") != null) {
                // decode it
                def ALFSSOAuthNToken = new String(request.getHeader("ALFSSOAuthNToken"))
                def decodedToken = new String(request.getHeader("ALFSSOAuthNToken").decodeBase64())
                log.info "found SSO token ${ALFSSOAuthNToken}"

                // to extract user
                def samlAssertion = new XmlSlurper().parseText(decodedToken).declareNamespace(saml: 'urn:oasis:names:tc:SAML:1.0:assertion');
                def ssoUser = samlAssertion.'saml:AuthenticationStatement'.'saml:Subject'.'saml:NameIdentifier'.text();
                log.debug "extracted user ${ssoUser} from SSO token"

                // create proxy session user
                User user = new User(login: ssoUser, name: ssoUser, password: "")
                session.user = user
                session.ALFSSOAuthNToken = ALFSSOAuthNToken

                // if user setting doesn't exist
                def setting = UserSetting.findByUsername(ssoUser)
                if (setting == null) {
                    // create them
                    log.debug "user setting for ${ssoUser} does not exist in database, creating..."
                    setting = new UserSetting(username: ssoUser,
                            autoUrl: grailsApplication.config.radar.default.autoURL,
                            buildUrl: grailsApplication.config.radar.default.buildURL,
                            refreshInterval: grailsApplication.config.radar.default.refresh)
                    setting.save()
                }

                session.autoUrl = setting.autoUrl
                session.refreshInterval = setting.refreshInterval

                log.debug "redirecting to default view..."
                flash.message = message(code: 'login.success', args: [ssoUser])
                redirect(controller: "dashboard", action: "view")
            } else {
                log.debug "no SSO token found, redirecting to login page..."
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

            // if user setting doesn't exist
            def setting = UserSetting.findByUsername(params.username)
            if (setting == null) {
                // create them
                log.debug "user setting for ${user} does not exist in database, creating..."
                setting = new UserSetting(username: params.username, autoUrl: params.url,
                        buildUrl: grailsApplication.config.radar.default.buildURL,
                        refreshInterval: grailsApplication.config.radar.default.refresh)
                setting.save()
            }
            session.autoUrl = setting.autoUrl
            session.refreshInterval = setting.refreshInterval

            log.debug "redirecting to default view..."
            flash.message = message(code: 'login.success', args: [params.username])
            redirect(controller: "dashboard", action: "view")
        } else {
            log.debug "user has failed authentication, redirecting back to login page..."
            flash.message = message(code: 'login.authentication.error', args: [params.username])
            redirect(action: "login")
        }
    }

    def logout() {
        if (session.ALFSSOAuthNToken != null) {
            log.debug "logging out user ${session.user} from SSO"
            session.invalidate()
            redirect(uri: "/logout-sso.jsp")
        } else {
            log.debug "logging out user ${session.user}"
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
