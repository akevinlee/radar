import grails.util.Environment
import java.util.regex.Matcher

eventWebXmlStart = { webXmlFile ->

    if (Environment.current == Environment.DEVELOPMENT) {
        def env = System.getenv()

        String serenaSSO = env['SERENA_SSO']
        if (!serenaSSO) serenaSSO = "false"
        String serenaTomcatHome = env['SERENA_TOMCAT_HOME']
        if (!serenaTomcatHome) serenaTomcatHome = "C:/Program Files/Serena/Common Tools/tomcat/7.0"

        def tmpWebXmlFile = new File(projectWorkDir, webXmlFile)

        ant.echo message: "Changing display-name for web.xml"
        ant.replace(file: tmpWebXmlFile, token: "@grails.app.name.version@",
                value: "${grailsAppName}-${grailsAppVersion}")

        if (serenaSSO == "true" || serenaSSO == "enabled" || serenaSSO == "on") {
            ant.echo message: "Enabling SSO and Changing catalina.home to ${serenaTomcatHome}"
            ant.replace(file: tmpWebXmlFile, token: "<!-- Begin Serena SSO", value: "")
            ant.replace(file: tmpWebXmlFile, token: "End Serena SSO -->", value: "")
            ant.replace(file: tmpWebXmlFile, token: "@catalina.home@", value: "${serenaTomcatHome}")
        }

    }

}