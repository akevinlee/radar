
Handlebars.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var DEBUG = true;

var RADAR = RADAR || {};

RADAR.Util = {
    uuid: function () {
        /*jshint bitwise:false */
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }

        return uuid;
    },
    pluralize: function (count, word) {
        return count === 1 ? word : word + 's';
    },
    store: function (namespace, data) {
        if (arguments.length > 1) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        }
    },
    makeBasicAuth: function (username, password) {
        var tok = username + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
    },

    ssoToken: null,
    getSsoToken: function() {
        if (util.ssoToken == null || util.ssoToken.ssoToken == "") {
            $.ajax({
                url: "/tmtrack/tmtrack.dll?JSONPage&Command=getssotoken",
                dataType: 'json',
                async: false,
                success: function (json) {
                    util.ssoToken = json.result.token;
                }
            });
        }

        return this.ssoToken;
    }
};

