<%@ page import="com.serena.radar.CloudConnector" %>



<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'name', 'error')} required">
	<label for="name">
		<g:message code="cloudConnector.name.label" default="Name" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="name" required="" value="${cloudConnectorInstance?.name}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'description', 'error')} required">
	<label for="description">
		<g:message code="cloudConnector.description.label" default="Description" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="description" required="" value="${cloudConnectorInstance?.description}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'procCreateId', 'error')} required">
	<label for="procCreateId">
		<g:message code="cloudConnector.procCreateId.label" default="Proc Create Id" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="procCreateId" required="" value="${cloudConnectorInstance?.procCreateId}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'procDeleteId', 'error')} required">
	<label for="procDeleteId">
		<g:message code="cloudConnector.procDeleteId.label" default="Proc Delete Id" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="procDeleteId" required="" value="${cloudConnectorInstance?.procDeleteId}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'procStartId', 'error')} required">
	<label for="procStartId">
		<g:message code="cloudConnector.procStartId.label" default="Proc Start Id" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="procStartId" required="" value="${cloudConnectorInstance?.procStartId}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'procStopId', 'error')} required">
	<label for="procStopId">
		<g:message code="cloudConnector.procStopId.label" default="Proc Stop Id" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="procStopId" required="" value="${cloudConnectorInstance?.procStopId}"/>

</div>

<div class="fieldcontain ${hasErrors(bean: cloudConnectorInstance, field: 'provider', 'error')} required">
	<label for="provider">
		<g:message code="cloudConnector.provider.label" default="Provider" />
		<span class="required-indicator">*</span>
	</label>
	<g:select name="provider" from="${com.serena.radar.CloudProvider?.values()}" keys="${com.serena.radar.CloudProvider.values()*.name()}" required="" value="${cloudConnectorInstance?.provider?.name()}" />

</div>

