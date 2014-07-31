//= require jquery

var RADAR = RADAR || {};

RADAR.Deployment = {
    init: function (options) {
        this.debug = options.debug || false;
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoAppsUrl = this.autoPath + "proxy/all-applications";
        this.autoCompsUrl = this.autoPath + "proxy/all-components";

        this.cacheElements();
        this.bindEvents();
        this.render();
    },
    cacheElements: function () {
        this.applicationsTemplate = Handlebars.compile($('#applications-template').html());
        this.environmentsTemplate = Handlebars.compile($('#environments-template').html());
        this.snapshotsTemplate = Handlebars.compile($('#snapshots-template').html());
        this.processesTemplate = Handlebars.compile($('#processes-template').html());
        this.$deployment = $('#app-deployment');
        this.$applications = this.$deployment.find('#application');
        this.$processes = this.$deployment.find('#process');
        this.$environments = this.$deployment.find('#environment');
        this.$snapshots = this.$deployment.find('#snapshot');
    },
    bindEvents: function () {
        this.$applications.on('keyup', this.appChanged.bind(this));
        this.$applications.on('change', this.appChanged.bind(this));
        this.$environments.on('keyup', this.envChanged.bind(this));
        this.$environments.on('change', this.envChanged.bind(this));
    },
    render: function (el) {
        this._updateApplications(el);
        //this._updateActivity(el);
        //this._updateCounts(el);
        //this.update();
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
                self.$applications.empty().html(self.applicationsTemplate(data));
            }
            else
                if (self.debug) console.log("Found no applications");
        });
    },
    _updateEnvironments: function(el) {

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
    },
    appChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var appId = $select.val().trim();
        if (self.debug) console.log("Application changed to " + appId);
        this.autoReq.url = this.autoPath + "proxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId +
                "/environments/false");
        $.ajax(this.autoReq).then(function(data) {
            var numEnvs = _.size(data);
            if (numEnvs > 0) {
                if (self.debug) console.log("Found " + numEnvs + " environments");
                self.$environments.empty().html(self.environmentsTemplate(data));
            }
            else
            if (self.debug) console.log("Found no environments");
        });
        this.autoReq.url = this.autoPath + "proxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId +
                "/executableProcesses");
        $.ajax(this.autoReq).then(function(data) {
            var numProcs = _.size(data);
            if (numProcs > 0) {
                if (self.debug) console.log("Found " + numProcs + " processes");
                self.$processes.empty().html(self.processesTemplate(data));
            }
            else
            if (self.debug) console.log("Found no processes");
        });
    },
    envChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var envId = $select.val().trim();
        var appId = self.$applications.val();
        if (self.debug) console.log("Environment changed to " + envId);
        this.autoReq.url = this.autoPath + "proxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId + "/" + envId +
                "/snapshotsForEnvironment/false");
        $.ajax(this.autoReq).then(function(data) {
            var numSnaps = _.size(data);
            if (numSnaps > 0) {
                if (self.debug) console.log("Found " + numSnaps + " snapshots");
                self.$snapshots.empty().html(self.snapshotsTemplate(data));
            }
            else
            if (self.debug) console.log("Found no snapshots");
        });
    }
};
