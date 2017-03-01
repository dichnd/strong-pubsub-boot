/**
 * Created by DICH on 3/1/2017.
 */
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function BrokerHandler(options) {
    this.handlerMap = {};
}

inherits(BrokerHandler, EventEmitter);

/**
 *
 * @param topic
 * @param {message} func
 */
BrokerHandler.prototype.subscribe = function (topic, func) {
    this.handlerMap[topic] = func;
}

/**
 *
 * @param topic
 * @param message
 */
BrokerHandler.prototype.handle = function (topic, message) {
    if(this.handlerMap[topic]) {
        this.handlerMap[topic](message);
    } else {
        this.emit('message', topic, message);
    }
}

module.exports = function (options) {
    return new BrokerHandler(options);
}

