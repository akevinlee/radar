<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <asset:link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
        <asset:link rel="apple-touch-icon" href="apple-touch-icon.png" type="image/x-icon"/>

        <title><g:layoutTitle default="Serena Radar"/></title>

        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
              <script src="${resource(dir: 'javascripts/lib', file: 'html5shiv.min.js')}" type="text/javascript"></script>
              <script src="${resource(dir: 'javascripts/lib', file: 'respond.min.js')}" type="text/javascript"></script>
        <![endif]-->

        <asset:stylesheet src="main.css"/>
        <g:layoutHead/>
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
                            <asset:image src="serena-logo.png" class="brand"/>
                        </a>
                    </div>
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li class="${controllerName.equals('dashboard') ? 'active' : '' }">
                            <a href="${createLink(uri: '/')}">
                                <span class="glyphicon glyphicon-stats"></span>
                                <g:message code="radar.dashboard.menu" default="Dashboard"/>
                            </a>
                        </li>
                        <li class="${controllerName.equals('applications') ? 'active' : '' }">
                            <a href="${createLink(action:"view", controller:"application")}">
                                <span class="glyphicon glyphicon-phone"></span>
                                Applications
                            </a>
                        </li>
                        <li class="${controllerName.equals('builds') ? 'active' : '' }">
                            <a href="${createLink(action:"view", controller:"build")}">
                                <span class="glyphicon glyphicon-cog"></span>
                                Builds
                            </a>
                        </li>
                        <li class="${controllerName.equals('releases') ? 'active' : '' }">
                            <a href="${createLink(action:"view", controller:"release")}">
                                <span class="glyphicon glyphicon-plane"></span>
                                Releases
                            </a>
                        </li>
                        <!--li class="${controllerName.equals('environments') ? 'active' : '' }">
                            <a href="${createLink(action:"view", controller:"environment")}">
                                <span class="glyphicon glyphicon-hdd"></span>
                                Environments
                            </a>
                        </li>
                        <li class="${controllerName.equals('resources') ? 'active' : '' }">
                            <a href="${createLink(action:"view", controller:"resource")}">
                                <span class="glyphicon glyphicon-tasks"></span>
                                Resources
                            </a>
                        </li-->
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <% if (session.user) { %>
                            <li>
                                <div class="btn-group navbar-btn">
                                    <button data-toggle="dropdown" class="btn btn-success dropdown-toggle">
                                        +&nbsp;New
                                    </button>

                                    <ul class="dropdown-menu" role="menu">
                                        <li>
                                            <a href="${createLink(action:"index", controller:"build")}">Build</a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                            <a href="${createLink(action:"snapshot", controller:"deploy")}">Deployment (snapshot)</a>
                                        </li>
                                        <li>
                                            <a href="${createLink(action:"version", controller:"deploy")}">Deployment (versions)</a>
                                        </li>
                                        <span id="configured-processes">
                                        </span>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <a href="${createLink(action:"view", controller:"workitems")}">
                                    <span id="my-tasks-count">0</span>
                                </a>
                            </li>
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                    <span class="glyphicon glyphicon-user"></span>
                                    <%= "${session.user.name}" %> <span class="caret"></span>
                                </a>
                                <ul class="dropdown-menu" role="menu">
                                    <li>
                                        <a href="${createLink(action:"edit", controller:"UserSetting")}">Settings</a>
                                    </li>
                                    <li>
                                        <a href="${createLink(action:"about", controller:"Help")}">About</a>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                        <a href="${createLink(action:"index", controller:"Help")}">Help</a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="http://deploy-community.serena.com/">SDA Community</a>
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
            <asset:javascript src="main.js"/>
        </div>

        <footer id="radar-footer">
            <div class="container-fluid">
                <span class="pull-right" id="version">Serena Radar</span>
                <p class="ng-binding">© 2014 Serena Software Inc., All Rights Reserved.</p>
            </div>
        </footer>

        <script>
            $(document).ready(function () {
                var automationSettings = {
                    debug: true,
                    refreshInterval: ${session.refreshInterval}
                };
                //RADAR.MyWorkItems.init(automationSettings);
            });
        </script>

    </body>
</html>
