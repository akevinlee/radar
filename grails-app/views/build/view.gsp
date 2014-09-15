<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="layout" content="main"/>
    </head>
    <body>
        <div id="build-dashboard" role="main">

            <h3 class="sub-header">Statistics <small>(last 30 days)</small></h3>

            <div class="row placeholders">
                <div class="col-xs-6 col-sm-3 placeholder-s">
                    <div id="success-status" class="small-box bg-green">
                        <div class="inner">
                            <h3 id="success-count">
                                0
                            </h3>
                            <p>
                                Successful Builds
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
                                Failed Builds
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
                                Running Builds
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
                                Scheduled Builds
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

            <h3 class="sub-header">Build Status</h3>
            <div class="table-responsive">
                <table id="builds" class="table table-condensed">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Buildable</th>
                        <th>Last Build</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody id="build-rows">
                    </tbody>
                </table>
            </div>
        </div>

        <script id="build-template" type="text/x-handlebars-template">
            {{#this}}
            <tr id="{{name}}">
                <td>
                    <a data-toggle="tooltip" title="Drill down to build"
                       class="autoMore small-box-footer" target="_blank" href="{{url}}">
                        {{name}} <span class="glyphicon glyphicon-circle-arrow-right"></span>
                    </a>
                </td>
                <td>{{buildable}}</td>
                <td>{{nextBuild}}</td>
                <td id="{{name}}-request"></td>
                <td>
                    <a href="/radar/build/job/{{name}}" data-toggle="tooltip"
                       title="Build Job"
                       class="autoMore small-box-footer">
                        <span class="glyphicon glyphicon-play-circle"></span>
                    </a>
                    &nbsp;
                </td>
            </tr>
            {{/this}}
        </script>

        <asset:javascript src="app/radar-builds.js"/>
        <script>
            $(document).ready(function () {
                var buildSettings = {
                    debug: true,
                    buildUrl: "${session.buildUrl}",
                    refreshInterval: ${session.refreshInterval}
                };
                RADAR.Builds.init(buildSettings);
            });
        </script>
    </body>
</html>