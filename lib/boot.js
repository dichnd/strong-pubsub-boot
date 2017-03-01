/**
 * Created by DICH on 3/1/2017.
 */
var Client = require('strong-pubsub');
const BROKERS_CONFIG_FILE_NAME = 'broker-config.json';
var _defaults = require('lodash').defaults;
var uid = require('uid-safe').sync;
var path = require('path');

/**
 * load broker config file and init connect
 * @param app
 * @param rootDir where application start
 * @param {error} callback
 */
module.exports = function (app, rootDir, callback) {
    rootDir = rootDir || './';
    var brokersInfos = require(path.join(rootDir, BROKERS_CONFIG_FILE_NAME));
    for(var id in brokersInfos) {
        addBroker(app, rootDir, id, brokersInfos[id]);
    }

    callback(null);
}

function addBroker(app, rootDir, brokerId, brokersInfo) {
    brokersInfo  = _defaults({}, brokersInfo, {
        host: 'localhost',
        port: '2181'
    });

    brokersInfo.consumer_options = _defaults({}, brokersInfo.consumer_options, {
        groupId: uid(5)
    });

    brokersInfo.producer_options = _defaults({}, brokersInfo.producer_options, {
        host: brokersInfo.host,
        port: brokersInfo.port
    });

    var Adapter = require(brokersInfo.adapter) || require(path.join(rootDir, brokersInfo.adapter));
    if(!brokersInfo.adapter || !Adapter) {
        throw new Error('adapter config must be defined!')
    }

    var client = new Client(brokersInfo.producer_options, Adapter)
    var handler = require(path.join(rootDir, brokersInfo.handler))
    if(!handler) {
        throw new Error('handler message for broker ' + brokerId + ' must be defined!')
    }

    if(brokersInfo.topics) {
        client.subscribe(brokersInfo.topics, brokersInfo.consumer_options);
    }

    client.on('connect', function () {
        handler.emit('connect', error);
    })

    client.on('message', function (topic, message) {
        handler.handle(topic, message);
    })

    client.on('error', function (error) {
        handler.emit('error', error);
    })

    app.brokers = app.brokers || {};
    app.brokers[brokerId] = client;
}
