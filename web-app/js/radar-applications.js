
var RADAR = RADAR || {};

RADAR.Applications = {
    init: function (options) {
        this.debug = options.debug || false;
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoAppsUrl = this.autoPath + "proxy/all-applications";
        this.autoCompsUrl = this.autoPath + "proxy/all-components";
        // get all recent deployments (last 30 days)
        this.autoDepReportUrl = this.autoPath + "proxy?url=" +
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
        this.applicationTemplate = Handlebars.compile($('#application-template').html());
        this.$dashboard = $('#app-dashboard');
        this.$applications = this.$dashboard.find('#applications');
        this.$applicationRows = this.$applications.find('#application-rows');
        this.$successCount = this.$dashboard.find('#success-count');
        this.$failureCount = this.$dashboard.find('#failure-count');
        this.$runningCount = this.$dashboard.find('#running-count');
        this.$scheduledCount = this.$dashboard.find('#scheduled-count');
    },
    render: function (el) {
        this._updateApplications(el);
        this._updateActivity(el);
        this._updateCounts(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        (function applicationsUpdate(){
            setTimeout(function(){
                self._updateApplications(self.el);
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
        $.ajax(this.autoReq).then(function(data) {
            var numApps = _.size(data);
            if (numApps > 0) {
                if (self.debug) console.log("Found " + numApps + " applications");
                self.$applicationRows.empty().html(self.applicationTemplate(data));
            }
            else
                if (self.debug) console.log("Found no applications");
        });

    },
    _updateActivity: function(el) {
        var self = this;
        this.autoReq.url = this.autoActivityUrl;
        $.ajax(this.autoReq).done(function(data) {
            if (self.debug) console.log("Found " + _.size(data) + " active deployments");
            /*self.$activityRows.empty().html(self.activityTemplate(data));
            self.$activityRows.find('a.autoMore').on('click', function(e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(".autoContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
            });*/
        });
    },
    _updateCounts: function(el) {
        var self = this;
        this.autoReq.url = this.autoDepReportUrl;
        $.ajax(this.autoReq).done(function(data) {

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
