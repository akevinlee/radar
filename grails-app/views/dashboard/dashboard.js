
$(document).ready(function () {
    var automationSettings = {
        debug: true,
        refreshInterval: ${session.refreshInterval}
    };
    RADAR.Dashboard.init(automationSettings);
});