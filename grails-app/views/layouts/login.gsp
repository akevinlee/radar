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

    <script src="${resource(dir: 'js', file: 'radar-util.js')}" type="text/javascript"></script>
    <script src="${resource(dir: 'js', file: 'application.js')}" type="text/javascript"></script>

    <link rel="stylesheet" href="${resource(dir: 'css', file: 'main.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'login.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'mobile.css')}" type="text/css">
</head>

<body>

<div class="container-fluid">
    <g:layoutBody/>
</div>

<r:layoutResources/>

</body>
</html>
