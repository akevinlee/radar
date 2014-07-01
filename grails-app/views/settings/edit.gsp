<%@ page import="com.serena.radar.Settings" %>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <r:require modules="bootstrap"/>
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
                    <div class="form-group col-xs-8 ${hasErrors(bean: settingsInstance, field: 'sraUrl', 'error')} ">
                        <div class="col-xs-3">
                            <label for="sraUrl">
                                <g:message code="setting.sraUrl.label" default="SRA URL"/>
                                <span class="required-indicator">*</span>
                            </label>
                        </div>
                        <div class="col-xs-4">
                            <g:textField name="sraUrl" value="${settingsInstance?.sraUrl}" class="form-control" required="" placeholder="URL"/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-xs-8 ${hasErrors(bean: settingsInstance, field: 'sraUsername', 'error')} ">
                        <div class="col-xs-3">
                            <label for="sraUsername">
                                <g:message code="setting.sraUsername.label" default="SRA Username"/>
                                <span class="required-indicator">*</span>
                            </label>
                        </div>
                        <div class="col-xs-4">
                            <g:textField name="sraUsername" value="${settingsInstance?.sraUsername}" class="form-control" required="" placeholder="Username"/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-xs-8 ${hasErrors(bean: settingsInstance, field: 'sraPassword', 'error')} ">
                        <div class="col-xs-3">
                            <label for="sraPassword">
                                <g:message code="setting.sraPassword.label" default="SRA Password"/>
                            </label>
                        </div>
                        <div class="col-xs-4 ">
                            <g:passwordField name="sraPassword" value="${settingsInstance?.sraPassword}" class="form-control" placeholder="Password"/>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-xs-8">
                        <div class="col-xs-3 col-xs-push-3">
                            <div class="checkbox ${hasErrors(bean: settingsInstance, field: 'useSSO', 'error')} ">
                                <label>
                                    <g:checkBox name="useSSO" value="${settingsInstance?.useSSO}"/> <g:message code="setting.useSSO.label" default="Use SSO"/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="form-group col-xs-8 ${hasErrors(bean: settingsInstance, field: 'refreshInterval', 'error')} required">
                        <div class="col-xs-3">
                            <label for="refreshInterval">
                                <g:message code="setting.refreshInterval.label" default="Refresh Interval"/>
                                <span class="required-indicator">*</span>
                            </label>
                        </div>
                        <div class="col-xs-2">
                            <g:field name="refreshInterval" type="number" value="${settingsInstance.refreshInterval}" required="" class="form-control" />
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-xs-4">
                        <g:actionSubmit action="update" class="save btn btn-success"
                            value="${message(code: 'default.button.save.label', default: 'Save')}"/>
                        <g:actionSubmit action="validate" class="save btn btn-info"
                                        value="${message(code: 'default.button.validate.label', default: 'Validate')}"/>
                    </div>
                </div>
            </g:form>
        </div>

    </div>
</body>
</html>