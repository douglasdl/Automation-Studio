define(['system/widgets/CompoundWidget/CompoundWidget', 'brease/core/Types'], function (SuperClass, Types) {

    'use strict';

    /**
    * @class widgets.__WIDGET_LIBRARY__.__WIDGET_NAME__
    * #Description
    *   
    * @breaseNote
    * @extends system.widgets.CompoundWidget
__DEPENDENCIES__
    *
    * @iatMeta category:Category
    * Compound
    * @iatMeta description:short
    * CompoundWidget example
    * @iatMeta description:de
    * CompoundWidget example
    * @iatMeta description:en
    * CompoundWidget example
    */

    /*__CUSTOM_PROPS__*/
    var defaultSettings = {//__DEFAULT_SETTINGS__
        },

        propertyMapping = {
            enable: 'all',
            visible: 'all',
            permissionOperate: 'all',
            permissionView: 'all'//__CUSTOM_MAPPING__
        },

        WidgetClass = SuperClass.extend(function __WIDGET_NAME__() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        this.initMapping(propertyMapping);
        SuperClass.prototype.init.call(this);
    };

    p.setInitialValues = function () {
        //__INITIAL_CALLS__
    };
	//__METHODS__
    //__SETTER__
    //__GETTER__

    return WidgetClass;

});
