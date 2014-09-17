//= require jquery

var RADAR = RADAR || {};

RADAR.BuildJob = {
    init: function (options) {
        this.debug = options.debug || false;
        this.buildUrl = options.buildUrl || "http://localhost:8080/jenkins"
        this.jobName = options.job || "";

        // all REST queries go through proxy
        this.basePath = RADAR.Util.getBaseURL();
        this.buildReq = RADAR.Util.getBaseBuildRequest();

        this.buildJobsUrl = this.basePath + "buildproxy/jobs";

        this.loadingHtml = "<option disabled>loading...</option>";

        this.cacheElements();
        this.bindEvents();
        this.render();
    },
    cacheElements: function () {
        this.optionsTemplate = Handlebars.compile($('#options-template').html());
        this.$jobs = $('#build-jobs');
        this.$job = this.$jobs.find('#job');
    },
    bindEvents: function () {
        this.$job.on('keyup', this.jobChanged.bind(this));
        this.$job.on('change', this.jobChanged.bind(this));
    },
    render: function (el) {
        this._updateJobs(el);
    },
    destroy: function (el) {

    },
    _updateJobs: function(el) {
        var self = this;
        this.buildReq.url = this.buildJobsUrl;
        this.buildReq.beforeSend =  function(){ self.$job.html(self.loadingHtml) };
        $.ajax(this.buildReq).done(function(data) {
            var numJobs = _.size(data.jobs);
            if (numJobs > 0) {
                if (self.debug) console.log("Found " + numJobs + " jobs");
                self.$job.empty().html(self.optionsTemplate(data.jobs));
                if (self.jobName != "") {
                    if (self.debug) console.log("Setting default job to " + self.jobName)
                    self.$job.val(self.jobName);
                    self.$job.trigger("change");
                }
            }
            else
                if (self.debug) console.log("Found no jobs");
        });
    },
    jobChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var job = $select.val().trim();
        //var appName = $('#applicationId option:selected').text().trim();
        if (self.debug) console.log("Job changed to " + job);

        /*self.$application.val(appName);
        this.autoReq.url = this.autoPath + "autoproxy?url=" +
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
                self.$environmentId.empty().html(self.optionsTemplate(data));
            }
            else
            if (self.debug) console.log("Found no environments");
        });*/

    }
};
