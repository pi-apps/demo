import EventSource from 'eventsource';
declare type Severity = 'info' | 'error';
interface Options {
    source: string;
    target: string;
    logger?: Pick<Console, Severity>;
}
declare class Client {
    source: string;
    target: string;
    logger: Pick<Console, Severity>;
    events: EventSource;
    constructor({ source, target, logger }: Options);
    static createChannel(): Promise<any>;
    onmessage(msg: any): void;
    onopen(): void;
    onerror(err: any): void;
    start(): EventSource;
}
export = Client;
