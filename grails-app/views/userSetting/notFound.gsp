<%@ page import="com.serena.radar.BuildProvider; com.serena.radar.SBMShell; com.serena.radar.UserSetting" %>

<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main">
        <g:set var="entityName" value="${message(code: 'setting.edit', default: 'Settings')}"/>
        <title><g:message code="setting.title"/></title>
    </head>

    <body>

        <h3 class="page-header">
            <g:message code="setting.title"/>
        </h3>

        <div id="page-body" role="main">

            <div id="notFound-settings" class="content" role="main">

                <div class="col-md-12">

                    <g:if test="${flash.error}">
                        <div class="alert alert-danger fade in message" role="status">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            ${flash.error}
                        </div>
                    </g:if>

                    <div class="col-md-offset-4 col-md-4">
                        <div class="btn-group btn-group-justified">
                            <a href="${createLink(uri: '/')}" class="btn btn-primary">Return to Dashboard</a>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </body>
</html>
