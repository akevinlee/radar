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
            <h2 class="sub-header">Recent Activity <small>(last 30 days)</small></h2>

            <div class="row placeholders">
                <div id="pieStatus" class="col-xs-6 col-sm-3 placeholder">
                    <h4>Status</h4>
                    <span class="text-muted">Deployment Status</span>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder">
                </div>
                <div class="col-xs-6 col-sm-3 placeholder">
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
                    <td>{{componentProcessRequest.submittedTime}}</td>
                    <td>{{componentProcessRequest.userName}}</td>
                {{/if}}
                {{#if applicationProcess}}
                    <td>Application</td>
                    <td>{{application.name}}</td>
                    <td>{{environment.name}}</td>
                    <td>{{snapshot.name}}</td>
                    <td>{{applicationProcess.name}}</td>
                    <td>{{applicationProcessRequest.submittedTime}}</td>
                    <td>{{applicationProcessRequest.userName}}</td>
                {{/if}}
            </tr>
            {{/this}}
        </script>

        <script src="${resource(dir: 'js', file: 'radar-dashboard.js')}" type="text/javascript"></script>
        <script>

            $(document).ready(function () {

                RADAR.Dashboard.init(sraSettings);

            });
        </script>
	</body>
</html>
