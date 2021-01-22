define(['brease/events/EventDispatcher'], function (EventDispatcher) {

    'use strict';

    var Value = function () {
        this.settings = {};
        this.sign = 1;
        this.strValue = '';
    };

    Value.prototype = new EventDispatcher();
    
    Value.prototype.setConfig = function (numberFormat, useDigitGrouping, separators) {
        this.settings.numberFormat = numberFormat;
        this.settings.useDigitGrouping = useDigitGrouping;
        this.settings.separators = separators;
    };

    Value.prototype.changeListener = function (e) {
        this.initialSetValue(e.detail.value);
    };
    
    Value.prototype.initialSetValue = function (value) {
        this.setValue(value);
        this.outputIsInitialized = false;
    };

    Value.prototype.setValue = function (value) {
        _internalSetValue.call(this, value);
    };
    
    Value.prototype.getValue = function () {
        return this.value;
    };
    
    Value.prototype.getStringValue = function () {
        return this.strValue;
    };

    Value.prototype.actionListener = function (e) {
        _processAction.call(this, e.detail.action, e.detail.value);
    };

    function _processAction(action, buttonValue) {
        var actString = this.strValue,
            newString;
            
        switch (action) {

            case 'delete':
                if (actString === brease.settings.noValueString && this.outputIsInitialized === false) {
                    _internalSetValue.call(this, 0);
                } else {
                    _setValueAsString.call(this, actString.substring(0, actString.length - 1), actString); 
                }
                break;
            case 'comma':
                if (this.outputIsInitialized === false) {
                    actString = '0';
                }
                if (actString.indexOf(this.settings.separators.dsp) === -1) {
                    _setValueAsString.call(this, actString + this.settings.separators.dsp, actString);
                }
                break;
            case 'sign':
                if (this.sign === -1) {
                    newString = actString.replace('-', '');
                    _setSign.call(this, 1);
                } else {
                    newString = '-' + actString;
                    _setSign.call(this, -1);
                }
                _setValueAsString.call(this, newString, actString, true);

                break;

            case 'value':
                if (!isNaN(buttonValue)) {
                    if (this.outputIsInitialized === false) {
                        _setValueAsString.call(this, ((actString.substring(0, 1) === '-') ? '-' : '') + buttonValue, actString);
                    } else {
                        newString = actString + buttonValue;
                        var commaIndex = newString.indexOf(this.settings.separators.dsp),
                            nachKomma = (commaIndex !== -1) ? newString.substring(commaIndex + 1) : '';

                        if (nachKomma.length <= this.settings.numberFormat.decimalPlaces) {
                            _setValueAsString.call(this, actString + buttonValue, actString);
                        }
                    }
                }
                break;
        }
    }

    function _internalSetValue(value) {
        var oldValue = this.value,
            oldStrValue = this.strValue;

        this.value = (isNaN(value)) ? NaN : parseFloat(value);
        this.strValue = _format.call(this, this.value);
        if (this.value >= 0) {
            _setSign.call(this, 1);
        } else {
            _setSign.call(this, -1);
        }
        if (this.value !== oldValue || this.strValue !== oldStrValue) {

            this.dispatchEvent({ type: 'ValueChanged', 
                detail: {
                    'value': this.value,
                    'strValue': this.strValue
                } 
            });
        }
    }

    function _setValueAsString(strValue, oldStrValue, omitInit) {
        // strip leading duplicate zeros for numbers with decimal places
        if (strValue.indexOf('00') === 0 && strValue.indexOf(this.settings.separators.dsp) !== 1) {
            strValue = strValue.substring(1);
        }
        if (strValue === '') {
            strValue = '0';
        }
        if (strValue === '-') {
            strValue = '-0';
        }

        this.strValue = strValue;
        this.value = brease.formatter.parseFloat(this.strValue, this.settings.separators);

        if (this.strValue.substring(0, 1) === '-') {
            _setSign.call(this, -1);
        } else {
            _setSign.call(this, 1);
        }
        
        this.dispatchEvent({ type: 'ValueChanged', 
            detail: {
                'value': this.value,
                'strValue': this.strValue
            } 
        });
        if (omitInit !== true) {
            this.outputIsInitialized = true;
        }
    }

    function _setSign(sign) {
        var oldSign = this.sign;
        this.sign = sign;
        if (this.sign !== oldSign) {
            this.dispatchEvent({ type: 'SignChanged', 
                detail: {
                    'sign': this.sign
                } }); 
        }
    }

    function _format(value) {
        if (isNaN(value)) {
            return brease.settings.noValueString;
        } else {
            return brease.formatter.formatNumber(value, this.settings.numberFormat, this.settings.useDigitGrouping, this.settings.separators);
        }
    }

    return Value;
});
