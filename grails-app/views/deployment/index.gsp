<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main">
    </head>

    <body>

        <h3 class="page-header">
            <g:if test="${type == 'snapshot'}">
                <g:message code="deployment.snapshot.title" default="Snapshot Deployment"/>
            </g:if>
            <g:elseif test="${type == 'version'}">
                <g:message code="deployment.version.title" default="Version Deployment"/>
            </g:elseif>
            <g:else>
                Application Deployment
            </g:else>
        </h3>

        <div id="page-body" role="main">

            <div id="app-deployment" class="content" role="main">

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

                <g:form class="form-horizontal" role="form" url="[controller: 'deployment', action: 'deploy']" method="POST">

                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-5">
                            <div class="checkbox">
                                <label>
                                    <g:checkBox id="onlyChanged" name="onlyChanged"></g:checkBox> Only changed
                                </label>
                            </div>
                            <span class="help-block">Select to deploy only versions that have changed.</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="applicationId" class="col-md-2 control-label">
                            <g:message code="deployment.application.label" default="Application"/>
                        </label>
                        <div class="col-md-5">
                            <g:select id="applicationId" from="" name="applicationId" class="form-control"
                                      noSelection="['':'-select an application-']" required=""/>
                            <span class="help-block">The Application that is going to be deployed.</span>
                            <g:hiddenField id="application" name="application"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="processId" class="col-md-2 control-label">
                            <g:message code="deployment.processes.label" default="Process"/>
                        </label>
                        <div class="col-md-5">
                            <g:select id="processId" from="" name="processId" class="form-control"
                                      noSelection="['':'-select an application-']" required=""/>
                            <span class="help-block">The Application Process that is going to be used for deployment.</span>
                            <g:hiddenField id="process" name="process"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="environmentId" class="col-md-2 control-label">
                            <g:message code="deployment.environment.label" default="Environment"/>
                        </label>
                        <div class="col-md-5">
                            <g:select id="environmentId" from="" name="environmentId" class="form-control"
                                      noSelection="['':'-select an application-']" required=""/>
                            <span class="help-block">The Application Environment that is going to be deployed to.</span>
                            <g:hiddenField id="environment" name="environment"/>
                        </div>

                    </div>

                    <g:if test="${type == 'snapshot'}">

                        <div class="form-group">
                            <label for="snapshotId" class="col-md-2 control-label">
                                <g:message code="deployment.snapshot.label" default="Snapshot"/>
                            </label>
                            <div class="col-md-5">
                                <g:select id="snapshotId" from="" name="snapshotId" class="form-control"
                                          noSelection="['':'-select an environment-']" required=""/>
                                <span class="help-block">The Application Snapshot that is going to be deployed.</span>
                                <g:hiddenField id="snapshot" name="snapshot"/>
                            </div>
                        </div>

                    </g:if>
                    <g:elseif test="${type == 'version'}">


                    </g:elseif>

                    <div class="form-group">
                        <div class="col-md-offset-2 col-md-5">
                            <g:actionSubmit action="deploy" class="save btn btn-success"
                                            value="${message(code: 'default.button.deploy.label', default: 'Deploy')}"/>
                        </div>
                    </div>

                </g:form>
            </div>

        </div>

        <script id="applications-template" type="text/x-handlebars-template">
            <option disabled></option>
            {{#this}}
            <option value="{{id}}">{{name}}</option>
            {{/this}}
        </script>

        <script id="processes-template" type="text/x-handlebars-template">
            <option disabled></option>
            {{#this}}
            <option value="{{id}}">{{name}}</option>
            {{/this}}
        </script>

        <script id="environments-template" type="text/x-handlebars-template">
            <option disabled></option>
            {{#this}}
            <option value="{{id}}">{{name}}</option>
            {{/this}}
        </script>

        <script id="snapshots-template" type="text/x-handlebars-template">
            <option disabled></option>
            {{#this}}
            <option value="{{id}}">{{name}}</option>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-deployment.js"/>
        <script>
            $(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.Deployment.init(automationSettings);
            });
        </script>
    </body>
</html>
