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

    <title><g:layoutTitle default="Grails"/></title>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="${resource(dir: 'js/lib', file: 'html5shiv.min.js')}" type="text/javascript"></script>
      <script src="${resource(dir: 'js/lib', file: 'respond.min.js')}" type="text/javascript"></script>
    <![endif]-->

    <g:layoutHead/>
    <r:layoutResources />

    <script src="${resource(dir: 'js/lib', file: 'handlebars.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'moment.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'jquery.flot.min.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js/lib', file: 'jquery.flot.pie.min.js')}" type="text/javascript"></script>

    <script src="${resource(dir: 'js', file: 'radar-util.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'application.js')}" type="text/javascript"></script>

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
                <li class="active"><a href="${createLink(uri: '/')}">Dashboard</a></li>
                <li><a href="${createLink(uri: '/applications')}">Applications</a></li>
                <li><a href="${createLink(uri: '/resources')}">Resources</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="${createLink(uri: '/settings')}">Settings</a></li>
                <li><a href="${createLink(uri: '/help')}">Help</a></li>
            </ul>
        </div>
    </div>
</div>

<div class="container-fluid">
    <g:layoutBody/>
</div>

<footer id="radar-footer">
    <div class="container-fluid">
        <span class="pull-right" id="version">Serena RAdaR</span>
        <p class="ng-binding">© 2014 Serena Software Inc., All Rights Reserved.</p>
    </div>
</footer>

<r:layoutResources/>

</body>
</html>
