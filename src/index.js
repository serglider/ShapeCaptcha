import ShapeDetector from './shape';
import resolver from './resolver';
import methods from './methods';

class ShapeCaptchaClass {

    constructor(options) {
        this.options = {
            timeout: 30, // sec
            items: 5,
            container: '',
            font: 'sans-serif',
            bgColor: '#000',
            drawColor: '#FFFF00',
            acceptColor: '#00FF00',
            textColor: '#000',
            textBgColor: '#CCC',
            helperText: '',
            drawLineWidth: 4,
            successLineWidth: 8
        };
        if ( options ) this.setOptions(options);
        this.shapeDetector = new ShapeDetector();
        this.resolver = resolver.bind(this);
        for (let key of Object.keys(methods)) {
            this[key] = methods[key].bind(this);
        }
    }

    setOptions(x, val) {
        const setOption = (k, v) => {
            k = k.toString();
            if (this.options.hasOwnProperty(k) && typeof this.options[k] === typeof v) {
                this.options[k] = v;
            }
        };

        if (Object.prototype.toString.call(x) === '[object Object]') {
            Object.keys(x).forEach(k => {
                setOption(k, x[k]);
            });
        } else {
            setOption(x, val);
        }
    }

    start() {
        return new Promise(this.resolver);
    }
}

export function start(options) {
    const sc = new ShapeCaptchaClass(options);
    return new Promise(sc.resolver);
}

export function create(options) {
    return new ShapeCaptchaClass(options);
}
