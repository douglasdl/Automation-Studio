define(['brease/core/Utils'], function (Utils) {

    'use strict';

    /**
    * @class brease.datatype.StructuredProperty
    * @alternateClassName StructuredProperty
    * @extends Function
    * base class for all StructuredProperties
    
    */

    var StructuredProperty = function (options, defaultSettings) {
        if (options !== undefined && options !== null) {
            this.settings = Utils.extendDeepToNew(defaultSettings, options);
        } else {
            this.settings = Utils.deepCopy(defaultSettings);
        }
    };

    return StructuredProperty;

});
