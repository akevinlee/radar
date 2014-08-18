<!DOCTYPE html>
<html lang="en">
	<head>
        <g:if test="${fullscreen}">
            <meta name="layout" content="basic"/>
            <asset:stylesheet src="fullscreen.css"/>
        </g:if>
        <g:else>
            <meta name="layout" content="main"/>
        </g:else>
	</head>
	<body>
		<div id="dashboard" role="main">

            <g:if test="${flash.message}">
                <div class="alert alert-success fade in message row" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <p>${flash.message}</p>
                </div>
            </g:if>

            <g:if test="${flash.error}">
                <div class="alert alert-danger fade in message row" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <p>${flash.error}</p>
                </div>
            </g:if>

            <h3 class="sub-header">Statistics</small></h3>

            <div id="stats" class="row placeholders">
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="app-stats" class="hidden small-box bg-aqua">
                        <div class="inner">
                            <h3 id="app-count">
                                0
                            </h3>
                            <p>
                                Applications
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-phone"></span>
                        </div>
                        <a href="${createLink(action:"view", controller:"applications")}" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                    <div id="comp-stats" class="small-box bg-blue">
                        <div class="inner">
                            <h3 id="comp-count">
                                0
                            </h3>
                            <p>
                                Components
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-phone"></span>
                        </div>
                        <a href="${createLink(action:"view", controller:"components")}" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="global-env-stats" class="small-box bg-yellow">
                        <div class="inner">
                            <h3 id="env-count">
                                0
                            </h3>
                            <p>
                                Global Environments
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-hdd"></span>
                        </div>
                        <a href="${createLink(action:"view", controller:"environments")}" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="resource-stats" class="hidden small-box bg-red">
                        <div class="inner">
                            <h3>
                                <span id="online-resource-count">0</span> / <span id="offline-resource-count" class="bg-white text-red">0</span>
                            </h3>
                            <p>
                                Online / <span class="bg-white text-red">Offline</span> Resources
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-tasks"></span>
                        </div>
                        <a href="${createLink(action:"view", controller:"resources")}" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                    <div id="agent-stats" class="small-box bg-maroon">
                        <div class="inner">
                            <h3>
                                <span id="online-agent-count">0</span> / <span id="offline-agent-count" class="bg-white text-red">0</span>
                            </h3>
                            <p>
                                Online / <span class="bg-white text-red">Offline</span> Agents
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-tasks"></span>
                        </div>
                        <a href="${createLink(action:"view", controller:"agents")}" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="approval-stats" class="small-box bg-green">
                        <div class="inner">
                            <h3>
                                <span id="approval-count">0</span> / <span id="rejected-count" class="bg-white text-red">0</span>
                            </h3>
                            <p>
                                Approvals Waiting / <span class="bg-white text-red">Rejected</span>
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-tasks"></span>
                        </div>
                        <a href="${createLink(action:"view", controller:"workitems")}" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
            </div>

            <h3 class="sub-header">Recent Activity <small>(last 30 days)</small></h3>

            <div class="row placeholders">
                <div id="success-status" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Successful Deployments</h4>
                    <span class="text-muted">loading...</span>
                </div>
                <div id="failure-status" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Failed Deployments</h4>
                    <span class="text-muted">loading...</span>
                </div>
                <div id="app-status" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Top Applications</h4>
                    <span class="text-muted">loading...</span>
                </div>
                <div id="user-status" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Top Users</h4>
                    <span class="text-muted">loading...</span>
                </div>
            </div>

            <h3 class="sub-header">Current Activity</h3>
            <div class="table-responsive">
                <table id="activity" class="table table-striped">
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Component/Application/Generic</th>
                        <th>Resource/Environment</th>
                        <th>Version/Snapshot</th>
                        <th>Process</th>
                        <th>Started</th>
                        <th>By</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id="activity-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <script id="activity-template" type="text/x-handlebars-template">
            {{#this}}
            <tr id="{{id}}">
                {{#if componentProcess}}
                    <td>Component</td>
                    <td>{{component.name}}</td>
                    <td>{{resource.name}}</td>
                    <td>{{version.name}}</td>
                    <td>{{componentProcess.name}}</td>
                    <td>{{prettifyDate componentProcessRequest.submittedTime}}</td>
                    <td>{{componentProcessRequest.userName}}</td>
                    <td>
                        <a class="autoMore small-box-footer" data-toggle="modal" data-target=".autoModal" href="${session.autoUrl}/#componentProcessRequest/{{componentProcessRequest.id}}">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </td>
                {{/if}}
                {{#if applicationProcess}}
                    <td>Application</td>
                    <td>{{application.name}}</td>
                    <td>{{environment.name}}</td>
                    <td>{{snapshot.name}}</td>
                    <td>{{applicationProcess.name}}</td>
                    <td>{{prettifyDate applicationProcessRequest.submittedTime}}</td>
                    <td>{{applicationProcessRequest.userName}}</td>
                    <td>
                        <a class="autoMore" data-toggle="modal" data-target=".autoModal" href="${session.autoUrl}/#applicationProcessRequest/{{applicationProcessRequest.id}}">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </td>
                {{/if}}
                {{#if genericProcess}}
                    <td>Generic</td>
                    <td>{{genericProcess.name}}</td>
                    <td>{{resource.name}}</td>
                    <td></td>
                    <td>{{genericProcess.name}}</td>
                    <td>{{prettifyDate genericProcessRequest.submittedTime}}</td>
                    <td>{{genericProcessRequest.userName}}</td>
                    <td>
                        <a class="autoMore" data-toggle="modal" data-target=".autoModal" href="${session.autoUrl}/#processRequest/{{genericProcessRequest.id}}">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </td>
                {{/if}}
            </tr>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-dashboard.js"/>
        <script>
            $(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.Dashboard.init(automationSettings);
                _.delay(function () {
                    $(".alert").alert('close');
                }, 5000);
            });
        </script>
	</body>
</html>
