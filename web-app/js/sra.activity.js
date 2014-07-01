(function(jQuery) {
    jQuery.widget("sra.activity", {

        // default options
        options: {
            debug: false,
            appId: "",
            sraUrl: 'http://localhost:8080/serena_ra/',
            sraUsername: "admin",
            sraPassword: "admin",
            useSSO: false,
            refreshInterval: 10
        },

        //
        // widget plugin methods
        //

        // create widget
        _create: function() {
        },

        // initialise widget
        _init: function() {
            this._getActivity();
        },

        // destroy widget
        _destroy: function() {

        },

        //
        // private methods
        //

        _dateConverter: function(timestamp){
            var a = new Date(timestamp*1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;
            return time;
        },

        _make_basic_auth: function make_basic_auth(username, password) {
            var tok = username + ':' + password;
            var hash = btoa(tok);
            return "Basic " + hash;
        },

        // get applications
        _getActivity: function(payload, settings) {
            var self = this;
            jQuery.ajax({
                type:	"GET",
                contentType: "application/json",
                //dataType: "json",
                // the name of the callback parameter, as specified by the YQL service
                jsonp: "callback",
// tell jQuery we're expecting JSONP
                dataType: "jsonp",
                //headers: { ALFSSOAuthNToken: this._getToken() },
                headers: {
                    "DirectSsoInteraction": self.options.useSSO,
                    "Authorization": self._make_basic_auth(self.options.sraUsername, self.options.sraPassword)
                },
                url:	self.options.sraUrl + "report/adHoc?dateRange=currentMonth&orderField=application&sortType=asc&type=com.urbancode.ds.subsys.report.domain.deployment_report.DeploymentReport&username=admin&password=admin",
                async: false,
                success: function(data) {
                    var success = 0; var running = 0; var failed = 0; var cancelled = 0;
                    jQuery.each(data.items[0], function(i, item) {
                        switch (item.status) {
                            case "SUCCESS":     success++; break;
                            case "RUNNING":     running++; break;
                            case "FAILURE":     failed++; break;
                            case "CANCELLED":   cancelled++; break;
                        }
                        self.element.append('<tr>' +
                            '<td>' + item.application + '</td>' +
                            '<td>' + item.environment + '</td>' +
                            '<td>' + moment.unix(item.date).format('MMMM Do YYYY, h:mm:ss a') + '</td>' +
                            '<td>' + item.user + '</td>' +
                            '<td>' + item.status + '</td>' +
                            '<td>' + moment.duration(item.duration, "minutes").humanize() + '</td>' +
                            '<td><a href="/serena_ra/#applicationProcessRequest/' + item.applicationRequestId + '">View Request</a></td>' +
                            '</tr>');
                    });
                    var statusData = [
                        { label: "Success",  data: success},
                        { label: "Running",  data: running},
                        { label: "Failed",  data: failed},
                        { label: "Cancelled",  data: cancelled}
                    ];
                    jQuery.plot('#pieStatus', statusData, {
                        series: {
                            pie: {
                                innerRadius: 0.5,
                                show: true
                            }
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        },
                        legend: {
                            show: false
                        },
                        colors: ["#78CD51", "#2FABE9", "#FA5833", "#FABB3D"]
                    });
                },
                error: function(xhr, status) {
                    // show generic error
                    alert('An unexpected error occured (status: ' + status + ')');
                }
            });

        },

        // empty the environments lists
        _empty: function() {
            this.element.empty();
        },

        //
        // public methods
        //

        // update the table
        update: function() {
            this._empty();
            //this._getActivity();
        }

    });
});

