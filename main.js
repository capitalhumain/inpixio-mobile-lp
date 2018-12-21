(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var FUNCTION = 'function';
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    if (global['Zone']) {
        throw new Error('Zone already loaded.');
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._properties = null;
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                throw Error('Already loaded patch: ' + name);
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== FUNCTION) {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = undefined; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            if (applyArgs === void 0) { applyArgs = null; }
            if (source === void 0) { source = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            // we have to define an variable here, if not
            // typescript compiler will complain below
            var isNotScheduled = task.state === notScheduled;
            if (isNotScheduled && task.type === eventTask) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = null;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this
                            .name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) {
            return delegate.hasTask(target, hasTaskState);
        },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) { return delegate.invokeTask(target, task, applyThis, applyArgs); },
        onCancelTask: function (delegate, _, target, task) {
            return delegate.cancelTask(target, task);
        }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt =
                zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ?
                this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ?
                this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                return this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ?
                    ' or \'' + fromState2 + '\'' :
                    '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId;
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                nativeMicroTaskQueuePromise[symbolThen](drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return null; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === FUNCTION) {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally          
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ? [] : [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise =  false || resolve(value));
            }
            function onReject(error) {
                promise && (promise =  false || reject(error));
            }
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then(onResolve, onReject);
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            var count = 0;
            var resolvedValues = [];
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var value = values_2[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then((function (index) { return function (value) {
                    resolvedValues[index] = value;
                    count--;
                    if (!count) {
                        resolve(resolvedValues);
                    }
                }; })(count), reject);
                count++;
            }
            if (!count)
                resolve(resolvedValues);
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    function zoneify(fn) {
        return function () {
            var resultPromise = fn.apply(this, arguments);
            if (resultPromise instanceof ZoneAwarePromise) {
                return resultPromise;
            }
            var ctor = resultPromise.constructor;
            if (!ctor[symbolThenPatched]) {
                patchThen(ctor);
            }
            return resultPromise;
        };
    }
    if (NativePromise) {
        patchThen(NativePromise);
        var fetch_1 = global['fetch'];
        if (typeof fetch_1 == 'function') {
            global['fetch'] = zoneify(fetch_1);
        }
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result = listener && listener.apply(this, arguments);
    if (result != undefined && !result) {
        event.preventDefault();
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask, null);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        var customScheduleGlobal = function () {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var eventName = arguments[0];
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = eventName + FALSE_STR;
                    var trueEventName = eventName + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource + eventName;
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : null;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                task.options = options;
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    handleId: null,
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 : null,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global.__Zone_ignore_on_properties;
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget) {
            patchFilteredProperties(XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var _registerElement = document.registerElement;
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    document.registerElement = function (name, opts) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = 'Document.registerElement::' + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return _registerElement.call(document, name, opts);
    };
    attachOriginToPatched(document.registerElement, _registerElement);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
    registerElementPatch(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            XMLHttpRequest[XHR_SCHEDULED] = false;
            var data = task.data;
            var target = data.target;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && XMLHttpRequest[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        task.invoke();
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            XMLHttpRequest[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = {
                    target: self,
                    url: self[XHR_URL],
                    isPeriodic: false,
                    delay: null,
                    args: args,
                    aborted: false
                };
                return scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppComponent, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.routing */ "./src/app/app.routing.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/fesm5/ng-bootstrap.js");
/* harmony import */ var _shared_directives_fullpage_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/directives/fullpage.directive */ "./src/app/shared/directives/fullpage.directive.ts");
/* harmony import */ var _page_page_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page/page.component */ "./src/app/page/page.component.ts");
/* harmony import */ var _shared_directives_calltoaction_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shared/directives/calltoaction.directive */ "./src/app/shared/directives/calltoaction.directive.ts");
/* harmony import */ var _content_box_content_box_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./content-box/content-box.component */ "./src/app/content-box/content-box.component.ts");
/* harmony import */ var _eraser_eraser_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./eraser/eraser.component */ "./src/app/eraser/eraser.component.ts");
/* harmony import */ var _router_animations__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./router.animations */ "./src/app/router.animations.ts");
/* harmony import */ var _slide_panel_slide_panel_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./slide-panel/slide-panel.component */ "./src/app/slide-panel/slide-panel.component.ts");
/* harmony import */ var _wistia_embed_wistia_embed_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./wistia-embed/wistia-embed.component */ "./src/app/wistia-embed/wistia-embed.component.ts");
/* harmony import */ var _photomontage_photomontage_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./photomontage/photomontage.component */ "./src/app/photomontage/photomontage.component.ts");
/* harmony import */ var _cropclone_cropclone_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./cropclone/cropclone.component */ "./src/app/cropclone/cropclone.component.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./header/header.component */ "./src/app/header/header.component.ts");






//import { AppComponent } from './app.component';











var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent.prototype.getState = function (outlet) {
        console.log(outlet.activatedRouteData.state);
        return outlet.activatedRouteData.state;
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: "app-root",
            animations: [_router_animations__WEBPACK_IMPORTED_MODULE_11__["routerTransition"]],
            template: "\n    <main [@routerTransition]=\"getState(o)\">\n      <router-outlet #o=\"outlet\"></router-outlet>\n    </main>\n  "
        })
    ], AppComponent);
    return AppComponent;
}());

var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                AppComponent,
                _shared_directives_fullpage_directive__WEBPACK_IMPORTED_MODULE_6__["FullpageDirective"],
                _page_page_component__WEBPACK_IMPORTED_MODULE_7__["PageComponent"],
                _shared_directives_calltoaction_directive__WEBPACK_IMPORTED_MODULE_8__["CalltoactionDirective"],
                _content_box_content_box_component__WEBPACK_IMPORTED_MODULE_9__["ContentBoxComponent"],
                _eraser_eraser_component__WEBPACK_IMPORTED_MODULE_10__["EraserComponent"],
                _slide_panel_slide_panel_component__WEBPACK_IMPORTED_MODULE_12__["SlidePanelComponent"],
                _wistia_embed_wistia_embed_component__WEBPACK_IMPORTED_MODULE_13__["WistiaEmbedComponent"],
                _photomontage_photomontage_component__WEBPACK_IMPORTED_MODULE_14__["PhotomontageComponent"],
                _cropclone_cropclone_component__WEBPACK_IMPORTED_MODULE_15__["CropcloneComponent"],
                _header_header_component__WEBPACK_IMPORTED_MODULE_16__["HeaderComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing__WEBPACK_IMPORTED_MODULE_4__["AppRouting"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_5__["NgbModule"]
            ],
            providers: [],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routing.ts":
/*!********************************!*\
  !*** ./src/app/app.routing.ts ***!
  \********************************/
/*! exports provided: AppRouting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRouting", function() { return AppRouting; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _page_page_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./page/page.component */ "./src/app/page/page.component.ts");
/* harmony import */ var _eraser_eraser_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eraser/eraser.component */ "./src/app/eraser/eraser.component.ts");
/* harmony import */ var _cropclone_cropclone_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cropclone/cropclone.component */ "./src/app/cropclone/cropclone.component.ts");
/* harmony import */ var _photomontage_photomontage_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./photomontage/photomontage.component */ "./src/app/photomontage/photomontage.component.ts");





var routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: _page_page_component__WEBPACK_IMPORTED_MODULE_1__["PageComponent"], data: { state: "home" } },
    { path: "eraser", component: _eraser_eraser_component__WEBPACK_IMPORTED_MODULE_2__["EraserComponent"], data: { state: "about" } },
    {
        path: "photomontage",
        component: _photomontage_photomontage_component__WEBPACK_IMPORTED_MODULE_4__["PhotomontageComponent"],
        data: { state: "photomontage" }
    },
    {
        path: "cropclone",
        component: _cropclone_cropclone_component__WEBPACK_IMPORTED_MODULE_3__["CropcloneComponent"],
        data: { state: "cropclone" }
    },
    { path: "**", component: _page_page_component__WEBPACK_IMPORTED_MODULE_1__["PageComponent"] }
];
var AppRouting = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes, {
    useHash: true
});


/***/ }),

/***/ "./src/app/content-box/content-box.component.css":
/*!*******************************************************!*\
  !*** ./src/app/content-box/content-box.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbnRlbnQtYm94L2NvbnRlbnQtYm94LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/content-box/content-box.component.html":
/*!********************************************************!*\
  !*** ./src/app/content-box/content-box.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"box\" [@scrollAnimation]=\"state\">\n  <img src=\"https://images.pexels.com/photos/37547/suit-business-man-business-man-37547.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb\">\n</div>\n"

/***/ }),

/***/ "./src/app/content-box/content-box.component.ts":
/*!******************************************************!*\
  !*** ./src/app/content-box/content-box.component.ts ***!
  \******************************************************/
/*! exports provided: ContentBoxComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentBoxComponent", function() { return ContentBoxComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");



var ContentBoxComponent = /** @class */ (function () {
    function ContentBoxComponent(el) {
        this.el = el;
        this.state = 'hide';
    }
    ContentBoxComponent.prototype.checkScroll = function () {
        var componentPosition = this.el.nativeElement.offsetTop;
        var scrollPosition = window.pageYOffset;
        if (scrollPosition >= componentPosition) {
            this.state = 'show';
        }
        else {
            this.state = 'show';
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('window:scroll', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", []),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], ContentBoxComponent.prototype, "checkScroll", null);
    ContentBoxComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-content-box',
            template: __webpack_require__(/*! ./content-box.component.html */ "./src/app/content-box/content-box.component.html"),
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('scrollAnimation', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('show', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        opacity: 1,
                        transform: 'translateX(0)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('hide', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({
                        opacity: 0,
                        transform: 'translateX(-100%)'
                    })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('show => hide', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('700ms ease-out')),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('hide => show', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])('700ms ease-in'))
                ])
            ],
            styles: [__webpack_require__(/*! ./content-box.component.css */ "./src/app/content-box/content-box.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], ContentBoxComponent);
    return ContentBoxComponent;
}());



/***/ }),

