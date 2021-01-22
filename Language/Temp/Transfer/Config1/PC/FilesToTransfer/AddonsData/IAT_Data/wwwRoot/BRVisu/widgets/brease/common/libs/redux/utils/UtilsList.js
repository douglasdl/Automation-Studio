define([
    'brease/enum/Enum'
], function (Enum) {

    'use strict';

    var UtilsList = {};

    UtilsList.parseJSONtoObject = function parseJSONtoObject(dataProvider) {
        var data = [];
        dataProvider.map(function (item) {
            if (typeof item === 'string') {
                try {
                    return data.push(JSON.parse(item));
                } catch (err) {
                    return [];
                }
            } else if (typeof item === 'object') {
                data.push(item);
            }
        });
        return data;
    };

    UtilsList.getItemsFromItems = function getItemsFromItems(itemsArray, selectedIndex) {
        var itemList = [], i;
        for (i = 0; i < itemsArray.length; i = i + 1) {
            itemList.push({
                imageId: i.toString(),
                textId: i.toString(),
                value: itemsArray[i].value,
                selected: i === selectedIndex
            });
        }
        return itemList;
    };

    UtilsList.getSelectedValueFromItems = function getSelectedValueFromItems(itemsArray, selectedIndex) {
        if (itemsArray[selectedIndex] !== undefined) {
            return itemsArray[selectedIndex].value;
        } else {
            return '';
        }
    };

    UtilsList.calculateListHeight = function calculateListHeight(fitHeight2Items, numberOfItems, maxVisibleEntries, itemHeight) {
        var itemsToShow = (maxVisibleEntries > numberOfItems || fitHeight2Items) ? numberOfItems : maxVisibleEntries,
            listHeight = itemsToShow * itemHeight;
        return listHeight;
    };

    UtilsList.getDataProviderForLanguage = function getDataProviderForLanguage(languages) {
        var dataProvider = Object.keys(languages).map(function (key, index) {
            return {
                value: key,
                text: languages[key].description,
                image: key + '.png',
                index: languages[key].index !== undefined ? languages[key].index : 0
            };
        });
        return dataProvider.sort(function (a, b) { return a.index - b.index; });
    };

    UtilsList.getDataProviderForMeasurement = function getDataProviderForMeasurement(systems) {
        var dataProvider = Object.keys(systems).map(function (key, index) {
            return {
                value: key,
                text: systems[key].description,
                image: key + '.png'
            };
        });
        return dataProvider.sort(function (a, b) { return a.index - b.index; });
    };

    UtilsList.getShowValues = function getShowValues(displaySettings) {
        return {
            showTexts: (displaySettings === Enum.DropDownDisplaySettings.default) ||
                (displaySettings === Enum.DropDownDisplaySettings.text) ||
                (displaySettings === Enum.DropDownDisplaySettings.imageAndText),
            showImages: (displaySettings === Enum.DropDownDisplaySettings.default) ||
                (displaySettings === Enum.DropDownDisplaySettings.image) ||
                (displaySettings === Enum.DropDownDisplaySettings.imageAndText),
            showTextsInButton: (displaySettings === Enum.DropDownDisplaySettings.default) ||
                (displaySettings === Enum.DropDownDisplaySettings.text) ||
                (displaySettings === Enum.DropDownDisplaySettings.imageAndText),
            showImagesInButton: (displaySettings === Enum.DropDownDisplaySettings.image) ||
                (displaySettings === Enum.DropDownDisplaySettings.imageAndText)
        };
    };

    UtilsList.isEqualIntBool = function isEqualIntBool(in1, in2) {
        return ((in1 === true || in1 === 1) && (in2 === true || in2 === 1)) || ((in1 === false || in1 === 0) && (in2 === false || in2 === 0));
    };

    return UtilsList;

});
