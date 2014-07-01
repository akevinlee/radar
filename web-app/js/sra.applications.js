(function($) {
    $.widget("sra.applications", {

        // default options
        options: {
            debug: false,
            linkTarget: "Home",
            sraUrl: '/serena_ra/rest/',
            sbmUrl: "/tmtrack/tmtrack.dll?",
            sraUsername: "admin",
            sraPassword: "admin"
        },

        _application: "",
        _applications: [],
        _environment: "",
        _environments: [],

        //
        // widget plugin methods
        //

        // create widget
        _create: function() {
            var self = this;

            this._getApplications();

            // create drop down list for applications
            for (var app in self._applications) {
                console.log(app);
                this.element.append('<li><a href="/applications/' + app + '">' + self._applications[app] + '</a></li>');
                //$('<option />', {value: app, text: self._applications[app]}).appendTo(appList);
            }
            //$('<option />', {value: '', text: 'All'}).prependTo(appList);

            //this._createHeader();
        },

        // initialise widget
        _init: function() {
            var self = this;
            /*
             // set options (using cookies if set)
             if (this._cookie('sra-app')) {
             $('#modified-app').val(this._cookie('rlm-environments-app'));
             self._application = this._cookie('rlm-environments-app');
             }

             // display loading text when AJAX methods being executed
             $(document).ajaxStart(function() {
             $("#loading").show();
             if (self.options.debug) console.log("loading start");
             });
             $(document).ajaxStop(function() {
             $("#loading").hide();
             if (self.options.debug) console.log("loading stop");
             });
             */
            this.update();
        },

        // destroy widget
        _destroy: function() {

        },

        //
        // private methods
        //

        _getToken: function(settings) {
             var self = this;
             if (this.token)
                return this.token;

             var ajaxToken = null;
             var ajaxSettings = {
                async: false,
                contentType: "application/json",
                dataType: "json",
                error: function(jqXHR, textStatus, errorThrown) {
                    throw { message: "Ajax error: "+errorThrown };
                },
                success: function(tokenData, textStatus, jqXHR) {
                    if (tokenData.error && tokenData.error.msg)
                    throw { message: "Token error: "+tokenData.error.msg };

                    ajaxToken = tokenData.result.token;
                },
                type: "GET",
                url: self.options.sbmUrl + "JSONPage&command=getssotoken"
             };

             if (settings)
                $.extend(ajaxSettings, settings);

             $.ajax(ajaxSettings);
             if (!ajaxSettings.async)
                this.token = ajaxToken;

             return this.token;
         },

        // get applications
        _getApplications: function(payload, settings) {
            var self = this;
            $.ajax({
                type:	"GET",
                contentType: "application/json",
                dataType: "json",
                headers: { ALFSSOAuthNToken: this._getToken() },
                //headers: {
                //    "Authorization": self._make_basic_auth(self.options.sraUsername, self.options.sraPassword)
                //},
                url:	self.options.sraUrl + "deploy/application/",
                async: false,
                success: function(apps) {
                    $.each(apps, function(i, app) {
                        if (self.options.debug) console.log(app.name + " - " + app.id);
                        self._applications[app.id] = app.name;
                    });
                },
                error: function(xhr, status) {
                    // show generic error
                    alert('An unexpected error occured (status: ' + status + ')');
                }
            });

        },

        // create the HTML for all of an environments components
        _createComponentHtml: function(obj) {
            var self = this;
            if (obj.compliancy.correctCount = obj.compliancy.desiredCount)
                statusClass = "success"
            else
                statusClass = "error"
            if (obj.hasOwnProperty('snapshot'))
                snapshot = '<a class="pageLink" href="' + self.options.sraUrl +
                    "#snapshot/" + obj.snapshot.id + 	'">' + obj.snapshot.name +
                    '</a>';
            else
                snapshot = "";
            return '<tr class="component">' +
                '<td><a class="pageLink" href="' + self.options.sraUrl + "#component/" +
                obj.component.id + "/inventory" + '">' + obj.component.name + '</a></td>' +
                '<td><a class="pageLink" href="' + self.options.sraUrl + "#version/" +
                obj.version.id + '">' + obj.version.name + '</a></td>' +
                '<td>' + snapshot + '</td>' +
                '<td><span class="' + statusClass + '">' +
                obj.status.name +
                "&nbsp(" + obj.compliancy.correctCount + "/" +
                obj.compliancy.desiredCount + ")" +
                '</span></td>' +
                '</tr>';
        },

        // create the HTML for an individual environments item
        _createEnvironmentHtml: function(obj) {
            var self = this;
            var componentsHtml = '<table id=' + obj.id + ' class="components">' +
                '<tr><th>Name</th><th>Version</th><th>Snapshot</th><th>Status</th></tr>' +
                '</table>';

            return '<li id="env' + obj.id + '">' +
                '<span class="environment">' +
                '<span class="title">' +
                '<a class="pageLink" href="' + self.options.sraUrl + "#environment/" +
                obj.id + "/inventory" + '">' + obj.name + '</a>' +
                '</span>' +
                '<span class="description" style="background:' + obj.color + ';">' +
                obj.description +
                '</span>' +
                componentsHtml +
                '</span>' +
                '</li>';
        },

        // empty the environments lists
        _empty: function() {
            this.element.empty();
        },

        /* update any changed environments items */
        _updateEnvironments: function() {
            var self = this;

            // get environments for each applications
            for (var app in self._applications) {
                // do we have an application set
                if (self._application != "") {
                    // yes, skip if this is not the application
                    if (self._application != app) {
                        if (self.options.debug) console.log("Application set to " + self._application + " skipping this application " + app);
                        continue;
                    }
                }

                $.ajax({
                    type:	"GET",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { ALFSSOAuthNToken: this._getToken() },
                    //headers: {
                    //    "Authorization": self._make_basic_auth(self.options.sraUsername, self.options.sraPassword)
                    //},
                    url:	self.options.sraUrl + "deploy/application/" + app + "/environments/false",
                    async: false,
                    success: function(envs) {
                        $.each(envs, function(i, env) {
                            if (self.options.debug) console.log(env.name);
                            self._environments[env.id] = app;
                            var liHtml = self._createEnvironmentHtml(env);
                            $('#app' + app + " ol.environments").append(liHtml);
                            if (self.options.debug) console.log("Added new environment "
                                + env.name + " for application " + app);
                        });
                    },
                    error: function(xhr, status) {
                        // show generic error
                        alert('An unexpected error occured (status: ' + status + ')');
                    }
                });
            }

            // get components for each environment
            for (var env in self._environments) {
                // do we have an application set
                /*if (self._application != "") {
                 // yes, skip if this is not an environment for the application
                 if (env != self._application) {
                 if (self.options.debug) console.log("Application set to " + self._application + " skipping this application " + app);
                 continue;
                 }
                 }*/

                $.ajax({
                    type:	"GET",
                    contentType: "application/json",
                    dataType: "json",
                    headers: { ALFSSOAuthNToken: this._getToken() },
                    //headers: {
                    //    "Authorization": self._make_basic_auth(self.options.sraUsername, self.options.sraPassword)
                    //},
                    url:	self.options.sraUrl + "deploy/environment/" + env + "/latestDesiredInventory/",
                    async: false,
                    success: function(comps) {
                        $.each(comps, function(i, comp) {
                            var compHtml = self._createComponentHtml(comp);
                            $('#' + env + " > tbody:last").after(compHtml);
                            if (self.options.debug) console.log("Added new component "
                                + comp.component.name + " for environment " + env);
                        });
                    },
                    error: function(xhr, status) {
                        // show generic error
                        alert('An unexpected error occured (status: ' + status + ')');
                    }
                });
            }

        },

        _make_basic_auth: function make_basic_auth(username, password) {
            var tok = username + ':' + password;
            var hash = btoa(tok);
            return "Basic " + hash;
        },

        _cookie: function(name, value, options) {
            if (typeof value != 'undefined') { // name and value given, set cookie
                options = options || {};
                if (value === null) {
                    value = '';
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                // CAUTION: Needed to parenthesize options.path and options.domain
                // in the following expressions, otherwise they evaluate to undefined
                // in the packed version for some reason...
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = $.trim(cookies[i]);
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },

        //
        // public methods
        //

        // set the app filter
        setAppFilter: function(filter) {
            this._application = filter;
            //this.update();
            this._cookie('rlm-environments-app', filter);
        },

        // update the table
        update: function() {
            //this._empty();
            //this._updateEnvironments();
        }

    });
})( jQuery );

