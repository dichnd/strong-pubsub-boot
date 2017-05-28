/**
 * Created by DICH on 5/28/2017.
 */

/**
 *
 * @param app
 * @param broker
 * @param topic
 * @param options
 *  - topic
 * @constructor
 */
function Producer(app, broker, topic, options) {
    if(!topic) {
        throw new Error('topic must be defined!')
    }
    this.app = app;
    this.broker = broker
    this.topic = options.topic
}

/**
 *
 * @param messages
 * @param options
 * @param {error} callback
 */
Producer.prototype.publish = function (messages, options, callback) {
    if(typeof messages == 'object') {
        messages = JSON.stringify(messages);
    }
    this.app.brokers[this.broker].publish(this.topic, messages, options, callback);
}

/**
 *
 * @param payloads
 * @param {error} callback
 */
Producer.prototype.send = function (payloads, callback) {
    this.app.brokers[this.broker].send(payloads, callback);
}