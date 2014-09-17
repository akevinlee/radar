<%@ page import="com.serena.radar.BuildProvider; com.serena.radar.UserSetting" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <g:set var="entityName" value="${message(code: 'setting.edit', default: 'Settings')}"/>
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

            <g:hasErrors bean="${userSettingInstance}">
                <div class="alert alert-danger fade in message" role="status">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <g:eachError bean="${userSettingInstance}" var="error">
                        <p <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message
                                error="${error}"/></p>
                    </g:eachError>
                </div>
            </g:hasErrors>

            <g:form class="form-horizontal" role="form" url="[resource:userSettingInstance, action:'update']" method="PUT" >

                <g:hiddenField name="version" value="${userSettingInstance?.version}"/>

                <div class="form-group ${hasErrors(bean: userSettingInstance, field: 'autoUrl', 'error')}">
                    <label for="autoUrl"  class="col-md-3 control-label">
                        <g:message code="setting.autoUrl.label" default="Automation Server URL"/>
                        <span class="required-indicator">*</span>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="autoUrl" value="${userSettingInstance?.autoUrl}"
                                     class="form-control" required="" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingInstance, field: 'buildUrl', 'error')}">
                    <label for="buildUrl" class="col-md-3 control-label">
                        <g:message code="setting.buildUrl.label" default="Build Server URL"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="buildUrl" value="${userSettingInstance?.buildUrl}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingInstance, field: 'buildUsername', 'error')}">
                    <label for="buildUsername" class="col-md-3 control-label">
                        <g:message code="setting.buildUsername.label" default="Build Server Username"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="buildUsername" value="${userSettingInstance?.buildUsername}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingInstance, field: 'buildToken', 'error')}">
                    <label for="buildToken" class="col-md-3 control-label">
                        <g:message code="setting.buildToken.label" default="Build Server API Token"/>
                    </label>
                    <div class="col-md-7">
                        <g:textField name="buildToken" value="${userSettingInstance?.buildToken}"
                                     class="form-control" placeholder=""/>
                    </div>
                </div>

                <div class="form-group ${hasErrors(bean: userSettingInstance, field: 'refreshInterval', 'error')} required">
                    <label for="refreshInterval" class="col-md-3 control-label">
                        <g:message code="setting.refreshInterval.label" default="Refresh Interval"/>
                        <span class="required-indicator">*</span>
                    </label>
                    <div class="col-md-2">
                        <g:field name="refreshInterval" type="number" value="${userSettingInstance?.refreshInterval}"
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
