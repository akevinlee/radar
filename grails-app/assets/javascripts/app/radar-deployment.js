//= require jquery

var RADAR = RADAR || {};

RADAR.Deployment = {
    init: function (options) {
        this.debug = options.debug || false;
        this.applicationId = options.applicationId || "";
        this.environmentId = options.environmentId || "";
        this.processId = options.processId || "";
        this.type = options.type || "version";

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoAppsUrl = this.autoPath + "autoproxy/all-applications";
        this.autoCompsUrl = this.autoPath + "autoproxy/all-components";

        this.loadingHtml = "<option disabled>loading...</option>";

        this.cacheElements();
        this.bindEvents();
        this.render();
    },
    cacheElements: function () {
        this.optionsTemplate = Handlebars.compile($('#options-template').html());
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
                self.$applicationId.empty().html(self.optionsTemplate(data));
                if (self.applicationId != "") {
                    if (self.debug) console.log("Setting default application to " + self.applicationId)
                    self.$applicationId.val(self.applicationId);
                    self.$applicationId.trigger("change");
                }
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
        });
        this.autoReq.url = this.autoPath + "autoproxy?url=" +
            encodeURIComponent("/rest/deploy/application/" + appId +
                "/executableProcesses");
        $.ajax(this.autoReq).done(function(data) {
            var numProcs = _.size(data);
            if (numProcs > 0) {
                if (self.debug) console.log("Found " + numProcs + " processes");
                self.$processId.empty().html(self.optionsTemplate(data));
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
        var procId = self.$processId.val();
        var appId = self.$applicationId.val();
        if (self.debug) console.log("Environment changed to " + envName + "/" + envId);

        self.$environment.val(envName);

        if (self.type == "snapshot") {
            this.autoReq.url = this.autoPath + "autoproxy?url=" +
                encodeURIComponent("/rest/deploy/application/" + appId + "/" + envId +
                    "/snapshotsForEnvironment/false");
            this.autoReq.beforeSend = function () {
                self.$snapshotId.html(self.loadingHtml)
            };
            $.ajax(this.autoReq).done(function (data) {
                var numSnaps = _.size(data);
                if (numSnaps > 0) {
                    if (self.debug) console.log("Found " + numSnaps + " snapshots");
                    self.$snapshotId.empty().html(self.optionsTemplate(data));
                }
                else if (self.debug) console.log("Found no snapshots");
            });
        } else {
            this.autoReq.url = this.autoPath + "autoproxy?url=" +
                encodeURIComponent("/rest/deploy/applicationProcess/" + procId + "/-1");
            this.autoReq.beforeSend =  function(){};

            $.ajax(this.autoReq).then(function(data) {
                var numComps = _.size(data.componentsTakingVersions);
                $('#versions > tbody').empty();
                if (numComps > 0) {
                    if (self.debug) console.log("Found " + numComps + " components");
                    $.each(data.componentsTakingVersions, function(index, component) {
                        var compId = component.id;
                        var compName = component.name;
                        $('#versions > tbody:last').append('<tr><td class="name">' + compName + '</td>' +
                            '<td id="' + compId + '">' +
                            '<select class="version form-control" id="' + compId + '-selector" name="cver-' + compId + '">' +
                            '<option value="latestVersion/">Latest Version</option>' +
                            '</select>' +
                            '</td></tr>');
                        self.autoReq.url = self.autoPath + "autoproxy?url=" +
                            encodeURIComponent("/rest/deploy/environment/" + envId + "/versions/" + compId);
                        self.autoReq.beforeSend =  function(){};
                        $.ajax(self.autoReq).then(function(data) {
                            $.each(data, function(index, version) {
                                $('#' + compId + "-selector").append($('<option>', {
                                    value: version.id,
                                    text : version.name
                                }));
                            });
                        });
                    });
                } else {
                    if (self.debug) console.log("Found no components");
                    $('#versions > tbody:last').append('<tr><td>No components found</td></tr>');
                }
            });
        }
    },
    procChanged: function (e) {
        var self = this;
        var $select = $(e.target);
        var procId = $select.val().trim();
        var procName = $('#processId option:selected').text().trim();
        if (self.debug) console.log("Process changed to " + procName + "/" + procId);

        self.$process.val(procName);
        this.autoReq.url = this.autoPath + "autoproxy?url=" +
            encodeURIComponent("/rest/deploy/applicationProcess/" + procId + "/-1");
        this.autoReq.beforeSend =  function(){};
        $.ajax(this.autoReq).done(function(data) {
            var numProps = _.size(data.propDefs);
            $('#properties > tbody').empty();
            if (numProps > 0) {
                if (self.debug) console.log("Found " + numProps + " properties");
                $.each(data.propDefs, function (index, property) {
                    var propField = "";
                    switch (property.type) {
                        case 'CHECKBOX':
                            propField = '<input type="checkbox" id="' + property.id + '" name="prop-' + property.name + '" value="' +
                                (property.value == true ? 'checked' : '')
                                + '"/>';
                            break;
                        case 'TEXT':
                            propField = '<input type="text" class="form-control" id="' + property.id + '" name="prop-' + property.name + '" value="' + property.value + '"/>';
                            break;
                        case 'SECURE':
                            propField = '<input type="password" class="form-control" id="' + property.id + '" name="prop-' + property.name + '" value="' + property.value + '"/>';
                            break;
                        case 'SELECT':
                            propField = '<select class="form-control" id="' + property.id + '" name="prop-' + property.name + '">';
                            $.each(property.allowedValues, function (index, av) {
                                propField += '<option value="' + av.value + '">' + av.label + '</option>';
                            });
                            propField += '</select>';
                            break;
                        default:
                            propField = "unknown property name";
                            break;
                    }
                    $('#properties > tbody:last').append('<tr><td>' + property.label + '</td>' +
                        '<td class="value">' + propField + '</td>' +
                        '<td class="id" style="display:none">' + property.id + '</td></tr>');
                });
            } else {
                if (self.debug) console.log("Found no properties");
                $('#properties > tbody:last').append('<tr><td class="name">No properties found</td>' +
                    '<td class="value"></td>' +
                    '<td class="id" style="display:none"></td></tr>');
            }
        });
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
