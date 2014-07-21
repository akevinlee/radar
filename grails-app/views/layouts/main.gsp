<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <!--link rel="apple-touch-icon" href="${resource(dir: 'images', file: 'apple-touch-icon.png')}">

    <title><g:layoutTitle default="Serena Radar"/></title>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="${resource(dir: 'js/lib', file: 'html5shiv.min.js')}" type="text/javascript"></script>
      <script src="${resource(dir: 'js/lib', file: 'respond.min.js')}" type="text/javascript"></script>
    <![endif]-->

    <g:layoutHead/>
    <r:layoutResources />

    <script src="${resource(dir: 'js/lib', file: 'handlebars.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'moment.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'lodash.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'jquery.flot.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'jquery.flot.pie.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'jquery.circliful.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'countUp.min.js')}" type="text/javascript"></script>

    <script src="${resource(dir: 'js', file: 'radar-util.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'application.js')}" type="text/javascript"></script>

    <link rel="stylesheet" href="${resource(dir: 'css', file: 'jquery.circliful.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'main.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'mobile.css')}" type="text/css">
</head>

<body>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div class="logo">
                <a href="http://www.serena.com/index.php/en/" class="navbar-brand" style="">
                    <img src="${resource(dir: 'images', file: 'serena-logo.png')}" class="brand">
                </a>
            </div>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="${controllerName.equals('dashboard') ? 'active' : '' }">
                    <a href="${createLink(uri: '/')}">
                        <span class="glyphicon glyphicon-stats"></span>
                        Dashboard
                    </a>
                </li>
                <li class="${controllerName.equals('applications') ? 'active' : '' }">
                    <a href="${createLink(action:"view", controller:"applications")}">
                        <span class="glyphicon glyphicon-phone"></span>
                        Applications
                    </a>
                </li>
                <li class="${controllerName.equals('environments') ? 'active' : '' }">
                    <a href="${createLink(action:"view", controller:"environments")}">
                        <span class="glyphicon glyphicon-hdd"></span>
                        Environments
                    </a>
                </li>
                <li class="${controllerName.equals('resources') ? 'active' : '' }">
                    <a href="${createLink(action:"view", controller:"resources")}">
                        <span class="glyphicon glyphicon-tasks"></span>
                        Resources
                    </a>
                </li>
                <li class="${controllerName.equals('cloud') ? 'active' : '' }">
                    <a href="${createLink(action:"view", controller:"cloud")}">
                        <span class="glyphicon glyphicon-cloud"></span>
                        Cloud
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <% if (session.user) { %>
                    <li>
                        <a href="${createLink(action:"view", controller:"workitems")}">
                            <span id="my-tasks-count" class="badge">0</span>
                            <span class="glyphicon glyphicon-flag"></span>
                        </a>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <span class="glyphicon glyphicon-user"></span>
                            <%= "${session.user.name}" %> <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a href="${createLink(uri: '/settings')}">Settings</a>
                            </li>
                            <li>
                                <a href="${createLink(uri: '/help')}">Help</a>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a href="${createLink(action:"logout", controller:"user")}">Logout</a>
                            </li>
                        </ul>
                    </li>
                <% } else { %>
                    <button type="button" class="btn btn-default navbar-btn">
                        <a href="${createLink(action:"login", controller:"user")}">Login</a>
                    </button>
                <% } %>

            </ul>
        </div>
    </div>
</div>

<div class="container-fluid">
    <g:layoutBody/>
</div>

<footer id="radar-footer">
    <div class="container-fluid">
        <span class="pull-right" id="version">Serena Radar</span>
        <p class="ng-binding">© 2014 Serena Software Inc., All Rights Reserved.</p>
    </div>
</footer>

<r:layoutResources/>

<script src="${resource(dir: 'js', file: 'radar-myworkitems.js')}" type="text/javascript"></script>
<script>

    $(document).ready(function () {
        var automationSettings = {
            debug: true,
            refreshInterval: ${session.refreshInterval}
        };
        RADAR.MyWorkItems.init(automationSettings);
    });
</script>

</body>
</html>
