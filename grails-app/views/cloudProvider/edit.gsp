<%@ page import="com.serena.radar.CloudProvider" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'cloudProvider.label', default: 'CloudProvider')}" />
		<title><g:message code="default.edit.label" args="[entityName]" /></title>
	</head>

	<body>
        <div id="page-body" role="main">
            <div class="nav" role="navigation">
                <h2>
                    <span class="glyphicon glyphicon-cloud"></span>
                    <g:message code="default.show.label" args="[entityName]" />
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

            <div id="edit-cloudProvider" class="content scaffold-edit" role="main">

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

                <g:hasErrors bean="${cloudProviderInstance}">
                    <div class="alert alert-danger fade in message" role="status">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <g:eachError bean="${cloudProviderInstance}" var="error">
                            <p <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message
                                    error="${error}"/></p>
                        </g:eachError>
                    </div>
                </g:hasErrors>

                <g:form role="form" url="[resource:cloudProviderInstance, action:'update']" method="PUT" >
                    <g:hiddenField name="version" value="${cloudProviderInstance?.version}" />
                    <g:render template="form"/>

                    <div class="row">
                        <div class="col-xs-4">
                            <g:submitButton name="update" class="save btn btn-success"
                                            value="${message(code: 'default.button.update.label', default: 'Update')}"/>
                        </div>
                    </div>

                </g:form>

            </div>
        </div>
	</body>
</html>
