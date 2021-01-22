define(['widgets/brease/KeyBoard/KeyBoard', 'widgets/brease/NumPad/NumPad', 'brease/events/BreaseEvent'], 
    function (BreaseKeyboardClass, BreaseNumPadClass, BreaseEvent) {

        'use strict';

        /**
        * @class brease.controller.KeyboardManager
        * @extends Object
        * @singleton
        */
        var controller = {

                /**
                * @method getKeyboard
                * Get widget instance of alphanumeric keyboard
                * @return {brease.objects.WidgetInstance}
                */
                getKeyboard: function () {
                    if (!keyboardInstance) {
                        keyboardInstance = new KeyboardClass();
                    }
                    return keyboardInstance;
                },

                /**
                * @method getNumPad
                * Get widget instance of numeric keyboard
                * @return {brease.objects.WidgetInstance}
                */
                getNumPad: function () {
                    if (!numPadInstance) {
                        numPadInstance = new NumPadClass();
                    }
                    return numPadInstance;
                }
            }, keyboardInstance, KeyboardClass, numPadInstance, NumPadClass;

        function _getConfig(config) {
            var classPath = '';
            if (brease.config && brease.config.virtualKeyboards) {
                var cObj = brease.config.virtualKeyboards[config];
                if (cObj) {
                    var refId = cObj.refId;
                    if (refId) {
                        var path = refId.replace(/\./g, '/');
                        classPath = path + path.substring(path.lastIndexOf('/'));
                    }
                }
            } 
            return classPath;
        }

        function _instantiateNumPad(vKeyboardClass) {

            var changedClass = NumPadClass !== vKeyboardClass;
            NumPadClass = vKeyboardClass;
            if (!numPadInstance || changedClass) {
                if (numPadInstance) {
                    numPadInstance.dispose();
                }
                numPadInstance = new NumPadClass();
            }
            
        }

        function _instantiateKeyboard(vKeyboardClass) {
            
            var changedClass = KeyboardClass !== vKeyboardClass;
            KeyboardClass = vKeyboardClass;
            if (!keyboardInstance || changedClass) {
                if (keyboardInstance) {
                    keyboardInstance.dispose();
                }
                keyboardInstance = new KeyboardClass();
            }
            
        }

        function _init() {
            if (loaded.config && loaded.resources) {
                var CustomNumPad = _getConfig('NumericKeyboard');
                if (CustomNumPad) {
                    require([CustomNumPad], function success(CustomNumPadClass) {
                        _instantiateNumPad(CustomNumPadClass);
                    }, function fail(e) { });
                } else {
                    _instantiateNumPad(BreaseNumPadClass); 
                }
                var CustomKeyboard = _getConfig('AlphanumericKeyboard');
                if (CustomKeyboard) {
                    require([CustomKeyboard], function (CustomKeyboardClass) {
                        _instantiateKeyboard(CustomKeyboardClass);
                    }, function fail(e) { });
                } else {
                    _instantiateKeyboard(BreaseKeyboardClass); 
                } 
            }
        }

        var loaded = {
            config: false,
            resources: false
        };
        
        document.body.addEventListener(BreaseEvent.CONFIG_LOADED, function () {
            loaded.config = true;
            _init();
        });
        brease.appElem.addEventListener(BreaseEvent.RESOURCES_LOADED, function () {
            loaded.resources = true;
            _init();
        });
        
        return controller;
    });
