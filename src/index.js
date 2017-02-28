import ShapeDetector from './shape';
import resolver from './resolver';
import funcs from './funcs';

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

class ShapeCaptchaClass {
    constructor(options) {
        this.options = options;
        this.shapeDetector = new ShapeDetector();
        this.resolver = resolver.bind(this);
        for (let key of Object.keys(funcs)) {
            this[key] = funcs[key].bind(this);
        }
    }

    init() {
        return new Promise(this.resolver);
    }
}

export function init(opts) {
    const options = Object.assign({}, defaults, opts);
    const sc = new ShapeCaptchaClass(options);
    return new Promise(sc.resolver);
}

export function create(opts) {
    const options = Object.assign({}, defaults, opts);
    return new ShapeCaptchaClass(options);
}
