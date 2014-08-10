<%@ page import="com.serena.radar.CloudProvider" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'cloudProvider.label', default: 'CloudProvider')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>

	<body>

        <div id="page-body" role="main">

            <div class="nav" role="navigation">
                <h2>
                    <span class="glyphicon glyphicon-cloud"></span>
                    <g:message code="default.list.label" args="[entityName]" />
                    <div class="btn-group pull-right">
                        <g:link action="create" class="btn btn-primary">
                            <g:message code="default.new.label" args="[entityName]" />
                        </g:link>
                        <g:link action="index" class="btn btn-primary pull-right">
                            <g:message code="default.list.label" args="[entityName]" />
                        </g:link>
                    </div>
                </h2>
            </div>

            <div id="show-cloudProvider" class="content scaffold-show" role="main">

                <g:if test="${flash.message}">
                    <div class="alert alert-success fade in message" role="status">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        ${flash.message}
                    </div>
                </g:if>

                <g:if test="${flash.error}">
                    <div class="alert alert-danger fade in message" role="status">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        ${flash.error}
                    </div>
                </g:if>

                <g:form role="form">
                    <fieldset disabled>
                        <g:render template="form"/>
                    </fieldset>
                </g:form>

                <g:form role="form" url="[resource:cloudProviderInstance, action:'delete']" method="DELETE">
                    <div class="row">
                        <div class="col-xs-4">
                            <g:link class="edit btn btn-primary" action="edit" resource="${cloudProviderInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
                            <g:actionSubmit class="delete btn btn-danger" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
                        </div>
                    </div>
                </g:form>
            </div>
        </div>
	</body>
</html>