/***/ "./src/app/cropclone/cropclone.component.html":
/*!****************************************************!*\
  !*** ./src/app/cropclone/cropclone.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"app-content\">\n  <div class=\"card\" >\n    <app-header header=\"{{app.logo}}\" headerClass=\"profile-card-active\"></app-header>\n    <div class=\"e-body\" >\n      <div class=\"e-menu-top\">\n<div class=\"e-menu-active-link\" style=\"background-color: #e87a45\" [routerLink]=\"['/photomontage']\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/SettingsYellow.png\" />\n          </div>\n          <div class=\"e-menu-title\">\n            <span class=\"e-menu-description\">Simply Touch Up</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"hmbrgr_menu_bg \" style=\"\nwidth: 20%;height: 80% ; background-color: #e87a45;opacity: 0.4;\n        \">\n        <div style=\"    position: fixed;\n        width: 20%;\n        bottom: 0;\n        \">\n\n<div class=\"e-menu-link\" [routerLink]=\"['/eraser']\"  style=\"background-color: #e87a45;position: relative;bottom: 0px;\">\n              <div class=\"e-menu-img\">\n                <img src=\"assets/img/MagicWandOrange.png\" />\n              </div>\n            </div>\n\n\n<div class=\"e-menu-link\" [routerLink]=\"['/cropclone']\" style=\"background-color: #e87a45;position: relative;bottom: 0px;\">\n              <div class=\"e-menu-img\">\n                <img src=\"assets/img/ComputerOrange.png\" />\n              </div>\n            </div>\n\n\n<div class=\"e-menu-link\" [routerLink]=\"['/']\"  style=\"background-color: #e87a45;position: relative;bottom: 0px;\">\n              <div class=\"e-menu-img\">\n<img src=\"assets/img/PclipLogoOrange.png\" />\n              </div>\n            </div>\n\n        </div>\n      </div>\n\n\n      <div class=\"e-video-full-width align-self-center row\">\n        <div style=\"width:22%;\" class=\"col-xs-2\">\n          &nbsp;\n        </div>\n        <div style=\"width:78%;height:100%;pull: right\" class=\"col-xs-10\">\n          <app-wistia-embed></app-wistia-embed>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div style=\"width:20%;height: 30%;\" class=\"col-xs-2 empbullet\">\n          &nbsp;\n        </div>\n        <div style=\"width:80%;height: 30%;\" class=\"col-xs-10 e-bullets\">\n<div class=\"e-bullets-element\" style=\"background-color: #e87a45\" [routerLink]=\"['/eraser']\">\n            <div class=\"e-bullets-img\">\n              <img src=\"assets/img/Bullet.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n\n              <div class=\"e-menu-details\">\n                <span> Lorem Ipsum is simply</span>\n                <span> Lorem Ipsum is simply</span>\n              </div>\n            </div>\n          </div>\n\n<div class=\"e-bullets-element\" style=\"background-color: #e87a45\" [routerLink]=\"['/photomontage']\">\n            <div class=\"e-bullets-img\">\n              <img src=\"assets/img/Bullet.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n\n              <div class=\"e-menu-details\">\n                <span> Lorem Ipsum is simply</span>\n                <span> Lorem Ipsum is simply</span>\n              </div>\n            </div>\n          </div>\n\n<div class=\"e-bullets-element\" style=\"background-color: #e87a45\" [routerLink]=\"['/cropclone']\">\n            <div class=\"e-bullets-img\">\n              <img src=\"assets/img/Bullet.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n\n              <div class=\"e-menu-details\">\n                <span> Lorem Ipsum is simply</span>\n                <span> Lorem Ipsum is simply</span>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/cropclone/cropclone.component.scss":
/*!****************************************************!*\
  !*** ./src/app/cropclone/cropclone.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "* {\n  box-sizing: border-box; }\n\n::-webkit-scrollbar {\n  display: none; }\n\nbody,\nng-view,\nng-include,\nng-transclude,\nui-shared-state {\n  margin: 0;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 100vh;\n  font-family: Raleway; }\n\n.app-content {\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  width: 100vw;\n  height: 100vh;\n  background-color: #3b3837; }\n\n.card {\n  background: linear-gradient(to bottom, #3b3837 25%, #F8F8FA 0%);\n  width: 100vw;\n  height: 100vh;\n  flex-direction: column;\n  display: flex;\n  align-items: center; }\n\n.card-container {\n  background-color: #3b3837;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100vw;\n  height: 25vh; }\n\n.e-body {\n  background-color: #3b3837;\n  width: 100vw;\n  height: 81vh;\n  min-height: 81%; }\n\n.e-menu {\n  flex: 1 1 31%;\n  height: 31%;\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center; }\n\n.e-menu-top {\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center; }\n\n.e-menu-img {\n  flex: 1 1 auto; }\n\n.e-menu-active-link {\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n  overflow: hidden; }\n\n.e-menu-link {\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n  overflow: hidden;\n  box-shadow: -13px 9px 3px 13px #e87a45; }\n\n.empbullet {\n  opacity: 0;\n  flex: 1 1 20%;\n  height: 100%;\n  background-color: #dc9892;\n  position: absolute;\n  bottom: 0;\n  left: 0; }\n\n.e-bullets-element {\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n  overflow: hidden;\n  box-shadow: -1px 8px 33px -5px rgba(0, 0, 0, 0.75); }\n\n.e-bullets {\n  flex: 1 1 78%;\n  height: 100%;\n  background-color: #dc9892;\n  position: absolute;\n  bottom: 0;\n  left: 20%; }\n\n.e-bullets-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%; }\n\n.e-menu-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%;\n  background-color: #d9d6d5;\n  opacity: 0.4; }\n\n.e-video-full-width {\n  flex: 1 1 80%;\n  height: 53%;\n  right: 0px;\n  background-color: #3b3837;\n  align-items: right;\n  justify-content: right; }\n\n.e-menu-img img,\n.e-bullets-img img {\n  align-self: center;\n  max-width: 60%;\n  max-height: 60%; }\n\n.e-menu-title {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 80%;\n  align-self: center; }\n\n.e-menu-description {\n  color: #F8F8FA;\n  font-weight: bolder;\n  font-size: 1.3em;\n  line-height: 13px; }\n\n.e-menu-details {\n  color: #F8F8FA;\n  font-size: 0.8em;\n  margin: 5px; }\n\n.hmbrgr_menu_bg {\n  opacity: 0.8;\n  flex: 1 1 20%;\n  border-radius: 0 0 0 0;\n  height: 100%;\n  background-color: #dc9892;\n  position: absolute;\n  /* top: 0; */\n  left: 0;\n  z-index: 2;\n  transition: all 0.5s ease; }\n\n.bottom {\n  position: absolute;\n  bottom: 0; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW5pZWx2YWxpZGUvV29ya1NwYWNlL0FOR1VMQVIvaW5waXhpb19tb2JpbGUvbW9iaWxlL3NyYy9hcHAvY3JvcGNsb25lL2Nyb3BjbG9uZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHVCQUFzQixFQUN2Qjs7QUFFRDtFQUNFLGNBQWEsRUFDZDs7QUFFRDs7Ozs7RUFLRSxVQUFTO0VBQ1QsY0FBYTtFQUNiLG9CQUFtQjtFQUNuQixvQkFBbUI7RUFDbkIsY0FBYTtFQUNiLHFCQUFvQixFQUNyQjs7QUFFRDtFQUNFLGNBQWE7RUFDYixvQkFBbUI7RUFDbkIsOEJBQTZCO0VBQzdCLGFBQVk7RUFDWixjQUFhO0VBQ2IsMEJBQXlCLEVBQzFCOztBQUlEO0VBQ0UsZ0VBQStEO0VBQy9ELGFBQVk7RUFDWixjQUFhO0VBQ2IsdUJBQXNCO0VBQ3RCLGNBQWE7RUFDYixvQkFBbUIsRUFFcEI7O0FBRUQ7RUFDRSwwQkFBeUI7RUFDekIsY0FBYTtFQUNiLG9CQUFtQjtFQUNuQix3QkFBdUI7RUFDdkIsYUFBWTtFQUNaLGFBQVksRUFDYjs7QUFFRDtFQUNFLDBCQUF5QjtFQUN6QixhQUFZO0VBQ1osYUFBWTtFQUNaLGdCQUFlLEVBQ2hCOztBQUVEO0VBQ0UsY0FBYTtFQUNiLFlBQVc7RUFDWCwwQkFBeUI7RUFDekIsdUJBQXNCO0VBQ3RCLG9CQUFtQjtFQUNuQix3QkFBdUIsRUFFeEI7O0FBRUQ7RUFDRSwwQkFBeUI7RUFDekIsdUJBQXNCO0VBQ3RCLG9CQUFtQjtFQUNuQix3QkFBdUIsRUFFeEI7O0FBT0Q7RUFDRSxlQUFjLEVBQ2Y7O0FBR0Q7RUFFRSxjQUFhO0VBQ2Isb0JBQW1CO0VBQ25CLG1CQUFrQjtFQUNsQixtQkFBa0I7RUFDbEIsdUJBQXNCO0VBRXRCLGlCQUFnQixFQUVqQjs7QUFFRDtFQUVFLGNBQWE7RUFDYixvQkFBbUI7RUFDbkIsbUJBQWtCO0VBQ2xCLG1CQUFrQjtFQUNsQix1QkFBc0I7RUFFdEIsaUJBQWdCO0VBQ2hCLHVDQUFzQyxFQUN2Qzs7QUFFRDtFQUNFLFdBQVU7RUFDVixjQUFhO0VBRWIsYUFBWTtFQUNaLDBCQUF5QjtFQUN6QixtQkFBa0I7RUFDbEIsVUFBUztFQUNULFFBQU8sRUFFUjs7QUFFRDtFQUdFLGNBQWE7RUFDYixvQkFBbUI7RUFDbkIsbUJBQWtCO0VBQ2xCLG1CQUFrQjtFQUNsQix1QkFBc0I7RUFFdEIsaUJBQWdCO0VBQ2hCLG1EQUFrRCxFQUNuRDs7QUFFRDtFQUNFLGNBQWE7RUFDYixhQUFZO0VBQ1osMEJBQXlCO0VBQ3pCLG1CQUFrQjtFQUNsQixVQUFTO0VBQ1QsVUFBUyxFQUNWOztBQUVEO0VBQ0UsY0FBYTtFQUNiLHVCQUFzQjtFQUN0QixvQkFBbUI7RUFDbkIsOEJBQTZCO0VBQzdCLGNBQWEsRUFFZDs7QUFFRDtFQUNFLGNBQWE7RUFDYix1QkFBc0I7RUFDdEIsb0JBQW1CO0VBQ25CLDhCQUE2QjtFQUM3QixjQUFhO0VBQ2IsMEJBQXlCO0VBQ3pCLGFBQVksRUFDYjs7QUFFRDtFQUNFLGNBQWE7RUFDYixZQUFXO0VBQ1gsV0FBVTtFQUNWLDBCQUF5QjtFQUV6QixtQkFBa0I7RUFDbEIsdUJBQXNCLEVBR3ZCOztBQUVEOztFQUVFLG1CQUFrQjtFQUNsQixlQUFjO0VBQ2QsZ0JBQWUsRUFFaEI7O0FBRUQ7RUFDRSxjQUFhO0VBQ2IsdUJBQXNCO0VBQ3RCLG9CQUFtQjtFQUNuQiw4QkFBNkI7RUFDN0IsY0FBYTtFQUNiLG1CQUFrQixFQUNuQjs7QUFNRDtFQUNFLGVBQWM7RUFDZCxvQkFBbUI7RUFDbkIsaUJBQWdCO0VBQ2hCLGtCQUFpQixFQUNsQjs7QUFFRDtFQUNFLGVBQWM7RUFFZCxpQkFBZ0I7RUFDaEIsWUFBVyxFQUNaOztBQUVEO0VBQ0EsYUFBWTtFQUNaLGNBQWE7RUFDYix1QkFBc0I7RUFDdEIsYUFBWTtFQUNaLDBCQUF5QjtFQUN6QixtQkFBa0I7RUFDbEIsYUFBYTtFQUNiLFFBQU87RUFDUCxXQUFVO0VBQ1YsMEJBQXlCLEVBRXhCOztBQUVEO0VBQ0UsbUJBQWtCO0VBQ2xCLFVBQVMsRUFDViIsImZpbGUiOiJzcmMvYXBwL2Nyb3BjbG9uZS9jcm9wY2xvbmUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIqIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbmJvZHksXG5uZy12aWV3LFxubmctaW5jbHVkZSxcbm5nLXRyYW5zY2x1ZGUsXG51aS1zaGFyZWQtc3RhdGUge1xuICBtYXJnaW46IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMTAwdmg7XG4gIGZvbnQtZmFtaWx5OiBSYWxld2F5O1xufVxuXG4uYXBwLWNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDEwMHZoO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xufVxuXG5cblxuLmNhcmQge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAjM2IzODM3IDI1JSwgI0Y4RjhGQSAwJSk7XG4gIHdpZHRoOiAxMDB2dztcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxufVxuXG4uY2FyZC1jb250YWluZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDI1dmg7XG59XG5cbi5lLWJvZHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogODF2aDtcbiAgbWluLWhlaWdodDogODElO1xufVxuXG4uZS1tZW51IHtcbiAgZmxleDogMSAxIDMxJTtcbiAgaGVpZ2h0OiAzMSU7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzYjM4Mzc7XG4gIGJvcmRlci1yYWRpdXM6IDAgMCAwIDA7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG59XG5cbi5lLW1lbnUtdG9wIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgYm9yZGVyLXJhZGl1czogMCAwIDAgMDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbn1cblxuLmUtbWVudS10b3AgaW1ne1xuXG5cbn1cblxuLmUtbWVudS1pbWcge1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxuXG4uZS1tZW51LWFjdGl2ZS1saW5rIHtcblxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAzNCUgIWltcG9ydGFudDtcblxuICBvdmVyZmxvdzogaGlkZGVuO1xuXG59XG5cbi5lLW1lbnUtbGluayB7XG5cbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGhlaWdodDogMzQlICFpbXBvcnRhbnQ7XG5cbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm94LXNoYWRvdzogLTEzcHggOXB4IDNweCAxM3B4ICNlODdhNDU7XG59XG5cbi5lbXBidWxsZXQge1xuICBvcGFjaXR5OiAwO1xuICBmbGV4OiAxIDEgMjAlO1xuXG4gIGhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RjOTg5MjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG5cbn1cblxuLmUtYnVsbGV0cy1lbGVtZW50IHtcblxuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBoZWlnaHQ6IDM0JSAhaW1wb3J0YW50O1xuXG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaGFkb3c6IC0xcHggOHB4IDMzcHggLTVweCByZ2JhKDAsIDAsIDAsIDAuNzUpO1xufVxuXG4uZS1idWxsZXRzIHtcbiAgZmxleDogMSAxIDc4JTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGM5ODkyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMjAlO1xufVxuXG4uZS1idWxsZXRzLWltZyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBmbGV4OiAxIDEgMjAlO1xuXG59XG5cbi5lLW1lbnUtaW1nIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGZsZXg6IDEgMSAyMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkOWQ2ZDU7XG4gIG9wYWNpdHk6IDAuNDtcbn1cblxuLmUtdmlkZW8tZnVsbC13aWR0aCB7XG4gIGZsZXg6IDEgMSA4MCU7XG4gIGhlaWdodDogNTMlO1xuICByaWdodDogMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuXG4gIGFsaWduLWl0ZW1zOiByaWdodDtcbiAganVzdGlmeS1jb250ZW50OiByaWdodDtcblxuXG59XG5cbi5lLW1lbnUtaW1nIGltZyxcbi5lLWJ1bGxldHMtaW1nIGltZyB7XG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcbiAgbWF4LXdpZHRoOiA2MCU7XG4gIG1heC1oZWlnaHQ6IDYwJTtcblxufVxuXG4uZS1tZW51LXRpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGZsZXg6IDEgMSA4MCU7XG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcbn1cblxuLmUtbWVudS10aXRsZT5kaXYge31cblxuLmUtbWVudS10aXRsZT5zcGFuIHt9XG5cbi5lLW1lbnUtZGVzY3JpcHRpb24ge1xuICBjb2xvcjogI0Y4RjhGQTtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbiAgZm9udC1zaXplOiAxLjNlbTtcbiAgbGluZS1oZWlnaHQ6IDEzcHg7XG59XG5cbi5lLW1lbnUtZGV0YWlscyB7XG4gIGNvbG9yOiAjRjhGOEZBO1xuXG4gIGZvbnQtc2l6ZTogMC44ZW07XG4gIG1hcmdpbjogNXB4O1xufVxuXG4uaG1icmdyX21lbnVfYmcge1xub3BhY2l0eTogMC44O1xuZmxleDogMSAxIDIwJTtcbmJvcmRlci1yYWRpdXM6IDAgMCAwIDA7XG5oZWlnaHQ6IDEwMCU7XG5iYWNrZ3JvdW5kLWNvbG9yOiAjZGM5ODkyO1xucG9zaXRpb246IGFic29sdXRlO1xuLyogdG9wOiAwOyAqL1xubGVmdDogMDtcbnotaW5kZXg6IDI7XG50cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlO1xuXG59XG5cbi5ib3R0b20ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogMDtcbn1cbiJdfQ== */"

/***/ }),

