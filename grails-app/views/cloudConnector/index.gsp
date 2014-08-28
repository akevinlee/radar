
<%@ page import="com.serena.radar.CloudConnector" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'cloudConnector.label', default: 'CloudConnector')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#list-cloudConnector" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="list-cloudConnector" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
				<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table>
			<thead>
					<tr>
					
						<g:sortableColumn property="name" title="${message(code: 'cloudConnector.name.label', default: 'Name')}" />
					
						<g:sortableColumn property="description" title="${message(code: 'cloudConnector.description.label', default: 'Description')}" />
					
						<g:sortableColumn property="procCreateId" title="${message(code: 'cloudConnector.procCreateId.label', default: 'Proc Create Id')}" />
					
						<g:sortableColumn property="procDeleteId" title="${message(code: 'cloudConnector.procDeleteId.label', default: 'Proc Delete Id')}" />
					
						<g:sortableColumn property="procStartId" title="${message(code: 'cloudConnector.procStartId.label', default: 'Proc Start Id')}" />
					
						<g:sortableColumn property="procStopId" title="${message(code: 'cloudConnector.procStopId.label', default: 'Proc Stop Id')}" />
					
					</tr>
				</thead>
				<tbody>
				<g:each in="${cloudConnectorInstanceList}" status="i" var="cloudConnectorInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${cloudConnectorInstance.id}">${fieldValue(bean: cloudConnectorInstance, field: "name")}</g:link></td>
					
						<td>${fieldValue(bean: cloudConnectorInstance, field: "description")}</td>
					
						<td>${fieldValue(bean: cloudConnectorInstance, field: "procCreateId")}</td>
					
						<td>${fieldValue(bean: cloudConnectorInstance, field: "procDeleteId")}</td>
					
						<td>${fieldValue(bean: cloudConnectorInstance, field: "procStartId")}</td>
					
						<td>${fieldValue(bean: cloudConnectorInstance, field: "procStopId")}</td>
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${cloudConnectorInstanceCount ?: 0}" />
			</div>
		</div>
	</body>
</html>
