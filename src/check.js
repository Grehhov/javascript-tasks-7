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
    properties = prop.call(this, false);
    properties.not = prop.call(this, true);
    return properties;
}

function prop(isNot) {
    if (Object.prototype === Object.getPrototypeOf(this)) {
        return {
            containsKeys: containsKeys.bind(this, isNot),
            hasKeys: hasKeys.bind(this, isNot),
            containsValues: containsValues.bind(this, isNot),
            hasValues: hasValues.bind(this, isNot),
            hasValueType: hasValueType.bind(this, isNot)
        };
    } else if (Array.prototype === Object.getPrototypeOf(this)) {
        return {
            containsKeys: containsKeys.bind(this, isNot),
            hasKeys: hasKeys.bind(this, isNot),
            containsValues: containsValues.bind(this, isNot),
            hasValues: hasValues.bind(this, isNot),
            hasValueType: hasValueType.bind(this, isNot),
            hasLength: hasLength.bind(this, isNot)
        };
    } else if (String.prototype === Object.getPrototypeOf(this)) {
        return {
            hasLength: hasLength.bind(this, isNot),
            hasWordsCount: hasWordsCount.bind(this, isNot)
        };
    } else if (Function.prototype === Object.getPrototypeOf(this)) {
        return {
            hasParamsCount: hasParamsCount.bind(this, isNot)
        }
    }
}

function containsKeys(isNot, keys) {
    for(var key of keys) {
        if (!this.hasOwnProperty(key)) {
            return result(false, isNot);
        }
    }
    return result(true, isNot);
}

function hasKeys(isNot, keys) {
    var pr = Object.keys(this);
    if (pr.length !== keys.length) {
        return result(false, isNot);
    }
    return result(this.check.containsKeys(keys), isNot);
}

function containsValues(isNot, values) {
    for(var value of values) {
        var containsValue = false;
        Object.keys(values).forEach(function(index) {
            if (value === values[index]) {
                containsValue = true;
            }
        });
        if (!containsValue) {
            return result(false, isNot);
        }
    }
    return result(true, isNot);
}

function hasValues(isNot, values) {
    var listOfValue = [];
    Object.keys(values).forEach(function(index) {
        listOfValue.push(values[index]);
        if (values.indexOf(values[index]) === -1) {
            return result(false, isNot);
        }
    });
    for (var value of values) {
        if (listOfValue.indexOf(value) === -1) {
            return result(false, isNot);
        }
    }
    return result(true, isNot);
}

function hasValueType(isNot, key, type) {
    var supportedTypes = {
        string: String,
        number: Number,
        function: Function,
        array: Array
    }
    for(var k in supportedTypes) {
        if (supportedTypes[k] === type) {
            return result(typeof(key) === k, isNot);
        }
    }
    return null;
}

function hasLength(isNot, length) {
    return result(this.length === length, isNot);
}

function hasParamsCount(isNot, count) {
    return result(this.length === count, isNot);
}

function hasWordsCount(isNot, count) {
    return result(this.split(/\s+/).length === count, isNot);
}

function result(res, isNot) {
    return isNot ? !res : res;
}