/***/ "./src/app/cropclone/cropclone.component.ts":
/*!**************************************************!*\
  !*** ./src/app/cropclone/cropclone.component.ts ***!
  \**************************************************/
/*! exports provided: CropcloneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CropcloneComponent", function() { return CropcloneComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var CropcloneComponent = /** @class */ (function () {
    function CropcloneComponent() {
        this.app = {
            logo: "assets/img/PclipLogoOrange.png"
        };
    }
    CropcloneComponent.prototype.ngOnInit = function () { };
    CropcloneComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-cropclone",
            template: __webpack_require__(/*! ./cropclone.component.html */ "./src/app/cropclone/cropclone.component.html"),
            styles: [__webpack_require__(/*! ./cropclone.component.scss */ "./src/app/cropclone/cropclone.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], CropcloneComponent);
    return CropcloneComponent;
}());



/***/ }),

/***/ "./src/app/eraser/eraser.component.css":
/*!*********************************************!*\
  !*** ./src/app/eraser/eraser.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "* {\n  box-sizing: border-box;\n}\n\n::-webkit-scrollbar {\n  display: none;\n}\n\nbody,\nng-view,\nng-include,\nng-transclude,\nui-shared-state {\n  margin: 0;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 100vh;\n  font-family: Raleway;\n}\n\n.app-content {\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  width: 100vw;\n  height: 100vh;\n  background-color: #3b3837;\n}\n\n.card {\n  background: linear-gradient(to bottom, #3b3837 25%, #F8F8FA 0%);\n  width: 100vw;\n  height: 100vh;\n  flex-direction: column;\n  display: flex;\n  align-items: center;\n\n}\n\n.card-container {\n  background-color: #3b3837;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100vw;\n  height: 25vh;\n}\n\n.e-body {\n  background-color: #3b3837;\n  width: 100vw;\n  height: 78vh;\n}\n\n.e-menu {\n  flex: 1 1 31%;\n  height: 31%;\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center;\n\n}\n\n.e-menu-top {\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center;\n\n}\n\n.e-menu-img {\n  flex: 1 1 auto;\n}\n\n.e-menu-active-link {\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n\n\n  overflow: hidden;\n\n}\n\n.e-menu-link {\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n\n  overflow: hidden;\n  box-shadow: -2px 9px 12px 9px #F44336;\n}\n\n.empbullet {\n  opacity: 0;\n  flex: 1 1 20%;\n\n  height: 100%;\n  background-color: #dc9892;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n\n}\n\n.e-bullets-element {\n\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n\n  overflow: hidden;\n  box-shadow: -1px 8px 33px -5px rgba(0, 0, 0, 0.75);\n}\n\n.e-bullets {\n   flex: 1 1 78%;\n   height: 100%;\n   background-color: #dc9892;\n   position: absolute;\n   bottom: 0;\n   left: 20%;\n}\n\n.e-bullets-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%;\n\n}\n\n.e-menu-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%;\n  background-color: #d9d6d5;\n  opacity: 0.4;\n}\n\n.e-video-full-width {\n  flex: 1 1 80%;\n  height: 53%;\n  right: 0px;\n  background-color: #3b3837;\n\n  align-items: right;\n  justify-content: right;\n\n\n}\n\n.e-menu-img img,\n.e-bullets-img img {\n  align-self: center;\n  max-width: 60%;\n  max-height: 60%;\n\n}\n\n.e-menu-title {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 80%;\n  align-self: center;\n}\n\n.e-menu-title>div {}\n\n.e-menu-title>span {}\n\n.e-menu-description {\n  color: #F8F8FA;\n  font-weight: bolder;\n  font-size: 1.3em;\n  line-height: 13px;\n}\n\n.e-menu-details {\n  color: #F8F8FA;\n\n  font-size: 0.8em;\n  margin-top: 1px;\n}\n\n.hmbrgr_menu_bg {\n  opacity: 0.8;\n  flex: 1 1 20%;\n\n  border-radius: 0 0 0 0;\n  height: 100%;\n  background-color: #dc9892;\n  ;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  transition: all 0.5s ease;\n\n}\n\n.bottom {\n  position: absolute;\n  bottom: 0;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZXJhc2VyL2VyYXNlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsdUJBQXVCO0NBQ3hCOztBQUVEO0VBQ0UsY0FBYztDQUNmOztBQUVEOzs7OztFQUtFLFVBQVU7RUFDVixjQUFjO0VBQ2Qsb0JBQW9CO0VBQ3BCLG9CQUFvQjtFQUNwQixjQUFjO0VBQ2QscUJBQXFCO0NBQ3RCOztBQUVEO0VBQ0UsY0FBYztFQUNkLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsYUFBYTtFQUNiLGNBQWM7RUFDZCwwQkFBMEI7Q0FDM0I7O0FBSUQ7RUFDRSxnRUFBZ0U7RUFDaEUsYUFBYTtFQUNiLGNBQWM7RUFDZCx1QkFBdUI7RUFDdkIsY0FBYztFQUNkLG9CQUFvQjs7Q0FFckI7O0FBRUQ7RUFDRSwwQkFBMEI7RUFDMUIsY0FBYztFQUNkLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLGFBQWE7Q0FDZDs7QUFDRDtFQUNFLDBCQUEwQjtFQUMxQixhQUFhO0VBQ2IsYUFBYTtDQUNkOztBQUNEO0VBQ0UsY0FBYztFQUNkLFlBQVk7RUFDWiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLG9CQUFvQjtFQUNwQix3QkFBd0I7O0NBRXpCOztBQUNEO0VBQ0UsMEJBQTBCO0VBQzFCLHVCQUF1QjtFQUN2QixvQkFBb0I7RUFDcEIsd0JBQXdCOztDQUV6Qjs7QUFDRDtFQUNFLGVBQWU7Q0FDaEI7O0FBR0Q7O0VBRUUsY0FBYztFQUNkLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIsbUJBQW1COzs7RUFHbkIsaUJBQWlCOztDQUVsQjs7QUFDRDs7RUFFRSxjQUFjO0VBQ2Qsb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsdUJBQXVCOztFQUV2QixpQkFBaUI7RUFDakIsc0NBQXNDO0NBQ3ZDOztBQUVEO0VBQ0UsV0FBVztFQUNYLGNBQWM7O0VBRWQsYUFBYTtFQUNiLDBCQUEwQjtFQUMxQixtQkFBbUI7RUFDbkIsVUFBVTtFQUNWLFFBQVE7O0NBRVQ7O0FBQ0Q7OztFQUdFLGNBQWM7RUFDZCxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQix1QkFBdUI7O0VBRXZCLGlCQUFpQjtFQUNqQixtREFBbUQ7Q0FDcEQ7O0FBQ0Q7R0FDRyxjQUFjO0dBQ2QsYUFBYTtHQUNiLDBCQUEwQjtHQUMxQixtQkFBbUI7R0FDbkIsVUFBVTtHQUNWLFVBQVU7Q0FDWjs7QUFDRDtFQUNFLGNBQWM7RUFDZCx1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLDhCQUE4QjtFQUM5QixjQUFjOztDQUVmOztBQUVEO0VBQ0UsY0FBYztFQUNkLHVCQUF1QjtFQUN2QixvQkFBb0I7RUFDcEIsOEJBQThCO0VBQzlCLGNBQWM7RUFDZCwwQkFBMEI7RUFDMUIsYUFBYTtDQUNkOztBQUNEO0VBQ0UsY0FBYztFQUNkLFlBQVk7RUFDWixXQUFXO0VBQ1gsMEJBQTBCOztFQUUxQixtQkFBbUI7RUFDbkIsdUJBQXVCOzs7Q0FHeEI7O0FBQ0Q7O0VBRUUsbUJBQW1CO0VBQ25CLGVBQWU7RUFDZixnQkFBZ0I7O0NBRWpCOztBQUVEO0VBQ0UsY0FBYztFQUNkLHVCQUF1QjtFQUN2QixvQkFBb0I7RUFDcEIsOEJBQThCO0VBQzlCLGNBQWM7RUFDZCxtQkFBbUI7Q0FDcEI7O0FBRUQsb0JBQW9COztBQUVwQixxQkFBcUI7O0FBRXJCO0VBQ0UsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixpQkFBaUI7RUFDakIsa0JBQWtCO0NBQ25COztBQUVEO0VBQ0UsZUFBZTs7RUFFZixpQkFBaUI7RUFDakIsZ0JBQWdCO0NBQ2pCOztBQUVEO0VBQ0UsYUFBYTtFQUNiLGNBQWM7O0VBRWQsdUJBQXVCO0VBQ3ZCLGFBQWE7RUFDYiwwQkFBMEI7O0VBRTFCLG1CQUFtQjtFQUNuQixPQUFPO0VBQ1AsUUFBUTtFQUNSLFdBQVc7RUFDWCwwQkFBMEI7O0NBRTNCOztBQUNEO0VBQ0UsbUJBQW1CO0VBQ25CLFVBQVU7Q0FDWCIsImZpbGUiOiJzcmMvYXBwL2VyYXNlci9lcmFzZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIioge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuYm9keSxcbm5nLXZpZXcsXG5uZy1pbmNsdWRlLFxubmctdHJhbnNjbHVkZSxcbnVpLXNoYXJlZC1zdGF0ZSB7XG4gIG1hcmdpbjogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgZm9udC1mYW1pbHk6IFJhbGV3YXk7XG59XG5cbi5hcHAtY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzYjM4Mzc7XG59XG5cblxuXG4uY2FyZCB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICMzYjM4MzcgMjUlLCAjRjhGOEZBIDAlKTtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDEwMHZoO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG59XG5cbi5jYXJkLWNvbnRhaW5lciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzYjM4Mzc7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMjV2aDtcbn1cbi5lLWJvZHkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogNzh2aDtcbn1cbi5lLW1lbnUge1xuICBmbGV4OiAxIDEgMzElO1xuICBoZWlnaHQ6IDMxJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgYm9yZGVyLXJhZGl1czogMCAwIDAgMDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbn1cbi5lLW1lbnUtdG9wIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgYm9yZGVyLXJhZGl1czogMCAwIDAgMDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbn1cbi5lLW1lbnUtaW1nIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG5cblxuLmUtbWVudS1hY3RpdmUtbGluayB7XG5cbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cblxuICBvdmVyZmxvdzogaGlkZGVuO1xuXG59XG4uZS1tZW51LWxpbmsge1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBoZWlnaHQ6IDM0JSAhaW1wb3J0YW50O1xuXG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaGFkb3c6IC0ycHggOXB4IDEycHggOXB4ICNGNDQzMzY7XG59XG5cbi5lbXBidWxsZXQge1xuICBvcGFjaXR5OiAwO1xuICBmbGV4OiAxIDEgMjAlO1xuXG4gIGhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RjOTg5MjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG5cbn1cbi5lLWJ1bGxldHMtZWxlbWVudCB7XG5cblxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAzNCUgIWltcG9ydGFudDtcblxuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2hhZG93OiAtMXB4IDhweCAzM3B4IC01cHggcmdiYSgwLCAwLCAwLCAwLjc1KTtcbn1cbi5lLWJ1bGxldHMge1xuICAgZmxleDogMSAxIDc4JTtcbiAgIGhlaWdodDogMTAwJTtcbiAgIGJhY2tncm91bmQtY29sb3I6ICNkYzk4OTI7XG4gICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICBib3R0b206IDA7XG4gICBsZWZ0OiAyMCU7XG59XG4uZS1idWxsZXRzLWltZyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBmbGV4OiAxIDEgMjAlO1xuXG59XG5cbi5lLW1lbnUtaW1nIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGZsZXg6IDEgMSAyMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkOWQ2ZDU7XG4gIG9wYWNpdHk6IDAuNDtcbn1cbi5lLXZpZGVvLWZ1bGwtd2lkdGgge1xuICBmbGV4OiAxIDEgODAlO1xuICBoZWlnaHQ6IDUzJTtcbiAgcmlnaHQ6IDBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcblxuICBhbGlnbi1pdGVtczogcmlnaHQ7XG4gIGp1c3RpZnktY29udGVudDogcmlnaHQ7XG5cblxufVxuLmUtbWVudS1pbWcgaW1nLFxuLmUtYnVsbGV0cy1pbWcgaW1nIHtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xuICBtYXgtd2lkdGg6IDYwJTtcbiAgbWF4LWhlaWdodDogNjAlO1xuXG59XG5cbi5lLW1lbnUtdGl0bGUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgZmxleDogMSAxIDgwJTtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xufVxuXG4uZS1tZW51LXRpdGxlPmRpdiB7fVxuXG4uZS1tZW51LXRpdGxlPnNwYW4ge31cblxuLmUtbWVudS1kZXNjcmlwdGlvbiB7XG4gIGNvbG9yOiAjRjhGOEZBO1xuICBmb250LXdlaWdodDogYm9sZGVyO1xuICBmb250LXNpemU6IDEuM2VtO1xuICBsaW5lLWhlaWdodDogMTNweDtcbn1cblxuLmUtbWVudS1kZXRhaWxzIHtcbiAgY29sb3I6ICNGOEY4RkE7XG5cbiAgZm9udC1zaXplOiAwLjhlbTtcbiAgbWFyZ2luLXRvcDogMXB4O1xufVxuXG4uaG1icmdyX21lbnVfYmcge1xuICBvcGFjaXR5OiAwLjg7XG4gIGZsZXg6IDEgMSAyMCU7XG5cbiAgYm9yZGVyLXJhZGl1czogMCAwIDAgMDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGM5ODkyO1xuICA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB6LWluZGV4OiAyO1xuICB0cmFuc2l0aW9uOiBhbGwgMC41cyBlYXNlO1xuXG59XG4uYm90dG9tIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/eraser/eraser.component.html":
/*!**********************************************!*\
  !*** ./src/app/eraser/eraser.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"app-content\">\n  <div class=\"card\">\n<app-header header=\"{{app.logo}}\" headerClass=\"profile-card-active\"></app-header>\n      <div class=\"e-body\">\n        <div class=\"e-menu-top\">\n<div class=\"e-menu-active-link\" style=\"background-color: #dd594f\" [routerLink]=\"['/eraser']\">\n            <div class=\"e-menu-img\">\n              <img src=\"assets/img/MagicWandRed.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n              <span class=\"e-menu-description\">Erase with a click</span>\n            </div>\n          </div>\n        </div>\n        <div class=\"hmbrgr_menu_bg \" style=\"\n        width: 20%;height: 80% ;top: 28%;\n        \">\n        <div style=\"    position: fixed;\n        width: 20%;\n        bottom: 0;\n        \">\n<a [routerLink]=\"['/photomontage']\">\n        <div class=\"e-menu-link\" style=\"background-color: #dd594f;position: relative;bottom: 0px;\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/ComputerRed.png\" />\n          </div>\n        </div>\n        </a>\n<a [routerLink]=\"['/photomontage']\">\n        <div class=\"e-menu-link\" style=\"background-color: #dd594f;position: relative;bottom: 0px;\">\n          <div class=\"e-menu-img\">\n<img src=\"assets/img/SettingsRed.png\" />\n          </div>\n        </div>\n        </a>\n<a [routerLink]=\"['/']\" >\n        <div class=\"e-menu-link\" style=\"background-color: #dd594f;position: relative;bottom: 0px;\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/PictoRed.png\" />\n          </div>\n        </div>\n        </a>\n        </div>\n        </div>\n\n\n<div class=\"e-video-full-width align-self-center row\" style=\"\n    background-color: #dc9892;opacity: 0.5;\n\">\n<div style=\"width:22%;\" class=\"col-xs-2\">\n&nbsp;\n</div>\n<div style=\"width:78%;height:100%;pull: right\" class=\"col-xs-10\">\n  <app-wistia-embed></app-wistia-embed>\n</div>\n</div>\n<div class=\"row\">\n<div style=\"width:20%;height: 30%;\" class=\"col-xs-2 empbullet\">\n&nbsp;\n</div>\n<div   style=\"width:80%;height: 30%;\" class=\"col-xs-10 e-bullets\">\n<div class=\"e-bullets-element\" style=\"background-color: #dd594f\" [routerLink]=\"['/eraser']\">\n<div class=\"e-bullets-img\">\n<img src=\"assets/img/Bullet.png\" />\n    </div>\n    <div class=\"e-menu-title\">\n\n      <div class=\"e-menu-details\">\n<span> Lorem Ipsum is simply</span>\n<span> Lorem Ipsum is simply</span>\n      </div>\n    </div>\n  </div>\n\n<div class=\"e-bullets-element\" style=\"background-color: #dd594f\" [routerLink]=\"['/photomontage']\">\n<div class=\"e-bullets-img\">\n<img src=\"assets/img/Bullet.png\" />\n    </div>\n    <div class=\"e-menu-title\">\n\n      <div class=\"e-menu-details\">\n<span> Lorem Ipsum is simply</span>\n<span> Lorem Ipsum is simply</span>\n      </div>\n    </div>\n  </div>\n\n<div class=\"e-bullets-element\" style=\"background-color: #dd594f\" [routerLink]=\"['/']\">\n<div class=\"e-bullets-img\">\n<img src=\"assets/img/Bullet.png\" />\n    </div>\n    <div class=\"e-menu-title\">\n\n      <div class=\"e-menu-details\">\n<span> Lorem Ipsum is simply</span>\n<span> Lorem Ipsum is simply</span>\n      </div>\n    </div>\n  </div>\n</div>\n      </div>\n</div>\n\n\n\n  </div>\n</div>\n\n"

/***/ }),

