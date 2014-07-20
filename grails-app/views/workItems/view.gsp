<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <r:require modules="bootstrap"/>
    <title>Serena Radar</title>
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


<script src="${resource(dir: 'js', file: 'radar-resources.js')}" type="text/javascript"></script>
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
