<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="login">
        <r:require modules="bootstrap"/>
        <title><g:message code="login.title" default="Log In"/></title>
    </head>
    <body>

        <div id="intro">
            <a href="http://www.serena.com" title="www.serena.com" target="_tab"><div class="logo" title=""></div></a>
        </div>

        <div id="loginForm">
            <g:form id="loginForm" class="form-login" role="form" url="[controller:'user', action:'authenticate']">
                <div class="message" role="status">
                    <g:if test="${flash.message}">
                        ${flash.message}
                    </g:if>
                </div>
                <label class="sr-only" for="url">${message(code: 'login.url.label', default: 'Automation Server URL')}</label>
                <g:textField name="url" type="url" class="form-control" required=""
                             value="${session.autoUrl != "" ? session.autoUrl : 'http://localhost:8080/serena_ra' }"
                             placeholder="${message(code: 'login.url.label', default: 'Automation Server URL')}" />
                <label class="sr-only" for="username">${message(code: 'login.username.label', default: 'Username')}</label>
                <g:textField name="username" type="username" class="form-control" required="" autofocus=""
                             placeholder="${message(code: 'login.username.label', default: 'Username')}" />
                <label class="sr-only" for="password">${message(code: 'login.password.label', default: 'Password')}</label>
                <g:passwordField name="password" type="password" class="form-control" required=""
                             placeholder="${message(code: 'login.password.label', default: 'Password')}" />
                <div class="checkbox">
                    <label>
                        <g:checkBox name="rememberMe" checked="false"></g:checkBox> ${message(code: 'login.rememberMe.label', default: 'Remember me')}
                    </label>
                </div>
                <g:actionSubmit action="authenticate" class="btn btn-lg btn-success btn-block"
                                value="${message(code: 'login.submit.button', default: 'Log In')}" />
            </g:form>
        </div>
        <div id="loading" style="display: none;"><div class="text"></div></div>
    </body>
</html>