/***/ "./src/app/eraser/eraser.component.ts":
/*!********************************************!*\
  !*** ./src/app/eraser/eraser.component.ts ***!
  \********************************************/
/*! exports provided: EraserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EraserComponent", function() { return EraserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var EraserComponent = /** @class */ (function () {
    function EraserComponent() {
        this.isLeftVisible = true;
        this.app = {
            title: "Home",
            maincontent: "assets/home.png",
            logo: "assets/img/PclipLogo.png",
            image: "assets/bg_0.jpg"
        };
    }
    EraserComponent.prototype.ngOnInit = function () { };
    EraserComponent.prototype.toggleUp = function (e) {
        console.log(e);
    };
    EraserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-eraser",
            template: __webpack_require__(/*! ./eraser.component.html */ "./src/app/eraser/eraser.component.html"),
            styles: [__webpack_require__(/*! ./eraser.component.css */ "./src/app/eraser/eraser.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], EraserComponent);
    return EraserComponent;
}());



/***/ }),

/***/ "./src/app/header/header.component.html":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"card-container {{headerClass}}\">\n<div class=\"profile-card {{headerClass}}\">\n<div class=\"profile-card__image \">\n<img src=\"{{header}}\" alt=\"Inpixio Logo\" class=\"app-logo\" />\n    </div>\n    <div class=\"profile-details\">\n      <h3>Photo Clip</h3>\n    </div>\n    <div class=\"profile-details\">\n      <h5>For Windows & Mac</h5>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/header/header.component.scss":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".app-logo {\n  max-width: 50px !important; }\n\n.profile-card {\n  background-color: #3b3837;\n  text-align: center;\n  position: relative;\n  padding: 3px;\n  border-radius: 5px;\n  box-shadow: -1px 8px 33px -5px rgba(0, 0, 0, 0.75); }\n\n.profile-card__image {\n  margin: 0 auto;\n  width: 100%;\n  border-radius: 50%;\n  overflow: hidden; }\n\n.profile-card__image img {\n  max-width: 100%;\n  max-height: 100%; }\n\n.profile-details {\n  display: flex;\n  align-items: center;\n  text-align: center;\n  justify-content: center;\n  color: #969595; }\n\n.profile-details h3 {\n  margin-top: 5px;\n  zoom: 1;\n  font-weight: bolder;\n  outline: none;\n  border: none;\n  letter-spacing: 3px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW5pZWx2YWxpZGUvV29ya1NwYWNlL0FOR1VMQVIvaW5waXhpb19tb2JpbGUvbW9iaWxlL3NyYy9hcHAvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNFLDJCQUEwQixFQUMzQjs7QUFDRDtFQUNFLDBCQUF5QjtFQUN6QixtQkFBa0I7RUFDbEIsbUJBQWtCO0VBQ2xCLGFBQVk7RUFDWixtQkFBa0I7RUFDbEIsbURBQWtELEVBQ25EOztBQUVEO0VBQ0UsZUFBYztFQUNkLFlBQVc7RUFDWCxtQkFBa0I7RUFDbEIsaUJBQWdCLEVBQ2pCOztBQUVEO0VBQ0UsZ0JBQWU7RUFDZixpQkFBZ0IsRUFDakI7O0FBSUQ7RUFDRSxjQUFhO0VBQ2Isb0JBQW1CO0VBQ25CLG1CQUFrQjtFQUNsQix3QkFBdUI7RUFDdkIsZUFBYyxFQUNmOztBQUVEO0VBQ0UsZ0JBQWU7RUFDZixRQUFPO0VBQ1Asb0JBQW1CO0VBQ25CLGNBQWE7RUFDYixhQUFZO0VBRVosb0JBQW1CLEVBQ3BCIiwiZmlsZSI6InNyYy9hcHAvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLmFwcC1sb2dvIHtcbiAgbWF4LXdpZHRoOiA1MHB4ICFpbXBvcnRhbnQ7XG59XG4ucHJvZmlsZS1jYXJkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmc6IDNweDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBib3gtc2hhZG93OiAtMXB4IDhweCAzM3B4IC01cHggcmdiYSgwLCAwLCAwLCAwLjc1KTtcbn1cblxuLnByb2ZpbGUtY2FyZF9faW1hZ2Uge1xuICBtYXJnaW46IDAgYXV0bztcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnByb2ZpbGUtY2FyZF9faW1hZ2UgaW1nIHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBtYXgtaGVpZ2h0OiAxMDAlO1xufVxuXG4ucHJvZmlsZS1kZXRhaWxzIHt9XG5cbi5wcm9maWxlLWRldGFpbHMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBjb2xvcjogIzk2OTU5NTtcbn1cblxuLnByb2ZpbGUtZGV0YWlscyBoMyB7XG4gIG1hcmdpbi10b3A6IDVweDtcbiAgem9vbTogMTtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbiAgb3V0bGluZTogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuXG4gIGxldHRlci1zcGFjaW5nOiAzcHg7XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/header/header.component.ts":
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
    }
    HeaderComponent.prototype.ngOnInit = function () { };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], HeaderComponent.prototype, "header", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], HeaderComponent.prototype, "headerClass", void 0);
    HeaderComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-header",
            template: __webpack_require__(/*! ./header.component.html */ "./src/app/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.scss */ "./src/app/header/header.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/page/page.component.css":
/*!*****************************************!*\
  !*** ./src/app/page/page.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "* {\n  box-sizing: border-box;\n}\n\n::-webkit-scrollbar {\n  display: none;\n}\n\nbody,\nng-view,\nng-include,\nng-transclude,\nui-shared-state {\n  margin: 0;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 100vh;\n  font-family: Raleway;\n}\n\n.app-content {\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  width: 100vw;\n  height: 100vh;\n  background-color: #3b3837;\n}\n\n.card {\n  background: linear-gradient(to bottom, #3b3837 25%, #F8F8FA 0%);\n  width: 100vw;\n  height: 100vh;\n  flex-direction: column;\n  display: flex;\n  align-items: center;\n\n}\n\n.card-container {\n  background-color: #3b3837;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100vw;\n  height: 25vh;\n}\n\n.e-body {\n  background-color: #3b3837;\n  width: 100vw;\n  height: 78vh;\n}\n\n.e-video-full-width {\n  flex: 1 1 69%;\n  height: 69%;\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center;\n\n}\n\n.e-menu {\n  flex: 1 1 31%;\n  height: 31%;\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center;\n\n}\n\n.e-menu-img {\n  flex: 1 1 auto;\n}\n\n.e-menu-link {\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n\n  overflow: hidden;\n  box-shadow: -1px 8px 33px -5px rgba(0, 0, 0, 0.75);\n}\n\n.e-menu-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%;\n  background-color: #d9d6d5;\n  opacity: 0.4;\n}\n\n.e-menu-img img {\n  align-self: center;\n  max-width: 60%;\n  max-height: 60%;\n\n}\n\n.e-menu-title {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 80%;\n  align-self: center;\n}\n\n.e-menu-title>div {}\n\n.e-menu-title>span {}\n\n.e-menu-description {\n  color: #F8F8FA;\n  font-weight: bolder;\n  font-size: 1.3em;\n  line-height: 13px;\n}\n\n.e-menu-details {\n  color: #F8F8FA;\n\n  font-size: 0.8em;\n  margin-top: 1px;\n}\n\n.pinned-trip__itenary {}\n\n.pinned-trip__itenary span:nth-of-type(2),\n.pinned-trip__itenary i {\n  margin: 0;\n  color: #a9a29f;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZS9wYWdlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx1QkFBdUI7Q0FDeEI7O0FBRUQ7RUFDRSxjQUFjO0NBQ2Y7O0FBRUQ7Ozs7O0VBS0UsVUFBVTtFQUNWLGNBQWM7RUFDZCxvQkFBb0I7RUFDcEIsb0JBQW9CO0VBQ3BCLGNBQWM7RUFDZCxxQkFBcUI7Q0FDdEI7O0FBRUQ7RUFDRSxjQUFjO0VBQ2Qsb0JBQW9CO0VBQ3BCLDhCQUE4QjtFQUM5QixhQUFhO0VBQ2IsY0FBYztFQUNkLDBCQUEwQjtDQUMzQjs7QUFJRDtFQUNFLGdFQUFnRTtFQUNoRSxhQUFhO0VBQ2IsY0FBYztFQUNkLHVCQUF1QjtFQUN2QixjQUFjO0VBQ2Qsb0JBQW9COztDQUVyQjs7QUFFRDtFQUNFLDBCQUEwQjtFQUMxQixjQUFjO0VBQ2Qsb0JBQW9CO0VBQ3BCLHdCQUF3QjtFQUN4QixhQUFhO0VBQ2IsYUFBYTtDQUNkOztBQUVEO0VBQ0UsMEJBQTBCO0VBQzFCLGFBQWE7RUFDYixhQUFhO0NBQ2Q7O0FBRUQ7RUFDRSxjQUFjO0VBQ2QsWUFBWTtFQUNaLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLHdCQUF3Qjs7Q0FFekI7O0FBRUQ7RUFDRSxjQUFjO0VBQ2QsWUFBWTtFQUNaLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLHdCQUF3Qjs7Q0FFekI7O0FBRUQ7RUFDRSxlQUFlO0NBQ2hCOztBQUlEOztFQUVFLGNBQWM7RUFDZCxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQix1QkFBdUI7O0VBRXZCLGlCQUFpQjtFQUNqQixtREFBbUQ7Q0FDcEQ7O0FBRUQ7RUFDRSxjQUFjO0VBQ2QsdUJBQXVCO0VBQ3ZCLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsY0FBYztFQUNkLDBCQUEwQjtFQUMxQixhQUFhO0NBQ2Q7O0FBRUQ7RUFDRSxtQkFBbUI7RUFDbkIsZUFBZTtFQUNmLGdCQUFnQjs7Q0FFakI7O0FBRUQ7RUFDRSxjQUFjO0VBQ2QsdUJBQXVCO0VBQ3ZCLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsY0FBYztFQUNkLG1CQUFtQjtDQUNwQjs7QUFFRCxvQkFBb0I7O0FBRXBCLHFCQUFxQjs7QUFFckI7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0VBQ3BCLGlCQUFpQjtFQUNqQixrQkFBa0I7Q0FDbkI7O0FBRUQ7RUFDRSxlQUFlOztFQUVmLGlCQUFpQjtFQUNqQixnQkFBZ0I7Q0FDakI7O0FBSUQsd0JBQXdCOztBQUV4Qjs7RUFFRSxVQUFVO0VBQ1YsZUFBZTtDQUNoQiIsImZpbGUiOiJzcmMvYXBwL3BhZ2UvcGFnZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiKiB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG5ib2R5LFxubmctdmlldyxcbm5nLWluY2x1ZGUsXG5uZy10cmFuc2NsdWRlLFxudWktc2hhcmVkLXN0YXRlIHtcbiAgbWFyZ2luOiAwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDEwMHZoO1xuICBmb250LWZhbWlseTogUmFsZXdheTtcbn1cblxuLmFwcC1jb250ZW50IHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIHdpZHRoOiAxMDB2dztcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbn1cblxuXG5cbi5jYXJkIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgIzNiMzgzNyAyNSUsICNGOEY4RkEgMCUpO1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbn1cblxuLmNhcmQtY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHdpZHRoOiAxMDB2dztcbiAgaGVpZ2h0OiAyNXZoO1xufVxuXG4uZS1ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDc4dmg7XG59XG5cbi5lLXZpZGVvLWZ1bGwtd2lkdGgge1xuICBmbGV4OiAxIDEgNjklO1xuICBoZWlnaHQ6IDY5JTtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgYm9yZGVyLXJhZGl1czogMCAwIDAgMDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbn1cblxuLmUtbWVudSB7XG4gIGZsZXg6IDEgMSAzMSU7XG4gIGhlaWdodDogMzElO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuICBib3JkZXItcmFkaXVzOiAwIDAgMCAwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxufVxuXG4uZS1tZW51LWltZyB7XG4gIGZsZXg6IDEgMSBhdXRvO1xufVxuXG5cblxuLmUtbWVudS1saW5rIHtcblxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAzNCUgIWltcG9ydGFudDtcblxuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2hhZG93OiAtMXB4IDhweCAzM3B4IC01cHggcmdiYSgwLCAwLCAwLCAwLjc1KTtcbn1cblxuLmUtbWVudS1pbWcge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgZmxleDogMSAxIDIwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDZkNTtcbiAgb3BhY2l0eTogMC40O1xufVxuXG4uZS1tZW51LWltZyBpbWcge1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gIG1heC13aWR0aDogNjAlO1xuICBtYXgtaGVpZ2h0OiA2MCU7XG5cbn1cblxuLmUtbWVudS10aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBmbGV4OiAxIDEgODAlO1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG59XG5cbi5lLW1lbnUtdGl0bGU+ZGl2IHt9XG5cbi5lLW1lbnUtdGl0bGU+c3BhbiB7fVxuXG4uZS1tZW51LWRlc2NyaXB0aW9uIHtcbiAgY29sb3I6ICNGOEY4RkE7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG4gIGxpbmUtaGVpZ2h0OiAxM3B4O1xufVxuXG4uZS1tZW51LWRldGFpbHMge1xuICBjb2xvcjogI0Y4RjhGQTtcblxuICBmb250LXNpemU6IDAuOGVtO1xuICBtYXJnaW4tdG9wOiAxcHg7XG59XG5cblxuXG4ucGlubmVkLXRyaXBfX2l0ZW5hcnkge31cblxuLnBpbm5lZC10cmlwX19pdGVuYXJ5IHNwYW46bnRoLW9mLXR5cGUoMiksXG4ucGlubmVkLXRyaXBfX2l0ZW5hcnkgaSB7XG4gIG1hcmdpbjogMDtcbiAgY29sb3I6ICNhOWEyOWY7XG59XG4iXX0= */"

/***/ }),

