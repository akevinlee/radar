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
                        <a target="_blank" href="${settingsInstance.sraUrl}/#main/applications" class="sraMore small-box-footer">
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
                        <a target="_blank" href="${settingsInstance.sraUrl}/#main/components" class="sraMore small-box-footer">
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
                        <a target="_blank" href="${settingsInstance.sraUrl}/#main/globalEnvironments" class="sraMore small-box-footer">
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
                        <a target="_blank" href="${settingsInstance.sraUrl}/#resources" class="sraMore small-box-footer">
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
                        <a target="_blank" href="${settingsInstance.sraUrl}/#agents" class="sraMore small-box-footer">
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
                        <a target="_blank" href="${settingsInstance.sraUrl}/#" class="sraMore small-box-footer">
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
                    <div class="modal-body sraContent">
                        <iframe frameborder="0"></iframe>
                    </div>
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
            <div style="float: none; margin: 0 auto;" id="{{id}}" data-dimension="200"
                 data-text="{{text}}" data-info="{{info}}" data-width="30" data-fontsize="30"
                 data-total="{{total}}" data-part="{{part}}" data-type="full"
                 data-fgcolor="{{fgcolor}}" data-bgcolor="{{bgcolor}}"data-fill="{{fillcolor}}"
                 data-animationstep="5"></div>
        </script>

        <script src="${resource(dir: 'js', file: 'radar-dashboard.js')}" type="text/javascript"></script>
        <script>

            $(document).ready(function () {
                var sraSettings = {
                    debug: true,
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
