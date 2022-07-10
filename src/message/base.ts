export enum SDomID {
    View3D = 1,
    View2D = 2,
}

export enum SEventType {
    Mouse = 1,
    Keyboard = 2,
    Network = 3,
}

export class SEventBase {
    private static _eventIds: number[] = [];

    constructor(type: SEventType) {
        this.type = type;
        this.eventId = SEventBase._eventIds[type] || 1;
        SEventBase._eventIds[type] = this.eventId + 1;
    }

    public type: SEventType;
    public eventId: number;
}
