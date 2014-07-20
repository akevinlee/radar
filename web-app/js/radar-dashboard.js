
var RADAR = RADAR || {};

RADAR.Dashboard = {
    init: function (options) {
        this.debug = options.debug || false;
        this.useSSO = options.useSSO || true; // assume SSO is enabled?
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();

        // default options for SDA rest query
        this.autoReq = {
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": (this.useSSO ? true : false)
            },
            url: this.autoPath
        };

        this.autoAppsUrl = this.autoPath + "proxy/all-applications";
        this.autoCompsUrl = this.autoPath + "proxy/all-components";
        this.autoEnvsUrl = this.autoPath + "proxy/all-global-environments";
        this.autoResourcesUrl = this.autoPath + "proxy/all-resources";
        this.autoAgentsUrl = this.autoPath + "proxy/all-agents";
        this.autoActivityUrl = this.autoPath + "proxy/current-activity";
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
        this.activityTemplate = Handlebars.compile($('#activity-template').html());
        this.depTemplate = Handlebars.compile($('#dep-template').html());
        this.$dashboard = $('#dashboard');
        this.$stats = this.$dashboard.find('#stats');
        this.$appStats = this.$stats.find('#app-stats');
        this.$compStats = this.$stats.find('#comp-stats');
        this.$resStats = this.$stats.find('#resource-stats');
        this.$agentStats = this.$stats.find('#agent-stats');
        this.$appCount = this.$appStats.find('#app-count');
        this.$compCount = this.$compStats.find('#comp-count');
        this.$envCount = this.$stats.find('#env-count');
        this.$onResCount = this.$stats.find('#online-resource-count');
        this.$offResCount = this.$stats.find('#offline-resource-count');
        this.$onAgentCount = this.$stats.find('#online-agent-count');
        this.$offAgentCount = this.$stats.find('#offline-agent-count');
        this.$approvalCount = this.$stats.find('#approval-count');
        this.$rejectedCount = this.$stats.find('#rejected-count');
        this.$activity = this.$dashboard.find('#activity');
        this.$activityRows = this.$activity.find('#activity-rows');
        this.$depSuccess = this.$dashboard.find('#success-status');
        this.$depFailure = this.$dashboard.find('#failure-status');
        this.$appStatus = this.$dashboard.find('#app-status');
        this.$userStatus = this.$dashboard.find('#user-status');
    },
    render: function (el) {
        this._updateCounts(el);
        this._updateActivity(el);
        this._updateStatus(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        (function dashboardUpdate(){
            setTimeout(function(){
                self._updateCounts(self.el);
                self._updateActivity(self.el);
                self._updateStatus(self.el);
                dashboardUpdate();
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    _updateCounts: function(el) {
        var self = this;
        this.$compStats.toggleClass('hidden'); this.$agentStats.toggleClass('hidden');
        this.$appStats.toggleClass('hidden'); this.$resStats.toggleClass('hidden');
        if (this.$appStats.hasClass("hidden")) {
            this.autoReq.url = this.autoCompsUrl;
            $.ajax(this.autoReq).then(function(data) {
                var numComps = _.size(data);
                if (self.debug) console.log("Found " + numComps + " components");
                if (numComps > 0)
                    new countUp("comp-count", self.$compCount.text(), numComps, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$compCount.text("0");
            });
        } else {
            this.autoReq.url = this.autoAppsUrl;
            $.ajax(this.autoReq).then(function(data) {
                var numApps = _.size(data);
                if (self.debug) console.log("Found " + numApps + " applications");
                if (numApps > 0)
                    new countUp("app-count", self.$appCount.text(), numApps, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$appCount.text("0");
            });
        }
        this.autoReq.url = this.autoEnvsUrl;
        $.ajax(this.autoReq).then(function(data) {
            // TODO: show application environments
            var numGlobEnvs = _.size(data);
            if (self.debug) console.log("Found " + numGlobEnvs + " global environments");
            if (numGlobEnvs > 0)
                new countUp("env-count", self.$envCount.text(), numGlobEnvs, 0, 2, 1.5, self.countOptions).start();
            else
                self.$envCount.text("0");
        });
        if (this.$resStats.hasClass("hidden")) {
            this.autoReq.url = self.autoAgentsUrl;
            $.ajax(this.autoReq).then(function(data) {
                var agentStats = _.chain(data).sortBy("status").countBy("status").value();
                if (self.debug) console.log("Found " + agentStats.ONLINE + " online / " + agentStats.OFFLINE + " offline agents");
                if (agentStats.ONLINE > 0)
                    new countUp("online-agent-count", self.$onAgentCount.text(), agentStats.ONLINE, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$onAgentCount.text("0");
                if (agentStats.OFFLINE > 0)
                    new countUp("offline-agent-count", self.$offAgentCount.text(), agentStats.OFFLINE, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$offAgentCount.text("0");
            });
        } else {
            this.autoReq.url = this.autoResourcesUrl;
            $.ajax(this.autoReq).then(function(data) {
                var resStats = _.chain(data).sortBy("status").countBy("status").value();
                if (self.debug) console.log("Found " + resStats.ONLINE + " online / " + resStats.OFFLINE + " offline resources");
                if (resStats.ONLINE > 0)
                    new countUp("online-resource-count", self.$onResCount.text(), resStats.ONLINE, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$onResCount.text("0");
                if (resStats.OFFLINE > 0)
                    new countUp("offline-resource-count", self.$offResCount.text(), resStats.OFFLINE, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$offResCount.text("0");
            });
        }
    },
    _updateActivity: function(el) {
        var self = this;
        this.autoReq.url = this.autoActivityUrl;
        $.ajax(this.autoReq).done(function(data) {
            if (self.debug) console.log("Found " + _.size(data) + " active deployments");
            self.$activityRows.empty().html(self.activityTemplate(data));
            self.$activityRows.find('a.autoMore').on('click', function(e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(".autoContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
            });
        });
    },
    _updateStatus: function(el) {
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

            if (self.debug) console.log("Found " + approvalCount + " waiting approval, " + rejectedCount + " rejected");

            if (approvalCount > 0)
                new countUp("approval-count", self.$approvalCount.text(), approvalCount, 0, 2, 1.5, self.countOptions).start();
            else
                self.$approvalCount.text("0");
            if (rejectedCount > 0)
                new countUp("rejected-count", self.$rejectedCount.text(), rejectedCount, 0, 2, 1.5, self.countOptions).start();
            else
                self.$rejectedCount.text("0");

            // TODO: extract top 5 only
            var apps = _.chain(results).sortBy("application").countBy("application").value();
            var users = _.chain(results).sortBy("user").countBy("user").value();

            if (_.size(data.items[0]) > 0) {
                self._drawPieChart(self.$appStatus, apps);
                self._drawPieChart(self.$userStatus, users);
            } else {
                if (self.debug) console.log("Found no deployments in range");
                self.$appStatus.find(".text-muted").text("none in range");
                self.$userStatus.find(".text-muted").text("none in range");
                self.$activityRows.html('<tr><td align="center" colspan="7">no deployments in range</td></tr>');
            }
        });
    },
    _labelFormatter: function (label, series) {
        return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
    },
    _drawPieChart: function(el, json) {
        var data = [];
        $.each(json, function(i, val) {
            data.push({ label: i, data: val});
        });
        el.empty();
        $.plot(el, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        formatter: this._labelFormatter,
                        background: {
                            opacity: 0.5
                        }
                    }
                }
            },
            grid: {
                hoverable: true,
                clickable: false
            },
            legend: {
                show: false
            },
            colors: ["#00c0ef", "#00a65a", "#f39c12", "#f56954", "#f012be"]
        });
    }
};
