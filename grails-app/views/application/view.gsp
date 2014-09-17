<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="layout" content="main"/>
    </head>
    <body>
        <div id="app-dashboard" role="main">

            <h3 class="sub-header">Statistics <small>(last 30 days)</small></h3>

            <div class="row placeholders">
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="success-status" class="small-box bg-green">
                        <div class="inner">
                            <h3 id="success-count">
                                0
                            </h3>
                            <p>
                                Successful Deployments
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-ok-circle"></span>
                        </div>
                        <a target="_blank" href="${session.autoUrl}/#reports/system/Deployment Detail" class="sraMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="failure-status" class="small-box bg-red">
                        <div class="inner">
                            <h3 id="failure-count">
                                0
                            </h3>
                            <p>
                                Failed Deployments
                            </p>
                        </div>
                        <div class="icon">
                            <span class="glyphicon glyphicon-remove-circle"></span>
                        </div>
                        <a target="_blank" href="${session.autoUrl}//#reports/system/Deployment Detail" class="autoMore small-box-footer">
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
                        <a target="_blank" href="${session.autoUrl}//#reports/system/Deployment Detail" class="autoMore small-box-footer">
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
                        <a target="_blank" href="${session.autoUrl}/#reports/system/Deployment Detail" class="autoMore small-box-footer">
                            More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
                        </a>
                    </div>
                </div>
            </div>

            <h3 class="sub-header">Application Status</h3>
            <div class="table-responsive">
                <table id="applications" class="table table-striped table-responsive table-hover">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created by</th>
                        <th>Created</th>
                        <th>Last Request</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody id="application-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <script id="application-template" type="text/x-handlebars-template">
            {{#this}}
            <tr id="{{id}}">
                {{#compare active true}}
                <td>
                    <a data-toggle="tooltip" title="Drill down to application in Serena DA"
                       class="autoMore small-box-footer" target="_blank" href="${session.autoUrl}/#application/{{id}}">
                        {{name}} <span class="glyphicon glyphicon-circle-arrow-right"></span>
                    </a>
                </td>
                <td>{{description}}</td>
                <td>{{user}}</td>
                <td>{{prettifyDate created}}</td>
                <td id="{{id}}-request"></td>
                <td class="text-left">
                    <a href="/radar/deploy/version?appId={{id}}" data-toggle="tooltip"
                       title="Deploy version(s) to application"
                       class="autoMore small-box-footer">
                        <span class="glyphicon glyphicon-play-circle"></span>
                    </a>
                    &nbsp;
                    <a href="/radar/deploy/snapshot?appId={{id}}" data-toggle="tooltip"
                       title="Deploy snapshot to application"
                       class="autoMore small-box-footer">
                        <span class="glyphicon glyphicon-camera"></span>
                    </a>
                    &nbsp;
                    <a target="_blank" href="${session.autoUrl}/#application/{{id}}/calendar" data-toggle="tooltip"
                       title="Show application calendar"
                       class="autoMore small-box-footer">
                        <span class="glyphicon glyphicon-calendar"></span>
                    </a>
                </td>
                {{/compare}}
            </tr>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-applications.js"/>
        <script>
            jQuery(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    autoUrl: "${session.autoUrl}",
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.Applications.init(automationSettings);
            });
        </script>
    </body>
</html>
