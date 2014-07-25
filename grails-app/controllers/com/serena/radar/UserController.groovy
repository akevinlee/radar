package com.serena.radar

import grails.plugins.rest.client.RestBuilder
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.apache.commons.codec.digest.DigestUtils
import grails.transaction.Transactional
import sun.misc.BASE64Decoder
import sun.misc.BASE64Encoder

import javax.servlet.http.Cookie
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.xpath.XPathFactory

@Transactional(readOnly = true)
class UserController {
    def scaffold = User

    def login() {
        /*
        // do we have an SSO token
        if (request.getHeader("ALFSSOAuthNToken") != null) {
            println "extracting sso user"
            // decode it
            def ALFSSOAuthNToken = new String(request.getHeader("ALFSSOAuthNToken").decodeBase64())
            println ALFSSOAuthNToken
            // to extract user
            def ssoUser = extractXml(new XmlParser().parseText(ALFSSOAuthNToken),
                "/saml:Assertion/saml:AuthenticationStatement/saml:Subject/saml:NameIdentifier")
            println ssoUser
        }*/

        // check if we have a cookie for we remember me authentication
        /*def cookieName = "${grailsApplication.metadata['app.name']}-${grailsApplication.metadata['app.version']}"
        String rememberMeHash = g.cookie(name: cookieName)
        println rememberMeHash
        if (rememberMeHash != null) {
            def (username, expiration, password) = decrypt(rememberMeHash).toString().split(':')
            println username
            println expiration
            println password
            def user = User.findByLogin(username)
            if (user != null) {
                session.user = user
                if (user.password != password) {
                    flash.message = message(code: 'login.authentication.error', args: [username])
                    redirect(action: "login")
                }
                def settings = Settings.findByUsername(username)
                if (settings != null) {
                    session.autoUrl = settings.autoUrl
                    session.refreshInterval = settings.refreshInterval

                    flash.message = message(code: 'login.success', args: [username])
                    redirect(controller: "dashboard", action: "view")
                } else {
                    flash.message = message(code: 'login.authentication.error', args: [username])
                    redirect(action: "login")
                }
            } else {
                println "in here"
                // delete cookie

                flash.message = message(code: 'login.authentication.error', args: [username])
                redirect(action: "login")
            }
        }*/

        // set default Automation Server URL
        if (session.autoUrl == null)
            session.autoUrl = "http://localhost:8080/serena_ra"
    }

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

            // write hash to cookie if rememberMe is true
            // NOT YET USED
            if (params.rememberMe.toString() == "true") {
                def expirationTime = new Date() + 30 // days
                def rememberMeHash = encrypt(params.username + ":" +
                        expirationTime.getTime().toString() + ":" +
                        params.password) // this is not secure at the moment!!!

                def cookieName = "${grailsApplication.metadata['app.name']}-${grailsApplication.metadata['app.version']}"
                Cookie cookie = new Cookie(cookieName, rememberMeHash.toString())
                cookie.maxAge = 30 * (60 * 60 * 24)
                response.addCookie(cookie)
            }

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

    def static String encrypt(String str) {
        BASE64Encoder encoder = new BASE64Encoder()
        byte[] salt = new byte[8];
        Random rand = new Random((new Date()).getTime())
        rand.nextBytes(salt)
        return encoder.encode(salt) + encoder.encode(str.getBytes())
    }

    def static String decrypt(String str) {
        if (str.length() > 12) {
            String cipher = str.substring(12);
            BASE64Decoder decoder = new BASE64Decoder();
            try {
                 return new String(decoder.decodeBuffer(cipher));
            } catch (IOException e) {
                //  throw new InvalidImplementationException(
                //  Fail
             }
         }
         return null;
    }

    def static String extractXml(String xml, String xpathQuery ) {
        def xpath = XPathFactory.newInstance().newXPath()
        def builder     = DocumentBuilderFactory.newInstance().newDocumentBuilder()
        def inputStream = new ByteArrayInputStream(xml.bytes)
        def records     = builder.parse(inputStream).documentElement
        xpath.evaluate(xpathQuery, records)
    }

}
