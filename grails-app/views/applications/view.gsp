<%@ page import="com.serena.radar.Settings" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <r:require modules="bootstrap"/>
    <title>Serena RAdAR</title>
</head>
<body>
<div id="app-dashboard" role="main">

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
        <div id="running-status" class="col-xs-6 col-sm-3 placeholder-m">
            <h4>Running Deployments</h4>
            <span class="text-muted">loading...</span>
        </div>
        <div id="scheduled-status" class="col-xs-6 col-sm-3 placeholder-m">
            <h4>Scheduled Deployments</h4>
            <span class="text-muted">loading...</span>
        </div>
    </div>

    <h3 class="sub-header">Application Status</h3>
    <div class="table-responsive">
        <table id="applications" class="table table-striped">
            <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created by</th>
                <th>Created</th>
                <th>Last Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody id="application-rows">
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

<script id="application-template" type="text/x-handlebars-template">
    {{#this}}
    <tr id="{{id}}">
        {{#compare active true}}
        <td>{{name}}</td>
        <td>{{description}}</td>
        <td>{{user}}</td>
        <td>{{prettifyDate created}}</td>
        <td id="{{id}}-status"></td>
        <td>
            <a class="sraMore small-box-footer" data-toggle="modal" data-target=".sraModal" href="${settingsInstance.sraUrl}/#application/{{id}}">
                More info <span class="glyphicon glyphicon-circle-arrow-right"></span>
            </a>
        </td>
        {{/compare}}
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

<script src="${resource(dir: 'js', file: 'radar-applications.js')}" type="text/javascript"></script>
<script>

    $(document).ready(function () {
        var sraSettings = {
            debug: true,
            refreshInterval: ${settingsInstance.refreshInterval}
        };
        RADAR.Applications.init(sraSettings);
    });
</script>
</body>
</html>
