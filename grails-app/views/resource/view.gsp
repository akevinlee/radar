<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="layout" content="main"/>
    </head>
    <body>
        <div id="resource-dashboard" role="main">

            <h3 class="sub-header">Statistics</h3>

            <div class="row placeholders">
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="online-status" class="small-box bg-green">
                        <div class="inner">
                            <h3 id="online-resource-count">
                                0
                            </h3>
                            <p>
                                Online Resources
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-ok-circle"></span>
                        </div>
                        <a target="_blank" href="${session.autoUrl}/#main/resources" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="offline-status" class="small-box bg-red">
                        <div class="inner">
                            <h3 id="offline-resource-count">
                                0
                            </h3>
                            <p>
                                Offline Resources
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-remove-circle"></span>
                        </div>
                        <a target="_blank" href="${session.autoUrl}/#main/resources" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="running-status" class="small-box bg-blue">
                        <div class="inner">
                            <h3 id="running-count">
                                0
                            </h3>
                            <p>
                                Running Deployments
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-refresh"></span>
                        </div>
                        <a target="_blank" href="${session.autoUrl}/#main/resources" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="scheduled-status" class="small-box bg-yellow">
                        <div class="inner">
                            <h3 id="scheduled-count">
                                0
                            </h3>
                            <p>
                                Scheduled Deployments
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-time"></span>
                        </div>
                        <a target="_blank" href="${session.autoUrl}/#main/resources" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
            </div>

            <h3 class="sub-header">Resource Status</h3>
            <div class="table-responsive">
                <table id="resources" class="table table-striped table-responsive table-hover">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Last Request</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody id="resource-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <script id="resource-template" type="text/x-handlebars-template">
            {{#this}}
            <tr id="{{id}}">
                {{#compare active true}}
            <td>
                <a data-toggle="tooltip" title="Drill down to resource in Serena DA"
                   class="autoMore small-box-footer" target="_blank" href="${session.autoUrl}/#resource/{{id}}">
                    {{name}} <span class="glyphicon glyphicon-circle-arrow-right"></span>
                </a>
            </td>
                <td>{{description}}</td>
                <td class="{{getStatus status}}">{{status}}</td>
                <td id="{{id}}-request"></td>
                <td class="text-left">
                    <a href="/radar/deploy/process?resId={{id}}" data-toggle="tooltip"
                       title="Run process on resource"
                       class="autoMore small-box-footer">
                        <span class="glyphicon glyphicon-play-circle"></span>
                    </a>
                    &nbsp;
                    <a target="_blank" href="${session.autoUrl}/#resource/{{id}}/inventory" data-toggle="tooltip"
                       title="Show resource inventory"
                       class="autoMore small-box-footer">
                        <span class="glyphicon glyphicon-book"></span>
                    </a>
                </td>
                {{/compare}}
            </tr>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-resources.js"/>
        <script>
            jQuery(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    autoUrl: "${session.autoUrl}",
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.Resources.init(automationSettings);
            });
        </script>
    </body>
</html>
