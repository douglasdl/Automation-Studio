define([
    'brease/events/BreaseEvent'
], function (BreaseEvent) {

    'use strict';

    /**
     * @class widgets.brease.KeyBoard.LayoutSelector
     * #Description
     * Handles the selection of language independent layouts. Displays
     * a list of available layouts if there are more than two configured. Otherwise
     * it will switch between the configured layouts without displaying a list.
     * @extends Class
     */
    var LayoutSelector = function () {
            this.currentLayout = '';
        },
        p = LayoutSelector.prototype;

    p.init = function (callback) {
        this.el = $('<div class="dropdown"></div>');
        this.btn = $('<div class="button"></div>');
        this.list = $('<div class="dropdownlist"></div>');
        this.callback = callback;
        this.btn.on(BreaseEvent.CLICK, { self: this }, _onBtnClick);
        this.list.on(BreaseEvent.CLICK, '[data-value]', { self: this }, _onListEntryClick);
        //this.setItems(items);
        this.el.append([this.btn, this.list]);
    };
    /**
     * @method setItems
     * set the items to be selected
     * @param {Object} items
     */
    p.setItems = function (items) {
        //console.debug('setItems:',items);
        var optionel;
        this.list.empty();
        for (var item in items) {
            optionel = $('<div data-value="' + item + '" data-name="' + items[item].description + '" data-index="' + items[item].index + '">' + items[item].description + '</div>');
            if (item === this.currentLayout) {
                optionel.addClass('selected');
                this.setButtonText(item);
            }
            this.list.append(optionel);
        }
    };
    /**
     * @method getItems
     * returns a set of available items. accepts an optional selector to filter
     * items to be returned.
     * @param {String} selector
     */
    p.getItems = function (selector) {
        if (selector) {
            return this.list.children(selector);
        } else {
            return this.list.children();
        }

    };

    /**
     * @method setCurrentLayout
     * sets the current layout
     * @param {String} currentLayout
     */
    p.setCurrentLayout = function (currentLayout) {
        this.currentLayout = currentLayout;
        if (!this.list) {
            this.list = $('<div class="dropdownlist"></div>');
        }
        this.list.find('.selected').removeClass('selected');
        this.list.find('[data-value=' + currentLayout + ']').addClass('selected');
    };

    p.setButtonText = function (text) {
        this.btn.text(text);
    };
    p.dispose = function () {
        this.callback = null;
        this.btn.off(BreaseEvent.CLICK, { self: this }, _onBtnClick);
        this.list.off(BreaseEvent.CLICK, '[data-value]', { self: this }, _onListEntryClick);
    };

    function _onBtnClick(e) {
        var self = e.data.self;
        if (self.getItems().length > 2 && !self.list.hasClass('open')) {
            self.list.addClass('open');
        } else if (self.list.hasClass('open')) {
            self.list.removeClass('open');
        } else {
            self.list.removeClass('open').find(':not(.selected),:only-child()').trigger(BreaseEvent.CLICK);
        }

    }
    function _onListEntryClick(e) {
        var self = e.data.self,
            target = $(this),
            langcode = target.attr('data-value');
        self.list.find('.selected').removeClass('selected');
        target.addClass('selected');
        self.setButtonText(langcode);
        if (typeof self.callback === 'function') {
            self.callback(langcode);
        }
        self.list.removeClass('open');
    }
    return LayoutSelector;
});
