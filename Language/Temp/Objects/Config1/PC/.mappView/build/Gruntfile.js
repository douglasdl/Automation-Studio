/*global __dirname,module*/
module.exports = function (grunt) {

    'use strict';

    var _require = require('a.require'),
        path = require('path');

    var logFile = 'C://log/ASBuild.log';
    if (grunt.file.exists(logFile)) {
        require('logfile-grunt')(grunt, { filePath: logFile, clearLogFile: true });
    }

    _require.init({ root: __dirname });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        projectFolder: 'BRVisu',
        basePath: __dirname,

        wwwRoot: (function (dirName) {
            var dir;
            if (grunt.option('buildPath')) {
                dir = path.resolve(grunt.option('buildPath'));
            } else {
                dir = path.resolve(dirName, '../data/wwwRoot');
            }
            dir = dir.replace(/\\/g, '/');
            console.log('grunt init - wwwRoot=' + dir);
            return dir;
        }(__dirname)),

        projectPath: '<%= wwwRoot %>/<%= projectFolder %>/',

        sass: {
            options: {
                includePaths: ['dynamically set in task'],
                outputStyle: 'compressed'
            },

            derivedWidget: {
                expand: true,
                cwd: '',
                src: '',
                dest: '',
                ext: '.sass.css'
            }
        },

        modules: {
            brease: {
                abspath: '<%= projectPath %>brease/brease.js',
                root: '<%= projectPath %>',
                replace: '',
                filename: 'brease.js'
            },
            config: {
                path: '<%= projectPath %>brease/config',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            controller: {
                path: '<%= projectPath %>brease/controller',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            core: {
                path: '<%= projectPath %>brease/core',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test'],
                excludeFile: ['BaseWidget.html']
            },
            datatype: {
                path: '<%= projectPath %>brease/datatype',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            decorators: {
                path: '<%= projectPath %>brease/decorators',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            enumFiles: {
                path: '<%= projectPath %>brease/enum',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            events: {
                path: '<%= projectPath %>brease/events',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            helper: {
                path: '<%= projectPath %>brease/helper',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            services: {
                path: '<%= projectPath %>brease/services',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test']
            },
            systemWidgets: {
                path: '<%= projectPath %>system/widgets',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test', 'meta', 'css', 'assets'],
                excludeFile: []
            },
            widgets: {
                path: '<%= projectPath %>widgets/brease',
                root: '<%= projectPath %>',
                replace: '',
                excludeFolder: ['Test', 'meta', 'css', 'assets', 'docs'],
                excludeFile: ['WidgetLibrary_gen']
            }
        },

        requirejs: {
            release: {
                options: {
                    name: 'brease/application',
                    mainConfigFile: '<%= projectPath %>require_config.js',
                    out: '<%= projectPath %>release/brease.js',
                    include: '<%= requirejs.modules %>',
                    onBuildWrite: function (moduleName, path, contents) {
                        path = path.substring(path.lastIndexOf('BRVisu'));
                        if (path.indexOf('.info') !== -1 || path.indexOf('.json') !== -1 || path.indexOf('.widget') !== -1 || path.indexOf('.css') !== -1 || path.indexOf('.xsd') !== -1 || path.indexOf('meta/') !== -1 || path.indexOf('.xmlschemaset') !== -1 || path.indexOf('.mapping') !== -1 || path.indexOf('external/') !== -1 || path.indexOf('/doc/') !== -1 || path.indexOf('WidgetLibrary') !== -1 || path.indexOf('EditorHandles') !== -1 || path.indexOf('/ASHelp') !== -1 || path.indexOf('/Test') !== -1 || (path.indexOf('BRVisu/libs') !== -1 && path.indexOf('require') === -1 && path.indexOf('globalize') === -1 && path.indexOf('polyfill') === -1)) {
                            return '';
                        }
                        return contents;
                    },
                    preserveLicenseComments: false,
                    generateSourceMaps: false,
                    optimize: 'uglify2',
                    uglify2: {
                        beautify: {
                            semicolons: true
                        },
                        compress: {
                            side_effects: false,
                            sequences: true,
                            dead_code: false,
                            unused: false,
                            drop_debugger: true,
                            unsafe: false,
                            hoist_funs: false,
                            hoist_vars: false
                        },
                        warnings: false,
                        mangle: {
                            except: '<%= requirejs.modulesShort %>'
                        },
                        lint: false,
                        logLevel: 4
                    }
                }
            }
        },

        csso: {
            breasecss: {
                options: {
                    restructure: true
                },
                expand: true,
                cwd: '<%= projectPath %>css/',
                src: ['brease_core.css'],
                dest: '<%= projectPath %>release',
                ext: '.min.css'
            },
            splittedcss: {
                options: {
                    restructure: true
                },
                expand: true,
                cwd: '<%= basePath %>/temp/css/',
                src: ['*.css'],
                dest: '<%= basePath %>/temp/css/',
                ext: '.min.css'
            }
        },

        concat: {
            splittedcss: {
                src: ['<%= basePath %>/temp/css/*.min.css'],
                dest: '<%= projectPath %>release/brease_core.min.css'
            }
        }

    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadTasks('tasks');

};
