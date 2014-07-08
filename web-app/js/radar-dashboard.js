
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
        }
        this.sraActivityUrl = this.sraPath +
            "/rest/workflow/currentActivity?orderField=startDate&sortType=desc";
        this.sraDepReportUrl = this.sraPath + "/rest/report/adHoc?dateRange=custom" +
            "&date_low=" + moment().subtract(30, 'd').valueOf() +
            "&date_hi=" + moment().valueOf() +
            "&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport";

        this.cacheElements();
        this.render();
    },
    cacheElements: function () {
        this.activityTemplate = Handlebars.compile($('#activity-template').html());
        this.depTemplate = Handlebars.compile($('#dep-template').html());
        this.$dashboard = $('#dashboard');
        this.$activity = this.$dashboard.find('#activity');
        this.$activityRows = this.$activity.find('#activity-rows');
        this.$depSuccess = $('#successStatus');
        this.$depFailure = $('#failureStatus');
        this.$appStatus = $('#appStatus');
        this.$userStatus = $('#userStatus');
    },
    render: function (el) {
        var self = this;
        this.sraReq.url = this.sraActivityUrl;
        $.ajax(this.sraReq).then(function(data) {
            self.$activityRows.html(self.activityTemplate(data));
            self.$activityRows.find('a.sraMore').on('click', function(e) {
                e.preventDefault();
                var url = $(this).attr('href');
                $(".sraContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
            });
        });
        this.sraReq.url = this.sraDepReportUrl;
        $.ajax(this.sraReq).then(function(data) {
            var status = _.chain(data.items[0]).sortBy("status").countBy("status").value();
            //var envs = _.chain(data.items[0]).sortBy("environment").countBy("environment").value();
            var apps = _.chain(data.items[0]).sortBy("application").countBy("application").value();
            var users = _.chain(data.items[0]).sortBy("user").countBy("user").value();
            var totalDeps = _.size(data.items[0]) - status.RUNNING;

            if (self.debug) console.log("Found " + totalDeps + " deployments in range");
            if (self.debug) console.log("Found " + status.SUCCESS + " successful deployments, " + status.FAILURE + " failed deployments");

            self.drawCircles(status.SUCCESS, status.FAILURE, totalDeps);
            self.plotChart(self.$appStatus, apps);
            self.plotChart(self.$userStatus, users);
        });

        this.update();
    },
    update: function (el) {
        var self = this;
        (function activityUpdate(){
            setTimeout(function(){
                self.sraReq.url = self.sraActivityUrl;
                $.ajax(self.sraReq).done(function(data) {
                    self.$activityRows.empty().html(self.activityTemplate(data));
                    self.$activityRows.find('a.sraMore').on('click', function(e) {
                        e.preventDefault();
                        var url = $(this).attr('href');
                        $(".sraContent").html('<iframe width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');
                    });
                    // TODO: error handling to decide if we can loop
                    activityUpdate();
                });
            }, self.refreshInterval*1000);
        })();
        (function statusUpdate(){
            setTimeout(function(){
                self.sraReq.url = self.sraDepReportUrl;
                $.ajax(self.sraReq).done(function(data) {
                    var status = _.chain(data.items[0]).sortBy("status").countBy("status").value();
                    var apps = _.chain(data.items[0]).sortBy("application").countBy("application").value();
                    var users = _.chain(data.items[0]).sortBy("user").countBy("user").value();
                    var totalDeps = _.size(data.items[0]) - status.RUNNING;

                    if (self.debug) console.log("Found " + totalDeps + " deployments in range");
                    if (self.debug) console.log("Found " + status.SUCCESS + " successful deployments, " + status.FAILURE + " failed deployments");

                    self.drawCircles(status.SUCCESS, status.FAILURE, totalDeps);
                    self.plotChart(self.$appStatus, apps);
                    self.plotChart(self.$userStatus, users);
                    // TODO: error handling to decide if we can loop
                    statusUpdate();
                });
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    drawCircles: function(success, failed, numDeps) {
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
    labelFormatter: function (label, series) {
        return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
    },
    plotChart: function(el, json) {
        var data = [];
        $.each(json, function(i, val) {
            data.push({ label: i, data: val});
        });
        $.plot(el, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        formatter: this.labelFormatter,
                        background: {
                            opacity: 0.5
                        },
                    }
                }
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            legend: {
                show: false
            },
            colors: ["#003399", "#006600", "#6685C2", "#338533", "#CCD6EB"]
        });
    }
};
