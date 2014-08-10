<%@ page import="com.serena.radar.CloudProvider" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'cloudProvider.label', default: 'CloudProvider')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
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
                        <g:link class="btn btn-danger" disabled="disabled">
                            <g:message code="default.delete.label" args="[entityName]" />
                        </g:link>
                    </div>
                </h2>
            </div>

            <div id="list-cloudProvider" class="content scaffold-list" role="main">

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

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <g:sortableColumn property="name" title="${message(code: 'cloudProvider.name.label', default: 'Name')}" />
                                <g:sortableColumn property="description" title="${message(code: 'cloudProvider.description.label', default: 'Description')}" />
                            </tr>
                        </thead>
                        <tbody>
                            <g:each in="${cloudProviderInstanceList}" status="i" var="cloudProviderInstance">
                                <tr>
                                    <td><g:link action="show" id="${cloudProviderInstance.id}">${fieldValue(bean: cloudProviderInstance, field: "name")}</g:link></td>
                                    <td>${fieldValue(bean: cloudProviderInstance, field: "description")}</td>
                                </tr>
                            </g:each>
                        </tbody>
                    </table>
                </div>

                <ul class="pagination">
                    <g:paginate total="${cloudProviderInstanceCount ?: 0}" />
                </ul>
            </div>
        </div>
	</body>
</html>
