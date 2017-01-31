import ShapeDetector from './shape';
import resolver from './resolver';
import funcs from './funcs';

class ShapeCaptcha {
    constructor(options) {
        this.options = options;
        this.shapeDetector = new ShapeDetector();
        this.resolver = resolver.bind(this);
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
        bgColor: '#000',
        drawColor: '#FFFF00',
        acceptColor: '#00FF00',
        textColor: '#000',
        textBgColor: '#CCC',
        helperText: '',
        drawLineWidth: 4,
        successLineWidth: 8
    };
    const options = Object.assign({}, defaults, opts);
    const sc = new ShapeCaptcha(options);
    return new Promise(sc.resolver);
}
