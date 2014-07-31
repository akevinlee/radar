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

        // TODO: make this work!!!
        // do we have an SSO token
        if (request.getHeader("ALFSSOAuthNToken") != null) {
            // decode it
            def ALFSSOAuthNToken = new String(request.getHeader("ALFSSOAuthNToken").decodeBase64())
            //println "found SSO token ${ALFSSOAuthNToken}"
            // to extract user
            def ssoUser = extractXml(new XmlParser().parseText(ALFSSOAuthNToken),
                "/saml:Assertion/saml:AuthenticationStatement/saml:Subject/saml:NameIdentifier")
            //println "found SSO user ${ssoUser}"

            // create temporary user
            User user = new User(login: ssoUser, name: ssoUser, password: "")
            session.user = user
            session.ALFSSOAuthNToken = ALFSSOAuthNToken

            // if user settings doesn't exist
            def settings = Settings.findByUsername(ssoUser)
            if (settings == null) {
                // create them
                settings = new Settings(username: ssoUser, autoUrl: "http://localhost:8080/serena_ra", refreshInterval: 10)
                settings.save()
            }
            session.autoUrl = settings.autoUrl
            session.refreshInterval = settings.refreshInterval

            flash.message = message(code: 'login.success', args: [ssoUser])
            redirect(controller: "dashboard", action: "view")
        }

        // set default Automation Server URL
        if (session.autoUrl == null)
            session.autoUrl = "http://localhost:8080/serena_ra"
    }

    def authenticate() {
        session.autoUrl = params.url
        if (validateAutomationConnection(params.url, params.username, params.password)) {
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
