define(['brease/helper/stubs/Server', 
    'brease/events/ServerEvent', 
    'brease/services/libs/SocketCommand',
    'brease/events/BreaseEvent',
    'brease/core/Utils'
], function (Server, ServerEvent, SocketCommand, BreaseEvent, Utils) {

    'use strict';

    var configTemplate = {
            timeout: { 
                sessionActivated: 0,
                activateContentResponse: 0,
                activateContent: 10,
                deactivateContentResponse: 0,
                deactivateContent: 10
            } 
        },
        config = Utils.deepCopy(configTemplate);

    function _editorListener(e) {
        if (e.detail.event === 'LanguageChangedByEditor') {
            var eventType = ServerEvent.LANGUAGE_CHANGED,
                event = {
                    'event': eventType,
                    'detail': { currentLanguage: e.detail.currentLanguage }
                };
            Server.dispatchEvent(event, eventType);
        }
    }

    function _activateResponse(data, eventType) {
        var event = {
            'event': eventType,
            'detail': {
                contentId: data.Parameter.contentId,
                status: { code: 0 }
            }
        };
        Server.dispatchEvent(event, eventType);
    }
    function _activateEvent(data, eventType) {
        var event = {
            'event': eventType,
            'detail': {
                contentId: data.Parameter.contentId,
                success: true
            }
        }; 
        Server.dispatchEvent(event, eventType);
    }

    function deferWithTimeout(fn, timeout, dataObj, command) {
        if (timeout > 0) {
            window.setTimeout(fn.bind(this, dataObj, command), timeout); 
        } else {
            fn(dataObj, command);
        }
    }

    return {
        send: function (dataObj) {
            if (dataObj && dataObj.Command === 'update') {
                Server.setData(dataObj.Data);
            }
            if (dataObj && dataObj.Command === SocketCommand.ACTIVATE_CONTENT) {
                deferWithTimeout.call(this, _activateResponse, config.timeout.activateContentResponse, dataObj, SocketCommand.ACTIVATE_CONTENT);
                deferWithTimeout.call(this, _activateEvent, config.timeout.activateContent, dataObj, ServerEvent.CONTENT_ACTIVATED);
            }
            if (dataObj && dataObj.Command === SocketCommand.DEACTIVATE_CONTENT) {
                deferWithTimeout.call(this, _activateResponse, config.timeout.deactivateContentResponse, dataObj, SocketCommand.DEACTIVATE_CONTENT);
                deferWithTimeout.call(this, _activateEvent, config.timeout.deactivateContent, dataObj, ServerEvent.CONTENT_DEACTIVATED);
            }
        },

        getModelData: function (widgetId, attribute) {
            return Server.getModelData(widgetId, attribute);
        },

        setData: function (key, value, type) {
            if (type === 'timeout') {
                config.timeout[key] = value;
            } 
        },

        resetData: function () {
            config = Utils.deepCopy(configTemplate);
        },

        start: function (callback) {
            callback(true);
            document.body.addEventListener('EditorEvent', _editorListener);
            window.setTimeout(function () {
                var type = ServerEvent.SESSION_ACTIVATED;
                Server.dispatchEvent({ event: type }, type);
            }, config.timeout.sessionActivated);

        },
        startHeartbeat: function () {

        },
        addEventListener: function (eventType, fn) {
            Server.addEventListener(eventType, fn);
        },
        removeEventListener: function (eventType, fn) {
            Server.removeEventListener(eventType, fn);
        },
        triggerServerAction: function (action, target, aId, args) {
            var type = 'action';
            Server.dispatchEvent({
                'event': type,
                'detail': {
                    'action': action,
                    'target': target,
                    'actionArgs': args || {},
                    'actionId': aId
                }
            }, type);
        },

        triggerServerChange: function (widgetId, attribute, value) {
            var type = ServerEvent.PROPERTY_VALUE_CHANGED;
            Server.dispatchEvent({
                'event': type,
                'detail': [
                    {
                        'data': [
                            {
                                'attribute': attribute,
                                'value': value
                            }
                        ],
                        'refId': widgetId
                    }
                ]
            }, type);
        },

        triggerConnectionStateChange: function (state) {
            var type = BreaseEvent.CONNECTION_STATE_CHANGED;
            Server.dispatchEvent({
                event: type,
                detail: { state: state }
            }, type);
        },

        triggerContentActivated: function (contentId) {
            var type = ServerEvent.CONTENT_ACTIVATED;
            Server.dispatchEvent({
                event: type,
                detail: { contentId: contentId }
            }, type);
        },

        triggerContentDeactivated: function (contentId) {
            var type = ServerEvent.CONTENT_DEACTIVATED;
            Server.dispatchEvent({
                event: type,
                detail: { contentId: contentId }
            }, type);
        },
        COMMAND: SocketCommand
    };
});
