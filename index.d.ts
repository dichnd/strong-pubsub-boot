/**
 * Created by DICH on 5/28/2017.
 */
export declare function Boot(app, rootDir, callback) : void;

declare class BrokerHandler {
    public subscribe(topic, func) : void
    public handle(topic, message) : void
}

export declare function Handler(options) : BrokerHandler
export declare class Producer {
    constructor(app, broker, topic, options)
    public publish(messages, options, callback) : void
    public send(payloads, callback) : void
}
