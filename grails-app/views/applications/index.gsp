<%@ page import="com.serena.radar.Settings" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <r:require modules="bootstrap"/>
    <title>Serena RAdAR - Application Inventory</title>
</head>
<body>
    <div id="app" role="main">
        <h1 class="page-header">Application Inventory</h1>
        <div id="main">
            <div id="app-list"></div>
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

<script src="${resource(dir: 'js', file: 'appInventory.js')}" type="text/javascript"></script>
<script>

    $(document).ready(function () {
        Dashboard.init();
    });
</script>
</body>
</html>
