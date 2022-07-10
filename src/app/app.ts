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
    }

    public receiveDomEvent(id: SDomID, event: SEventBase) {
        console.log(`The dom id: ${SDomID[id]}, event id: ${event.eventId}, eventType: ${SEventType[event.type]}`);
        this._appWorker.postMessage(event);
    }

    public run() {
        this._initDom();
    }

    private _initDom() {
        const div = document.getElementById('mview3d');
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

    private _appWorker: Worker;
}

const app = new App();
app.run();
