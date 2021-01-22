define(['brease/events/BreaseEvent',
    'brease/events/ServerEvent',
    'brease/controller/objects/ContentStatus',
    'brease/controller/ContentManager',
    'brease/core/Utils'], 
function (BreaseEvent, ServerEvent, ContentStatus, contentManager, Utils) {

    'use strict';

    var _timeout = {
            activateContentResponse: 50,
            activateContentEvent: 100,
            deactivateContentResponse: 50
        },
        BindingControllerStub = function BindingControllerStub(timeout, runtimeService) {
            this.contents = {};
            this.activateFail = [];
            this.deactivateFail = [];
            if (timeout !== undefined) {
                this.timeout = {
                    activateContentResponse: 0,
                    activateContentEvent: 0,
                    deactivateContentResponse: 0
                };
            } else {
                this.timeout = Utils.deepCopy(_timeout);
            }
            this.runtimeService = runtimeService;
        };

    var p = BindingControllerStub.prototype;

    p.reset = function () {
        this.contents = {};
        this.activateFail = [];
        this.deactivateFail = [];
    };

    p.activateContent = function (contentId) {
        //console.warn('activateContent:' + contentId);
        contentManager.setActiveState(contentId, ContentStatus.activatePending);
        var deferred = $.Deferred();
        activateContent.call(this, contentId, deferred); 
        return deferred.promise();
    };

    p.deactivateContent = function (contentId) {
        //console.warn('deactivateContent:' + contentId);
        contentManager.setActiveState(contentId, ContentStatus.deactivatePending);
        var deferred = $.Deferred();
        deactivateContent.call(this, contentId, deferred); 
        return deferred.promise();
    };

    p.sendInitialValues = function (contentId, callback) { 
        if (typeof callback === 'function') { callback(contentId); } 
    };

    p.getSubscriptionsForElement = function () { return []; };

    p.allActive = function () {
        return true;
    };

    p.isBindingLoaded = function () {
        return true;
    };

    p.isActiveSessionEvent = function () {
        return true;
    };

    p.setContentState = function (contentId, state) {
        this.contents[contentId] = state;
    };

    p.getContentState = function (contentId) {
        if (this.contents && this.contents[contentId] !== undefined) {
            return this.contents[contentId];
        } else {
            return undefined;
        }
    };

    p.isContentActive = function (contentId) {
        //console.warn('isContentActive:' + contentId + ':' + (this.contents[contentId] === true));
        return (this.contents[contentId] === true);
    };

    p.attributeChangeForwarder = function () { 
        //console.info('attributeChangeForwarder'); 
    };

    function activateContent(contentId, deferred) {
        var self = this;
        if (this.activateFail.indexOf(contentId) === -1) {
            if (this.timeout.activateContentResponse === 0) {
                deferred.resolve(contentId);

            } else {
                window.setTimeout(function (cid) {
                    deferred.resolve(cid);
                }, this.timeout.activateContentResponse, contentId);
            }

            if (this.timeout.activateContentEvent === 0) {
                this.contents[contentId] = true;
                if (this.runtimeService) {
                    this.runtimeService.dispatchEvent({
                        event: ServerEvent.CONTENT_ACTIVATED,
                        detail: {
                            visuId: '',
                            contentId: contentId
                        }
                    }, ServerEvent.CONTENT_ACTIVATED);
                } else {
                    document.body.dispatchEvent(new CustomEvent(BreaseEvent.CONTENT_ACTIVATED, { detail: { contentId: contentId } })); 
                } 

            } else {
                window.setTimeout(function (cid) {
                    self.contents[cid] = true;
                    if (self.runtimeService) {
                        self.runtimeService.dispatchEvent({
                            event: ServerEvent.CONTENT_ACTIVATED,
                            detail: {
                                visuId: '',
                                contentId: cid
                            }
                        }, ServerEvent.CONTENT_ACTIVATED);
                    } else {
                        document.body.dispatchEvent(new CustomEvent(BreaseEvent.CONTENT_ACTIVATED, { detail: { contentId: contentId } })); 
                    } 
                }, self.timeout.activateContentEvent, contentId);
            }
                
        } else {
            console.log('%c' + 'activate of content ' + contentId + ' failed', 'color:red;');
        }
    }
    function deactivateContent(contentId, deferred) {
        if (this.deactivateFail.indexOf(contentId) === -1) {
            //console.log('%c' + BreaseEvent.CONTENT_DEACTIVATED + ':' + contentId, 'color:#cc00cc');
            this.contents[contentId] = false;
            if (this.runtimeService) {
                this.runtimeService.dispatchEvent({
                    event: ServerEvent.CONTENT_DEACTIVATED,
                    detail: {
                        visuId: '',
                        contentId: contentId
                    }
                }, ServerEvent.CONTENT_DEACTIVATED);
            } else {
                document.body.dispatchEvent(new CustomEvent(BreaseEvent.CONTENT_DEACTIVATED, { detail: { contentId: contentId } }));
            }
            deferred.resolve(contentId);
        } else {
            console.log('%c' + 'deactivate of content ' + contentId + ' failed', 'color:red;');
        }
    }

    return BindingControllerStub;

});
