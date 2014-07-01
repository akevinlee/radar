<%@ page import="com.serena.radar.Settings" %>

<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main"/>
        <r:require modules="bootstrap"/>
		<title>Serena RAdAR</title>
	</head>
	<body>
		<div id="app" role="main">
            <h1 class="page-header">Home</h1>

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

            <div id="main">
                <div id="app-list"></div>
            </div>

            <h2 class="sub-header">Recent Activity</h2>
            <div class="table-responsive">
                <table id="activity" class="table table-striped">
                    <thead>
                    <tr>
                        <th>Application</th>
                        <th>Environment</th>
                        <th>Date</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>

    <script id="app-template" type="text/x-handlebars-template">
        {{#this}}
        <div class="panel panel-default">
            <div class="panel-heading">
                <a href="/applications/{{id}}">{{name}}</a>
            </div>
            <div class="panel-body">
                <div id="env-list-{{id}}"></div>
            </div>
        </div>
        {{/this}}
    </script>

    <script id="app-env-template" type="text/x-handlebars-template">
        {{#this}}
        <div class="col-md-auto">
            <h5>{{name}}</h5>
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>component</th><th>version</th>
                </tr>
                <thead>
                <tbody id="comp-env-list-{{id}}">

                </tbody>
            </table>
        </div>
        {{/this}}
    </script>

    <script id="comp-env-template" type="text/x-handlebars-template">
        {{#this}}
        <tr>
            <td>{{component.name}}</td>
            <td>{{version.name}}</td>
        </tr>
        {{/this}}
    </script>

    <script src="${resource(dir: 'js', file: 'radar-dashboard.js')}" type="text/javascript"></script>
    <script>

        $(document).ready(function () {

            moment().format();
            RADAR.Dashboard.init(
                    "${settingsInstance.sraUrl}",
                    "${settingsInstance.sraUsername}",
                    "${settingsInstance.sraPassword}",
                    ${settingsInstance.useSSO},
                    ${settingsInstance.refreshInterval});
            /*$('#activity').activity({
                debug: true,
                sraUrl: "${settingsInstance.sraUrl}",
                sraUsername: "${settingsInstance.sraUsername}",
                sraPassword: "${settingsInstance.sraPassword}",
                useSSO: ${settingsInstance.useSSO},
                refreshInterval: ${settingsInstance.refreshInterval}
            });*/


        });
    </script>
	</body>
</html>
