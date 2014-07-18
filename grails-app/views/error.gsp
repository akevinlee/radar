<!DOCTYPE html>
<html>
	<head>
        <meta name="layout" content="basic">
        <r:require modules="bootstrap"/>
		<title><g:if env="development">Grails Runtime Exception</g:if><g:else>Error</g:else></title>
		<g:if env="development"><link rel="stylesheet" href="${resource(dir: 'css', file: 'errors.css')}" type="text/css"></g:if>
	</head>
	<body>
        <div id="page-body" class="content" role="main">
            <g:if env="development">
                <g:renderException exception="${exception}" />
            </g:if>
            <g:else>
                <ul class="errors">
                    <li>An error has occurred</li>
                </ul>
            </g:else>
        </div>
	</body>
</html>
