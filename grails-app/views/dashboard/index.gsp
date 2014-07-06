<%@ page import="com.serena.radar.Settings" %>

<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main"/>
        <r:require modules="bootstrap"/>
		<title>Serena RAdAR</title>
	</head>
	<body>
		<div id="dashboard" role="main">
            <h2 class="sub-header">Statistics</small></h2>

            <div class="row placeholders">
                <div id="appStats" class="col-xs-6 col-sm-3 placeholder">
                    <div class="small-box bg-aqua">
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
                        <a href="#" class="small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div id="envStats" class="col-xs-6 col-sm-3 placeholder">
                    <div class="small-box bg-red">
                        <div class="inner">
                            <h3 id="env-count">
                                0
                            </h3>
                            <p>
                                Environments
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-hdd"></span>
                        </div>
                        <a href="#" class="small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div id="resourceStats" class="col-xs-6 col-sm-3 placeholder">
                    <div class="small-box bg-yellow">
                        <div class="inner">
                            <h3 id="resource-count">
                                0
                            </h3>
                            <p>
                                Resources
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-tasks"></span>
                        </div>
                        <a href="#" class="small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div id="userStats" class="col-xs-6 col-sm-3 placeholder">
                    <div class="small-box bg-green">
                        <div class="inner">
                            <h3 id="user-count">
                                0
                            </h3>
                            <p>
                                Users
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-user"></span>
                        </div>
                        <a href="#" class="small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
            </div>

            <h2 class="sub-header">Recent Activity <small>(last 30 days)</small></h2>

            <div class="row placeholders">
                <div id="successStatus" class="col-xs-6 col-sm-3 placeholder">
                </div>
                <div id="failureStatus" class="col-xs-6 col-sm-3 placeholder">
                </div>
                <div id="pieStatus" class="col-xs-6 col-sm-3 placeholder">
                    <h4>Status</h4>
                    <span class="text-muted">Deployment Status</span>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder">
                </div>
            </div>

            <h2 class="sub-header">Current Activity</h2>
            <div class="table-responsive">
                <table id="activity" class="table table-striped">
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Component/Application/Generic</th>
                        <th>Resource/Environment</th>
                        <th>Version/Snapshot</th>
                        <th>Process</th>
                        <th>Started On</th>
                        <th>By</th>
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
                    <td><span data-livestamp="{componentProcessRequest.submittedTime}}.000"></span></td>
                    <td>{{componentProcessRequest.userName}}</td>
                {{/if}}
                {{#if applicationProcess}}
                    <td>Application</td>
                    <td>{{application.name}}</td>
                    <td>{{environment.name}}</td>
                    <td>{{snapshot.name}}</td>
                    <td>{{applicationProcess.name}}</td>
                    <td><span data-livestamp="{{applicationProcessRequest.submittedTime}}.000"></span></td>
                    <td>{{applicationProcessRequest.userName}}</td>
                {{/if}}
            </tr>
            {{/this}}
        </script>

        <script id="dep-template" type="text/x-handlebars-template">
            <div id="{{id}}" data-dimension="200" data-text="{{text}}%" data-info="{{info}}"
            data-width="30" data-fontsize="30" data-total="{{total}}" data-part="{{part}}"
            data-fgcolor="{{fgcolor}}" data-bgcolor="{{bgcolor}}" data-type="full" data-fill="{{fillcolor}}"></div>
        </script>

        <script src="${resource(dir: 'js', file: 'radar-dashboard.js')}" type="text/javascript"></script>
        <script>

            $(document).ready(function () {
                var sraSettings = {
                    sraUrl: "${settingsInstance.sraUrl}",
                    sraUsername: "${settingsInstance.sraUsername}",
                    sraPassword: "${settingsInstance.sraPassword}",
                    useProxy: ${settingsInstance.useProxy},
                    refreshInterval: ${settingsInstance.refreshInterval}
                };
                RADAR.Dashboard.init(sraSettings);
            });
        </script>
	</body>
</html>
