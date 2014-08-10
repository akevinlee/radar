<%@ page import="com.serena.radar.CloudConnector" %>



<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'name', 'error')} required">
	<label for="name">
		<g:message code="cloudConnector.name.label" default="Name" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="name" required="" value="${cloudConnectorInstance?.name}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'provider', 'error')} required">
	<label for="provider">
		<g:message code="cloudConnector.provider.label" default="Provider" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="provider" name="provider.id" from="${com.serena.radar.CloudProvider.list()}" optionKey="id" required="" value="${cloudConnectorInstance?.provider?.id}" class="many-to-one"/>

</div>

