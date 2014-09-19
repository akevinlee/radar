//= require jquery

var RADAR = RADAR || {};

RADAR.Tasks = {
    init: function (options) {
        this.debug = options.debug || false;
        this.autoUrl = options.autoUrl || "http://localhost:8080/serena_ra";
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoTasksUrl = this.autoPath + "autoproxy/tasks-for-user";

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
        this.taskTemplate = Handlebars.compile(jQuery('#task-template').html());
        this.$dashboard = jQuery('#task-dashboard');
        this.$tasks = this.$dashboard.find('#tasks');
        this.$taskRows = this.$tasks.find('#task-rows');
    },
    render: function (el) {
        this._updateTasks(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        (function myTasksUpdate(){
            setTimeout(function(){
                self._updateTasks(self.el);
                myTasksUpdate();
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    _updateTasks: function(el) {
        var self = this;
        this.autoReq.url = this.autoTasksUrl;
        jQuery.ajax(this.autoReq).then(function(data) {
            var numTasks = _.size(data);
            if (numTasks > 0) {
                if (self.debug) console.log("Found " + numTasks + " tasks");
                self.$taskRows.empty().html(self.taskTemplate(data));
                jQuery('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
            }
            else
            if (self.debug) console.log("Found no tasks");
        });
    }
};
