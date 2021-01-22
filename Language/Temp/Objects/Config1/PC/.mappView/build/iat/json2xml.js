/*global require,module*/
(function () {
    'use strict';

    var extend = require('node.extend'),
        moduleRequire = require('a.require'),
        xmlPrepare = moduleRequire('iat/xmlPrepare'),
        defaults = {
            declaration: {
                include: true,
                encoding: 'UTF-8'
            },
            hiddenKey: '@hidden',
            attributeKey: '@attr',
            nameKey: '@name',
            arrayItem: 'item',
            useCDATA: false,
            prettify: {
                enable: false,
                tab: '\t'
            }
        },
        settings = {},

        json2xml = {

            convert: function convert(widgetInfo, options) {
                var root = {
                        name: 'WidgetLibrary',
                        namespace: 'http://www.br-automation.com/iat2014/widget'
                    }, 
                    json = [xmlPrepare.run(widgetInfo)];

                settings = extend(true, {}, defaults, options);

                var xml = '';

                if (typeof root !== 'object') {
                    throw new Error('first argument must be an object');
                }
                if (typeof root.name !== 'string') {
                    throw new Error('root.name must be a string');
                }
                if (typeof json !== 'object') {
                    throw new Error('second argument (=json to convert) must be an object');
                }

                if (settings.declaration.include === true) {
                    xml += '<?xml version="1.0" encoding="' + settings.declaration.encoding + '"?>';
                }

                xml += _startTag(root.name, ((_typeOf(root.namespace) === 'string') ? ' xmlns="' + root.namespace + '"' : '')) + _parseJSON(json) + _endTag(root.name);

                return xml;
            }

        };

    var _level = -1;

    function _endTag(tagName, omitLineBreak, omitTab) {
        var pre = '';
        if (settings.prettify.enable === true) {
            if (omitLineBreak !== true) {
                pre += '\n';
            }
            if (omitTab !== true) {
                pre += _tab();
            }
        }
        _level -= 1;
        return pre + '</' + tagName + '>';
    }

    function _startTag(tagName, attributes) {
        _level += 1;
        return ((settings.prettify.enable === true) ? '\n' + _tab() : '') + '<' + tagName + ((attributes) || '') + '>';
    }

    function _tab() {
        var tab = '';
        for (var i = 0; i < _level; i += 1) {
            tab += settings.prettify.tab;
        }
        return tab;
    }

    function _parseJSON(json) {
        var str = '';
        if (_typeOf(json === 'array')) {
            str += _parseArray(json);
        } else {
            for (var key in json) {
                if (_typeOf(json[key] === 'array')) {
                    str += _parseArray(json[key]);
                } else if (_typeOf(json[key] === 'object')) {
                    str += _parseObject(json[key], key);
                }
            }
        }
        return str;

    }

    function _parseArray(arr) {
        //console.log('_parseArray');
        var str = '',
            item, name, r;
        for (var i = 0; i < arr.length; i += 1) {
            name = settings.arrayItem;
            item = arr[i];
            if (item[settings.nameKey] !== undefined) {
                name = item[settings.nameKey];
            }

            if (_typeOf(item) === 'array') {
                str += _parseArray(item);
            } else if (_typeOf(arr[i]) === 'object') {
                if (item['@content'] !== undefined) {
                    r = _parsePrimitive(item['@content']);
                    str += _startTag(name, _parseAttributes(arr[i])) + r + _endTag(name, true, r.indexOf('\n') === -1);
                } else {
                    str += _parseObject(item, name);
                }
            } else {
                r = _parsePrimitive(item);
                str += _startTag(name) + r + _endTag(name, true, r.indexOf('\n') === -1);
            }

        }
        return str;

    }

    function _parseObject(obj, name) {
        //console.log('_parseObject:' + name);
        var str = _startTag(name, _parseAttributes(obj));
        for (var key in obj) {
            //console.log('key in object:' + key + ',type='+_typeOf(obj[key]));
            if (key !== settings.nameKey && key !== settings.attributeKey && key !== settings.hiddenKey) {
                if (_typeOf(obj[key]) === 'array') {
                    str += _parseArray(obj[key]);
                } else if (_typeOf(obj[key]) === 'object') {
                    str += _parseObject(obj[key], key);
                } else {
                    var r = _parsePrimitive(obj[key]);
                    str += _startTag(key) + r + _endTag(key, true, r.indexOf('\n') === -1);
                }
            }
        }
        str += _endTag(name);
        return str;

    }

    function _parsePrimitive(obj) {
        var data = String(obj);
        if (settings.useCDATA === true) {
            return '<![CDATA[' + data.replace(/]]>/gm, ']]]]><![CDATA[>') + ']]>';
        } else {

            return data.replace(/&/gm, '&amp;')
                .replace(/</gm, '&lt;')
                .replace(/>/gm, '&gt;')
                .replace(/"/gm, '&quot;')
                .replace(/'/gm, '&apos;');
        }
    }

    function _parseAttributes(obj) {
        var str = '',
            attr = obj[settings.attributeKey];
        if (_typeOf(attr) === 'object') {
            for (var key in attr) {
                str += ' ' + key + '="' + _stripAttr(attr[key]) + '"';

            }

        }
        return str;
    }

    function _stripAttr(obj) {
        var attr = String(obj);
        if (attr.indexOf("'") === 0) {
            attr = attr.substring(1);
        }
        if (attr.lastIndexOf("'") === (attr.length - 1)) {
            attr = attr.substring(0, attr.length - 1);
        }
        return attr;
    }

    function _typeOf(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return 'array';
        } else if (Object.prototype.toString.call(obj) === '[object String]') {
            return 'string';
        } else if (Object.prototype.toString.call(obj) === '[object Number]') {
            return 'number';
        } else if (Object.prototype.toString.call(obj) === '[object Boolean]') {
            return 'boolean';
        } else if (Object.prototype.toString.call(obj) === '[object Null]') {
            return 'null';
        } else {
            return typeof obj; //"object" and "undefined"
        }
    }

    module.exports = json2xml;

})();
