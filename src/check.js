'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            return property.call(this);
        }
    });
};

exports.wrap = function (obj) {
    if (obj !== null) {
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
    if (Object.prototype === Object.getPrototypeOf(this)) {
        return {
            containsKeys: containsKeys.bind(this),
            hasKeys: hasKeys.bind(this),
            containsValues: containsValues.bind(this),
            hasValues: hasValues.bind(this),
            hasValueType: hasValueType.bind(this)
        };
    }
    if (Array.prototype === Object.getPrototypeOf(this)) {
        return {
            containsKeys: containsKeys.bind(this),
            hasKeys: hasKeys.bind(this),
            containsValues: containsValues.bind(this),
            hasValues: hasValues.bind(this),
            hasValueType: hasValueType.bind(this),
            hasLength: hasLength.bind(this)
        };
    }
    if (String.prototype === Object.getPrototypeOf(this)) {
        return {
            hasLength: hasLength.bind(this),
            hasWordsCount: hasWordsCount.bind(this)
        };
    }
    if (Function.prototype === Object.getPrototypeOf(this)) {
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
    var pr = Object.keys(this);
    if (pr.length !== keys.length) {
        return false;
    }
    return this.check.containsKeys(keys);
}

function containsValues(values) {
    var _this = this;
    for (var value of values) {
        var containsValue = false;
        Object.keys(_this).forEach(function (index) {
            if (value === _this[index]) {
                containsValue = true;
            }
        });
        if (!containsValue) {
            return false;
        }
    }
    return true;
}

function hasValues(values) {
    var listOfValue = [];
    var _this = this;
    Object.keys(_this).forEach(function (index) {
        listOfValue.push(_this[index]);
        if (values.indexOf(_this[index]) === -1) {
            return false;
        }
    });
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
    for (var k in supportedTypes) {
        if (supportedTypes[k] === type) {
            return typeof (this[key]) === k;
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
