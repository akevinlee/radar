<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'cloudProvider.label', default: 'CloudProvider')}" />
		<title><g:message code="default.create.label" args="[entityName]" /></title>
	</head>

	<body>
        <div id="page-body" role="main">

            <div class="nav" role="navigation">
                <h2 class="pull-left">
                    <g:message code="default.create.label" args="[entityName]" />
                </h2>
                <div class="pull-right">
                    <div class="btn-group">
                        <button class="btn btn-primary">
                            Actions
                        </button>
                        <button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                            <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu pull-right">
                            <g:link action="index">
                                <g:message code="default.list.label" args="[entityName]" />
                            </g:link>
                        </ul>
                    </div>
                </div>
            </div>

            <div id="create-cloudProvider" class="content scaffold-create" role="main">

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

                <g:form role="form" url="[resource:cloudProviderInstance, action:'save']" >
                    <g:render template="form"/>

                    <div class="row">
                        <div class="col-xs-4">
                            <g:submitButton name="create" class="save btn btn-success"
                                            value="${message(code: 'default.button.save.label', default: 'Save')}"/>
                        </div>
                    </div>

                </g:form>

            </div>
        </div>
	</body>
</html>