/***/ "./src/app/page/page.component.html":
/*!******************************************!*\
  !*** ./src/app/page/page.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"app-content\">\n  <div class=\"card\">\n    <app-header header=\"{{app.logo}}\"></app-header>\n    <div class=\"e-body\">\n      <div class=\"e-video-full-width align-self-center\">\n        <video playsinline autoplay loop muted style=\"min-width:80%; min-height:80%;\" poster=\"http://sandbox.thewikies.com/vfe-generator/images/big-buck-bunny_poster.jpg\"\n          class=\"fullscreen-bg__video\">\n          <source src=\"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4\" type=\"video/mp4\">\n          <source src=\"http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm\" type=\"video/webm\">\n          <source src=\"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv\" type=\"video/ogg\">\n        </video>\n      </div>\n      <div class=\"e-menu\">\n        <div class=\"e-menu-link\" style=\"background-color: #dd594f\" [routerLink]=\"['/eraser']\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/MagicWandRed.png\" />\n          </div>\n          <div class=\"e-menu-title\">\n            <span class=\"e-menu-description\">Erase with a click</span>\n            <div class=\"e-menu-details\">\n              <span>Remove Object with just a click</span>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"e-menu-link\" style=\"background-color: #f19f36\" [routerLink]=\"['/photomontage']\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/ComputerYellow.png\" />\n          </div>\n          <div class=\"e-menu-title\">\n            <span class=\"e-menu-description\">Photomontage</span>\n            <div class=\"e-menu-details\">\n              <span>Cut out & replace background</span>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"e-menu-link\" style=\"background-color: #e87a45\" [routerLink]=\"['/cropclone']\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/SettingsOrange.png\" />\n          </div>\n          <div class=\"e-menu-title\">\n            <span class=\"e-menu-description\">Simply Touch Up</span>\n            <div class=\"e-menu-details\">\n              <span>Crop Clone & Much more</span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/page/page.component.ts":
/*!****************************************!*\
  !*** ./src/app/page/page.component.ts ***!
  \****************************************/
