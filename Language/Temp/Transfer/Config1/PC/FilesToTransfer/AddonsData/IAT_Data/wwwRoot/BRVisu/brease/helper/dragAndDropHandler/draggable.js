define(function () {

    'use strict';

    /**
    * @class brease.helper.dragDropHandler.Draggable
    * Represents a draggable item
    */
    var Draggable = function (data) {
        var self = this;
        if (!data) {
            data = {};
        }
        data.offset = data.offset ? data.offset : {}; // offset will not be defined for rotated elements
        self = {
            id: data.id ? data.id : '', // id of the draggable widget
            contentId: data.contentId ? data.contentId : '', // content id of the draggable widget
            scaleFactor: data.scaleFactor ? data.scaleFactor : 1,
            zIndex: data.zIndex ? data.zIndex : 'auto',
            width: data.width ? data.width : '',
            height: data.height ? data.height : '',
            clientX: data.clientX ? data.clientX : 0,
            clientY: data.clientY ? data.clientY : 0,
            startPosition: {}, // initial position for calculating when ondrag starts needs to be fired
            offset: { // offset within the draggable clone
                x: data.offset.x ? data.offset.x : 0,
                y: data.offset.y ? data.offset.y : 0
            },
            clone: data.clone ? data.clone : undefined // clone which is dragged arround
        };
        // update the position of the stored clone
        self.setPosition = function () {
            if (self.clone) {
                self.clone.style.left = (self.clientX - self.offset.x) + 'px';
                self.clone.style.top = (self.clientY - self.offset.y) + 'px';
            }
        };
        // get intersecting element for drag enter and drag leave event
        self.updateIntersection = function (e) {
            self.setIntersectionElement($(document.elementFromPoint(e.clientX, e.clientY)).closest('.droppableItem').get(0));
        };
        // update the element the draggable is currently intersecting with
        // needed because there is no native drag enter and drag leave on touch devices
        self.setIntersectionElement = function (elem) {
            var old = self.intersectionElem;
            if (elem !== self.intersectionElem) {
                self.intersectionElem = elem;
                _dispatchDragLeave(old); // element the draggable is leaving or undefined
                _dispatchDragEnter(elem); // element the draggable is entering or undefined
            }
        };
        // dispatch drag start event on the draggable widget
        self.dispatchDragStart = function () {
            brease.callWidget(self.id, 'dragStartHandler', { contentId: self.contentId, id: self.id });
        };
        // dispatch drop event on the droppable widget
        self.dispatchDrop = function () {
            if (self.intersectionElem && self.intersectionElem.id) {
                if (self.intersectionElem.hasAttribute('data-widget-refid') === true) {
                    brease.callWidget(self.intersectionElem.getAttribute('data-widget-refid'), 'dropHandler', { id: self.id, contentId: self.contentId });
                } else {
                    brease.callWidget(self.intersectionElem.id, 'dropHandler', { id: self.id, contentId: self.contentId });
                }

            }
        };

        // dispatch drag end event on the draggable widget
        self.dispatchDragEnd = function () {
            brease.callWidget(self.id, 'dragEndHandler', { id: self.id, contentId: self.contentId });
        };
        self.dispose = function () {
            if (self.clone) {
                self.clone.remove();
            }
        };
        // set styles on the clone
        if (self.clone) {
            if (self.width) {
                self.clone.style['width'] = self.width + 'px';
            }
            if (self.height) {
                self.clone.style['height'] = self.height + 'px';
            }
            self.clone.style['pointer-events'] = 'none';
            self.clone.style['position'] = 'fixed';
            self.clone.style['margin'] = 'auto';
            self.clone.style['z-index'] = self.zIndex;
            self.clone.style['transform'] = 'scale(' + self.scaleFactor + ',' + self.scaleFactor + ')';
            self.clone.style['transform-origin'] = '0 0';
            // prevent the browser from leaving artifacts when dragging 
            // widgets with dashed or dotted border (see A&P 643730 )
            self.clone.style.WebkitBackfaceVisibility = 'hidden';
            self.clone.style.backfaceVisibility = 'hidden';
        }
        // set initial position
        self.startPosition.x = self.clientX;
        self.startPosition.y = self.clientY;
        // immediately apply initial position when instance of draggable is created
        // to overwrite top and left attributes from the original element on the clone
        self.setPosition();
        //dispatch mouse leave event on the droppable widget
        function _dispatchDragLeave(elem) {
            if (elem && elem.id) {
                //console.log(self.id, 'leaves:', elem.id);
                if (elem.hasAttribute('data-widget-refid') === true) {
                    brease.callWidget(elem.getAttribute('data-widget-refid'), 'dragLeaveHandler', { id: self.id, contentId: self.contentId });
                } else {
                    brease.callWidget(elem.id, 'dragLeaveHandler', { id: self.id, contentId: self.contentId });
                }
            }
        }
        //dispatch mouse enter event on the droppable widget
        function _dispatchDragEnter(elem) {
            if (elem && elem.id) {
                //console.log(self.id, 'enters:', elem.id);
                if (elem.hasAttribute('data-widget-refid') === true) {
                    brease.callWidget(elem.getAttribute('data-widget-refid'), 'dragEnterHandler', { id: self.id, contentId: self.contentId });
                } else {
                    brease.callWidget(elem.id, 'dragEnterHandler', { id: self.id, contentId: self.contentId });
                }
            }
        }

        return self;
    };

    return Draggable;
});
