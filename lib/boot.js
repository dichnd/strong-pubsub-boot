/**
 * Created by DICH on 3/1/2017.
 */
var Client = require('./index');
const BROKERS_CONFIG_FILE_NAME = 'broker-config.json';
var _defaults = require('lodash').defaults;
var uid = require('uid-safe').sync;

/**
 * load broker config file and init connect
 * @param app
 * @param rootDir where application start
 * @param {error} callback
 */
module.exports = function (app, rootDir, callback) {
    rootDir = rootDir || './';
    var brokersInfos = require(rootDir + BROKERS_CONFIG_FILE_NAME);
    for(var id in brokersInfos) {
        addBroker(app, brokersInfos[id]);
    }

    callback(null);
}

function addBroker(app, brokerId, brokersInfo) {
    brokersInfo  = _defaults({}, brokersInfo, {
        host: 'localhost',
        port: '2181'
    });

    brokersInfo.options = _defaults({}, brokersInfo.options, {
        groupId: uid(5)
    });

    var Adapter = require(brokersInfo.adapter);
    if(!brokersInfo.adapter || !Adapter) {
        throw new Error('adapter config must be defined!')
    }

    var client = new Client({host: brokersInfo.host, port: brokersInfo.port}, Adapter)
    var handler = require(brokersInfo.handler);
    if(!handler) {
        throw new Error('handler message for broker ' + brokerId + ' must be defined!')
    }

    if(brokersInfo.topics) {
        client.subscribe(brokersInfo.topics, brokersInfo.options);
    }

    client.on('message', function (topic, message) {
        handler.handle(topic, message);
    })

    client.on('error', function (error) {
        handler.emit('error', error);
    })

    app.brokers = app.brokers || {};
    app.brokers[brokerId] = client;
}
