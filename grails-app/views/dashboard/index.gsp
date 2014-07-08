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
            <h3 class="sub-header">Statistics</small></h3>

            <div class="row placeholders">
                <div id="appStats" class="col-xs-6 col-sm-3 placeholder-s">
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
                <div id="envStats" class="col-xs-6 col-sm-3 placeholder-s">
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
                <div id="resourceStats" class="col-xs-6 col-sm-3 placeholder-s">
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
                <div id="userStats" class="col-xs-6 col-sm-3 placeholder-s">
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

            <h3 class="sub-header">Recent Activity <small>(last 30 days)</small></h3>

            <div class="row placeholders">
                <div id="successStatus" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Successful Deployments</h4>
                    <span class="text-muted">loading...</span>
                </div>
                <div id="failureStatus" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Failed Deployments</h4>
                    <span class="text-muted">loading...</span>
                </div>
                <div id="appStatus" class="col-xs-6 col-sm-3 placeholder-m">
                    <h4>Top Applications</h4>
                    <span class="text-muted">loading...</span>
                </div>
                <div id="userStatus" class="col-xs-6 col-sm-3 placeholder-m">
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
                        <th>Started On</th>
                        <th>By</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id="activity-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <div class="modal sraModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    </div>
                    <div class="modal-body sraContent"></div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

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
                        <a class="sraMore small-box-footer" data-toggle="modal" data-target=".sraModal" href="${settingsInstance.sraUrl}/#componentProcessRequest/{{componentProcessRequest.id}}">
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
                        <a class="sraMore" data-toggle="modal" data-target=".sraModal" href="${settingsInstance.sraUrl}/#applicationProcessRequest/{{applicationProcessRequest.id}}">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </td>
                {{/if}}
            </tr>
            {{/this}}
        </script>

        <script id="dep-template" type="text/x-handlebars-template">
            <div id="{{id}}" data-dimension="200" data-text="{{text}}" data-info="{{info}}"
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
