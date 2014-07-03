
var RADAR = RADAR || {};

RADAR.Dashboard = {
    init: function (options) {
        this.sraUrl = options.sraUrl || "http://localhost:8080/serena_ra"
        this.username = options.username || "admin";
        this.password = options.password;
        this.useProxy = options.useProxy || false;
        this.sraPath = (this.useProxy ? RADAR.Util.getSiteRoot() + "/proxy" : "") + "/serena_ra";
        this.useSSO = options.useSSO || false;
        this.refreshInterval = parseInt(options.refreshInterval) || 10;
        /*this.sraActivityReq = $.ajax({
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": true,
                "Authorization": RADAR.Util.makeBasicAuth(this.username, this.password)
            },
            url: this.sraPath + "/rest/workflow/currentActivity?orderField=startDate&sortType=desc"
        });*/
        this.sraActivityOpts = {
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": true,
                "Authorization": RADAR.Util.makeBasicAuth(this.username, this.password)
            },
            url: this.sraPath + "/rest/workflow/currentActivity?orderField=startDate&sortType=desc"
        }
        this.sraDepReportOpts = {
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": true,
                "Authorization": RADAR.Util.makeBasicAuth(this.username, this.password)
            },
            //url: this.sraPath + "/rest/report/adHoc?dateRange=currentMonth&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport"
            url: this.sraPath + "/rest/report/adHoc?dateRange=custom" +
                "&date_low=" + moment().subtract(3, 'd').valueOf() +
                "&date_hi=" + moment().valueOf() +
                "&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport"
        };

        this.cacheElements();
        this.render();
    },
    cacheElements: function () {
        this.activityTemplate = Handlebars.compile($('#activity-template').html());
        this.$dashboard = $('#dashboard');
        this.$activity = this.$dashboard.find('#activity');
        this.$activityRows = this.$activity.find('#activity-rows');
        this.$pieStatus = $('#pieStatus');
    },
    render: function (el) {
        var self = this;
        $.ajax(self.sraActivityOpts).then(function(data) {
            self.$activityRows.html(self.activityTemplate(data));
        });
        $.ajax(self.sraDepReportOpts).then(function(data) {
            var success = 0, running = 0, failed = 0, cancelled = 0;
            $.each(data.items[0], function(i, item) {
                switch (item.status) {
                    case "SUCCESS":     success++;      break;
                    case "RUNNING":     running++;      break;
                    case "FAILURE":     failed++;       break;
                    case "CANCELLED":   cancelled++;    break;
                }
            });
            self.plotChart(self.$pieStatus, success, running, failed, cancelled);
        });

        this.update();
    },
    update: function (el) {
        var self = this;
        (function activityUpdate(){
            setTimeout(function(){
                /*$.ajax({
                    cache: false,
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "DirectSsoInteraction": true,
                        "Authorization": RADAR.Util.makeBasicAuth(self.username, self.password)
                    },
                    url: self.sraPath + "/rest/workflow/currentActivity?orderField=startDate&sortType=desc"
                }).then(function(data) {*/
                $.ajax(self.sraActivityOpts).done(function(data) {
                    self.$activityRows.empty().html(self.activityTemplate(data));
                    // TODO: error handling to decide if we can loop
                    activityUpdate();
                });
            }, self.refreshInterval*1000);
        })();
        (function pieStatusUpdate(){
            setTimeout(function(){
                $.ajax(self.sraDepReportOpts).done(function(data) {
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
