define(['widgets/brease/Window/Window'], function (SuperClass) {

    'use strict';

    /**
    * @class system.widgets.KeyBoard
    * @extends widgets.brease.Window
    *
    * @iatMeta studio:visible
    * false
    * @iatMeta category:Category
    * System
    */
   
    var defaultSettings = {
            modal: true,
            showCloseButton: true,
            forceInteraction: false
        },

        WidgetClass = SuperClass.extend(function KeyBoardBase(elem, options, deferredInit, inherited) {
            if (inherited === true) {
                SuperClass.call(this, null, null, true, true);
            } else {
                SuperClass.call(this, null, options, true, true);
            }

        }, defaultSettings),

        p = WidgetClass.prototype;

    p.init = function () {
        this.settings.windowType = 'KeyBoard';
        SuperClass.prototype.init.apply(this, arguments);
    };

    return WidgetClass;

});
