'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            return property.call(this);
        }
    });
};

exports.wrap = function (obj) {
    if (obj !== null && obj !== undefined) {
        this.init();
        return obj;
    }
    return {
        isNull: function () {
            return true;
        }
    };
};

function property() {
    var properties = {};
    properties = prop.call(this);
    properties.not = Object.keys(properties).reduce(function (prev, key) {
        prev[key] = function () {
            return !properties[key].apply(this, arguments);
        };
        return prev;
    }, {});
    return properties;
}

function prop() {
    var prototype = Object.getPrototypeOf(this);
    if (Object.prototype === prototype) {
        return {
            containsKeys: containsKeys.bind(this),
            hasKeys: hasKeys.bind(this),
            containsValues: containsValues.bind(this),
            hasValues: hasValues.bind(this),
            hasValueType: hasValueType.bind(this)
        };
    }
    if (Array.prototype === prototype) {
        return {
            containsKeys: containsKeys.bind(this),
            hasKeys: hasKeys.bind(this),
            containsValues: containsValues.bind(this),
            hasValues: hasValues.bind(this),
            hasValueType: hasValueType.bind(this),
            hasLength: hasLength.bind(this)
        };
    }
    if (String.prototype === prototype) {
        return {
            hasLength: hasLength.bind(this),
            hasWordsCount: hasWordsCount.bind(this)
        };
    }
    if (Function.prototype === prototype) {
        return {
            hasParamsCount: hasParamsCount.bind(this)
        };
    }
}

function containsKeys(keys) {
    for (var key of keys) {
        if (!this.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function hasKeys(keys) {
    if (Object.keys(this).length !== keys.length) {
        return false;
    }
    return this.check.containsKeys(keys);
}

function containsValues(values) {
    for (var value of values) {
        var containsValue = false;
        Object.keys(this).forEach(function (index) {
            if (value === this[index]) {
                containsValue = true;
            }
        }.bind(this));
        if (!containsValue) {
            return false;
        }
    }
    return true;
}

function hasValues(values) {
    var listOfValue = [];
    var hasValue = true;
    Object.keys(this).forEach(function (index) {
        listOfValue.push(this[index]);
        if (values.indexOf(this[index]) === -1) {
            hasValue = false;
        }
    }.bind(this));
    if (!hasValue) {
        return false;
    }
    for (var value of values) {
        if (listOfValue.indexOf(value) === -1) {
            return false;
        }
    }
    return true;
}

function hasValueType(key, type) {
    var supportedTypes = {
        string: String,
        number: Number,
        function: Function,
        array: Array
    };
    for (var t in supportedTypes) {
        if (supportedTypes[t] === type) {
            return typeof (this[key]) === t;
        }
    }
    return null;
}

function hasLength(length) {
    return this.length === length;
}

function hasParamsCount(count) {
    return this.length === count;
}

function hasWordsCount(count) {
    return this.split(/\s+/).length === count;
}
