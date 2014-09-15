
Handlebars.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("prettifyDate", function(timestamp) {
    return moment(new Date(timestamp)).fromNow();
});

Handlebars.registerHelper("getStatus", function(status) {
    var cssClass = '';
    switch (status) {
        case "ONLINE":
            cssClass = 'success';   break;
        case "OFFLINE":
            cssClass = 'danger';    break;
        case "CONNECTED":
            cssClass = 'warning';   break;
    }
    return cssClass;
});

Handlebars.registerHelper('compare', function (lvalue, operator, rvalue, options) {

    var operators, result;

    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }

    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }

    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };

    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var DEBUG = true;

var RADAR = RADAR || {};

RADAR.Util = {
    getBaseURL: function () {
        var url = location.href;  // entire url including querystring - also: window.location.href;
        var baseURL = url.substring(0, url.indexOf('/', 14));

        if (baseURL.indexOf('http://localhost') != -1) {
            // Base Url for localhost
            var url = location.href;  // window.location.href;
            var pathname = location.pathname;  // window.location.pathname;
            var index1 = url.indexOf(pathname);
            var index2 = url.indexOf("/", index1 + 1);
            var baseLocalUrl = url.substr(0, index2);
            return baseLocalUrl + "/";
        }
        else {
            // Root Url for domain name
            return baseURL + "/";
        }
    },
    getSiteRoot: function () {
        var path1 = location.pathname.substr(1);
        var path2 = path1.substr(0, path1.indexOf("/"));
        return "/" + path2;
    },
    makeBasicAuth: function (username, password) {
        var tok = username + ':' + password;
        var hash = btoa(tok);
        return "Basic " + hash;
    },
    getBaseAutomationRequest: function () {
        // default options for SDA rest query
        this.autoReq = {
            beforeSend: function () {
                $("#ajaxLoader").show();
            },
            complete: function () {
                $("#ajaxLoader").hide();
            },
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {},
            url: this.autoPath
        };
        return this.autoReq;
    },
    getBaseBuildRequest: function () {
        // default options for Jenkins rest query
        this.buildReq = {
            beforeSend: function () {
                $("#ajaxLoader").show();
            },
            complete: function () {
                $("#ajaxLoader").hide();
            },
            cache: false,
            contentType: "application/json",
            dataType: "json",
            headers: {},
            url: this.buildPath
        };
        return this.buildReq;

    }
};

