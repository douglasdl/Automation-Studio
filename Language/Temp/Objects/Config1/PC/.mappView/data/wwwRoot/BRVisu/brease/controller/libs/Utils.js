define(['brease/controller/objects/PageTypes'], function (PageTypes) {
    
    'use strict';

    /**
    * @class brease.controller.libs.Utils
    * @extends Object
    * @singleton
    */

    var stylePattern = new RegExp('.*_style_.*'),
        executeScript = 'ev' + 'al'; // forces an indirect call in global context

    function isString(item) {
        return (typeof item === 'string' || item instanceof String);
    }

    var Utils = {

        findLoaders: function (elem) {
            
            if (elem && typeof elem.querySelectorAll === 'function') {
                var loaders = elem.querySelectorAll('.systemContentLoader'),
                    length = loaders.length;
                if (length > 0) {
                    var ret = new Array(length);
                    for (var i = 0; i < length; i += 1) {
                        ret[length - (i + 1)] = loaders[i];
                    }
                    return ret;
                }
            }
            return [];
        },

        resetContentControls: function (elem) {
            if (elem && typeof elem.querySelectorAll === 'function') {
                var elems = elem.querySelectorAll('.breaseContentControl');

                for (var i = 0; i < elems.length; i += 1) {
                    brease.uiController.callWidget(elems[i].id, 'reset');
                } 
            }
        },

        setPageStyle: function (styleName, container, type) {

            if (isString(styleName) && isString(type)) {
                var $el = $(container), //container is either a HTMLElement or an id-selector
                    styleClass = Utils.pageStyleName(styleName, type);
                if ($el.length > 0) {
                    if (type === PageTypes.DIALOG) {
                        $el = $el.closest('[data-brease-widget="widgets/brease/DialogWindow"]');
                    }
                    var classList = $el[0].classList;

                    if (classList.contains(styleClass) === false) {

                        for (var i in classList) {
                            if (stylePattern.test(classList[i])) {
                                $el.removeClass(classList[i]);
                            }
                        }
                        $el.addClass(styleClass);
                    } 
                }
            }
        },

        pageStyleName: function (styleName, type) {
            return 'system_brease_' + type + '_style_' + styleName;
        },

        appendHTML: function (elem, html) {
            if (elem && elem.innerHTML !== undefined && isString(html)) {
                elem.innerHTML = html;
                var scripts = elem.querySelectorAll('script');
                for (var i = 0; i < scripts.length; i += 1) {
                    window[executeScript](scripts[i].textContent);
                    scripts[i].parentNode.removeChild(scripts[i]);
                }
            }
        },

        injectCSS: function (css) {
            var styleElement;
            if (isString(css)) {
                if (!this.headElem) {
                    this.headElem = document.getElementsByTagName('head')[0];
                }
                styleElement = document.createElement('style');
                styleElement.textContent = css;
                this.headElem.appendChild(styleElement); 
            }
            return styleElement;
        }

    };

    return Utils;
});
