define(function () {

    'use strict';

    var UtilsJSON = {};

    UtilsJSON.convertJSONtoObject = function (jsonData) {
        if (typeof jsonData === 'string' && jsonData !== '') {
            return JSON.parse(jsonData);
        }
        return jsonData;
    };

    UtilsJSON.convertObjectToJSON = function (objectData) {
        if (typeof objectData === 'object' && objectData !== '') {
            return JSON.stringify(objectData);
        }
        return objectData;
    };

    return UtilsJSON;

});
