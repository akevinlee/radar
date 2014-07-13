
var RADAR = RADAR || {};

RADAR.Dashboard = {
    init: function (options) {
        this.debug = options.debug || true;
        this.sraUrl = options.sraUrl || "http://localhost:8080/serena_ra"
        this.username = options.sraUsername || "admin";
        this.password = options.sraPassword;
        this.useProxy = options.useProxy || false;
        this.sraPath = (this.useProxy ? RADAR.Util.getSiteRoot() + "/proxy" : "") + "/serena_ra";
        this.useSSO = options.useSSO || false;
        this.refreshInterval = parseInt(options.refreshInterval) || 10;
        this.sraReq = {
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": true,
                "Authorization": RADAR.Util.makeBasicAuth(this.username, this.password)
            },
            url: this.sraPath
        };
        this.sraAppsUrl = this.sraPath +
            "/rest/deploy/application?sortType=asc";
        this.sraCompsUrl = this.sraPath +
            "/rest/deploy/component?sortType=asc";
        this.sraEnvsUrl = this.sraPath +
            "/rest/deploy/globalEnvironment?sortType=asc";
        this.sraResourcesUrl = this.sraPath +
            "/rest/resource/resource/tree?orderField=name&sortType=asc";
        this.sraAgentsUrl = this.sraPath +
            "/rest/agent?&orderField=name&sortType=desc";
        this.sraUsersUrl = this.sraPath +
            "/rest/security/authenticationRealm/20000000000000000000000000000001/users?sortType=asc";
        this.sraActivityUrl = this.sraPath +
            "/rest/workflow/currentActivity?orderField=startDate&sortType=desc";
        this.sraDepReportUrl = this.sraPath + "/rest/report/adHoc?dateRange=custom" +
            "&date_low=" + moment().subtract(30, 'd').valueOf() +
            "&date_hi=" + moment().valueOf() +
            "&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport";
        this.countOptions = {
            useEasing : true,
            useGrouping : false,
            separator : ',',
            decimal : '.'
        }
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
        this.$userCount = this.$stats.find('#user-count');
        this.$activity = this.$dashboard.find('#activity');
        this.$activityRows = this.$activity.find('#activity-rows');
        this.$depSuccess = this.$dashboard.find('#successStatus');
        this.$depFailure = this.$dashboard.find('#failureStatus');
        this.$appStatus = this.$dashboard.find('#appStatus');
        this.$userStatus = this.$dashboard.find('#userStatus');
    },
    render: function (el) {
        this._updateCounts(el);
        this._updateActivity(el);
        this._updateStatus(el);
        this.update();
        this.$stats.find('a.sraMore').on('click', function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            $(".sraContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
        });
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
            this.sraReq.url = this.sraCompsUrl;
            $.ajax(this.sraReq).then(function(data) {
                var numComps = _.size(data);
                if (self.debug) console.log("Found " + numComps + " components");
                if (numComps > 0)
                    new countUp("comp-count", self.$compCount.text(), numComps, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$compCount.text("0");
            });
        } else {
            this.sraReq.url = this.sraAppsUrl;
            $.ajax(this.sraReq).then(function(data) {
                var numApps = _.size(data);
                if (self.debug) console.log("Found " + numApps + " applications");
                if (numApps > 0)
                    new countUp("app-count", self.$appCount.text(), numApps, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$appCount.text("0");
            });
        }
        this.sraReq.url = this.sraEnvsUrl;
        $.ajax(this.sraReq).then(function(data) {
            // TODO: show application environments
            var numGlobEnvs = _.size(data);
            if (self.debug) console.log("Found " + numGlobEnvs + " global environments");
            if (numGlobEnvs > 0)
                new countUp("env-count", self.$envCount.text(), numGlobEnvs, 0, 2, 1.5, self.countOptions).start();
            else
                self.$envCount.text("0");
        });
        if (this.$resStats.hasClass("hidden")) {
            this.sraReq.url = self.sraAgentsUrl;
            $.ajax(this.sraReq).then(function(data) {
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
            this.sraReq.url = this.sraResourcesUrl;
            $.ajax(this.sraReq).then(function(data) {
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
        this.sraReq.url = this.sraUsersUrl;
        $.ajax(this.sraReq).then(function(data) {
            // TODO: show approvals/tasks
            var numUsers = _.size(data);
            if (self.debug) console.log("Found " + numUsers + " users");
            if (numUsers > 0)
                new countUp("user-count", self.$userCount.text(), _.size(data), 0, 2, 1.5, self.countOptions).start();
            else
                self.$userCount.text("0");
        });
    },
    _updateActivity: function(el) {
        var self = this;
        this.sraReq.url = this.sraActivityUrl;
        $.ajax(this.sraReq).done(function(data) {
            if (self.debug) console.log("Found " + _.size(data) + " active deployments");
            self.$activityRows.empty().html(self.activityTemplate(data));
            self.$activityRows.find('a.sraMore').on('click', function(e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(".sraContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
            });
        });
    },
    _updateStatus: function(el) {
        var self = this;
        this.sraReq.url = this.sraDepReportUrl;
        $.ajax(this.sraReq).done(function(data) {
            // TODO: extract top 5 only
            var status = _.chain(data.items[0]).sortBy("status").countBy("status").value();
            var apps = _.chain(data.items[0]).sortBy("application").countBy("application").value();
            var users = _.chain(data.items[0]).sortBy("user").countBy("user").value();
            var totalDeps = _.size(data.items[0]) - status.RUNNING;

            if (totalDeps > 0) {
                if (self.debug) console.log("Found " + totalDeps + " deployments in range");
                if (self.debug) console.log("Found " + status.SUCCESS + " successful deployments, " + status.FAILURE + " failed deployments");

                self._drawStatusCircles(status.SUCCESS, status.FAILURE, totalDeps);
                self._drawPieChart(self.$appStatus, apps);
                self._drawPieChart(self.$userStatus, users);
            } else {
                if (self.debug) console.log("Found no deployments in range");
                self.$depSuccess.find(".text-muted").text("none in range");
                self.$depFailure.find(".text-muted").text("none in range");
                self.$appStatus.find(".text-muted").text("none in range");
                self.$userStatus.find(".text-muted").text("none in range");
                self.$activityRows.html('<tr><td align="center" colspan="7">no deployments in range</td></tr>');
            }
        });
    },
    _drawStatusCircles: function(success, failed, numDeps) {
        this.$depSuccess.empty();
        this.$depSuccess.html(this.depTemplate({
            id: "depSuccess",
            text: success,
            info: "Successful",
            total: numDeps,
            part: success,
            fgcolor: "#339933",
            bgcolor: "#eee",
            fillcolor: "#ddd"
        }));
        this.$depFailure.empty();
        this.$depFailure.html(this.depTemplate({
            id: "depFailure",
            text: failed,
            info: "Failed",
            total: numDeps,
            part: failed,
            fgcolor: "#FF0000",
            bgcolor: "#eee",
            fillcolor: "#ddd"
        }));
        $('#depSuccess').circliful();
        $('#depFailure').circliful();
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
