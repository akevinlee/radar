
var RADAR = RADAR || {};

RADAR.Dashboard = {
    init: function (options) {
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
            "&date_low=" + moment().subtract(3, 'd').valueOf() +
            "&date_hi=" + moment().valueOf() +
            "&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport";

        this.cacheElements();
        this.render();
    },
    cacheElements: function () {
        this.activityTemplate = Handlebars.compile($('#activity-template').html());
        this.$dashboard = $('#dashboard');
        this.$activity = this.$dashboard.find('#activity');
        this.$activityRows = this.$activity.find('#activity-rows');
        this.$pieStatus = $('#pieStatus');
        this.depTemplate = Handlebars.compile($('#dep-template').html());
        this.$depSuccess = $('#successStatus');
        this.$depFailure = $('#failureStatus');
    },
    render: function (el) {
        var self = this;
        this.sraReq.url = this.sraActivityUrl;
        $.ajax(this.sraReq).then(function(data) {
            self.$activityRows.html(self.activityTemplate(data));
        });
        this.sraReq.url = this.sraDepReportUrl;
        $.ajax(this.sraReq).then(function(data) {
            var numDeps = data.items[0].length;
            var success = 0, running = 0, failed = 0, cancelled = 0;
            $.each(data.items[0], function(i, item) {
                switch (item.status) {
                    case "SUCCESS":     success++;      break;
                    case "RUNNING":     running++;      break;
                    case "FAILURE":     failed++;       break;
                    case "CANCELLED":   cancelled++;    break;
                }
            });
            self.$depSuccess.html(self.depTemplate({
                id: "depSuccess",
                text: success,
                info: "Successful",
                total: numDeps,
                part: success,
                fgcolor: "#339933",
                bgcolor: "#eee",
                fillcolor: "#ddd"
            }));
            self.$depFailure.html(self.depTemplate({
                id: "depFailure",
                text: failed,
                info: "Failed",
                total: numDeps,
                part: failed,
                fgcolor: "#FF0000",
                bgcolor: "#eee",
                fillcolor: "#ddd"
            }));
            self.plotChart(self.$pieStatus, success, running, failed, cancelled);
            $('#depSuccess').circliful();
            $('#depFailure').circliful();
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
                    // TODO: error handling to decide if we can loop
                    activityUpdate();
                });
            }, self.refreshInterval*1000);
        })();
        (function pieStatusUpdate(){
            setTimeout(function(){
                self.sraReq.url = self.sraDepReportUrl;
                $.ajax(self.sraReq).done(function(data) {
                    // TODO: error handling to decide if we can loop
                    pieStatusUpdate();
                });
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    plotChart: function(el, success, running, failed, cancelled) {
        var statusData = [
            { label: "Success",     data: success},
            { label: "Running",     data: running},
            { label: "Failed",      data: failed},
            { label: "Cancelled",   data: cancelled}
        ];
        $.plot(el, statusData, {
            series: {
                pie: {
                    innerRadius: 0.5,
                    show: true
                }
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            legend: {
                show: false
            },
            colors: ["#78CD51", "#2FABE9", "#FA5833", "#FABB3D"]
        });
    }
};
