define(['brease/events/BreaseEvent',
    'brease/controller/WidgetController',
    'brease/controller/PageController', 
    'brease/controller/BindingController', 
    'brease/controller/ActionController',
    'brease/controller/objects/Client',
    'brease/services/RuntimeService',
    'brease/helper/stubs/ServiceBridge',
    'brease/helper/stubs/WebSocket'],
function (BreaseEvent, widgetController, pageController, bindingController, actionController, client, runtimeService, serviceBridge, socketStub) {

    'use strict';

    var _langDeferred, _mmsDeferred, _cultureDeferred;

    function switchLang(lang) {
        _langDeferred = $.Deferred();
        document.body.addEventListener(BreaseEvent.LANGUAGE_CHANGED, switchLangReadyHandler);
        if (brease.language.getCurrentLanguage() !== lang) {
            brease.language.switchLanguage(lang);
        } else {
            _langDeferred.resolve();
        }
        return _langDeferred.promise();
    }

    function switchLangReadyHandler() {
        document.body.removeEventListener(BreaseEvent.LANGUAGE_CHANGED, switchLangReadyHandler);
        _langDeferred.resolve();
    }

    function switchMMS(mms) {
        _mmsDeferred = $.Deferred();
        document.body.addEventListener(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, switchMmsReadyHandler);
        if (brease.measurementSystem.getCurrentMeasurementSystem() !== mms) {
            brease.measurementSystem.switchMeasurementSystem(mms);
        } else {
            _mmsDeferred.resolve();
        }
        return _mmsDeferred.promise();
    }

    function switchMmsReadyHandler() {
        document.body.removeEventListener(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, switchMmsReadyHandler);
        _mmsDeferred.resolve();
    }

    function switchCulture(culture) {
        _cultureDeferred = $.Deferred();
        document.body.addEventListener(BreaseEvent.CULTURE_CHANGED, switchCultureReadyHandler);
        if (brease.culture.getCurrentCulture().key !== culture) {
            brease.culture.switchCulture(culture);
        } else {
            _cultureDeferred.resolve();
        }
        return _cultureDeferred.promise();
    }

    function switchCultureReadyHandler() {
        document.body.removeEventListener(BreaseEvent.CULTURE_CHANGED, switchCultureReadyHandler);
        _cultureDeferred.resolve();
    }

    function setConditions(conditions, callback) {
        var preconditions = [];
        if (conditions.lang !== undefined) {
            preconditions.push(switchLang(conditions.lang));
        }
        if (conditions.mms !== undefined) {
            preconditions.push(switchMMS(conditions.mms));
        }
        if (conditions.culture !== undefined) {
            preconditions.push(switchCulture(conditions.culture));
        }
        $.when.apply(null, preconditions).then(function () {
            callback();
        });
    }

    var TestUtils = {

        preConditions: function (title, conditions) {

            describe(title, function () {
                it('', function () {
                    var ready = jasmine.createSpy();

                    runs(function () {
                        setConditions(conditions, ready);
                    });

                    waitsFor(function () {
                        return ready.callCount > 0;
                    });

                });
            });
        },

        /**
        * @method logWithParent
        * write description of spec and description of parent suite (describe-block) to console
        * the returned method takes two arguments:
        *   the spec itself ('this' inside of it-block)
        *   config object
        * @param {Boolean} flag to enable or disable
        * @param {Object} parentConfig
        * @param {Color} parentConfig.color
        * @param {String} parentConfig.method of console to use
        * @return {Function}
        */
        logWithParent: function (flag, parentConfig) {
            if (flag) {
                parentConfig = parentConfig || {};
                parentConfig.method = (parentConfig.method) ? parentConfig.method : 'log';
                parentConfig.color = (parentConfig.color) ? parentConfig.color : '#999999';
                parentConfig.parent = (parentConfig.parent !== undefined) ? parentConfig.parent : true;
                return function (spec, config) {
                    if (!config) {
                        config = {};
                    }
                    if (console[parentConfig.method]) {
                        console[parentConfig.method]('%c' + ((config.prefix) ? config.prefix : '') + ((parentConfig.parent) ? spec.suite.parentSuite.description + spec.suite.description : '') + spec.description + ((config.suffix) ? config.suffix : ''), 'color:' + parentConfig.color);
                    } else {
                        console.log('%c' + ((config.prefix) ? config.prefix : '') + ((parentConfig.parent) ? spec.suite.parentSuite.description + spec.suite.description : '') + spec.description + ((config.suffix) ? config.suffix : ''), 'color:' + parentConfig.color);
                    }
                };
            } else {
                return function () { };
            }
        },

        /**
        * @method log
        * write description of spec to console
        * the returned method takes two arguments:
        *   the spec itself ('this' inside of it-block)
        *   config object
        * @param {Boolean} flag to enable or disable 
        * @param {Color} color
        * @param {String} method of console to use
        * @return {Function}
        */
        log: function (flag, color, method) {
            if (flag) {
                return function (spec, config) {
                    if (!config) {
                        config = {};
                    }
                    if (console[method]) {
                        console[method]('%c########### ' + ((config.prefix) ? config.prefix : '') + spec.description + ((config.suffix) ? config.suffix : ''), 'color:' + (color || '#999999'));
                    } else {
                        console.log('%c########### ' + ((config.prefix) ? config.prefix : '') + spec.description + ((config.suffix) ? config.suffix : ''), 'color:' + (color || '#999999'));
                    }
                };
            } else {
                return function () { };
            }
        },

        logSuite: function (suite) {
            var prefix = (brease.config.jenkins === true) ? '\n[' : '[';
            var suffix = (brease.config.jenkins === true) ? ']' : ']';
            console.debug(prefix + ((suite && suite.spec && typeof suite.spec.replace === 'function') ? suite.spec.replace(/\./g, '/') : 'undefined') + suffix);
        },

        console: function (action, callThrough, config) {
            if (action === 'mock') {
                TestUtils.callThrough = callThrough;
                TestUtils.config = config || {};
                window.console = TestUtils.fakeConsole;
            } else {
                window.console = TestUtils.originalConsole;
            }
        },

        originalConsole: window.console,
        fakeConsole: {

            log: function () {
                if (TestUtils.callThrough || TestUtils.config.log === true) {
                    TestUtils.originalConsole.log.apply(TestUtils.originalConsole, arguments);
                }
            },
            warn: function () {
                if (TestUtils.callThrough || TestUtils.config.warn === true) {
                    TestUtils.originalConsole.warn.apply(TestUtils.originalConsole, arguments);
                }
            },
            debug: function () {
                if (TestUtils.callThrough || TestUtils.config.debug === true) {
                    TestUtils.originalConsole.debug.apply(TestUtils.originalConsole, arguments);
                }
            },
            info: function () {
                if (TestUtils.callThrough || TestUtils.config.info === true) {
                    TestUtils.originalConsole.info.apply(TestUtils.originalConsole, arguments);
                }
            },
            trace: function () {
                if (TestUtils.callThrough || TestUtils.config.trace === true) {
                    TestUtils.originalConsole.trace.apply(TestUtils.originalConsole, arguments);
                }
            },
            time: function () {
                if (TestUtils.callThrough || TestUtils.config.time === true) {
                    TestUtils.originalConsole.time.apply(TestUtils.originalConsole, arguments);
                }
            },
            timeEnd: function () {
                if (TestUtils.callThrough || TestUtils.config.timeEnd === true) {
                    TestUtils.originalConsole.timeEnd.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatWarn: function () {
                if (TestUtils.callThrough || TestUtils.config.iatWarn === true) {
                    TestUtils.originalConsole.iatWarn.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatDebug: function () {
                if (TestUtils.callThrough || TestUtils.config.iatDebug === true) {
                    TestUtils.originalConsole.iatDebug.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatDebugLog: function () {
                if (TestUtils.callThrough || TestUtils.config.iatDebugLog === true) {
                    TestUtils.originalConsole.iatDebug.apply(TestUtils.originalConsole, arguments);
                }
            },
            iatInfo: function () {
                if (TestUtils.callThrough || TestUtils.config.iatInfo === true) {
                    TestUtils.originalConsole.iatInfo.apply(TestUtils.originalConsole, arguments);
                }
            },
            always: function () {
                TestUtils.originalConsole.log.apply(TestUtils.originalConsole, arguments);
            },
            alwaysWarn: function () {
                TestUtils.originalConsole.warn.apply(TestUtils.originalConsole, arguments);
            }
        },

        getBackgroundImageUrl: function (divId) {
            var css = $('#' + divId).css('background-image');
            if (css !== undefined) {
                return css.match(/url\([^)]+\)/gi)[0].split(/[()'"]+/)[1];
            } else {
                return undefined;
            }
        },

        addMatchers: function (testcase, arType) {

            if (Array.isArray(arType)) {
                var matcher = {};
                arType.forEach(function (type) {
                    if (_customMatcher[type]) {
                        matcher[type] = _customMatcher[type];
                    }
                });
                
                testcase.addMatchers(matcher);
            }
        },

        resetFramework: function () {

            serviceBridge.testServices.setData('deactivateContent', 0, 'timeout');
            socketStub.setData('deactivateContent', 0, 'timeout');
            pageController.reset();
            widgetController.reset(true);
            pageController.init(runtimeService);
            //pageController.rootContainer = brease.appElem;
            bindingController.init(runtimeService);
            brease.uiController.bindingController = bindingController;
            actionController.init(runtimeService);
            client.init(runtimeService);
            client.setValid(true);
            serviceBridge.testServices.resetModelData();
        }

    };

    var _customMatcher = {
        toEqualArray: function (array) {
            this.message = function () {
                return 'Expected ' + JSON.stringify(this.actual) + ' to be array ' + JSON.stringify(array) + '.';
            };
            var arraysHaveSameMembers = function (x, y) {
                var equal = Array.isArray(x) && Array.isArray(y) && x.length === y.length;
                for (var i = 0; i < x.length; i += 1) {
                    equal = equal && (y.indexOf(x[i]) !== -1);
                }
                return equal;
            };
            return arraysHaveSameMembers(this.actual, array);
        }
    };

    return TestUtils;

});