/*! exports provided: query, homeTransition, PageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "query", function() { return query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homeTransition", function() { return homeTransition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageComponent", function() { return PageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_services_content_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/services/content.service */ "./src/app/shared/services/content.service.ts");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");





var query = function (s, a, o) {
    if (o === void 0) { o = { optional: true }; }
    return Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["query"])(s, a, o);
};
var homeTransition = Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["trigger"])('homeTransition', [
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])(':enter', [
        query('.e-menu-link', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({ opacity: 0 })),
        query('.e-menu-link', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["stagger"])(300, [
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({ transform: 'translateY(100px)' }),
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('1s cubic-bezier(.75,-0.48,.26,1.52)', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({ transform: 'translateY(0px)', opacity: 1 })),
        ])),
    ]),
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["transition"])(':leave', [
        query('.e-menu-link', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["stagger"])(300, [
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({ transform: 'translateY(0px)', opacity: 1 }),
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["animate"])('1s cubic-bezier(.75,-0.48,.26,1.52)', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_3__["style"])({ transform: 'translateY(-100px)', opacity: 0 })),
        ])),
    ])
]);
var PageComponent = /** @class */ (function () {
    function PageComponent(contentService, router) {
        this.contentService = contentService;
        this.router = router;
        this.app = {
            title: "Home",
            maincontent: "assets/home.png",
            logo: "assets/img/PclipLogo.png",
            image: "assets/bg_0.jpg"
        };
        this.page = "mobile";
    }
    PageComponent.prototype.hideMenu = function () {
        console.log("Navigation is successful!");
        this.router.navigate(["/eraser"]).then(function (e) {
            if (e) {
                console.log("Navigation is successful!");
            }
            else {
                console.log("Navigation has failed!");
            }
        });
    };
    PageComponent.prototype.ngOnInit = function () {
        this.page = this.contentService.pages["home"];
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        var vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty("--vh", vh + "px");
    };
    PageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-page",
            template: __webpack_require__(/*! ./page.component.html */ "./src/app/page/page.component.html"),
            animations: [homeTransition],
            host: {
                "[@homeTransition]": ""
            },
            styles: [__webpack_require__(/*! ./page.component.css */ "./src/app/page/page.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_shared_services_content_service__WEBPACK_IMPORTED_MODULE_2__["ContentService"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]])
    ], PageComponent);
    return PageComponent;
}());



/***/ }),

