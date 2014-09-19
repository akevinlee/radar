<%@ page import="com.serena.radar.BuildProvider; com.serena.radar.UserSetting" %>

<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main">
    </head>

    <body>

        <h3 class="page-header">
            <g:message code="build.title" default="Build Job"/>
        </h3>

        <div id="page-body" role="main">

            <div id="build-jobs" class="content" role="main">

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

                    <g:form class="form-horizontal" role="form" url="[controller: 'build', action: 'submit']" method="POST">

                        <div class="form-group">
                            <label for="job" class="col-md-2 control-label">
                                <g:message code="build.job.label" default="Job Name"/>
                            </label>
                            <div class="col-md-7">
                                <g:select id="job" from="" name="job" class="form-control"
                                          noSelection="['':'- select a job -']" required=""/>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-7">
                                <div class="panel panel-default">
                                    <div class="panel-heading">Parameters</div>
                                    <table id="parameters" class="table table-striped">
                                        <tbody>
                                        <tr><td>- select a job -</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-7">
                                <g:actionSubmit action="submit" class="save btn btn-success"
                                                value="${message(code: 'default.button.build.label', default: 'Build')}"/>
                            </div>
                        </div>

                    </g:form>
                </div>

                <div class="col-md-3">
                </div>

            </div>

        </div>

        <script id="options-template" type="text/x-handlebars-template">
            <option disabled></option>
            {{#this}}
            <option value="{{name}}">{{name}}</option>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-buildjob.js"/>
        <script>
            jQuery(document).ready(function () {
                var jobSettings = {
                    debug: true,
                    buildUrl: "${userSettingInstance?.buildUrl}",
                    job: "${job}"
                };
                RADAR.BuildJob.init(jobSettings);
            });
        </script>
    </body>
</html>
