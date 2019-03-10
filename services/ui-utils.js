/**
 * Created by stasfainberg on 09/03/19.
 */
angular.module('c4Utils', [])
.service('UiService', function() {

        this.NOT_EMPTY = function() {
            return this.value != undefined && this.value != '';
        };

        this.newField = function newField(defaultValue, validateCallback) {
            return {
                hasError: false,
                value: defaultValue,
                validate: validateCallback
            };
        };

        this.checkErrors = function(fields) {

            var result = true;

            for(var i in fields) {

                fields[i].hasError = false;

                if(fields[i].validate != undefined && !fields[i].validate()) {
                    fields[i].hasError = true;
                    result = false;
                }
            }

            return result;
        };

        this.buildRouteWithParams = function(path, params) {
            var route = path + '/';
            for(var i in params) {
                route += params[i] + '/';
            }
            return route;
        };
});