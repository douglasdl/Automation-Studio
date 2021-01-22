/*global module*/
module.exports = function (grunt) {

    'use strict';

    // node modules
    var _modulePath = require('path');

    grunt.registerTask('compound_postProcess', '', function () {

        grunt.file.defaultEncoding = 'utf8';

        var compoundWidget = grunt.config('compoundWidget');

        var transformedHTML = grunt.file.read(_modulePath.resolve(compoundWidget.dir, 'content/widgets.html'));
        var idRegex1 = new RegExp('id="' + compoundWidget.name + '_', 'g'),
            idRegex2 = new RegExp('setOptions\\("' + compoundWidget.name + '_', 'g');
        var contentHTML = transformedHTML.replace(idRegex1, 'id="{ID_PREFIX}');
        contentHTML = contentHTML.replace(idRegex2, 'setOptions("{ID_PREFIX}');
        contentHTML = contentHTML.replace(/script>/g, 'script>\n');
        _writeFile(_modulePath.resolve(compoundWidget.dir, 'content/widgets.html'), '<div>\n' + contentHTML + '</div>');

        var transformedCSS = grunt.file.read(_modulePath.resolve(compoundWidget.dir, 'content/widgets.css'));
        var idRegex3 = new RegExp('#' + compoundWidget.name + '_', 'g');

        var contentCSS = transformedCSS.replace(idRegex3, '#{ID_PREFIX}');
        _writeFile(_modulePath.resolve(compoundWidget.dir, 'content/widgets_css.xml'), '<?xml version="1.0" encoding="utf-8"?><style>' + contentCSS + '</style>');

    });

    function _writeFile(path, content) {
        grunt.file.write(path, content);
    }

};
