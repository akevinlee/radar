
<%@ page import="com.serena.radar.CloudConnector" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'cloudConnector.label', default: 'CloudConnector')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-cloudConnector" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-cloudConnector" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list cloudConnector">
			
				<g:if test="${cloudConnectorInstance?.name}">
				<li class="fieldcontain">
					<span id="name-label" class="property-label"><g:message code="cloudConnector.name.label" default="Name" /></span>
					
						<span class="property-value" aria-labelledby="name-label"><g:fieldValue bean="${cloudConnectorInstance}" field="name"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${cloudConnectorInstance?.description}">
				<li class="fieldcontain">
					<span id="description-label" class="property-label"><g:message code="cloudConnector.description.label" default="Description" /></span>
					
						<span class="property-value" aria-labelledby="description-label"><g:fieldValue bean="${cloudConnectorInstance}" field="description"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${cloudConnectorInstance?.procCreateId}">
				<li class="fieldcontain">
					<span id="procCreateId-label" class="property-label"><g:message code="cloudConnector.procCreateId.label" default="Proc Create Id" /></span>
					
						<span class="property-value" aria-labelledby="procCreateId-label"><g:fieldValue bean="${cloudConnectorInstance}" field="procCreateId"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${cloudConnectorInstance?.procDeleteId}">
				<li class="fieldcontain">
					<span id="procDeleteId-label" class="property-label"><g:message code="cloudConnector.procDeleteId.label" default="Proc Delete Id" /></span>
					
						<span class="property-value" aria-labelledby="procDeleteId-label"><g:fieldValue bean="${cloudConnectorInstance}" field="procDeleteId"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${cloudConnectorInstance?.procStartId}">
				<li class="fieldcontain">
					<span id="procStartId-label" class="property-label"><g:message code="cloudConnector.procStartId.label" default="Proc Start Id" /></span>
					
						<span class="property-value" aria-labelledby="procStartId-label"><g:fieldValue bean="${cloudConnectorInstance}" field="procStartId"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${cloudConnectorInstance?.procStopId}">
				<li class="fieldcontain">
					<span id="procStopId-label" class="property-label"><g:message code="cloudConnector.procStopId.label" default="Proc Stop Id" /></span>
					
						<span class="property-value" aria-labelledby="procStopId-label"><g:fieldValue bean="${cloudConnectorInstance}" field="procStopId"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${cloudConnectorInstance?.provider}">
				<li class="fieldcontain">
					<span id="provider-label" class="property-label"><g:message code="cloudConnector.provider.label" default="Provider" /></span>
					
						<span class="property-value" aria-labelledby="provider-label"><g:fieldValue bean="${cloudConnectorInstance}" field="provider"/></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form url="[resource:cloudConnectorInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${cloudConnectorInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
