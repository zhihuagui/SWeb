import { SEventType } from "../message/base";
import { AppInternalEvent, SKeyboardEvent, SMouseEvent, SMouseEventType } from "../message/event";
import { ArrayBufferMessage } from "../message/message";

declare const self: Worker;

class AppWrapper {
    constructor() {
        /**
         * worker中有自己的事件循环，由于settimeout反应时间比较慢，使用worker直接传递，可更快速的相应
         */
        const tickwkStr = "self.onmessage=function(){postMessage({});}";
        const blob = new Blob([tickwkStr], {type: 'application/javascript'});
        const tkUrl = URL.createObjectURL(blob);
        this._tickWorker = new Worker(tkUrl);
        this._tickWorker.onmessage = this.loopMessage;
    }

    public loopMessage: () => void = () => {
        this._processMessage();

        if (this._messageQueue.length > 0 && !this._msgTrigging) {
            this._msgTrigging = true;
            if (this._tickWorker) {
                this._tickWorker.postMessage(1);
            } else {
                setTimeout(this.loopMessage, 0);
            }
        }
    };

    private _processMessage() {
        this._msgTrigging = false;
        const msg = this._messageQueue.shift();
        if (msg) {
            if (msg instanceof AppInternalEvent) {
                if (!(msg.eventId & 0xFFFF)) {
                    console.log(`process message ${msg.eventId}`);
                }
            } else {
                if (msg instanceof SMouseEvent) {
                    // console.log(`process message ${msg.eventId}, mouse type: ${SMouseEventType[msg.mouseType]}, x: ${msg.x}, y: ${msg.y}`);
                    if (msg.mouseType === SMouseEventType.MouseMove) {
                        const bfmsg = new ArrayBufferMessage(msg.x, msg.y);
                        bfmsg.setBufferValue(msg.eventId % 256);
                        self.postMessage(bfmsg.buffer, [bfmsg.buffer]);
                    }
                }
            }
        }
    }

    public triggerMsgLoop() {
        if (!this._msgTrigging) {
            this._msgTrigging = true;
            if (this._tickWorker) {
                this._tickWorker.postMessage(1);
            } else {
                setTimeout(this.loopMessage, 0);
            }
        }
    }

    public receiveMessage(msg: SMouseEvent | SKeyboardEvent) {
        this._messageQueue.push(msg);
        // let ss = this._messageQueue.shift();
        // this._messageQueue.push(new AppInternalEvent('Network'));
        this.triggerMsgLoop();
    }

    private _messageQueue: (SMouseEvent | SKeyboardEvent | AppInternalEvent)[] = [];
    private _msgTrigging = false;
    private _tickWorker: Worker;
}

const app = new AppWrapper();

global.onmessage = (event) => {
    const data = event.data;
    if (data.type === SEventType.Mouse) {
        app.receiveMessage(SMouseEvent.create(data));
    }
}
