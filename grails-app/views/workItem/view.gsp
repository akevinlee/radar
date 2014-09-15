<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="layout" content="main"/>
    </head>
    <body>
        <div id="work-items" role="main">

            <h3 class="sub-header">Work Items</h3>
            <div class="table-responsive">
                <table id="work-items" class="table table-striped">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Started</th>
                        <th>Requestor</th>
                        <th>Snapshot/Version</th>
                        <th>Environment/Resource</th>
                        <th>Target</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id="work-item-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <script id="work-item-template" type="text/x-handlebars-template">
            {{#this}}
            <tr id="{{id}}">
                <td>{{name}}</td>
                <td>{{prettifydate started}}</td>
                <td>{{user}}</td>
                <td>{{version}}</td>
                <td>{{environment}}</td>
                <td>{{target}}</td>
                <td>
                    <a class="sraMore small-box-footer" data-toggle="modal" data-target=".sraModal" href="${session.autoUrl}/#resource/{{id}}">
                        More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                    </a>
                </td>
                {{/compare}}
            </tr>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-workitems.js"/>
        <script>
            $(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.WorkItems.init(automationSettings);
            });
        </script>
    </body>
</html>
