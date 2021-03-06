angular.module('vinyldns', [
    'services.module',
    'controllers.module',
    'directives.module',
    'batch-change'
])
    .config(function ($httpProvider, $animateProvider, $logProvider) {
        $httpProvider
            .defaults.transformResponse.push(function (responseData) {
                convertDateStringsToDates(responseData);
                return responseData;
            });
        $animateProvider
            .classNameFilter(/toshow/);
        //turning off $log
        $logProvider.debugEnabled(false);
    })
    .controller('AppController', function ($scope) {
    });

var regexIso8601 = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

function convertDateStringsToDates(input) {
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) {
                value = new Date(milliseconds);
                input[key] = value.toString();
                input[key] = input[key].substring(0, 24);
            }
        } else if (typeof value === "object") {
            convertDateStringsToDates(value);
        }
    }
}
