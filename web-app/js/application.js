
//
// Settings object to be passed to any SRA Javascript
//
var sraSettings = {
    sraUrl: "${settingsInstance.sraUrl}",
    sraUsername: "${settingsInstance.sraUsername}",
    sraPassword: "${settingsInstance.sraPassword}",
    useProxy: "${settingsInstance.useProxy}",
    refreshInterval: "${settingsInstance.refreshInterval}"
};

moment().format();
