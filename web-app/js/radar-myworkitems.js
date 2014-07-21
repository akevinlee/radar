
var RADAR = RADAR || {};

RADAR.MyWorkItems = {
    init: function (options) {
        this.debug = options.debug || false;
        this.useSSO = options.useSSO || true; // assume SSO is enabled
        this.refreshInterval = parseInt(options.refreshInterval) || 10;

        // all REST queries go through proxy
        this.autoPath = RADAR.Util.getBaseURL();

        // default options for SDA rest query
        this.autoReq = {
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {
                "DirectSsoInteraction": (this.useSSO ? true : false)
            },
            url: this.autoPath
        };

        this.autoWorkItemsUrl = this.autoPath + "proxy?url=/rest/approval/task/tasksForUserCount";

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
        this.$myTasksCount = $('#my-tasks-count');
        this.autoReq.url = this.autoWorkItemsUrl;
        $.ajax(this.autoReq).done(function(data) {
            var workItemCount = data.count;
            if (self.debug) console.log("Found " + workItemCount + " work items for user");
            if (workItemCount > 0) {
                new countUp("my-tasks-count", self.$myTasksCount.text(), workItemCount, 0, 2, 1.5, self.countOptions).start();
            } else {
                self.$myTasksCount.text("0");
            }
        });
    }
};
