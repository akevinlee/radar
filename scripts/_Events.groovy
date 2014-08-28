import grails.util.Environment
import java.util.regex.Matcher

eventWebXmlEnd = { String filename ->

    if (Environment.current == Environment.DEVELOPMENT) {
        def env = System.getenv()

        String serenaTomcatHome = env['SERENA_TOMCAT_HOME']
        if (!serenaTomcatHome) serenaTomcatHome = "C:/Program Files/Serena/Common Tools/tomcat/7.0"

        String content = webXmlFile.text

        // update the XML
        content = content.replaceAll("\\\$\\{catalina.home\\}", serenaTomcatHome)

        webXmlFile.withWriter { file -> file << content }
    }

}