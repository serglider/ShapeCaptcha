import ShapeDetector from './shape';
import run from './run';
import funcs from './funcs';

class ShapeCaptcha {
    constructor(options) {
        this.options = options;
        this.shapeDetector = new ShapeDetector();
        this.run = run.bind(this);
        for (let key of Object.keys(funcs)) {
            this[key] = funcs[key].bind(this);
        }
    }
}

export function init(opts) {
    const defaults = {
        timeout: 30, // sec
        items: 5,
        container: '',
        bgColor: 'black',
        drawColor: '#FFFF00',
        acceptColor: '#00FF00',
        textColor: 'black',
        textBgColor: '#CCC',
        text: '',
        drawLineWidth: 4,
        successLineWidth: 8
    };
    const options = Object.assign({}, defaults, opts);
    const sc = new ShapeCaptcha(options);
    return new Promise(sc.run);
}
