//= require jquery

var RADAR = RADAR || {};

RADAR.Applications = {
    init: function (options) {
        this.debug = options.debug || false;
        this.autoUrl = options.autoUrl || "http://localhost:8080/serena_ra";
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoAppsUrl = this.autoPath + "autoproxy/all-applications";
        this.autoCompsUrl = this.autoPath + "autoproxy/all-components";
        // get all recent deployments (last 30 days)
        this.autoDepReportUrl = this.autoPath + "autoproxy?url=" +
            encodeURIComponent("/rest/report/adHoc?dateRange=custom&status=" +
            "&date_low=" + moment().subtract(30, 'd').valueOf() +
            "&date_hi=" + moment().valueOf() +
            "&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport");

        this.countOptions = {
            useEasing : true,
            useGrouping : false,
            separator : ',',
            decimal : '.'
        };

        this.cacheElements();
        this.render();
    },
    cacheElements: function () {
        this.applicationTemplate = Handlebars.compile(jQuery('#application-template').html());
        this.$dashboard = jQuery('#app-dashboard');
        this.$applications = this.$dashboard.find('#applications');
        this.$applicationRows = this.$applications.find('#application-rows');
        this.$successCount = this.$dashboard.find('#success-count');
        this.$failureCount = this.$dashboard.find('#failure-count');
        this.$runningCount = this.$dashboard.find('#running-count');
        this.$scheduledCount = this.$dashboard.find('#scheduled-count');
    },
    render: function (el) {
        //this._updateApplications(el);
        this._updateActivity(el);
        this._updateCounts(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        self._updateApplications(self.el); // applications only on load
        (function applicationsUpdate(){
            setTimeout(function(){
                self._updateActivity(self.el);
                self._updateCounts(self.el);
                applicationsUpdate();
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    _updateApplications: function(el) {
        var self = this;
        this.autoReq.url = this.autoAppsUrl;
        jQuery.ajax(this.autoReq).then(function(data) {
            var numApps = _.size(data);
            if (numApps > 0) {
                if (self.debug) console.log("Found " + numApps + " applications");
                self.$applicationRows.empty().html(self.applicationTemplate(data));
                jQuery('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
            }
            else
                if (self.debug) console.log("Found no applications");
        });

    },
    _updateActivity: function(el) {
        var self = this;
        self.$applicationRows.find("tr").each(function() {
            var thisTr = this;
            var appId = jQuery(this).attr('id');
            if (self.debug) console.log("Getting last request for application " + appId)
            this.autoActivityUrl = self.autoPath + "autoproxy?url=" +
                encodeURIComponent("/rest/deploy/applicationProcessRequest/table?rowsPerPage=1" +
                    "&pageNumber=1&orderField=entry.scheduledDate&sortType=desc&filterFields=application.id" +
                    "&filterValue_application.id=" + appId + "&filterType_application.id=eq&filterClass_application.id=UUID");
            jQuery.ajax(this.autoActivityUrl).then(function(data) {
                if (data.totalRecords != 0) {
                    var depReq = data.records[0];
                    var cssClass = 'info';
                    var icon = '';
                    if (depReq.entry.fired == false) {
                        cssClass = 'warning'
                        icon = '<span title="Deployment scheduled" data-toggle="tooltip" class="glyphicon glyphicon-time"></span>'
                    } else {
                        if (depReq.rootTrace.state != undefined) {
                            if (depReq.rootTrace.state == "EXECUTING") {
                                cssClass = 'active';
                                icon = '<span title="Deployment running" data-toggle="tooltip" class="glyphicon glyphicon-refresh icon-refresh-animate"></span>';
                                // move row to the top
                                self.$applicationRows.find("tr:first").parents('tbody').prepend(thisTr);
                            } else {
                                switch (depReq.result) {
                                    case "SUCCEEDED":
                                        cssClass = 'success';
                                        break;
                                    case "FAULTED":
                                        cssClass = 'danger';
                                        break;
                                }
                            }
                        }
                    }
                    jQuery('#' + appId + "-request").html('<a data-toggle="tooltip" title="Executed process '
                            + '(' + depReq.applicationProcess.name + ')" ' +
                            'target="_blank" href="' + self.autoUrl +
                            '/#applicationProcessRequest/' + depReq.id + '">' +
                            moment(new Date(depReq.submittedTime)).calendar() +
                            ' by ' + depReq.userName + '</a>&nbsp;' + icon
                    ).removeClass().addClass(cssClass);
                }
                jQuery('a[data-toggle="tooltip"]').tooltip({'placement': 'top'});
                jQuery('span[data-toggle="tooltip"]').tooltip({'placement': 'top'});
            });
        });
    },
    _updateCounts: function(el) {
        var self = this;
        this.autoReq.url = this.autoDepReportUrl;
        jQuery.ajax(this.autoReq).done(function(data) {

            var results = data.items[0];
            var successCount = _.size(_.uniq(_.where(results, { "status": "SUCCESS"}), "applicationRequestId"));
            var failureCount = _.size(_.uniq(_.where(results, { "status": "FAILURE"}), "applicationRequestId"));
            var runningCount = _.size(_.uniq(_.where(results, { "status": "RUNNING"}), "applicationRequestId"));
            var scheduledCount = _.size(_.uniq(_.where(results, { "status": "SCHEDULED"}), "applicationRequestId"));
            var approvalCount = _.size(_.uniq(_.where(results, { "status": "AWAITING_APPROVAL"}), "applicationRequestId"));
            var rejectedCount = _.size(_.uniq(_.where(results, { "status": "APPROVAL_REJECTED"}), "applicationRequestId"));

            if (self.debug) console.log("Found " + successCount + " successful, " + failureCount + " failed deployments");

            var depCount = successCount + failureCount + runningCount + approvalCount;
            if (successCount > 0) {
                new countUp("success-count", self.$successCount.text(), successCount, 0, 2, 1.5, self.countOptions).start();
            } else {
                self.$successCount.text("0");
            }
            if (failureCount > 0) {
                new countUp("failure-count", self.$failureCount.text(), failureCount, 0, 2, 1.5, self.countOptions).start();
            } else {
                self.$failureCount.text("0");
            }
            if (runningCount > 0) {
                new countUp("running-count", self.$runningCount.text(), runningCount, 0, 2, 1.5, self.countOptions).start();
            } else {
                self.$runningCount.text("0");
            }
            if (scheduledCount > 0) {
                new countUp("scheduled-count", self.$scheduledCount.text(), scheduledCount, 0, 2, 1.5, self.countOptions).start();
            } else {
                self.$scheduledCount.text("0");
            }

        });
    }
};
