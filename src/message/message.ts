
export class ArrayBufferMessage {
    constructor(width: number, height: number) {
        this._buffer = new ArrayBuffer(width * height * 4 + 4);
        const dv = new DataView(this._buffer);
        dv.setInt16(0, width);
        dv.setInt16(2, height);
    }

    public setBufferValue(value: number) {
        const dv = new DataView(this._buffer);
        const width = dv.getInt16(0);
        const height = dv.getInt16(2);
        const vbuf = new Uint8ClampedArray(this._buffer, 4, width * height * 4);
        vbuf.fill(value);
    }

    public get buffer() {
        return this._buffer;
    }

    private _buffer: ArrayBuffer;
}