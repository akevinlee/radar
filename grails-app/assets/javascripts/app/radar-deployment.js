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

        this.loadingHtml = "<option disabled>loading...</option>";

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
        this.$applicationId = this.$deployment.find('#applicationId');
        this.$processId = this.$deployment.find('#processId');
        this.$environmentId = this.$deployment.find('#environmentId');
        this.$snapshotId = this.$deployment.find('#snapshotId');
        this.$application = this.$deployment.find('#application');
        this.$process = this.$deployment.find('#process');
        this.$environment = this.$deployment.find('#environment');
        this.$snapshot = this.$deployment.find('#snapshot');
    },
    bindEvents: function () {
        this.$applicationId.on('keyup', this.appChanged.bind(this));
        this.$applicationId.on('change', this.appChanged.bind(this));
        this.$environmentId.on('keyup', this.envChanged.bind(this));
        this.$environmentId.on('change', this.envChanged.bind(this));
        this.$processId.on('keyup', this.procChanged.bind(this));
        this.$processId.on('change', this.procChanged.bind(this));
        this.$snapshotId.on('keyup', this.snapChanged.bind(this));
        this.$snapshotId.on('change', this.snapChanged.bind(this));
    },
    render: function (el) {
        this._updateApplications(el);
    },
    destroy: function (el) {

    },
    _updateApplications: function(el) {
        var self = this;
        this.autoReq.url = this.autoAppsUrl;
        this.autoReq.beforeSend =  function(){ self.$applicationId.html(self.loadingHtml) };
        $.ajax(this.autoReq).done(function(data) {
            var numApps = _.size(data);
            if (numApps > 0) {
                if (self.debug) console.log("Found " + numApps + " applications");
                self.$applicationId.empty().html(self.applicationsTemplate(data));
            }
            else
                if (self.debug) console.log("Found no applications");
        });
    },
    appChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var appId = $select.val().trim();
        var appName = $('#applicationId option:selected').text().trim();
        if (self.debug) console.log("Application changed to " + appName + "/" + appId);

        self.$application.val(appName);
        this.autoReq.url = this.autoPath + "proxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId +
                "/environments/false");
        this.autoReq.beforeSend =  function(){
            self.$environmentId.html(self.loadingHtml);
            self.$processId.html(self.loadingHtml)
        };
        $.ajax(this.autoReq).done(function(data) {
            var numEnvs = _.size(data);
            if (numEnvs > 0) {
                if (self.debug) console.log("Found " + numEnvs + " environments");
                self.$environmentId.empty().html(self.environmentsTemplate(data));
            }
            else
            if (self.debug) console.log("Found no environments");
        });
        this.autoReq.url = this.autoPath + "proxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId +
                "/executableProcesses");
        $.ajax(this.autoReq).done(function(data) {
            var numProcs = _.size(data);
            if (numProcs > 0) {
                if (self.debug) console.log("Found " + numProcs + " processes");
                self.$processId.empty().html(self.processesTemplate(data));
            }
            else
            if (self.debug) console.log("Found no processes");
        });
    },
    envChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var envId = $select.val().trim();
        var envName = $('#environmentId option:selected').text().trim();
        var appId = self.$applicationId.val();
        if (self.debug) console.log("Environment changed to " + envName + "/" + envId);

        self.$environment.val(envName);
        this.autoReq.url = this.autoPath + "proxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId + "/" + envId +
                "/snapshotsForEnvironment/false");
        this.autoReq.beforeSend =  function(){ self.$snapshotId.html(self.loadingHtml) };
        $.ajax(this.autoReq).done(function(data) {
            var numSnaps = _.size(data);
            if (numSnaps > 0) {
                if (self.debug) console.log("Found " + numSnaps + " snapshots");
                self.$snapshotId.empty().html(self.snapshotsTemplate(data));
            }
            else
            if (self.debug) console.log("Found no snapshots");
        });
    },
    procChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var procId = $select.val().trim();
        var procName = $('#processId option:selected').text().trim();
        if (self.debug) console.log("Process changed to " + procName + "/" + procId);
        self.$process.val(procName);
    },
    snapChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var snapId = $select.val().trim();
        var snapName = $('#snapshotId option:selected').text().trim();
        if (self.debug) console.log("Snapshot changed to " + snapName + "/" + snapId);
        self.$snapshot.val(snapName);
    }
};
