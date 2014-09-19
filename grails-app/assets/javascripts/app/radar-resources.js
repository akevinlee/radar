//= require jquery

var RADAR = RADAR || {};

RADAR.Resources = {
    init: function (options) {
        this.debug = options.debug || false;
        this.autoUrl = options.autoUrl || "http://localhost:8080/serena_ra";
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoResourcesUrl = this.autoPath + "autoproxy/all-resources";
        this.autoAgentsUrl = this.autoPath + "autoproxy/all-agents";
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
        this.resourceTemplate = Handlebars.compile(jQuery('#resource-template').html());
        this.$dashboard = jQuery('#resource-dashboard');
        this.$resources = this.$dashboard.find('#resources');
        this.$resourceRows = this.$resources.find('#resource-rows');
        this.$onResCount = this.$dashboard.find('#online-resource-count');
        this.$offResCount = this.$dashboard.find('#offline-resource-count');
        this.$runningCount = this.$dashboard.find('#running-count');
        this.$scheduledCount = this.$dashboard.find('#scheduled-count');
    },
    render: function (el) {
        //this._updateResources(el);
        this._updateActivity(el);
        this._updateCounts(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        self._updateResources(self.el); // resources only on load
        (function resourcesUpdate(){
            setTimeout(function(){
                self._updateActivity(self.el);
                self._updateCounts(self.el);
                resourcesUpdate();
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    _updateResources: function(el) {
        var self = this;
        this.autoReq.url = this.autoResourcesUrl;
        jQuery.ajax(this.autoReq).then(function(data) {
            var numResources = _.size(data);
            if (numResources > 0) {
                if (self.debug) console.log("Found " + numResources + " resources");
                self.$resourceRows.empty().html(self.resourceTemplate(data));
                jQuery('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
            }
            else
                if (self.debug) console.log("Found no resources");
        });

    },
    _updateActivity: function(el) {
        var self = this;
        self.$resourceRows.find("tr").each(function() {
            var thisTr = this;
            var resId = jQuery(this).attr('id');
            if (self.debug) console.log("Getting last request for resource " + resId)
            this.autoActivityUrl = self.autoPath + "autoproxy?url=" +
                encodeURIComponent("/rest/deploy/componentProcessRequest/table?rowsPerPage=1" +
                    "&pageNumber=1&orderField=entry.scheduledDate&sortType=desc&filterFields=resource.id" +
                    "&filterValue_resource.id=" + resId + "&filterType_resource.id=eq&filterClass_resource.id=UUID");
            jQuery.ajax(this.autoActivityUrl).then(function(data) {
                if (data.totalRecords != 0) {
                    var depReq = data.records[0];
                    var cssClass = 'info';
                    var icon = '';
                    // a scheduled request
                    if (depReq.entry.fired == false) {
                        cssClass = 'warning'
                        icon = '<span title="Deployment scheduled" data-toggle="tooltip" class="glyphicon glyphicon-time"></span>';
                    // an approval
                    } else if (depReq.approval != undefined) {
                        if (depReq.approval.finished == false) {
                            cssClass = 'warning'
                            icon = '<span title="Waiting approval" data-toggle="tooltip" class="glyphicon glyphicon-user"></span>'
                        } else if (depReq.rootTrace.state != undefined) {
                            if (depReq.rootTrace.state == "EXECUTING") {
                                cssClass = 'active';
                                icon = '<span title="Deployment running" data-toggle="tooltip" class="glyphicon glyphicon-refresh icon-refresh-animate"></span>';
                                // move row to the top
                                self.$resourceRows.find("tr:first").parents('tbody').prepend(thisTr);
                            } else {
                                switch (depReq.rootTrace.result) {
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
                    jQuery('#' + resId + "-request").html('<a data-toggle="tooltip" title="' +
                            depReq.componentProcess.name + " " + depReq.component.name + " " +
                            depReq.version.name + " to " + " " + depReq.environment.name + '"' +
                            'target="_blank" href="' + self.autoUrl +
                            '/#componentProcessRequest/' + depReq.id + '">' +
                            moment(new Date(depReq.submittedTime)).calendar() +
                            ' by ' + depReq.userName +
                            '</a>&nbsp;' + icon
                    ).removeClass().addClass(cssClass);
                }
                jQuery('a[data-toggle="tooltip"]').tooltip({'placement': 'top'});
                jQuery('span[data-toggle="tooltip"]').tooltip({'placement': 'top'});
            });
        });
    },
    _updateCounts: function(el) {
        var self = this;
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


        this.autoReq.url = this.autoDepReportUrl;
        jQuery.ajax(this.autoReq).done(function(data) {

            var results = data.items[0];
            var runningCount = _.size(_.uniq(_.where(results, { "status": "RUNNING"}), "applicationRequestId"));
            var scheduledCount = _.size(_.uniq(_.where(results, { "status": "SCHEDULED"}), "applicationRequestId"));

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
