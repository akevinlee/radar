<%@ page import="com.serena.radar.CloudProvider; com.serena.radar.BuildProvider; com.serena.radar.SBMShell; com.serena.radar.UserSettings" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <g:set var="entityName" value="${message(code: 'setting.edit', default: 'Settings')}"/>
    <title><g:message code="setting.title"/></title>
</head>

<body>

<h3 class="page-header">
    <g:message code="setting.title"/>
</h3>

<div id="page-body" role="main">

    <div id="edit-settings" class="content" role="main">

        <div class="col-md-9">

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

            <g:hasErrors bean="${userSettingsInstance}">
                <div class="alert alert-danger fade in message" role="status">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <g:eachError bean="${userSettingsInstance}" var="error">
                        <p <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message
                                error="${error}"/></p>
                    </g:eachError>
                </div>
            </g:hasErrors>

            <g:form class="form-horizontal" role="form" url="[resource:userSettingsInstance, action:'update']" method="PUT" >

                <g:hiddenField name="version" value="${userSettingsInstance?.version}"/>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'autoUrl', 'error')}">
                    <label for="autoUrl"  class="col-md-3 control-label">
                        <g:message code="setting.autoUrl.label" default="Automation Server URL"/>
                        <span class="required-indicator">*</span>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="autoUrl" value="${userSettingsInstance?.autoUrl}"
                                     class="form-control" required="" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'sbmUrl', 'error')}">
                    <label for="sbmUrl"  class="col-md-3 control-label">
                        <g:message code="setting.sbmUrl.label" default="SBM Server URL"/>
                        <span class="required-indicator">*</span>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="sbmUrl" value="${userSettingsInstance?.sbmUrl}"
                                     class="form-control" required="" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'sbmReleaseReport', 'error')}">
                    <label for="sbmReleaseReport"  class="col-md-3 control-label">
                        <g:message code="setting.sbmReleaseReport.label" default="SBM Release Report"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="sbmReleaseReport" value="${userSettingsInstance?.sbmReleaseReport}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'sbmShell', 'error')}">
                    <label for="sbmShell"  class="col-md-3 control-label">
                        <g:message code="setting.sbmShell.label" default="SBM Shell"/>
                    </label>
                    <div class="col-md-3">
                        <g:select name="sbmShell" from="${SBMShell.values()}" class="form-control"
                                  value="${SBMShell}" optionKey="key" />
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'buildProvider', 'error')}">
                    <label for="buildProvider"  class="col-md-3 control-label">
                        <g:message code="setting.buildProvider.label" default="Build Provider"/>
                    </label>
                    <div class="col-md-3">
                        <g:select name="buildProvider" from="${BuildProvider.values()}" class="form-control"
                                  value="${BuildProvider}" optionKey="key" />
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'buildUrl', 'error')}">
                    <label for="buildUrl" class="col-md-3 control-label">
                        <g:message code="setting.buildUrl.label" default="Build Server URL"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="jenkinsUrl" value="${userSettingsInstance?.buildUrl}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'buildUsername', 'error')}">
                    <label for="buildUsername" class="col-md-3 control-label">
                        <g:message code="setting.buildUsername.label" default="Build Server Username"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="buildUsername" value="${userSettingsInstance?.buildUsername}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'buildToken', 'error')}">
                    <label for="buildToken" class="col-md-3 control-label">
                        <g:message code="setting.buildToken.label" default="Build Server API Token"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="buildToken" value="${userSettingsInstance?.buildToken}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'cloudProvider', 'error')}">
                    <label for="buildProvider"  class="col-md-3 control-label">
                        <g:message code="setting.cloudProvider.label" default="Cloud Provider"/>
                    </label>
                    <div class="col-md-3">
                        <g:select name="cloudProvider" from="${CloudProvider.values()}" class="form-control"
                                  value="${CloudProvider}" optionKey="key" />
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'cloudUsername', 'error')}">
                    <label for="buildUsername" class="col-md-3 control-label">
                        <g:message code="setting.cloudUsername.label" default="Cloud Provider Username"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="cloudUsername" value="${userSettingsInstance?.cloudUsername}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'cloudToken', 'error')}">
                    <label for="cloudToken" class="col-md-3 control-label">
                        <g:message code="setting.cloudToken.label" default="Cloud Provider API Token"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="cloudToken" value="${userSettingsInstance?.cloudToken}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingsInstance, field: 'refreshInterval', 'error')} required">
                    <label for="refreshInterval" class="col-md-3 control-label">
                        <g:message code="setting.refreshInterval.label" default="Refresh Interval"/>
                        <span class="required-indicator">*</span>
                    </label>
                    <div class="col-md-2">
                        <g:field name="refreshInterval" type="number" value="${userSettingsInstance?.refreshInterval}"
                                 required="" class="form-control" />
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-md-offset-3 col-md-7">
                        <g:actionSubmit action="update" class="save btn btn-success"
                                        value="${message(code: 'default.button.save.label', default: 'Save')}"/>
                    </div>
                </div>
            </g:form>
        </div>

        <div class="col-md-3">
        </div>

    </div>

</div>
</body>
</html>
