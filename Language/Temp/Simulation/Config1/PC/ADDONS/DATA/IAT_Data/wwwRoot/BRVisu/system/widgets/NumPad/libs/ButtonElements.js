define(['brease/events/EventDispatcher', 'brease/events/BreaseEvent', 'brease/core/Utils'], 
    function (EventDispatcher, BreaseEvent, Utils) {

        'use strict';

        var ButtonElements = function (widget) {
            this.buttons = {};
            this.widget = widget;
            this.el = widget.el;
            this.buttonClickHandler = this.buttonClickHandler.bind(this);
            this.buttonDownHandler = this.buttonDownHandler.bind(this);
            this.buttonUpHandler = this.buttonUpHandler.bind(this);
        };

        ButtonElements.prototype = new EventDispatcher();
        
        ButtonElements.prototype.init = function (e) {
            this.buttons = {
                'sign': this.el.find('[data-action="sign"]'),
                'comma': this.el.find('[data-action="comma"]'),
                'delete': this.el.find('[data-action="delete"]'),
                'enter': this.el.find('[data-action="enter"]'),
                'close': this.el.find('[data-action="close"]')
            };
            this.clickEventName = _getEventConfig(brease.config.virtualKeyboards);
        };
        
        ButtonElements.prototype.get = function (buttonId) {
            return this.buttons[buttonId];
        };

        ButtonElements.prototype.signChangeListener = function (e) {
            if (this.buttons.sign) {
                if (e.detail.sign === -1) {
                    this.buttons.sign.addClass('active');
                } else {
                    this.buttons.sign.removeClass('active');
                } 
            }
        };

        ButtonElements.prototype.triggerButton = function (buttonAction, value) {
            this.startButton = undefined;
            if (buttonAction === 'value') {
                this.el.find('[data-value="' + value + '"]').triggerHandler({
                    type: this.clickEventName
                });
            } else {
                if (this.buttons[buttonAction]) {
                    this.buttons[buttonAction].triggerHandler({
                        type: this.clickEventName
                    }); 
                }
            }
        };

        ButtonElements.prototype.addListeners = function () {
            this.clickEventName = _getEventConfig(brease.config.virtualKeyboards);
            this.el.find('[data-action]').on(BreaseEvent.MOUSE_DOWN, this.buttonDownHandler).on(this.clickEventName, this.buttonClickHandler);
        };

        ButtonElements.prototype.removeListeners = function () {
            this.el.find('[data-action]').off();
            brease.docEl.off(BreaseEvent.MOUSE_UP, this.buttonUpHandler);
        };

        ButtonElements.prototype.reset = function () {
            if (this.activeButton) {
                Utils.removeClass(this.activeButton, 'active');
            }
            this.activeButton = undefined;
        };

        ButtonElements.prototype.buttonDownHandler = function (e) {
            if (this.activeButton) {
                Utils.removeClass(this.activeButton, 'active');
            }
            this.activeButton = this.startButton = e.target;
            Utils.addClass(this.activeButton, 'active');
            brease.docEl.on(BreaseEvent.MOUSE_UP, this.buttonUpHandler);
        };

        ButtonElements.prototype.buttonUpHandler = function (e) {
            brease.docEl.off(BreaseEvent.MOUSE_UP, this.buttonUpHandler);
            Utils.removeClass(this.activeButton, 'active');
            this.activeButton = undefined;
        };

        ButtonElements.prototype.buttonClickHandler = function (e) {
            this.widget._handleEvent(e, true);
            var button = $(e.currentTarget),
                action = '' + button.attr('data-action'),
                buttonValue = button.attr('data-value');
                
            /**
            * @event ButtonAction
            * @param {Object} detail  
            * @param {String} detail.action
            * @param {String} detail.value
            * @param {String} type 'ButtonAction'
            */
            if (this.startButton === undefined || this.startButton === e.currentTarget) {
                this.dispatchEvent({ type: 'ButtonAction', 
                    detail: {
                        'action': action,
                        'value': buttonValue
                    } 
                });
            }
            this.startButton = undefined;
        };

        function _getEventConfig(kbdConf) {
            if (!kbdConf) {
                return BreaseEvent.CLICK;
            }
            if (kbdConf.InputProcessing) {
                return kbdConf.InputProcessing.onKeyDown === true ? BreaseEvent.MOUSE_DOWN : BreaseEvent.CLICK;
            } else {
                return BreaseEvent.CLICK;
            }
        }

        return ButtonElements;
    });
