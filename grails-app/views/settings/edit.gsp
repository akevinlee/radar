<%@ page import="com.serena.radar.Settings" %>
<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main">
        <g:set var="entityName" value="${message(code: 'setting.edit', default: 'Settings')}"/>
        <title><g:message code="setting.title"/></title>
    </head>

    <body>

        <div id="page-body" role="main">
            <div id="edit-settings" class="content scaffold-edit" role="main">
                <h1><g:message code="setting.edit"/></h1>
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
                <g:hasErrors bean="${settingsInstance}">
                    <div class="alert alert-danger fade in message" role="status">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <g:eachError bean="${settingsInstance}" var="error">
                            <p <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message
                                    error="${error}"/></p>
                        </g:eachError>
                    </div>
                </g:hasErrors>
                <g:form role="form" url="[resource: settingsInstance, action: 'update']" method="PUT">
                    <g:hiddenField name="version" value="${settingsInstance?.version}"/>

                    <div class="row">
                        <div class="form-group col-md-8 ${hasErrors(bean: settingsInstance, field: 'autoUrl', 'error')} ">
                            <div class="col-md-3">
                                <label for="autoUrl">
                                    <g:message code="setting.autoUrl.label" default="Automation Server URL"/>
                                    <span class="required-indicator">*</span>
                                </label>
                            </div>
                            <div class="col-md-4">
                                <g:textField name="autoUrl" value="${settingsInstance?.autoUrl}" class="form-control" required="" placeholder="URL"/>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="form-group col-md-8 ${hasErrors(bean: settingsInstance, field: 'refreshInterval', 'error')} required">
                            <div class="col-md-3">
                                <label for="refreshInterval">
                                    <g:message code="setting.refreshInterval.label" default="Refresh Interval"/>
                                    <span class="required-indicator">*</span>
                                </label>
                            </div>
                            <div class="col-md-2">
                                <g:field name="refreshInterval" type="number" value="${settingsInstance.refreshInterval}" required="" class="form-control" />
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-4">
                            <g:actionSubmit action="update" class="save btn btn-success"
                                value="${message(code: 'default.button.save.label', default: 'Save')}"/>
                        </div>
                    </div>
                </g:form>
            </div>

        </div>
    </body>
</html>
