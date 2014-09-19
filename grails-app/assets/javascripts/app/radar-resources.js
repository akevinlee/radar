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
        this.$dashboard = jQuery('#app-dashboard');
        this.$resources = this.$dashboard.find('#resources');
        this.$resourceRows = this.$resources.find('#resource-rows');
        this.$onResCount = this.$dashboard.find('#online-resource-count');
        this.$offResCount = this.$dashboard.find('#offline-resource-count');
        this.$runningCount = this.$dashboard.find('#running-count');
        this.$scheduledCount = this.$dashboard.find('#scheduled-count');
    },
    render: function (el) {
        this._updateResources(el);
        this._updateActivity(el);
        this._updateCounts(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        (function resourcesUpdate(){
            setTimeout(function(){
                self._updateResources(self.el);
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
            }
            else
                if (self.debug) console.log("Found no resources");
        });

    },
    _updateActivity: function(el) {
        var self = this;
        this.autoReq.url = this.autoActivityUrl;
        jQuery.ajax(this.autoReq).done(function(data) {
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
