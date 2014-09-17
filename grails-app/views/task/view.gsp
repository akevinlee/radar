<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="layout" content="main"/>
    </head>
    <body>
        <div id="task-dashboard" role="main">

            <g:if test="${flash.message}">
                <div class="alert alert-success fade in message row" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <p class="text-center">${flash.message}</p>
                </div>
            </g:if>

            <g:if test="${flash.error}">
                <div class="alert alert-danger fade in message row" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <p class="text-center">${flash.error}</p>
                </div>
            </g:if>

            <h3 class="sub-header">My Tasks</h3>
            <div class="table-responsive">
                <table id="tasks" class="table table-striped table-hover table-responsive">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Started</th>
                        <th>Requestor</th>
                        <th>Snapshot/Version</th>
                        <th>Environment/Resource</th>
                        <th>Target</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody id="task-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <script id="task-template" type="text/x-handlebars-template">
            {{#this}}
            <tr id="{{id}}">
                {{#eq type "approval"}}
                    <td>{{name}}</td>
                    <td>{{prettifyDate startDate}}</td>
                    <td>{{approval.startedBy}}</td>
                    <td></td>
                    <td>{{environment.name}}</td>
                    <td>{{environment.name}}</td>
                {{/eq}}
                {{#eq type "componentTask"}}
                    <td>{{name}}</td>
                    <td>{{prettifyDate startDate}}</td>
                    <td>{{componentProcessRequest.userName}}</td>
                    <td>
                        {{#if componentProcessRequest.snapshot}}
                            {{componentProcessRequest.snapshot.name}}
                        {{/if}}
                        {{#if componentProcessRequest.version}}
                            {{componentProcessRequest.version.name}}
                        {{/if}}
                    </td>
                    <td>{{componentProcessRequest.resource.name}}</td>
                    <td>Component Process Request</td>
                {{/eq}}
                <td class="text-left">
                    <a href="/radar/task/approve/{{id}}" data-toggle="tooltip"
                       data-toggle="modal" data-target="#commentModal"
                       title="Approve/Complete Task"
                       class="autoMore small-box-footer text-success">
                        <span class="glyphicon glyphicon glyphicon-ok-sign"></span>
                    </a>
                    &nbsp;
                    <a href="/radar/task/reject/{{id}}" data-toggle="tooltip"
                       data-toggle="modal" data-target="#commentModal"
                       title="Reject/Fail Task"
                       class="autoMore small-box-footer text-danger">
                        <span class="glyphicon glyphicon-remove-sign"></span>
                    </a>
                </td>
            </tr>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-tasks.js"/>
        <script>
            $(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    autoUrl: "${session.autoUrl}",
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.Tasks.init(automationSettings);
                _.delay(function () {
                    jQuery(".alert").alert('close');
                }, 5000);
            });
        </script>
    </body>
</html>
