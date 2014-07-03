<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <link rel="apple-touch-icon" href="${resource(dir: 'images', file: 'apple-touch-icon.png')}">
    <link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'images', file: 'apple-touch-icon-retina.png')}">

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
            <a class="navbar-brand" href="${createLink(uri: '/')}">Serena RA<i>daR</i></a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="${createLink(uri: '/')}">Dashboard</a></li>
                <li><a href="${createLink(uri: '/applications')}">App Inventory</a></li>
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

<!--div id="footer">
    <div class="container-fluid">
        <p class="text-muted">Serena RAdaR - &copy; Serena Software 2014.</p>
    </div>
</div-->

<r:layoutResources/>

</body>
</html>
