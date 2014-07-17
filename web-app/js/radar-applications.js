
var RADAR = RADAR || {};

RADAR.Applications = {
    init: function (options) {
        this.debug = options.debug || false;
        this.useSSO = options.useSSO || true; // assume SSO is enabled
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.sraPath = RADAR.Util.getBaseURL();

        // default options for SRA rest query
        this.sraReq = {
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": (this.useSSO ? true : false)
            },
            url: this.sraPath
        };

        this.sraAppsUrl = this.sraPath + "proxy/all-applications";
        this.sraCompsUrl = this.sraPath + "proxy/all-components";
        // get all recent deployments (last 30 days)
        this.sraDepReportUrl = this.sraPath + "proxy?url=" +
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
        this.depTemplate = Handlebars.compile($('#dep-template').html());
        this.$dashboard = $('#app-dashboard');
        this.$applications = this.$dashboard.find('#applications');
        this.$applicationRows = this.$applications.find('#application-rows');
        this.$depSuccess = this.$dashboard.find('#success-status');
        this.$depFailure = this.$dashboard.find('#failure-status');
        this.$depRunning = this.$dashboard.find('#running-status');
        this.$depScheduled = this.$dashboard.find('#scheduled-status');
    },
    render: function (el) {
        this._updateApplications(el);
        this._updateActivity(el);
        this._updateStatus(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        (function dashboardUpdate(){
            setTimeout(function(){
                self._updateApplications(self.el);
                self._updateActivity(self.el);
                self._updateStatus(self.el);
                dashboardUpdate();
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    _updateApplications: function(el) {
        var self = this;
        this.sraReq.url = this.sraAppsUrl;
        $.ajax(this.sraReq).then(function(data) {
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
        this.sraReq.url = this.sraActivityUrl;
        $.ajax(this.sraReq).done(function(data) {
            if (self.debug) console.log("Found " + _.size(data) + " active deployments");
            /*self.$activityRows.empty().html(self.activityTemplate(data));
            self.$activityRows.find('a.sraMore').on('click', function(e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(".sraContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
            });*/
        });
    },
    _updateStatus: function(el) {
        var self = this;
        this.sraReq.url = this.sraDepReportUrl;
        $.ajax(this.sraReq).done(function(data) {

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
                self.$depSuccess.empty();
                self.$depSuccess.html(self.depTemplate({
                    id: "dep-success",
                    text: successCount,
                    info: "Successful",
                    total: depCount,
                    part: successCount,
                    fgcolor: "#339933", bgcolor: "#eee", fillcolor: "#ddd"
                }));
                $('#dep-success').circliful();
            } else {
                self.$depSuccess.find(".text-muted").text("none in range");
            }
            if (failureCount > 0) {
                self.$depFailure.empty();
                self.$depFailure.html(self.depTemplate({
                    id: "dep-failure",
                    text: failureCount,
                    info: "Failed",
                    total: depCount,
                    part: failureCount,
                    fgcolor: "#FF0000", bgcolor: "#eee", fillcolor: "#ddd"
                }));
                $('#dep-failure').circliful();
            } else {
                self.$depFailure.find(".text-muted").text("none in range");
            }
            if (runningCount > 0) {
                self.$depRunning.empty();
                self.$depRunning.html(self.depTemplate({
                    id: "dep-running",
                    text: runningCount,
                    info: "Running",
                    total: depCount,
                    part: runningCount,
                    fgcolor: "#EE2367", bgcolor: "#eee", fillcolor: "#ddd"
                }));
                $('#dep-running').circliful();
            } else {
                self.$depRunning.find(".text-muted").text("none in range");
            }
            if (scheduledCount > 0) {
                self.$depScheduled.empty();
                self.$depScheduled.html(self.depTemplate({
                    id: "dep-scheduled",
                    text: scheduledCount,
                    info: "Scheduled",
                    total: depCount,
                    part: scheduledCount,
                    fgcolor: "#223355", bgcolor: "#eee", fillcolor: "#ddd"
                }));
                $('#dep-scheduled').circliful();
            } else {
                self.$depScheduled.find(".text-muted").text("none in range");
            }

        });
    }
};
