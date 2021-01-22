define(['brease/core/Utils'], function (Utils) {

    'use strict';

    /** 
    * @enum {String} brease.events.ServerEvent
    */
    
    /**
    * @property {string} CONTENT_ACTIVATED='ContentActivated'
    * @readonly
    * @static
    */
    /**
    * @property {string} CONTENT_DEACTIVATED='ContentDeactivated'
    * @readonly
    * @static
    */
    /**
    * @property {string} LANGUAGE_CHANGED='LanguageChanged'
    * @readonly
    * @static
    */
    /**
    * @property {string} PROPERTY_VALUE_CHANGED='PropertyValueChanged'
    * @readonly
    * @static
    */
    /**
    * @property {string} SESSION_ACTIVATED='SessionActivated'
    * @readonly
    * @static
    */
    /**
    * @property {string} TRANSFER_START='TransferStart'
    * @readonly
    * @static
    */
    /**
    * @property {string} TRANSFER_FINISH='TransferFinish'
    * @readonly
    * @static
    */
    /**
    * @property {string} USER_CHANGED='UserChanged'
    * @readonly
    * @static
    */
    /**
    * @property {string} VISU_ACTIVATED='VisuActivated'
    * @readonly
    * @static
    */

    var ServerEvent = {};

    Utils.defineProperty(ServerEvent, 'CONTENT_ACTIVATED', 'ContentActivated');
    Utils.defineProperty(ServerEvent, 'CONTENT_DEACTIVATED', 'ContentDeactivated');
    Utils.defineProperty(ServerEvent, 'LANGUAGE_CHANGED', 'LanguageChanged');
    Utils.defineProperty(ServerEvent, 'PROPERTY_VALUE_CHANGED', 'PropertyValueChanged');
    Utils.defineProperty(ServerEvent, 'SESSION_ACTIVATED', 'SessionActivated');
    Utils.defineProperty(ServerEvent, 'TRANSFER_START', 'TransferStart');
    Utils.defineProperty(ServerEvent, 'TRANSFER_FINISH', 'TransferFinish');
    Utils.defineProperty(ServerEvent, 'USER_CHANGED', 'UserChanged');
    Utils.defineProperty(ServerEvent, 'VISU_ACTIVATED', 'VisuActivated');

    return ServerEvent;

});
