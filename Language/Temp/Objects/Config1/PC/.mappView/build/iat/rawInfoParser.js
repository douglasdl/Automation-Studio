/*global module,__dirname*/
(function () {
    
    'use strict';

    var path = require('path'),
        grunt = require('grunt'),
        utils = require(path.resolve(__dirname, './utils')),
        DataTypes = require(path.resolve(__dirname, './DataTypes')),
        compiler = {

            runCore: function runCore(rawInfo, type, grunt) {
                return compiler.run(rawInfo, type, grunt, false, true);
            },

            run: function run(rawInfo, type, localGrunt, newDepFormat, allowArrays) {
                if (localGrunt) { grunt = localGrunt; }
                var widgetName = rawInfo.name; // name wie in @class vergeben, also zB widgets.company.CustomWidget

                if (widgetName === undefined) {
                    grunt.fail.warn('compile failed:'.red + ' widget name undefined (use @class)');
                }
                var widgetInfo = {
                    name: String(widgetName),
                    type: type,
                    meta: {
                        superClass: rawInfo.extends,
                        requires: [],
                        mixins: [],
                        parents: [],
                        children: [],
                        inheritance: rawInfo.inheritance
                    },
                    methods: [],
                    events: [],
                    properties: [],
                    dependencies: {
                        files: [],
                        widgets: []
                    },
                    categories: {},
                    descriptions: {}
                };

                addKeyboardType(widgetInfo, rawInfo.inheritance);
                addMetaInfo(widgetInfo, rawInfo.iatMeta);
                addFilePath(widgetInfo, rawInfo.files);
                addMixins(widgetInfo, rawInfo.mixins);
                addDependencies(widgetInfo, rawInfo.dependencies, rawInfo.requires, newDepFormat);

                if (rawInfo.members && rawInfo.members.length > 0) {
                    for (let i = 0; i < rawInfo.members.length; i += 1) {
                        let member = rawInfo.members[i];
                        if (member.tagname === 'method') { // @method -> widget methods
                            addMethod(widgetInfo, member, allowArrays);
                        } else if (member.tagname === 'event') { // @event -> widget events
                            addEvent(widgetInfo, member, allowArrays);
                        } else if (member.tagname === 'cfg') { // @cfg -> widget properties
                            addProperty(widgetInfo, member);
                        } else if (member.tagname === 'property') { // @property -> widget meta info like parents or children
                            addParentChildren(widgetInfo, member);
                        }

                    } 
                }
                return widgetInfo;

            }
        };

    // PRIVATE functions

    function isWidget(filename) {
        var isInWidgets = (filename && filename.indexOf('widgets.') !== -1),
            level = (filename.match(/\./g) || []).length;
            
        return isInWidgets && level === 2;
    }

    function addKeyboardType(widgetInfo, inheritanceChain) {

        if (Array.isArray(inheritanceChain)) {
            if (inheritanceChain.indexOf('system.widgets.KeyBoard') !== -1) {
                widgetInfo.meta.keyboard = 'AlphaPad';
            } else if (inheritanceChain.indexOf('system.widgets.NumPad') !== -1) {
                widgetInfo.meta.keyboard = 'NumPad';
            } 
        }

    }

    function _parseArguments(params, nodeType, allowArrays, grunt) {
        var args = [];
        for (var i = 0; i < params.length; i += 1) {
            args.push({
                'name': params[i].name,
                'type': _normalizeType(params[i].type),
                'index': i,
                'description': params[i].doc || '',
                'optional': (params[i].optional === true)
            });

            if (params[i].name === undefined) {
                grunt.fail.warn('compile failed:'.red + ' ' + nodeType + ' argument name undefined');
            }
            if (params[i].type === undefined) {
                grunt.fail.warn('compile failed:'.red + ' ' + nodeType + ' argument type undefined');
            }
            if (!_isAllowedType(params[i].type, allowArrays)) {
                grunt.fail.warn('compile failed:'.red + ' ' + nodeType + ' argument type "' + params[i].type + '" not allowed');
            }
        }
        return args;
    }

    function _parseConfig(cfg) {
        //console.log("cfg:",cfg);
        var info = {
            'name': cfg.name,
            'type': _normalizeType(cfg.type),
            'initOnly': (cfg.bindable !== undefined) ? !cfg.bindable : true,
            'localizable': (cfg.localizable !== undefined) ? cfg.localizable : false,
            'editableBinding': (cfg.editableBinding !== undefined) ? cfg.editableBinding : false,
            'readOnly': (cfg.readonly !== undefined) ? cfg.readonly : false,
            'required': (cfg.required !== undefined) ? cfg.required : false,
            'owner': cfg.owner,
            'projectable': (cfg.not_projectable !== true),
            'description': _parseDoc(cfg.doc)
        };
        if (cfg.deprecated) {
            info.deprecated = true;
        }

        if (cfg.groupOrder !== undefined) {
            info.groupOrder = parseInt(cfg.groupOrder[0], 10);
        }

        if (cfg.nodeRefId !== undefined) {
            info.nodeRefId = cfg.nodeRefId;
        }
        addStringFromArray(info, 'groupRefId', cfg.groupRefId);
        addStringFromArray(info, 'category', cfg.iatCategory);
        addStringFromArray(info, 'typeRefId', cfg.typeRefId);
        addStringFromArray(info, 'subtype', cfg.subtype);

        addDefaultValue(info, cfg);
        return info;
    }

    function addStringFromArray(info, attrName, config) {
        if (Array.isArray(config) === true) {
            info[attrName] = (config[0] + '').trim();
        }
    }

    function addDefaultValue(info, cfg) {

        if (cfg.default !== null && cfg.default !== undefined && cfg.default !== 'undefined') {
            if (cfg.default.indexOf("'") === 0 && cfg.default.lastIndexOf("'") === (cfg.default.length - 1)) {
                cfg.default = cfg.default.slice(1, -1);
            }

            info['defaultValue'] = cfg.default.replace(/&/gm, '&amp;')
                .replace(/</gm, '&lt;')
                .replace(/>/gm, '&gt;')
                .replace(/"/gm, '&quot;')
                .replace(/'/gm, '&apos;');
        }
    }

    function _parseDoc(doc) {
        var ret = '',
            override = '<p><strong>Defined in override';
        if (doc) {
            var index = doc.indexOf(override);
            if (index !== -1) {
                ret = doc.substring(0, index - 2);
            } else {
                ret = doc;
            }
            ret = ret.replace(/<p>/g, '');
            ret = ret.replace(/<\/p>/g, '');
        }
        return ret;
    }

    function _parseProperty(prop) {
        var info = {
            'name': prop.name
        };
        if (prop.type) {
            info['type'] = prop.type;
        }
        if (prop.default) {
            info['defaultValue'] = prop.default;
        }
        if (prop.properties !== null && prop.properties !== undefined) {
            info.values = [];
            for (var i = 0; i < prop.properties.length; i += 1) {
                info.values.push(_parseProperty(prop.properties[i]));
            }
        }
        return info;
    }

    function _parseWidgetList(prop, widgetName, grunt) {
        var result;
        try {
            result = JSON.parse(prop.default);
        } catch (e) {

        }
        if (!Array.isArray(result)) {
            grunt.fail.warn('compile failed:'.red + ', property "' + prop.name + '" on ' + widgetName + ' has invalid value!');
        }
        return result;
    }

    function _normalizeType(type) {

        if (type === undefined || type === '') {
            type = 'undefined';
        }
        return type;
    }
    function _isAllowedType(type, allowArrays) {
        if (type.lastIndexOf('[]') === type.length - 2) {
            var pureType = type.substring(0, type.length - 2);
            return allowArrays && DataTypes.baseType(pureType) !== undefined;
        } else {
            return DataTypes.baseType(type) !== undefined; 
        }
    }

    function addMetaInfo(widgetInfo, iatMeta) {
        if (Array.isArray(iatMeta) && iatMeta.length > 0) {
            for (let i = 0; i < iatMeta.length; i += 1) {
                let info = iatMeta[i].name.split(':');
                if (info.length === 1) {
                    grunt.fail.warn('compile failed:'.red + ' iatMeta name has to contain a colon');
                }
                let tag1 = info[0];
                let tag2 = info[1];
                let value = iatMeta[i].doc;
                switch (tag1) {
                    case 'category':
                        let values = value.split(',');
                        for (let j = 0; j < values.length; j += 1) {
                            if (widgetInfo['categories'][tag2] === undefined) {
                                widgetInfo['categories'][tag2] = [];
                            }
                            widgetInfo['categories'][tag2].push(values[j]);
                        }
                        break;
                    case 'description':
                        widgetInfo['descriptions'][tag2] = value;
                        break;
                    case 'studio':
                        if (['requires', 'mixins', 'parents', 'children', 'superClass', 'inheritance'].indexOf(tag2) === -1) {
                            widgetInfo['meta'][tag2] = value;
                        } else {
                            grunt.log.writeln(('compile warning: iatMeta tag has not allowed name (' + tag2 + ') after studio:').yellow);
                        }
                        break;
                    default:
                        grunt.log.writeln(('compile warning: iatMeta tag has unknown name before colon').yellow);
                        break;
                }

            }
        }
    }
    
    function addLegacyDependencies(widgetInfo, dependencies) {
        
        if (dependencies && dependencies.length > 0) {

            for (let i = 0; i < dependencies.length; i += 1) {
                let dep = dependencies[i];

                if (dep.indexOf('widgets/') === 0 && dep.indexOf('libs/') === -1) {
                    widgetInfo.dependencies.widgets.push(dep + '.js');
                } else {
                    widgetInfo.dependencies.files.push(dep + '.js');
                }

            }
        }
    }
    
    function addDependencies(widgetInfo, dependencies, requiredFiles, newFormat) {
        if (newFormat === true) {
            if (dependencies) {
                widgetInfo.dependencies.widgets = dependencies.widgets.slice(0);
                widgetInfo.dependencies.files = dependencies.files.slice(0);
            }
        } else {
            addLegacyDependencies(widgetInfo, dependencies);
        }

        if (Array.isArray(requiredFiles) && requiredFiles.length > 0) {
            widgetInfo['meta'].requires = widgetInfo['meta'].requires.concat(requiredFiles);

            for (let i = 0; i < requiredFiles.length; i += 1) {
                let dep = requiredFiles[i];
                if (isWidget(dep)) {
                    path = utils.className2Path(dep, true);
                    let index = widgetInfo.dependencies.widgets.indexOf(path);
                    if (index === -1) {
                        widgetInfo.dependencies.widgets.push(path);
                    }
                }

            }
        }
    }

    function addFilePath(widgetInfo, files) {

        if (Array.isArray(files) && files.length > 0) {
            var filename = files[0].filename;
            widgetInfo['meta'].filePath = filename.substring(filename.indexOf('widgets/'));
        }
    }

    function addMixins(widgetInfo, mixins) {

        if (mixins && mixins.length > 0) {
            widgetInfo['meta'].mixins = widgetInfo['meta'].mixins.concat(mixins);
        } 
    }

    function addMethod(widgetInfo, member, allowArrays) {
        if (member.owner !== 'brease.core.Class' && member.static !== true && (member.iatStudioExposed === true || member.name.toLowerCase().indexOf('set') === 0)) {
                                
            if (member.name === undefined) {
                grunt.fail.warn('compile failed:'.red + ' method name undefined');
            }
            let info = {
                'name': member.name,
                'originalName': member.name,
                'read': (member.name.toLowerCase().indexOf('get') === 0), // currently methods which start with 'get' are read actions
                'description': member.doc || '',
                'iatStudioExposed': (member.iatStudioExposed === true)
            };
            if (Array.isArray(member.params)) {
                let args = _parseArguments(member.params, 'method', allowArrays, grunt);
                if (args.length > 0) {
                    info['parameter'] = args;
                }
            }
            widgetInfo['methods'].push(info);
        }
    }

    function addEvent(widgetInfo, member, allowArrays) {

        if (member.iatStudioExposed === true) {
            if (member.name === undefined) {
                grunt.fail.warn('compile failed:'.red + ' event name undefined');
            }
            let info = {
                'name': member.name,
                'description': member.doc || ''
            };
            if (member.deprecated) {
                info.deprecated = true;
            }
            if (Array.isArray(member.params)) {
                let args = _parseArguments(member.params, 'event', allowArrays, grunt);
                if (args.length > 0) {
                    info['parameter'] = args;
                } 
            }
            widgetInfo['events'].push(info);
        } 
    }

    function addProperty(widgetInfo, member) {
        if (member.iatStudioExposed === true) {
            widgetInfo['properties'].push(_parseConfig(member));
        } 
    }

    function addParentChildren(widgetInfo, member) {
        if (member.name === 'parents') {
            widgetInfo['meta'].parents = _parseWidgetList(member, widgetInfo.name, grunt);
        } else if (member.name === 'children') {
            widgetInfo['meta'].children = _parseWidgetList(member, widgetInfo.name, grunt);
        } else if (member.iatStudioExposed === true) { // not used for widgets
            widgetInfo['properties'].push(_parseProperty(member));
        } 
    }

    module.exports = compiler;

})();
