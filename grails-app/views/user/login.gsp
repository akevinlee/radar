<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="basic">
    <r:require modules="bootstrap"/>
    <title><g:message code="login.title" default="Log In"/></title>
</head>
<body class="login">

    <g:form class="form-login" role="form" url="[controller:'user', action:'authenticate']">
        <h2 class="form-login-heading">Please Log In</h2>
        <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
        </g:if>
        <g:textField name="url" type="url" class="form-control" required=""
                     value="${session.sraUrl != "" ? session.sraUrl : 'http://localhost:8080/serena_ra' }"
                     placeholder="${message(code: 'login.url.label', default: 'Automation Server URL')}" />
        <g:textField name="username" type="username" class="form-control" required="" autofocus=""
                     placeholder="${message(code: 'login.username.label', default: 'Username')}" />
        <g:passwordField name="password" type="password" class="form-control" required=""
                     placeholder="${message(code: 'login.password.label', default: 'Password')}" />
        <div class="checkbox">
            <label>
                <g:checkBox name="rememberMe" checked="false"></g:checkBox> Remember me
            </label>
        </div>
        <g:actionSubmit action="authenticate" class="btn btn-lg btn-primary btn-block"
                        value="${message(code: 'login.submit.button', default: 'Log In')}" />
    </g:form>

</body>
</html>