<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="login">
        <title><g:message code="login.title" default="Log In"/></title>
    </head>
    <body>

        <div id="intro">
            <a href="http://www.serena.com" title="www.serena.com" target="_tab"><div class="logo" title=""></div></a>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-md-3"></div>
                <div class="col-md-6 panel panel-default login-panel">
                    <g:form role="form" url="[controller:'user', action:'authenticate']" autocomplete="off">
                        <h2>Please Sign In</h2>

                        <div class="help-block">
                            ${message(code: 'login.help', default: 'To access live dashboards and user portal.')}
                        </div>

                        <g:if test="${flash.message}">
                            <div class="alert alert-danger" role="status">
                                ${flash.message}
                            </div>
                        </g:if>

                        <div class="form-group">
                            <label for="url">${message(code: 'login.url.label', default: 'Automation Server URL')}</label>
                            <g:textField name="url" type="url" class="form-control" required=""
                                         value="${session.autoUrl != "" ? session.autoUrl : 'http://localhost:8080/serena_ra' }"
                                         placeholder="${message(code: 'login.url.focus.label', default: 'Automation Server URL')}" />
                        </div>
                        <div class="form-group">
                            <label for="username">${message(code: 'login.username.label', default: 'Username')}</label>
                            <g:textField name="username" type="username" class="form-control" required="" autofocus=""
                                         placeholder="${message(code: 'login.username.focus.label', default: 'Username')}"
                                         autocomplete="off"/>
                        </div>
                        <div class="form-group">
                            <label for="password">${message(code: 'login.password.label', default: 'Password')}</label>
                            <g:passwordField name="password" type="password" class="form-control" required=""
                                             placeholder="${message(code: 'login.password.focus.label', default: 'Password')}"
                                             autocomplete="off"/>
                        </div>
                        <g:actionSubmit action="authenticate" class="btn btn-success pull-right"
                                        value="${message(code: 'login.submit.button', default: 'Log In')}" />
                        <br style="clear:both;" />
                    </g:form>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>
    </body>
</html>