import { SEventBase, SEventType } from "./base";

export enum SMouseEventType {
    MouseDown = 1,
    MouseMove = 2,
    MouseUp = 3,
    MouseOut = 4,
}

export class SMouseEvent extends SEventBase {
    static create(obj: SMouseEvent) {
        const rst = new SMouseEvent(obj._mouseType, obj.x, obj.y);
        rst.eventId = rst.eventId;
        return rst;
    }

    constructor(type: SMouseEventType, public x: number, public y: number) {
        super(SEventType.Mouse);
        this._mouseType = type;
    }

    public get mouseType() {
        return this._mouseType;
    }

    private _mouseType: SMouseEventType;
}

export class SKeyboardEvent extends SEventBase {
    constructor(public value: string) {
        super(SEventType.Keyboard);
    }
}

export class AppInternalEvent extends SEventBase {
    constructor(public type1: string) {
        super(SEventType.Network);
    }
}