/***/ "./src/app/photomontage/photomontage.component.css":
/*!*********************************************************!*\
  !*** ./src/app/photomontage/photomontage.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "* {\n  box-sizing: border-box;\n}\n\n::-webkit-scrollbar {\n  display: none;\n}\n\nbody,\nng-view,\nng-include,\nng-transclude,\nui-shared-state {\n  margin: 0;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  height: 100vh;\n  font-family: Raleway;\n}\n\n.app-content {\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  width: 100vw;\n  height: 100vh;\n  background-color: #3b3837;\n}\n\n.card {\n  background: linear-gradient(to bottom, #3b3837 25%, #F8F8FA 0%);\n  width: 100vw;\n  height: 100vh;\n  flex-direction: column;\n  display: flex;\n  align-items: center;\n\n}\n\n.card-container {\n  background-color: #3b3837;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100vw;\n  height: 25vh;\n}\n\n.e-body {\n  background-color: #3b3837;\n  width: 100vw;\n  height: 78vh;\n}\n\n.e-menu {\n  flex: 1 1 31%;\n  height: 31%;\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center;\n\n}\n\n.e-menu-top {\n\n  background-color: #3b3837;\n  border-radius: 0 0 0 0;\n  align-items: center;\n  justify-content: center;\n\n}\n\n.e-menu-img {\n  flex: 1 1 auto;\n}\n\n.e-menu-active-link {\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n\n  overflow: hidden;\n\n}\n\n.e-menu-link {\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n\n  overflow: hidden;\n  box-shadow: -13px 9px 3px 13px #f19f36;\n}\n\n.empbullet {\n  opacity: 0;\n  flex: 1 1 20%;\n\n  height: 100%;\n  background-color: #dc9892;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n\n}\n\n.e-bullets-element {\n\n\n  display: flex;\n  flex-direction: row;\n  text-align: center;\n  position: relative;\n  height: 34% !important;\n\n  overflow: hidden;\n  box-shadow: -1px 8px 33px -5px rgba(0, 0, 0, 0.75);\n}\n\n.e-bullets {\n   flex: 1 1 78%;\n   height: 100%;\n   background-color: #dc9892;\n   position: absolute;\n   bottom: 0;\n   left: 20%;\n}\n\n.e-bullets-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%;\n\n}\n\n.e-menu-img {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 20%;\n  background-color: #d9d6d5;\n  opacity: 0.4;\n}\n\n.e-video-full-width {\n  flex: 1 1 80%;\n  height: 53%;\n  right: 0px;\n  background-color: #3b3837;\n\n  align-items: right;\n  justify-content: right;\n\n\n}\n\n.e-menu-img img,\n.e-bullets-img img {\n  align-self: center;\n  max-width: 60%;\n  max-height: 60%;\n\n}\n\n.e-menu-title {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  flex: 1 1 80%;\n  align-self: center;\n}\n\n.e-menu-title>div {}\n\n.e-menu-title>span {}\n\n.e-menu-description {\n  color: #F8F8FA;\n  font-weight: bolder;\n  font-size: 1.3em;\n  line-height: 13px;\n}\n\n.e-menu-details {\n  color: #F8F8FA;\n\n  font-size: 0.8em;\n  margin-top: 1px;\n}\n\n.hmbrgr_menu_bg {\n  opacity: 0.8;\n  flex: 1 1 20%;\n\n  border-radius: 0 0 0 0;\n  height: 100%;\n  background-color: #dc9892;\n  ;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n  transition: all 0.5s ease;\n\n}\n\n.bottom {\n  position: absolute;\n  bottom: 0;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGhvdG9tb250YWdlL3Bob3RvbW9udGFnZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsdUJBQXVCO0NBQ3hCOztBQUVEO0VBQ0UsY0FBYztDQUNmOztBQUVEOzs7OztFQUtFLFVBQVU7RUFDVixjQUFjO0VBQ2Qsb0JBQW9CO0VBQ3BCLG9CQUFvQjtFQUNwQixjQUFjO0VBQ2QscUJBQXFCO0NBQ3RCOztBQUVEO0VBQ0UsY0FBYztFQUNkLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsYUFBYTtFQUNiLGNBQWM7RUFDZCwwQkFBMEI7Q0FDM0I7O0FBSUQ7RUFDRSxnRUFBZ0U7RUFDaEUsYUFBYTtFQUNiLGNBQWM7RUFDZCx1QkFBdUI7RUFDdkIsY0FBYztFQUNkLG9CQUFvQjs7Q0FFckI7O0FBRUQ7RUFDRSwwQkFBMEI7RUFDMUIsY0FBYztFQUNkLG9CQUFvQjtFQUNwQix3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLGFBQWE7Q0FDZDs7QUFDRDtFQUNFLDBCQUEwQjtFQUMxQixhQUFhO0VBQ2IsYUFBYTtDQUNkOztBQUNEO0VBQ0UsY0FBYztFQUNkLFlBQVk7RUFDWiwwQkFBMEI7RUFDMUIsdUJBQXVCO0VBQ3ZCLG9CQUFvQjtFQUNwQix3QkFBd0I7O0NBRXpCOztBQUNEOztFQUVFLDBCQUEwQjtFQUMxQix1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLHdCQUF3Qjs7Q0FFekI7O0FBQ0Q7RUFDRSxlQUFlO0NBQ2hCOztBQUdEOztFQUVFLGNBQWM7RUFDZCxvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQix1QkFBdUI7O0VBRXZCLGlCQUFpQjs7Q0FFbEI7O0FBQ0Q7O0VBRUUsY0FBYztFQUNkLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLHVCQUF1Qjs7RUFFdkIsaUJBQWlCO0VBQ2pCLHVDQUF1QztDQUN4Qzs7QUFFRDtFQUNFLFdBQVc7RUFDWCxjQUFjOztFQUVkLGFBQWE7RUFDYiwwQkFBMEI7RUFDMUIsbUJBQW1CO0VBQ25CLFVBQVU7RUFDVixRQUFROztDQUVUOztBQUNEOzs7RUFHRSxjQUFjO0VBQ2Qsb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsdUJBQXVCOztFQUV2QixpQkFBaUI7RUFDakIsbURBQW1EO0NBQ3BEOztBQUNEO0dBQ0csY0FBYztHQUNkLGFBQWE7R0FDYiwwQkFBMEI7R0FDMUIsbUJBQW1CO0dBQ25CLFVBQVU7R0FDVixVQUFVO0NBQ1o7O0FBQ0Q7RUFDRSxjQUFjO0VBQ2QsdUJBQXVCO0VBQ3ZCLG9CQUFvQjtFQUNwQiw4QkFBOEI7RUFDOUIsY0FBYzs7Q0FFZjs7QUFFRDtFQUNFLGNBQWM7RUFDZCx1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLDhCQUE4QjtFQUM5QixjQUFjO0VBQ2QsMEJBQTBCO0VBQzFCLGFBQWE7Q0FDZDs7QUFDRDtFQUNFLGNBQWM7RUFDZCxZQUFZO0VBQ1osV0FBVztFQUNYLDBCQUEwQjs7RUFFMUIsbUJBQW1CO0VBQ25CLHVCQUF1Qjs7O0NBR3hCOztBQUNEOztFQUVFLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsZ0JBQWdCOztDQUVqQjs7QUFFRDtFQUNFLGNBQWM7RUFDZCx1QkFBdUI7RUFDdkIsb0JBQW9CO0VBQ3BCLDhCQUE4QjtFQUM5QixjQUFjO0VBQ2QsbUJBQW1CO0NBQ3BCOztBQUVELG9CQUFvQjs7QUFFcEIscUJBQXFCOztBQUVyQjtFQUNFLGVBQWU7RUFDZixvQkFBb0I7RUFDcEIsaUJBQWlCO0VBQ2pCLGtCQUFrQjtDQUNuQjs7QUFFRDtFQUNFLGVBQWU7O0VBRWYsaUJBQWlCO0VBQ2pCLGdCQUFnQjtDQUNqQjs7QUFFRDtFQUNFLGFBQWE7RUFDYixjQUFjOztFQUVkLHVCQUF1QjtFQUN2QixhQUFhO0VBQ2IsMEJBQTBCOztFQUUxQixtQkFBbUI7RUFDbkIsT0FBTztFQUNQLFFBQVE7RUFDUixXQUFXO0VBQ1gsMEJBQTBCOztDQUUzQjs7QUFDRDtFQUNFLG1CQUFtQjtFQUNuQixVQUFVO0NBQ1giLCJmaWxlIjoic3JjL2FwcC9waG90b21vbnRhZ2UvcGhvdG9tb250YWdlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIqIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbmJvZHksXG5uZy12aWV3LFxubmctaW5jbHVkZSxcbm5nLXRyYW5zY2x1ZGUsXG51aS1zaGFyZWQtc3RhdGUge1xuICBtYXJnaW46IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMTAwdmg7XG4gIGZvbnQtZmFtaWx5OiBSYWxld2F5O1xufVxuXG4uYXBwLWNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDEwMHZoO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xufVxuXG5cblxuLmNhcmQge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAjM2IzODM3IDI1JSwgI0Y4RjhGQSAwJSk7XG4gIHdpZHRoOiAxMDB2dztcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxufVxuXG4uY2FyZC1jb250YWluZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDI1dmg7XG59XG4uZS1ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDc4dmg7XG59XG4uZS1tZW51IHtcbiAgZmxleDogMSAxIDMxJTtcbiAgaGVpZ2h0OiAzMSU7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzYjM4Mzc7XG4gIGJvcmRlci1yYWRpdXM6IDAgMCAwIDA7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG59XG4uZS1tZW51LXRvcCB7XG5cbiAgYmFja2dyb3VuZC1jb2xvcjogIzNiMzgzNztcbiAgYm9yZGVyLXJhZGl1czogMCAwIDAgMDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbn1cbi5lLW1lbnUtaW1nIHtcbiAgZmxleDogMSAxIGF1dG87XG59XG5cblxuLmUtbWVudS1hY3RpdmUtbGluayB7XG5cbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGhlaWdodDogMzQlICFpbXBvcnRhbnQ7XG5cbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxufVxuLmUtbWVudS1saW5rIHtcblxuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAzNCUgIWltcG9ydGFudDtcblxuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2hhZG93OiAtMTNweCA5cHggM3B4IDEzcHggI2YxOWYzNjtcbn1cblxuLmVtcGJ1bGxldCB7XG4gIG9wYWNpdHk6IDA7XG4gIGZsZXg6IDEgMSAyMCU7XG5cbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGM5ODkyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcblxufVxuLmUtYnVsbGV0cy1lbGVtZW50IHtcblxuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBoZWlnaHQ6IDM0JSAhaW1wb3J0YW50O1xuXG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaGFkb3c6IC0xcHggOHB4IDMzcHggLTVweCByZ2JhKDAsIDAsIDAsIDAuNzUpO1xufVxuLmUtYnVsbGV0cyB7XG4gICBmbGV4OiAxIDEgNzglO1xuICAgaGVpZ2h0OiAxMDAlO1xuICAgYmFja2dyb3VuZC1jb2xvcjogI2RjOTg5MjtcbiAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgIGJvdHRvbTogMDtcbiAgIGxlZnQ6IDIwJTtcbn1cbi5lLWJ1bGxldHMtaW1nIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gIGZsZXg6IDEgMSAyMCU7XG5cbn1cblxuLmUtbWVudS1pbWcge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgZmxleDogMSAxIDIwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDZkNTtcbiAgb3BhY2l0eTogMC40O1xufVxuLmUtdmlkZW8tZnVsbC13aWR0aCB7XG4gIGZsZXg6IDEgMSA4MCU7XG4gIGhlaWdodDogNTMlO1xuICByaWdodDogMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2IzODM3O1xuXG4gIGFsaWduLWl0ZW1zOiByaWdodDtcbiAganVzdGlmeS1jb250ZW50OiByaWdodDtcblxuXG59XG4uZS1tZW51LWltZyBpbWcsXG4uZS1idWxsZXRzLWltZyBpbWcge1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gIG1heC13aWR0aDogNjAlO1xuICBtYXgtaGVpZ2h0OiA2MCU7XG5cbn1cblxuLmUtbWVudS10aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICBmbGV4OiAxIDEgODAlO1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG59XG5cbi5lLW1lbnUtdGl0bGU+ZGl2IHt9XG5cbi5lLW1lbnUtdGl0bGU+c3BhbiB7fVxuXG4uZS1tZW51LWRlc2NyaXB0aW9uIHtcbiAgY29sb3I6ICNGOEY4RkE7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG4gIGZvbnQtc2l6ZTogMS4zZW07XG4gIGxpbmUtaGVpZ2h0OiAxM3B4O1xufVxuXG4uZS1tZW51LWRldGFpbHMge1xuICBjb2xvcjogI0Y4RjhGQTtcblxuICBmb250LXNpemU6IDAuOGVtO1xuICBtYXJnaW4tdG9wOiAxcHg7XG59XG5cbi5obWJyZ3JfbWVudV9iZyB7XG4gIG9wYWNpdHk6IDAuODtcbiAgZmxleDogMSAxIDIwJTtcblxuICBib3JkZXItcmFkaXVzOiAwIDAgMCAwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkYzk4OTI7XG4gIDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHotaW5kZXg6IDI7XG4gIHRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2U7XG5cbn1cbi5ib3R0b20ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogMDtcbn1cbiJdfQ== */"

/***/ }),

/***/ "./src/app/photomontage/photomontage.component.html":
/*!**********************************************************!*\
  !*** ./src/app/photomontage/photomontage.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"app-content\">\n  <div class=\"card\">\n    <app-header header=\"{{app.logo}}\" headerClass=\"profile-card-active\"></app-header>\n    <div class=\"e-body\">\n      <div class=\"e-menu-top\">\n<div class=\"e-menu-active-link\" style=\"background-color: #f19f36\" [routerLink]=\"['/photomontage']\">\n          <div class=\"e-menu-img\">\n            <img src=\"assets/img/ComputerYellow.png\" />\n          </div>\n          <div class=\"e-menu-title\">\n            <span class=\"e-menu-description\">Photomontage</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"hmbrgr_menu_bg \" style=\"\nwidth: 20%;height: 80% ;top: 28%; background-color: #f19f36;opacity: 0.3;\n        \">\n        <div style=\"    position: fixed;\n        width: 20%;\n        bottom: 0;\n        \">\n          <a [routerLink]=\"['/eraser']\">\n<div class=\"e-menu-link\" style=\"background-color: #f19f36;position: relative;bottom: 0px;\">\n              <div class=\"e-menu-img\">\n<img src=\"assets/img/MagicWandYellow.png\" />\n              </div>\n            </div>\n          </a>\n<a [routerLink]=\"['/cropclone']\">\n<div class=\"e-menu-link\" style=\"background-color: #f19f36;position: relative;bottom: 0px;\">\n              <div class=\"e-menu-img\">\n                <img src=\"assets/img/SettingsYellow.png\" />\n              </div>\n            </div>\n          </a>\n          <a [routerLink]=\"['/']\">\n<div class=\"e-menu-link\" style=\"background-color: #f19f36;position: relative;bottom: 0px;\">\n              <div class=\"e-menu-img\">\n<img src=\"assets/img/PclipLogoYellow.png\" />\n              </div>\n            </div>\n          </a>\n        </div>\n      </div>\n\n\n      <div class=\"e-video-full-width align-self-center row\">\n        <div style=\"width:22%;\" class=\"col-xs-2\">\n          &nbsp;\n        </div>\n        <div style=\"width:78%;height:100%;pull: right\" class=\"col-xs-10\">\n          <app-wistia-embed></app-wistia-embed>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div style=\"width:20%;height: 30%;\" class=\"col-xs-2 empbullet\">\n          &nbsp;\n        </div>\n        <div style=\"width:80%;height: 30%;\" class=\"col-xs-10 e-bullets\">\n<div class=\"e-bullets-element\" style=\"background-color: #f19f36\" [routerLink]=\"['/eraser']\">\n            <div class=\"e-bullets-img\">\n              <img src=\"assets/img/Bullet.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n\n              <div class=\"e-menu-details\">\n                <span> Lorem Ipsum is simply</span>\n                <span> Lorem Ipsum is simply</span>\n              </div>\n            </div>\n          </div>\n\n<div class=\"e-bullets-element\" style=\"background-color: #f19f36\" [routerLink]=\"['/photomontage']\">\n            <div class=\"e-bullets-img\">\n              <img src=\"assets/img/Bullet.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n\n              <div class=\"e-menu-details\">\n                <span> Lorem Ipsum is simply</span>\n                <span> Lorem Ipsum is simply</span>\n              </div>\n            </div>\n          </div>\n\n<div class=\"e-bullets-element\" style=\"background-color: #f19f36\" [routerLink]=\"['/cropclone']\">\n            <div class=\"e-bullets-img\">\n              <img src=\"assets/img/Bullet.png\" />\n            </div>\n            <div class=\"e-menu-title\">\n\n              <div class=\"e-menu-details\">\n                <span> Lorem Ipsum is simply</span>\n                <span> Lorem Ipsum is simply</span>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n\n\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/photomontage/photomontage.component.ts":
/*!********************************************************!*\
  !*** ./src/app/photomontage/photomontage.component.ts ***!
  \********************************************************/
