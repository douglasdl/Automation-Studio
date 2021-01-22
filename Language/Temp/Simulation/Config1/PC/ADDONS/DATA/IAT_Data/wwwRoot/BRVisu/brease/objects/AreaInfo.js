define(['brease/core/Utils'], function (Utils) {

    'use strict';

    /**
    * @class brease.objects.AreaInfo
    * @extends Object
    */

    var AreaInfo = function (id, areaInfo) {
        _setRequired.call(this, 'id', id);
        _setRequired.call(this, 'width', areaInfo.width);
        _setRequired.call(this, 'height', areaInfo.height);
        _setRequired.call(this, 'top', areaInfo.top);
        _setRequired.call(this, 'left', areaInfo.left);

        _setOptional.call(this, 'zIndex', areaInfo.zIndex);
        _setOptional.call(this, 'cssWidth', areaInfo.cssWidth);
        _setOptional.call(this, 'cssHeight', areaInfo.cssHeight);

    };

    AreaInfo.prototype.hasPercentageWidth = function () {
        return (this.cssWidth !== undefined && this.cssWidth.indexOf('%') !== -1);
    };

    AreaInfo.prototype.hasPercentageHeight = function () {
        return (this.cssHeight !== undefined && this.cssHeight.indexOf('%') !== -1);
    };

    Object.defineProperty(AreaInfo.prototype, 'styleWidth', { get: function () { return ((Utils.isString(this.cssWidth) && this.cssWidth.indexOf('%') !== -1) ? this.cssWidth : this.width + 'px'); } });
    Object.defineProperty(AreaInfo.prototype, 'styleHeight', { get: function () { return ((Utils.isString(this.cssHeight) && this.cssHeight.indexOf('%') !== -1) ? this.cssHeight : this.height + 'px'); } });

    function _setRequired(propertyName, value) {
        if (value !== undefined) {
            this[propertyName] = value;
        } else {
            //console.log(this, value)
            throw new SyntaxError(propertyName + ' is required');
        }
    }

    function _setOptional(propertyName, value) {
        if (value !== undefined) {
            this[propertyName] = value;
        }
    }

    return AreaInfo;
});
