import { SDomID, SEventBase, SEventType } from "../message/base";
import { SMouseEvent, SMouseEventType } from "../message/event";

function GetUrlRelativePath(fileName: string) {
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if (relUrl.indexOf("?") != -1) {
        relUrl = relUrl.split("?")[0];
    }

    if (relUrl.length > 0) {
        if (relUrl.endsWith('/')) {
            relUrl += fileName;
        } else {
            relUrl += `/${fileName}`;
        }
    } else {
        return url;
    }
    return relUrl;
}

export class App {
    constructor() {
        this._appWorker = new Worker(GetUrlRelativePath('dist/worker.js'));
        this._appWorker.onmessage = (event) => {
            this._dealMessage(event);
        }
    }

    public receiveDomEvent(id: SDomID, event: SEventBase) {
        //console.log(`The dom id: ${SDomID[id]}, event id: ${event.eventId}, eventType: ${SEventType[event.type]}`);
        this._appWorker.postMessage(event);
    }

    public run() {
        this._initDom();
    }

    private _dealMessage(event: MessageEvent<ArrayBuffer>) {
        const buffer = event.data;
        if (!this._ctx2d) {
            return;
        }
        const dv = new DataView(buffer);
        const width = dv.getInt16(0);
        const height = dv.getInt16(2);
        const clime9 = new Uint8ClampedArray(buffer, 4, width * height * 4);
        const imgdt = new ImageData(clime9, width, height);
        this._ctx2d.clearRect(0, 0, this._width, this._height);
        this._ctx2d.putImageData(imgdt, 0, 0);
    }

    private _initDom() {
        const div = document.getElementById('mview3d');
        if (!(div instanceof HTMLCanvasElement)) {
            throw new Error('MViewe3D must be canvas.')
        }
        const rect = div.getBoundingClientRect();
        div.width = rect.width;
        div.height = rect.height;
        const ctx2d = div.getContext('2d');
        if (ctx2d) {
            this._ctx2d = ctx2d;
            this._width = div.width;
            this._height = div.height;
            const imgData = ctx2d.getImageData(0, 0, div.width, div.height);
            const buffer = imgData.data;
            buffer.fill(128);
            ctx2d.putImageData(imgData, 0, 0);
        }
        if (div) {
            div.addEventListener('mousedown', (ev) => {
                this.receiveDomEvent(SDomID.View3D, new SMouseEvent(SMouseEventType.MouseDown, ev.x, ev.y));
            });
            div.addEventListener('mousemove', (ev) => {
                this.receiveDomEvent(SDomID.View3D, new SMouseEvent(SMouseEventType.MouseMove, ev.x, ev.y));
            });
            div.addEventListener('mouseup', (ev) => {
                this.receiveDomEvent(SDomID.View3D, new SMouseEvent(SMouseEventType.MouseUp, ev.x, ev.y));
            });
        }

    }

    private _ctx2d: CanvasRenderingContext2D | null = null;
    private _width = 1;
    private _height = 1;
    private _appWorker: Worker;
}

const app = new App();
app.run();