/*! exports provided: PhotomontageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PhotomontageComponent", function() { return PhotomontageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var PhotomontageComponent = /** @class */ (function () {
    function PhotomontageComponent() {
        this.app = {
            logo: "assets/img/PclipLogoYellow.png"
        };
    }
    PhotomontageComponent.prototype.ngOnInit = function () { };
    PhotomontageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-photomontage",
            template: __webpack_require__(/*! ./photomontage.component.html */ "./src/app/photomontage/photomontage.component.html"),
            styles: [__webpack_require__(/*! ./photomontage.component.css */ "./src/app/photomontage/photomontage.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PhotomontageComponent);
    return PhotomontageComponent;
}());



/***/ }),

/***/ "./src/app/router.animations.ts":
/*!**************************************!*\
  !*** ./src/app/router.animations.ts ***!
  \**************************************/
/*! exports provided: routerTransition */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routerTransition", function() { return routerTransition; });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");

var query = function (s, a, o) {
    if (o === void 0) { o = { optional: true }; }
    return Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["query"])(s, a, o);
};
var routerTransition = Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["trigger"])('routerTransition', [
    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["transition"])('* => *', [
        query(':enter, :leave', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ position: 'fixed', width: '100%' })),
        query(':enter', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(100%)' })),
        Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["sequence"])([
            query(':leave', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animateChild"])()),
            Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["group"])([
                query(':leave', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(0%)' }),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('500ms cubic-bezier(.75,-0.48,.26,1.52)', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(-100%)' }))
                ]),
                query(':enter', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(100%)' }),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animate"])('500ms cubic-bezier(.75,-0.48,.26,1.52)', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["style"])({ transform: 'translateY(0%)' })),
                ]),
            ]),
            query(':enter', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_0__["animateChild"])()),
        ])
    ])
]);


/***/ }),

/***/ "./src/app/shared/directives/calltoaction.directive.ts":
/*!*************************************************************!*\
  !*** ./src/app/shared/directives/calltoaction.directive.ts ***!
  \*************************************************************/
/*! exports provided: CalltoactionDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CalltoactionDirective", function() { return CalltoactionDirective; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var CalltoactionDirective = /** @class */ (function () {
    function CalltoactionDirective(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    CalltoactionDirective.prototype.ngOnInit = function () {
        // this.el.nativeElement.style.color = 'blue';
        console.log(this.el.nativeElement);
        this.renderer.setStyle(this.el.nativeElement, "background-color", "blue");
    };
    CalltoactionDirective.prototype.clickEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.renderer.setStyle(this.el.nativeElement, "position", "fixed");
        this.renderer.setStyle(this.el.nativeElement, "top", "19%");
        console.log("Click from Host Element!");
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])("click", ["$event"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], CalltoactionDirective.prototype, "clickEvent", null);
    CalltoactionDirective = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({
            selector: "[appCalltoaction]"
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"], _angular_core__WEBPACK_IMPORTED_MODULE_1__["Renderer2"]])
    ], CalltoactionDirective);
    return CalltoactionDirective;
}());



/***/ }),

/***/ "./src/app/shared/directives/fullpage.directive.ts":
/*!*********************************************************!*\
  !*** ./src/app/shared/directives/fullpage.directive.ts ***!
  \*********************************************************/
/*! exports provided: FullpageDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FullpageDirective", function() { return FullpageDirective; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var FullpageDirective = /** @class */ (function () {
    function FullpageDirective(element) {
        this.element = element;
        this._addOverflow = false;
    }
    FullpageDirective.prototype.onResize = function (event) {
        console.log('resize');
        this.resize();
    };
    FullpageDirective.prototype.onLoad = function (event) {
        console.log('resize');
        this.resize();
    };
    FullpageDirective.prototype.resize = function () {
        // We listen to the resize event
        // We execute the same script as before
        var vh = window.screen.height * 0.01;
        document.documentElement.style.setProperty('--vh', vh + "px");
        var bgwidth = this.element.nativeElement.width;
        var bgheight = this.element.nativeElement.height;
        console.log({ bgheight: bgheight });
        var winwidth = window.innerWidth;
        var winheight = window.screen.height;
        var widthratio = winwidth / bgwidth;
        var heightratio = (winheight / bgheight);
        console.log({ winheight: winheight });
        var widthdiff = heightratio * bgwidth;
        var heightdiff = (winheight * 40) / 100;
        console.log({ heightdiff: heightdiff });
        //  if (heightdiff > winheight) {*
        // this.element.nativeElement.width = winwidth;
        document
            .getElementById("cta")
            .style.setProperty("height", heightdiff + "px");
        //document.getElementById("cta").style.setProperty; "--max-heigth", `35%`;
        //this.element.nativeElement.minHeight = heightdiff;
        this.element.nativeElement.style.setProperty("height", heightdiff + "px");
        // } else {
        // this.element.nativeElement.width = widthdiff;
        // this.element.nativeElement.height = winheight;
        //}
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostBinding"])('class.my-element'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], FullpageDirective.prototype, "_addOverflow", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('window:resize', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], FullpageDirective.prototype, "onResize", null);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["HostListener"])('load', ['$event']),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Function),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [Object]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:returntype", void 0)
    ], FullpageDirective.prototype, "onLoad", null);
    FullpageDirective = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Directive"])({
            selector: '[appFullpage]'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], FullpageDirective);
    return FullpageDirective;
}());



/***/ }),

/***/ "./src/app/shared/services/content.service.ts":
/*!****************************************************!*\
  !*** ./src/app/shared/services/content.service.ts ***!
  \****************************************************/
/*! exports provided: ContentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentService", function() { return ContentService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var ContentService = /** @class */ (function () {
    function ContentService() {
        this.pages = {
            home: {
                title: "Home",
                subtitle: "Welcome Home!",
                content: "Some home content.",
                image: "assets/bg_0.jpg"
            },
            eraser: {
                title: "About",
                subtitle: "About Us",
                content: "Some content about us.",
                image: "assets/bg01.jpg"
            },
            photomontage: {
                title: "Contact",
                subtitle: "Contact Us",
                content: "How to contact us.",
                image: "assets/bg02.jpg"
            },
            crop: {
                title: "About",
                subtitle: "About Us",
                content: "Some content about us.",
                image: "assets/bg01.jpg"
            }
        };
    }
    ContentService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: "root"
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], ContentService);
    return ContentService;
}());



/***/ }),

/***/ "./src/app/slide-panel/slide-panel.component.css":
/*!*******************************************************!*\
  !*** ./src/app/slide-panel/slide-panel.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n  overflow: hidden;\n\n}\n\n.panes {\n  height: 200%;\n  width: 100%;\n\n  display: flex;\n\n\n}\n\ndiv {\n display: flex;\n flex: 1 1 80%;\n flex-direction: column;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2xpZGUtcGFuZWwvc2xpZGUtcGFuZWwuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQWU7RUFDZixpQkFBaUI7O0NBRWxCOztBQUVEO0VBQ0UsYUFBYTtFQUNiLFlBQVk7O0VBRVosY0FBYzs7O0NBR2Y7O0FBQ0Q7Q0FDQyxjQUFjO0NBQ2QsY0FBYztDQUNkLHVCQUF1QjtDQUN2QiIsImZpbGUiOiJzcmMvYXBwL3NsaWRlLXBhbmVsL3NsaWRlLXBhbmVsLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuXG59XG5cbi5wYW5lcyB7XG4gIGhlaWdodDogMjAwJTtcbiAgd2lkdGg6IDEwMCU7XG5cbiAgZGlzcGxheTogZmxleDtcblxuXG59XG5kaXYge1xuIGRpc3BsYXk6IGZsZXg7XG4gZmxleDogMSAxIDgwJTtcbiBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuIl19 */"

/***/ }),

/***/ "./src/app/slide-panel/slide-panel.component.html":
/*!********************************************************!*\
  !*** ./src/app/slide-panel/slide-panel.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"panes\" [@slide]=\"activePane\">\n<div class=\"column\">\n<ng-content class=\"column\"  select=\"[leftPane]\"></ng-content>\n  </div>\n<div class=\"column\">\n<ng-content class=\"column\"  select=\"[rightPane]\" style=\"overflow-y: scroll\"></ng-content>\n</div>\n</div>\n"

/***/ }),

/***/ "./src/app/slide-panel/slide-panel.component.ts":
/*!******************************************************!*\
  !*** ./src/app/slide-panel/slide-panel.component.ts ***!
  \******************************************************/
/*! exports provided: SlidePanelComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlidePanelComponent", function() { return SlidePanelComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/animations */ "./node_modules/@angular/animations/fesm5/animations.js");



var SlidePanelComponent = /** @class */ (function () {
    function SlidePanelComponent() {
        this.activePane = 'left';
    }
    SlidePanelComponent.prototype.ngOnInit = function () {
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
    ], SlidePanelComponent.prototype, "activePane", void 0);
    SlidePanelComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-slide-panel',
            template: __webpack_require__(/*! ./slide-panel.component.html */ "./src/app/slide-panel/slide-panel.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            animations: [
                Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["trigger"])('slide', [
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('left', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ transform: 'translateY(0)' })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["state"])('right', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["style"])({ transform: 'translateY(-55%)' })),
                    Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["transition"])('* => *', Object(_angular_animations__WEBPACK_IMPORTED_MODULE_2__["animate"])(300))
                ])
            ],
            styles: [__webpack_require__(/*! ./slide-panel.component.css */ "./src/app/slide-panel/slide-panel.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SlidePanelComponent);
    return SlidePanelComponent;
}());



/***/ }),

/***/ "./src/app/wistia-embed/wistia-embed.component.css":
/*!*********************************************************!*\
  !*** ./src/app/wistia-embed/wistia-embed.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3dpc3RpYS1lbWJlZC93aXN0aWEtZW1iZWQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/wistia-embed/wistia-embed.component.ts":
/*!********************************************************!*\
  !*** ./src/app/wistia-embed/wistia-embed.component.ts ***!
  \********************************************************/
/*! exports provided: WistiaEmbedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WistiaEmbedComponent", function() { return WistiaEmbedComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var WistiaEmbedComponent = /** @class */ (function () {
    function WistiaEmbedComponent() {
        this.hashed_id = "xtn87n6r5s";
    }
    WistiaEmbedComponent.prototype.ngOnInit = function () { };
    WistiaEmbedComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: "app-wistia-embed",
            template: "\n    <div\n      class=\"wistia_embed wistia_async_{{hashed_id}} seo=false\"\n      style=\"\n        height: 100%;\n      \"\n    >\n      &nbsp;\n    </div>\n  ",
            styles: [__webpack_require__(/*! ./wistia-embed.component.css */ "./src/app/wistia-embed/wistia-embed.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], WistiaEmbedComponent);
    return WistiaEmbedComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "./src/polyfills.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])()
    .bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_4__["AppModule"])
    .then(function (ref) {
    // Ensure Angular destroys itself on hot reloads.
    if (window["ngRef"]) {
        window["ngRef"].destroy();
    }
    window["ngRef"] = ref;
    // Otherise, log the boot error
})
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/dist/zone */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';
/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */
// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
/*
* in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
* with the following flag, it will bypass `zone.js` patch for IE/Edge
*/
// (window as any).__Zone_enable_cross_context_check = true;
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/danielvalide/WorkSpace/ANGULAR/inpixio_mobile/mobile/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map