define(['system/widgets/__ANCESTOR_NAME__/__ANCESTOR_NAME__'], 
    function (SuperClass) {

        'use strict';

        /**
        * @class widgets.__WIDGET_LIBRARY__.__WIDGET_NAME__
        * #Description
        *   
        * @breaseNote
        * @extends system.widgets.__ANCESTOR_NAME__
        *
        * @iatMeta category:Category
        * Keyboards
        * @iatMeta description:short
        * Custom keyboard
        * @iatMeta description:de
        * Custom keyboard
        * @iatMeta description:en
        * Custom keyboard
        */

        var defaultSettings = {
                html: 'widgets/__WIDGET_LIBRARY__/__WIDGET_NAME__/__WIDGET_NAME__.html',
                stylePrefix: 'widgets___WIDGET_LIBRARY_____WIDGET_NAME__',
                width: __WIDTH__,
                height: __HEIGHT__
            },
            WidgetClass = SuperClass.extend(function __WIDGET_NAME__(elem, options, deferredInit, inherited) {
                if (inherited === true) {
                    SuperClass.call(this, null, null, true, true);
                    _loadHTML(this);
                } else {
                    if (instance === undefined) {
                        SuperClass.call(this, null, null, true, true);
                        _loadHTML(this);
                        instance = this;
                    } else {
                        return instance;
                    }
                }
            }, defaultSettings),
            instance;
    
        function _loadHTML(widget) { 
            require(['text!' + widget.settings.html], function (html) {
                widget.deferredInit(document.body, html, true);
                widget.readyHandler();
            });
        }

        return WidgetClass;

    });
