<%@ page import="com.serena.radar.CloudProvider" %>

<div class="row">
    <div class="form-group col-xs-8 ${hasErrors(bean: cloudProviderInstance, field: 'name', 'error')} required">
        <div class="col-xs-3">
            <label for="name">
                <g:message code="cloudProvider.name.label" default="Name" />
                <span class="required-indicator">*</span>
            </label>
        </div>
        <div class="col-xs-4">
            <g:textField name="name" value="${cloudProviderInstance?.name}" class="form-control" required="" placeholder="Name"/>
        </div>
    </div>
</div>

<div class="row">
    <div class="form-group col-xs-8 ${hasErrors(bean: cloudProviderInstance, field: 'description', 'error')}">
        <div class="col-xs-3">
            <label for="description">
                <g:message code="cloudProvider.description.label" default="Description" />
                <span class="required-indicator">*</span>
            </label>
        </div>
        <div class="col-xs-4">
            <g:textArea name="description" value="${cloudProviderInstance?.name}" class="form-control"/>
        </div>
    </div>
</div>

<div class="row">
    <div class="form-group col-xs-8 ${hasErrors(bean: cloudProviderInstance, field: 'connector', 'error')}">
        <div class="col-xs-3">
            <label for="name">
                <g:message code="cloudProvider.connector.label" default="Connector" />
            </label>
        </div>
        <div class="col-xs-4">
            <ul class="one-to-many">
                <g:each in="${cloudProviderInstance?.connector?}" var="c">
                    <li><g:link controller="cloudConnector" action="show" id="${c.id}">${c?.encodeAsHTML()}</g:link></li>
                </g:each>
                <li class="add">
                    <g:link controller="cloudConnector" action="create" params="['cloudProvider.id': cloudProviderInstance?.id]">${message(code: 'default.add.label', args: [message(code: 'cloudConnector.label', default: 'CloudConnector')])}</g:link>
                </li>
        </div>
    </div>
</div>


