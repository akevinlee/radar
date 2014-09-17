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
        if (self.debug) console.log("Job changed to " + job);

        this.buildReq.url = this.basePath + "buildproxy?url=" +
            encodeURIComponent("/job/" + job + "/api/json?tree=property[parameterDefinitions[*]]");
        this.buildReq.beforeSend =  function(){};
        $.ajax(this.buildReq).done(function(data) {
            var numParams = _.size(data.property[0].parameterDefinitions);
            $('#parameters > tbody').empty();
            if (numParams > 0) {
                if (self.debug) console.log("Found " + numParams + " parameters");
                $.each(data.property[0].parameterDefinitions, function (index, parameter) {
                    var paramField = "";
                    var defaultVal = "";
                    if (typeof parameter.defaultParameterValue.value !== "undefined") {
                        defaultVal = parameter.defaultParameterValue.value;
                    }
                    switch (parameter.type) {
                        case 'BooleanParameterDefinition':
                            defaultVal = "false";
                            paramField = '<input type=checkbox id="' + parameter.name + '" name="param-' + parameter.name + '" value="' + defaultVal+ '"/>';
                            break;
                        case 'StringParameterDefinition':
                        case 'TextParameterDefinition':
                            paramField = '<input type=text id="' + parameter.name + '" name="param-' + parameter.name + '" value="' + defaultVal+ '"/>';
                            break;
                        case 'PasswordParameterDefinition':
                            paramField = '<input type=password id="' + parameter.name+ '" name="param-' + parameter.name + '" value="' + defaultVal + '"/>';
                            break;
                        case 'ChoiceParameterDefinition':
                            paramField = '<select id="' + parameter.name + '" name="param-' + parameter.name + '">';
                            $.each(parameter.choices, function(index, choice) {
                                paramField += '<option value="' + choice + '">' + choice + '</option>';
                            });
                            paramField += '</select>';
                            break;
                        default:
                            paramField = "unknown property name";
                            break;
                    }
                    $('#parameters > tbody:last').append('<tr><td>' + parameter.name + '</td>' +
                        '<td class="value">' + paramField + '</td>' +
                        '<td class="id" style="display:none">' + parameter.name + '</td></tr>');
                });
            } else {
                if (self.debug) console.log("Found no parameters");
                $('#parameters > tbody:last').append('<tr><td class="name">No parameters found</td>' +
                    '<td class="value"></td>' +
                    '<td class="id" style="display:none"></td></tr>');
            }
        });

    }
};
