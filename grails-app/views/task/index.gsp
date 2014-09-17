<%@ page import="com.serena.radar.UserSetting" %>

<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main">
    </head>

    <body>

        <h3 class="page-header">
            <g:if test="${type == 'approve'}">
                <g:message code="task.approve.title" default="Approve Task"/>
            </g:if>
            <g:elseif test="${type == 'reject'}">
                <g:message code="task.reject.title" default="Reject Task"/>
            </g:elseif>
            <g:else>
                Task
            </g:else>
        </h3>

        <div id="page-body" role="main">

            <div id="tasks" class="content" role="main">

                <div class="col-md-9">

                    <g:if test="${flash.message}">
                        <div class="alert alert-success fade in message" role="status">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            ${flash.message}
                        </div>
                    </g:if>

                    <g:if test="${flash.error}">
                        <div class="alert alert-danger fade in message" role="status">
                            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                            ${flash.error}
                        </div>
                    </g:if>

                    <g:form class="form-horizontal" role="form" url="[controller: 'task', action: 'submit']" method="POST">

                        <g:hiddenField name="task" value="${task}" />
                        <g:hiddenField name="type" value="${type}" />

                        <div class="form-group">
                            <label for="comment" class="col-md-2 control-label">
                                <g:message code="task.comment.label" default="Comments"/>
                            </label>
                            <div class="col-md-7">
                                <g:textArea name="comment" class="form-control" placeholder=""/>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-7">
                                <g:actionSubmit action="submit" class="save btn btn-default"
                                                value="${message(code: 'default.button.approve.label', default: 'Submit')}"/>
                            </div>
                        </div>

                    </g:form>
                </div>

                <div class="col-md-3">
                </div>

            </div>

        </div>

    </body>
</html>
