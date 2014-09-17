
var RADAR = RADAR || {};

RADAR.TaskCount = {
    init: function (options) {
        this.debug = options.debug || false;
        this.autoUrl = options.autoUrl || "http://localhost:8080/serena_ra";
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();
        this.autoReq = RADAR.Util.getBaseAutomationRequest();

        this.autoWorkItemsUrl = this.autoPath + "autoproxy/tasks-for-user-count";

        this.countOptions = {
            useEasing : true,
            useGrouping : false,
            separator : ',',
            decimal : '.'
        };

        this.render();
    },
    cacheElements: function () {

    },
    render: function (el) {
        this._updateCounts(el);
        this.update();
    },
    update: function (el) {
        var self = this;
        (function myWorkItemsUpdate(){
            setTimeout(function(){
                self._updateCounts(self.el);
                myWorkItemsUpdate();
            }, self.refreshInterval*1000);
        })();
    },
    destroy: function (el) {

    },
    _updateCounts: function(el) {
        var self = this;
        this.$myTasksCount = jQuery('#my-task-count');
        this.autoReq.url = this.autoWorkItemsUrl;
        jQuery.ajax(this.autoReq).done(function(data) {
            var taskCount = data.count;
            if (self.debug) console.log("Found " + taskCount + " tasks for user");
            if (taskCount > 0) {
                new countUp("my-task-count", self.$myTasksCount.text(), taskCount, 0, 2, 1.5, self.countOptions).start();
            } else {
                self.$myTasksCount.text("0");
            }
        });
    }
};
