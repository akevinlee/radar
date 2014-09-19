//= require jquery

var RADAR = RADAR || {};

RADAR.Dashboard = {
    init: function (options) {
        this.debug = options.debug || false;
        this.autoUrl = options.autoUrl || "http://localhost:8080/serena_ra";
        this.maxApps = parseInt(options.maxApps) || 5;
        this.maxUsers = parseInt(options.maxUsers) || 5;
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        this.depCount = 0; // the current number of deployments

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoAppsUrl = this.autoPath + "autoproxy/all-applications";
        this.autoCompsUrl = this.autoPath + "autoproxy/all-components";
        this.autoEnvsUrl = this.autoPath + "autoproxy/all-global-environments";
        this.autoResourcesUrl = this.autoPath + "autoproxy/all-resources";
        this.autoAgentsUrl = this.autoPath + "autoproxy/all-agents";
        this.autoActivityUrl = this.autoPath + "autoproxy/current-activity";
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
        this.activityTemplate = Handlebars.compile(jQuery('#activity-template').html());
        this.$dashboard = jQuery('#dashboard');
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
            jQuery.ajax(this.autoReq).then(function(data) {
                var numComps = _.size(data);
                if (self.debug) console.log("Found " + numComps + " components");
                if (numComps > 0)
                    new countUp("comp-count", self.$compCount.text(), numComps, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$compCount.text("0");
            });
        } else {
            this.autoReq.url = this.autoAppsUrl;
            jQuery.ajax(this.autoReq).then(function(data) {
                var numApps = _.size(data);
                if (self.debug) console.log("Found " + numApps + " applications");
                if (numApps > 0)
                    new countUp("app-count", self.$appCount.text(), numApps, 0, 2, 1.5, self.countOptions).start();
                else
                    self.$appCount.text("0");
            });
        }
        this.autoReq.url = this.autoEnvsUrl;
        jQuery.ajax(this.autoReq).then(function(data) {
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
            jQuery.ajax(this.autoReq).then(function(data) {
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
            jQuery.ajax(this.autoReq).then(function(data) {
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
        jQuery.ajax(this.autoReq).done(function(data) {
            if (self.debug) console.log("Found " + _.size(data) + " active deployments");
            self.$activityRows.empty().html(self.activityTemplate(data));
            jQuery('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
        });
    },
    _updateStatus: function(el) {
        var self = this;
        this.autoReq.url = this.autoDepReportUrl;
        jQuery.ajax(this.autoReq).done(function(data) {

            var results = data.items[0];
            var successData = _.uniq(_.where(results, { "status": "SUCCESS"}), "applicationRequestId");
            var failureData = _.uniq(_.where(results, { "status": "FAILURE"}), "applicationRequestId");
            var runningData = _.uniq(_.where(results, { "status": "RUNNING"}), "applicationRequestId");
            var scheduledData = _.uniq(_.where(results, { "status": "SCHEDULED"}), "applicationRequestId");
            var approvalData = _.uniq(_.where(results, { "status": "AWAITING_APPROVAL"}), "applicationRequestId");
            var rejectedData = _.uniq(_.where(results, { "status": "APPROVAL_REJECTED"}), "applicationRequestId");
            var successCount = _.size(successData);
            var failureCount = _.size(failureData);
            var runningCount = _.size(runningData);
            var scheduledCount = _.size(scheduledData);
            var approvalCount = _.size(approvalData);
            var rejectedCount = _.size(rejectedData);

            if (self.debug) console.log("Found " + successCount + " successful, " + failureCount + " failed deployments");

            // ignore running for deployment count
            var newDepCount = successCount + failureCount + approvalCount + rejectedCount;
            // has the number of deployments changes
            if (self.depCount != newDepCount) {
                self.depCount = newDepCount;
            } else {
                return;
            }

            if (successCount > 0) {
                self._drawGauge(self.$depSuccess, "Successfull Deployments", "Success", successCount,
                    self.depCount, "#339933");
            } else {
                self.$depSuccess.find(".text-muted").text("none in range");
            }
            if (failureCount > 0) {
                self._drawGauge(self.$depFailure, "Failed Deployments", "Success", failureCount,
                    self.depCount, "#FF0000");
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

            var appSuccess = _.chain(successData).sortBy("application").countBy("application").value();
            var appFailure = _.chain(failureData).sortBy("application").countBy("application").value();
            var userSuccess = _.chain(successData).sortBy("user").countBy("user").value();
            var userFailure = _.chain(failureData).sortBy("user").countBy("user").value();
            var count = 0;

            if (successCount + failureCount > 0) {
                var appCategories = [];
                var appSuccessData = [];
                var appFailureData = [];
                // extract application success and failure counts
                count = 0;
                jQuery.each(appSuccess, function(i, val) {
                    if (count++ < self.maxApps) {
                        if (!_.contains(appCategories, i)) appCategories.push(i);
                        appSuccessData.push(val);
                    }
                });
                count = 0;
                jQuery.each(appFailure, function(i, val) {
                    if (count++ < self.maxApps) {
                        if (!_.contains(appCategories, i)) appCategories.push(i);
                        appFailureData.push(val);
                    }
                });
                var appData = [{
                    name: 'Failure',
                    data: appFailureData
                }, {
                    name: 'Success',
                    data: appSuccessData
                }];
                self._drawBarChart(self.$appStatus, "Top Applications",
                    "Number of Deployments", appCategories, appData);

                var userCategories = [];
                var userSuccessData = [];
                var userFailureData = [];
                count = 0;
                // extract user success and failure counts
                jQuery.each(userSuccess, function(i, val) {
                    if (count++ < self.maxUsers) {
                        if (!_.contains(userCategories, i)) userCategories.push(i);
                        userSuccessData.push(val);
                    }
                });
                count = 0;
                jQuery.each(userFailure, function(i, val) {
                    if (count++ < self.maxUsers) {
                        if (!_.contains(userCategories, i)) userCategories.push(i);
                        userFailureData.push(val);
                    }
                });
                var userData = [{
                    name: 'Failure',
                    data: userFailureData
                }, {
                    name: 'Success',
                    data: userSuccessData

                }];
                self._drawBarChart(self.$userStatus, "Top Users",
                    "Number of Deployments", userCategories, userData);
            } else {
                if (self.debug) console.log("Found no deployments in range");
                self.$appStatus.find(".text-muted").text("none in range");
                self.$userStatus.find(".text-muted").text("none in range");
                self.$activityRows.html('<tr><td align="center" colspan="7">no deployments in range</td></tr>');
            }
        });
    },
    _drawBarChart: function(el, title, subTitle, categories, data) {
        var chart = jQuery(el).highcharts();
        // do we need to update the chart
        if (chart != null) {
            if (self.debug) console.log("Updating chart " + title);
            jQuery(el).empty(); // clear element
        }
        jQuery(el).highcharts({
            chart: {
                type: 'bar',
                animation: {
                    duration: 1500,
                    easing: 'easeOutBounce'
                }
            },
            colors: ['#FF0000', '#339933', '#0000C0'],
            title: {
                text: title,
                style: {
                    fontSize: '18px',
                    fontFamily: '"HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif',
                    fontWeight: 'normal',
                    color: '#1b94c1'
                }
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: subTitle
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: data,
        });
    },
    _drawGauge: function(el, title, name, count, max, color) {
        var chart = jQuery(el).highcharts();
        // do we need to update the chart
        if (chart != null) {
            if (self.debug) console.log("Updating chart " + title);
            jQuery(el).empty(); // clear element
        }
        jQuery(el).highcharts({
            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: "",
            pane: {
                center: ['50%', '85%'],
                size: '125%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            yAxis: {
                stops: [
                    [1, color]
                ],
                lineWidth: 0,
                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    y: 16
                },
                min: 0,
                max: max,
                title: {
                    text: title,
                    style: {
                        fontSize: '18px',
                        fontFamily: '"HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif',
                        fontWeight: 'normal',
                        color: '#1b94c1'
                    },
                    y: -80
                },
                plotBands: [{
                    from: 0,
                    to: count,
                    color: color
                }]
            },
            plotOptions: {
                gauge: {
                    dataLabels: {
                        y: 0,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: name,
                data: [count],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        color + '">{y}</span></div>'
                }
            }]
        });
    }
};
