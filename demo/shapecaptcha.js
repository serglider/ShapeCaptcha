var ShapeCaptcha =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = {

    getContainer(selector) {
        if (!selector) {
            return document.body;
        }
        const container = document.querySelector(selector);
        return container ? container : document.body;
    },

    getSizes(container, ctx, text1) {
        let width, height;
        if ( container === document.body ) {
            width = window.innerWidth - 4;
            height = window.innerHeight - 4;
        }else {
            const bcr = container.getBoundingClientRect();
            width = bcr.width;
            height = bcr.height;
        }

        let f1 = 0.05;
        let font1 = Math.round(height * f1);
        ctx.font = `${font1}px sans-serif`;
        while (ctx.measureText(text1).width > width) {
            f1 *= 0.95;
            font1 = Math.round(height * f1);
            ctx.font = `${font1}px sans-serif`;
        }

        const text2 =  this.options.helperText;
        let f2 = 0.03;
        let font2 = Math.round(height * f2);
        if ( text2 ) {
            ctx.font = `${font2}px sans-serif`;
            while (ctx.measureText(text2).width > width) {
                f2 *= 0.95;
                font2 = Math.round(height * f2);
                ctx.font = `${font2}px sans-serif`;
            }
        }
        const text1Y = text2 ? Math.round(height * 0.07) : Math.round(height * 0.1);
        return {
            width,
            height,
            explanation: {
                height: Math.round(height * 0.2),
                font1,
                font2,
                text1Y,
                text2Y: Math.round(height * 0.15),
            }
        };
    },

    checkResults(shapes, task) {
        let res = shapes.reduce((acc, item) => {
            acc[item.shape] -= 1;
            return acc;
        }, Object.assign({}, task));
        return Object.keys(res).every(key => {
            return res[key] === 0;
        });
    },

    drawTaskText(ctx, text) {
        const s = this.sizes.explanation;
        ctx.fillStyle = this.options.textBgColor;
        ctx.fillRect(0, 0, ctx.canvas.width, s.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = this.options.textColor;
        ctx.font = `${s.font1}px sans-serif`;
        ctx.fillText(text, ctx.canvas.width / 2, s.text1Y);
        if ( this.options.helperText ) {
            ctx.font = `${s.font2}px sans-serif`;
            ctx.fillText(this.options.helperText, ctx.canvas.width / 2, s.text2Y);
        }
    },

    getRandItemSet(n) {
        let items = ['circle', 'triangle', 'square'];
        let result = this.shuffle(items).reduce((acc, item, idx) => {
            let total = Object.keys(acc).reduce((total, key) => {
                total += acc[key];
                return total;
            }, 0);
            let rest = n - total;
            if (idx === 2) {
                acc[item] = rest;
            } else {
                acc[item] = Math.ceil(Math.random() * rest);
            }
            return acc;
        }, {});
        return result;
    },

    getText(obj) {
        let text = Object.keys(obj).reduce((str, key) => {
            if (obj[key]) {
                if (obj[key] === 1) {
                    str += ` a ${key},`;
                } else {
                    str += ` ${obj[key]} ${key}s,`;
                }
            }
            return str;
        }, 'Please draw');
        return text.replace(/,$/, '.').replace(/,(?=[^,]*$)/, ' and');
    },

    shuffle(arr) {
        let i = arr.length,
            randi;
        while (i) {
            randi = Math.floor(Math.random() * (i--));
            arr[i] = [arr[randi], arr[randi] = arr[i]][0];
        }
        return arr;
    },

    drawDots(ctx, dots, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        dots.forEach((dot, i) => {
            if (i) {
                ctx.lineTo(dot.x, dot.y);
            } else {
                ctx.moveTo(dot.x, dot.y);
            }
        });
        ctx.stroke();
    },

    getPathData(dots) {
        const shape = this.shapeDetector.spot(dots);
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return {
            shape,
            dots,
            color
        };
    },

    getPointerPos(e) {
        const bcr = e.target.getBoundingClientRect();
        return {
            x: e.pageX - bcr.left,
            y: e.pageY - bcr.top
        };
    }

};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = resolver;
function resolver(resolve, reject) {
    const container = this.getContainer(this.options.container);
    const self = this;
    const shapes = [];
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const delay = this.options.timeout ? this.options.timeout * 1000 : 3600000;
    const timer = setTimeout(() => {
        container.removeChild(canvas);
        canvas = null;
        reject('time out!');
    }, delay);
    let shape = [];

    const task = this.getRandItemSet(this.options.items);
    const taskText = this.getText(task);
    this.sizes = this.getSizes(container, ctx, taskText);
    canvas.width = this.sizes.width;
    canvas.height = this.sizes.height;
    container.appendChild(canvas);
    drawScene(ctx);
    canvas.addEventListener('mousedown', setListeners);

    function setListeners(e) {
        e.target.addEventListener('mouseup', onMouseUp);
        e.target.addEventListener('mousemove', onMouseMove);
    }

    function removeListeners(e) {
        e.target.removeEventListener('mouseup', onMouseUp);
        e.target.removeEventListener('mousemove', onMouseMove);
    }

    function onMouseUp(e) {
        removeListeners(e);
        const pathData = self.getPathData(shape);
        if (pathData.shape !== null) {
            proccessData(pathData);
        } else {
            drawScene(ctx);
        }
        shape = [];
    }

    function proccessData(data) {
        const len = shapes.filter(item => item.shape === data.shape).length;
        if (task[data.shape] && (task[data.shape] > len)) {
            shapes.push(data);
        }
        const done = self.checkResults(shapes, task);
        drawScene(ctx, done);
        if (done) {
            container.removeChild(canvas);
            canvas = null;
            clearTimeout(timer);
            resolve();
        }
    }

    function drawScene(ctx, done) {
        self.drawTaskText(ctx, taskText);
        ctx.fillStyle = self.options.bgColor;
        ctx.fillRect(0, self.sizes.explanation.height, canvas.width, canvas.height);
        ctx.lineWidth = done ? self.options.successLineWidth : self.options.drawLineWidth;
        if (shapes.length) {
            shapes.forEach(item => {
                self.drawDots(ctx, item.dots, self.options.acceptColor);
            });
        }
    }

    function onMouseMove(e) {
        const dot = self.getPointerPos(e);
        shape.push(dot);
        self.drawDots(ctx, shape, self.options.drawColor);
    }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Stroke {
    constructor(squareSize, nbSamplePoints, points, name) {
        this.squareSize = squareSize;
        this.nbSamplePoints = nbSamplePoints;
        this.points = points;
        this.name = name;
        this.processStroke();
    }

    getDistance(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.hypot(dx, dy);
    }

    processStroke() {
        this.points = this.resample();
        this.setCentroid();
        this.points = this.rotateBy(-this.indicativeAngle());
        this.points = this.scaleToSquare();
        this.setCentroid();
        this.points = this.translateToOrigin();
        return this;
    }

    resample() {
        const interval = this.strokeLength() / (this.nbSamplePoints - 1);
        const newPoints = [this.points[0]];
        let distance = 0;

        for (let i = 1; i < this.points.length; i++) {
            let localDistance = this.getDistance(this.points[i - 1], this.points[i]);

            if (distance + localDistance >= interval) {
                let q = {
                    x: this.points[i - 1].x + ((interval - distance) / localDistance) * (this.points[i].x - this.points[i - 1].x),
                    y: this.points[i - 1].y + ((interval - distance) / localDistance) * (this.points[i].y - this.points[i - 1].y)
                };

                newPoints.push(q);
                this.points.splice(i, 0, q);
                distance = 0;
            } else {
                distance += localDistance;
            }
        }

        if (newPoints.length === this.nbSamplePoints - 1) {
            newPoints.push(this.points[this.points.length - 1]);
        }

        return newPoints;
    }

    rotateBy(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return this.points.map(point => {
            return {
                x: (point.x - this.c.x) * cos - (point.y - this.c.y) * sin + this.c.x,
                y: (point.x - this.c.x) * sin + (point.y - this.c.y) * cos + this.c.y
            };
        });
    }

    scaleToSquare() {
        const box = {
            minX: +Infinity,
            maxX: -Infinity,
            minY: +Infinity,
            maxY: -Infinity
        };

        for (let point of this.points) {
            box.minX = Math.min(box.minX, point.x);
            box.minY = Math.min(box.minY, point.y);
            box.maxX = Math.max(box.maxX, point.x);
            box.maxY = Math.max(box.maxY, point.y);
        }
        box.width = box.maxX - box.minX;
        box.height = box.maxY - box.minY;

        return this.points.map(point => {
            return {
                x: point.x * (this.squareSize / box.width),
                y: point.y * (this.squareSize / box.height)
            };
        });
    }

    translateToOrigin() {
        const _origin = {
            x: 0,
            y: 0
        };
        return this.points.map(point => {
            return {
                x: point.x + _origin.x - this.c.x,
                y: point.y + _origin.y - this.c.y
            };
        });
    }

    setCentroid() {
        this.c = this.points.reduce((acc, point) => {
            acc.x += point.x;
            acc.y += point.y;
            return acc;
        }, {
            x: 0,
            y: 0
        });
        this.c.x /= this.points.length;
        this.c.y /= this.points.length;
    }

    indicativeAngle() {
        return Math.atan2(this.c.y - this.points[0].y, this.c.x - this.points[0].x);
    }

    strokeLength() {
        return this.points.reduce((acc, point, i, arr) => {
            if (i > 0) {
                acc += this.getDistance(arr[i - 1], point);
            }
            return acc;
        }, 0);
    }

    distanceAtBestAngle(pattern) {
        const _phi = 0.5 * (-1 + Math.sqrt(5));
        const deg2Rad = d => d * Math.PI / 180;
        const _angleRange = deg2Rad(45);
        const _anglePrecision = deg2Rad(2);
        let a = -_angleRange;
        let b = _angleRange;
        let x1 = _phi * a + (1 - _phi) * b;
        let f1 = this.distanceAtAngle(pattern, x1);
        let x2 = (1 - _phi) * a + _phi * b;
        let f2 = this.distanceAtAngle(pattern, x2);

        while (Math.abs(b - a) > _anglePrecision) {
            if (f1 < f2) {
                b = x2;
                x2 = x1;
                f2 = f1;
                x1 = _phi * a + (1 - _phi) * b;
                f1 = this.distanceAtAngle(pattern, x1);
            } else {
                a = x1;
                x1 = x2;
                f1 = f2;
                x2 = (1 - _phi) * a + _phi * b;
                f2 = this.distanceAtAngle(pattern, x2);
            }
        }
        return Math.min(f1, f2);
    }

    distanceAtAngle(pattern, angle) {
        const strokePoints = this.rotateBy(angle);
        const d = strokePoints.reduce((acc, point, i) => {
            acc += this.getDistance(point, pattern.points[i]);
            return acc;
        }, 0);
        return d / strokePoints.length;
    }

}

class ShapeDetector {
    constructor() {
        const defaultShapes = [{
                points: [{
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 157.69687843322748,
                    y: 385.4812583923338
                }, {
                    x: 175.2187538146972,
                    y: 350.4375076293944
                }, {
                    x: 192.7406291961669,
                    y: 315.39375686645496
                }, {
                    x: 210.26250457763663,
                    y: 280.3500061035155
                }, {
                    x: 227.78437995910636,
                    y: 245.30625534057606
                }, {
                    x: 245.30625534057606,
                    y: 210.26250457763663
                }, {
                    x: 262.8281307220458,
                    y: 175.2187538146972
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 297.87188148498524,
                    y: 175.2187538146972
                }, {
                    x: 315.39375686645496,
                    y: 210.26250457763663
                }, {
                    x: 332.9156322479247,
                    y: 245.30625534057606
                }, {
                    x: 350.4375076293944,
                    y: 280.3500061035155
                }, {
                    x: 367.95938301086414,
                    y: 315.39375686645496
                }, {
                    x: 385.4812583923338,
                    y: 350.4375076293944
                }, {
                    x: 403.00313377380354,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }],
                name: "triangle"
            },
            {
                points: [{
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 297.87188148498524,
                    y: 175.2187538146972
                }, {
                    x: 315.39375686645496,
                    y: 210.26250457763663
                }, {
                    x: 332.9156322479247,
                    y: 245.30625534057606
                }, {
                    x: 350.4375076293944,
                    y: 280.3500061035155
                }, {
                    x: 367.95938301086414,
                    y: 315.39375686645496
                }, {
                    x: 385.4812583923338,
                    y: 350.4375076293944
                }, {
                    x: 403.00313377380354,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 157.69687843322748,
                    y: 385.4812583923338
                }, {
                    x: 175.2187538146972,
                    y: 350.4375076293944
                }, {
                    x: 192.7406291961669,
                    y: 315.39375686645496
                }, {
                    x: 210.26250457763663,
                    y: 280.3500061035155
                }, {
                    x: 227.78437995910636,
                    y: 245.30625534057606
                }, {
                    x: 245.30625534057606,
                    y: 210.26250457763663
                }, {
                    x: 262.8281307220458,
                    y: 175.2187538146972
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }],
                name: "triangle"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 157.69687843322748,
                    y: 385.4812583923338
                }, {
                    x: 175.2187538146972,
                    y: 350.4375076293944
                }, {
                    x: 192.7406291961669,
                    y: 315.39375686645496
                }, {
                    x: 210.26250457763663,
                    y: 280.3500061035155
                }, {
                    x: 227.78437995910636,
                    y: 245.30625534057606
                }, {
                    x: 245.30625534057606,
                    y: 210.26250457763663
                }, {
                    x: 262.8281307220458,
                    y: 175.2187538146972
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 297.87188148498524,
                    y: 175.2187538146972
                }, {
                    x: 315.39375686645496,
                    y: 210.26250457763663
                }, {
                    x: 332.9156322479247,
                    y: 245.30625534057606
                }, {
                    x: 350.4375076293944,
                    y: 280.3500061035155
                }, {
                    x: 367.95938301086414,
                    y: 315.39375686645496
                }, {
                    x: 385.4812583923338,
                    y: 350.4375076293944
                }, {
                    x: 403.00313377380354,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }],
                name: "triangle"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 403.00313377380354,
                    y: 385.4812583923338
                }, {
                    x: 385.4812583923338,
                    y: 350.4375076293944
                }, {
                    x: 367.9593830108641,
                    y: 315.39375686645496
                }, {
                    x: 350.4375076293944,
                    y: 280.3500061035155
                }, {
                    x: 332.9156322479247,
                    y: 245.30625534057606
                }, {
                    x: 315.39375686645496,
                    y: 210.26250457763663
                }, {
                    x: 297.87188148498524,
                    y: 175.2187538146972
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 262.8281307220458,
                    y: 175.2187538146972
                }, {
                    x: 245.30625534057606,
                    y: 210.26250457763663
                }, {
                    x: 227.78437995910636,
                    y: 245.30625534057606
                }, {
                    x: 210.26250457763663,
                    y: 280.3500061035155
                }, {
                    x: 192.7406291961669,
                    y: 315.39375686645496
                }, {
                    x: 175.2187538146972,
                    y: 350.4375076293944
                }, {
                    x: 157.69687843322748,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }],
                name: "triangle"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 403.00313377380354,
                    y: 385.4812583923338
                }, {
                    x: 385.4812583923338,
                    y: 350.4375076293944
                }, {
                    x: 367.9593830108641,
                    y: 315.39375686645496
                }, {
                    x: 350.4375076293944,
                    y: 280.3500061035155
                }, {
                    x: 332.9156322479247,
                    y: 245.30625534057606
                }, {
                    x: 315.39375686645496,
                    y: 210.26250457763663
                }, {
                    x: 297.87188148498524,
                    y: 175.2187538146972
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 262.8281307220458,
                    y: 175.2187538146972
                }, {
                    x: 245.30625534057606,
                    y: 210.26250457763663
                }, {
                    x: 227.78437995910636,
                    y: 245.30625534057606
                }, {
                    x: 210.26250457763663,
                    y: 280.3500061035155
                }, {
                    x: 192.7406291961669,
                    y: 315.39375686645496
                }, {
                    x: 175.2187538146972,
                    y: 350.4375076293944
                }, {
                    x: 157.69687843322748,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }],
                name: "triangle"
            },
            {
                points: [{
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 262.8281307220458,
                    y: 175.2187538146972
                }, {
                    x: 245.30625534057606,
                    y: 210.26250457763663
                }, {
                    x: 227.78437995910636,
                    y: 245.30625534057606
                }, {
                    x: 210.26250457763663,
                    y: 280.3500061035155
                }, {
                    x: 192.7406291961669,
                    y: 315.39375686645496
                }, {
                    x: 175.2187538146972,
                    y: 350.4375076293944
                }, {
                    x: 157.69687843322748,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 403.00313377380354,
                    y: 385.4812583923338
                }, {
                    x: 385.4812583923338,
                    y: 350.4375076293944
                }, {
                    x: 367.9593830108641,
                    y: 315.39375686645496
                }, {
                    x: 350.4375076293944,
                    y: 280.3500061035155
                }, {
                    x: 332.9156322479247,
                    y: 245.30625534057606
                }, {
                    x: 315.39375686645496,
                    y: 210.26250457763663
                }, {
                    x: 297.87188148498524,
                    y: 175.2187538146972
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }],
                name: "triangle"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }],
                name: "square"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }],
                name: "square"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }],
                name: "square"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }],
                name: "square"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }],
                name: "square"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }],
                name: "square"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }],
                name: "square"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 175.2187538146972
                }, {
                    x: 140.17500305175776,
                    y: 210.26250457763663
                }, {
                    x: 140.17500305175776,
                    y: 245.30625534057606
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 140.17500305175776,
                    y: 315.39375686645496
                }, {
                    x: 140.17500305175776,
                    y: 350.4375076293944
                }, {
                    x: 140.17500305175776,
                    y: 385.4812583923338
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 140.17500305175776,
                    y: 420.52500915527327
                }, {
                    x: 175.2187538146972,
                    y: 420.52500915527327
                }, {
                    x: 210.26250457763663,
                    y: 420.52500915527327
                }, {
                    x: 245.30625534057606,
                    y: 420.52500915527327
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 315.39375686645496,
                    y: 420.52500915527327
                }, {
                    x: 350.4375076293944,
                    y: 420.52500915527327
                }, {
                    x: 385.4812583923338,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 420.52500915527327
                }, {
                    x: 420.52500915527327,
                    y: 385.4812583923338
                }, {
                    x: 420.52500915527327,
                    y: 350.4375076293944
                }, {
                    x: 420.52500915527327,
                    y: 315.39375686645496
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 420.52500915527327,
                    y: 245.30625534057606
                }, {
                    x: 420.52500915527327,
                    y: 210.26250457763663
                }, {
                    x: 420.52500915527327,
                    y: 175.2187538146972
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 420.52500915527327,
                    y: 140.17500305175776
                }, {
                    x: 385.4812583923338,
                    y: 140.17500305175776
                }, {
                    x: 350.4375076293944,
                    y: 140.17500305175776
                }, {
                    x: 315.39375686645496,
                    y: 140.17500305175776
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 245.30625534057606,
                    y: 140.17500305175776
                }, {
                    x: 210.26250457763663,
                    y: 140.17500305175776
                }, {
                    x: 175.2187538146972,
                    y: 140.17500305175776
                }, {
                    x: 140.17500305175776,
                    y: 140.17500305175776
                }],
                name: "square"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 418.3954358873965,
                    y: 304.69113993790967
                }, {
                    x: 412.07142208989444,
                    y: 328.29268073795373
                }, {
                    x: 401.74511972189896,
                    y: 350.43750762939436
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529582
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 350.4375076293944,
                    y: 401.74511972189896
                }, {
                    x: 328.2926807379538,
                    y: 412.07142208989444
                }, {
                    x: 304.69113993790967,
                    y: 418.3954358873965
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 256.0088722691214,
                    y: 418.3954358873965
                }, {
                    x: 232.4073314690773,
                    y: 412.07142208989444
                }, {
                    x: 210.26250457763666,
                    y: 401.74511972189896
                }, {
                    x: 190.2472509540728,
                    y: 387.73028825550034
                }, {
                    x: 172.9697239515307,
                    y: 370.4527612529582
                }, {
                    x: 158.95489248513206,
                    y: 350.43750762939436
                }, {
                    x: 148.62859011713658,
                    y: 328.2926807379538
                }, {
                    x: 142.30457631963455,
                    y: 304.6911399379096
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 142.30457631963455,
                    y: 256.00887226912135
                }, {
                    x: 148.62859011713655,
                    y: 232.4073314690773
                }, {
                    x: 158.9548924851321,
                    y: 210.2625045776366
                }, {
                    x: 172.96972395153068,
                    y: 190.2472509540728
                }, {
                    x: 190.24725095407277,
                    y: 172.9697239515307
                }, {
                    x: 210.26250457763658,
                    y: 158.95489248513212
                }, {
                    x: 232.40733146907718,
                    y: 148.62859011713658
                }, {
                    x: 256.00887226912135,
                    y: 142.30457631963455
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 304.6911399379096,
                    y: 142.30457631963455
                }, {
                    x: 328.2926807379537,
                    y: 148.62859011713653
                }, {
                    x: 350.4375076293944,
                    y: 158.9548924851321
                }, {
                    x: 370.4527612529582,
                    y: 172.96972395153068
                }, {
                    x: 387.73028825550034,
                    y: 190.24725095407274
                }, {
                    x: 401.7451197218989,
                    y: 210.26250457763658
                }, {
                    x: 412.07142208989444,
                    y: 232.4073314690773
                }, {
                    x: 418.39543588739645,
                    y: 256.00887226912124
                }, {
                    x: 420.52500915527327,
                    y: 280.35000610351545
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 418.3954358873965,
                    y: 256.00887226912135
                }, {
                    x: 412.07142208989444,
                    y: 232.4073314690773
                }, {
                    x: 401.74511972189896,
                    y: 210.26250457763666
                }, {
                    x: 387.73028825550034,
                    y: 190.2472509540728
                }, {
                    x: 370.4527612529582,
                    y: 172.96972395153068
                }, {
                    x: 350.4375076293944,
                    y: 158.9548924851321
                }, {
                    x: 328.2926807379538,
                    y: 148.62859011713658
                }, {
                    x: 304.69113993790967,
                    y: 142.30457631963455
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 256.0088722691214,
                    y: 142.30457631963455
                }, {
                    x: 232.4073314690773,
                    y: 148.62859011713655
                }, {
                    x: 210.26250457763666,
                    y: 158.95489248513206
                }, {
                    x: 190.2472509540728,
                    y: 172.96972395153068
                }, {
                    x: 172.9697239515307,
                    y: 190.24725095407277
                }, {
                    x: 158.95489248513206,
                    y: 210.26250457763666
                }, {
                    x: 148.62859011713658,
                    y: 232.40733146907723
                }, {
                    x: 142.30457631963455,
                    y: 256.0088722691214
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 142.30457631963455,
                    y: 304.69113993790967
                }, {
                    x: 148.62859011713655,
                    y: 328.29268073795373
                }, {
                    x: 158.9548924851321,
                    y: 350.4375076293944
                }, {
                    x: 172.96972395153068,
                    y: 370.4527612529582
                }, {
                    x: 190.24725095407277,
                    y: 387.73028825550034
                }, {
                    x: 210.26250457763658,
                    y: 401.7451197218989
                }, {
                    x: 232.40733146907718,
                    y: 412.07142208989444
                }, {
                    x: 256.00887226912135,
                    y: 418.3954358873965
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 304.6911399379096,
                    y: 418.3954358873965
                }, {
                    x: 328.2926807379537,
                    y: 412.0714220898945
                }, {
                    x: 350.4375076293944,
                    y: 401.74511972189896
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529583
                }, {
                    x: 401.7451197218989,
                    y: 350.4375076293944
                }, {
                    x: 412.07142208989444,
                    y: 328.29268073795373
                }, {
                    x: 418.39543588739645,
                    y: 304.6911399379098
                }, {
                    x: 420.52500915527327,
                    y: 280.35000610351557
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 142.30457631963455,
                    y: 256.00887226912135
                }, {
                    x: 148.62859011713655,
                    y: 232.4073314690773
                }, {
                    x: 158.95489248513206,
                    y: 210.26250457763666
                }, {
                    x: 172.96972395153068,
                    y: 190.2472509540728
                }, {
                    x: 190.2472509540728,
                    y: 172.96972395153068
                }, {
                    x: 210.2625045776366,
                    y: 158.9548924851321
                }, {
                    x: 232.40733146907726,
                    y: 148.62859011713658
                }, {
                    x: 256.00887226912135,
                    y: 142.30457631963455
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 304.6911399379096,
                    y: 142.30457631963455
                }, {
                    x: 328.29268073795373,
                    y: 148.62859011713655
                }, {
                    x: 350.43750762939436,
                    y: 158.95489248513206
                }, {
                    x: 370.4527612529582,
                    y: 172.96972395153068
                }, {
                    x: 387.73028825550034,
                    y: 190.24725095407277
                }, {
                    x: 401.74511972189896,
                    y: 210.26250457763666
                }, {
                    x: 412.07142208989444,
                    y: 232.40733146907723
                }, {
                    x: 418.3954358873965,
                    y: 256.0088722691214
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 418.3954358873965,
                    y: 304.69113993790967
                }, {
                    x: 412.07142208989444,
                    y: 328.29268073795373
                }, {
                    x: 401.74511972189896,
                    y: 350.4375076293944
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529582
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 350.4375076293944,
                    y: 401.7451197218989
                }, {
                    x: 328.29268073795384,
                    y: 412.07142208989444
                }, {
                    x: 304.69113993790967,
                    y: 418.3954358873965
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 256.0088722691214,
                    y: 418.3954358873965
                }, {
                    x: 232.40733146907735,
                    y: 412.0714220898945
                }, {
                    x: 210.2625045776366,
                    y: 401.74511972189896
                }, {
                    x: 190.2472509540728,
                    y: 387.73028825550034
                }, {
                    x: 172.9697239515307,
                    y: 370.4527612529583
                }, {
                    x: 158.95489248513212,
                    y: 350.4375076293944
                }, {
                    x: 148.62859011713655,
                    y: 328.29268073795373
                }, {
                    x: 142.30457631963458,
                    y: 304.6911399379098
                }, {
                    x: 140.17500305175776,
                    y: 280.35000610351557
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 142.30457631963455,
                    y: 304.69113993790967
                }, {
                    x: 148.62859011713655,
                    y: 328.29268073795373
                }, {
                    x: 158.95489248513206,
                    y: 350.43750762939436
                }, {
                    x: 172.96972395153068,
                    y: 370.4527612529582
                }, {
                    x: 190.2472509540728,
                    y: 387.73028825550034
                }, {
                    x: 210.2625045776366,
                    y: 401.74511972189896
                }, {
                    x: 232.40733146907726,
                    y: 412.07142208989444
                }, {
                    x: 256.00887226912135,
                    y: 418.3954358873965
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 304.6911399379096,
                    y: 418.3954358873965
                }, {
                    x: 328.29268073795373,
                    y: 412.07142208989444
                }, {
                    x: 350.43750762939436,
                    y: 401.74511972189896
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529582
                }, {
                    x: 401.74511972189896,
                    y: 350.43750762939436
                }, {
                    x: 412.07142208989444,
                    y: 328.2926807379538
                }, {
                    x: 418.3954358873965,
                    y: 304.6911399379096
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 418.3954358873965,
                    y: 256.00887226912135
                }, {
                    x: 412.07142208989444,
                    y: 232.4073314690773
                }, {
                    x: 401.74511972189896,
                    y: 210.2625045776366
                }, {
                    x: 387.73028825550034,
                    y: 190.2472509540728
                }, {
                    x: 370.4527612529582,
                    y: 172.9697239515307
                }, {
                    x: 350.4375076293944,
                    y: 158.95489248513212
                }, {
                    x: 328.29268073795384,
                    y: 148.62859011713658
                }, {
                    x: 304.69113993790967,
                    y: 142.30457631963455
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 256.0088722691214,
                    y: 142.30457631963455
                }, {
                    x: 232.40733146907735,
                    y: 148.62859011713653
                }, {
                    x: 210.2625045776366,
                    y: 158.9548924851321
                }, {
                    x: 190.2472509540728,
                    y: 172.96972395153068
                }, {
                    x: 172.9697239515307,
                    y: 190.24725095407274
                }, {
                    x: 158.95489248513212,
                    y: 210.26250457763658
                }, {
                    x: 148.62859011713655,
                    y: 232.4073314690773
                }, {
                    x: 142.30457631963458,
                    y: 256.00887226912124
                }, {
                    x: 140.17500305175776,
                    y: 280.35000610351545
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 304.6911399379096,
                    y: 418.3954358873965
                }, {
                    x: 328.29268073795373,
                    y: 412.07142208989444
                }, {
                    x: 350.43750762939436,
                    y: 401.74511972189896
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529582
                }, {
                    x: 401.74511972189896,
                    y: 350.43750762939436
                }, {
                    x: 412.07142208989444,
                    y: 328.2926807379538
                }, {
                    x: 418.3954358873965,
                    y: 304.6911399379096
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 418.3954358873965,
                    y: 256.00887226912135
                }, {
                    x: 412.07142208989444,
                    y: 232.4073314690773
                }, {
                    x: 401.74511972189896,
                    y: 210.2625045776366
                }, {
                    x: 387.73028825550034,
                    y: 190.2472509540728
                }, {
                    x: 370.4527612529582,
                    y: 172.9697239515307
                }, {
                    x: 350.4375076293944,
                    y: 158.95489248513212
                }, {
                    x: 328.29268073795384,
                    y: 148.62859011713658
                }, {
                    x: 304.69113993790967,
                    y: 142.30457631963455
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 256.0088722691214,
                    y: 142.30457631963455
                }, {
                    x: 232.40733146907735,
                    y: 148.62859011713653
                }, {
                    x: 210.2625045776366,
                    y: 158.9548924851321
                }, {
                    x: 190.2472509540728,
                    y: 172.96972395153068
                }, {
                    x: 172.9697239515307,
                    y: 190.24725095407274
                }, {
                    x: 158.95489248513212,
                    y: 210.26250457763658
                }, {
                    x: 148.62859011713655,
                    y: 232.4073314690773
                }, {
                    x: 142.30457631963458,
                    y: 256.00887226912124
                }, {
                    x: 140.17500305175776,
                    y: 280.35000610351545
                }, {
                    x: 142.30457631963455,
                    y: 304.6911399379096
                }, {
                    x: 148.62859011713658,
                    y: 328.2926807379538
                }, {
                    x: 158.954892485132,
                    y: 350.4375076293943
                }, {
                    x: 172.96972395153068,
                    y: 370.4527612529582
                }, {
                    x: 190.24725095407274,
                    y: 387.7302882555003
                }, {
                    x: 210.26250457763666,
                    y: 401.74511972189896
                }, {
                    x: 232.40733146907718,
                    y: 412.07142208989444
                }, {
                    x: 256.00887226912135,
                    y: 418.3954358873965
                }, {
                    x: 280.35000610351545,
                    y: 420.52500915527327
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 304.6911399379096,
                    y: 142.30457631963455
                }, {
                    x: 328.29268073795373,
                    y: 148.62859011713655
                }, {
                    x: 350.43750762939436,
                    y: 158.95489248513206
                }, {
                    x: 370.4527612529582,
                    y: 172.96972395153068
                }, {
                    x: 387.73028825550034,
                    y: 190.24725095407277
                }, {
                    x: 401.74511972189896,
                    y: 210.26250457763666
                }, {
                    x: 412.07142208989444,
                    y: 232.40733146907723
                }, {
                    x: 418.3954358873965,
                    y: 256.0088722691214
                }, {
                    x: 420.52500915527327,
                    y: 280.3500061035155
                }, {
                    x: 418.3954358873965,
                    y: 304.69113993790967
                }, {
                    x: 412.07142208989444,
                    y: 328.29268073795373
                }, {
                    x: 401.74511972189896,
                    y: 350.4375076293944
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529582
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 350.4375076293944,
                    y: 401.7451197218989
                }, {
                    x: 328.29268073795384,
                    y: 412.07142208989444
                }, {
                    x: 304.69113993790967,
                    y: 418.3954358873965
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 256.0088722691214,
                    y: 418.3954358873965
                }, {
                    x: 232.40733146907735,
                    y: 412.0714220898945
                }, {
                    x: 210.2625045776366,
                    y: 401.74511972189896
                }, {
                    x: 190.2472509540728,
                    y: 387.73028825550034
                }, {
                    x: 172.9697239515307,
                    y: 370.4527612529583
                }, {
                    x: 158.95489248513212,
                    y: 350.4375076293944
                }, {
                    x: 148.62859011713655,
                    y: 328.29268073795373
                }, {
                    x: 142.30457631963458,
                    y: 304.6911399379098
                }, {
                    x: 140.17500305175776,
                    y: 280.35000610351557
                }, {
                    x: 142.30457631963455,
                    y: 256.0088722691214
                }, {
                    x: 148.62859011713658,
                    y: 232.40733146907723
                }, {
                    x: 158.954892485132,
                    y: 210.26250457763672
                }, {
                    x: 172.96972395153068,
                    y: 190.2472509540728
                }, {
                    x: 190.24725095407274,
                    y: 172.96972395153074
                }, {
                    x: 210.26250457763666,
                    y: 158.95489248513206
                }, {
                    x: 232.40733146907718,
                    y: 148.6285901171366
                }, {
                    x: 256.00887226912135,
                    y: 142.30457631963455
                }, {
                    x: 280.35000610351545,
                    y: 140.17500305175776
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 256.0088722691214,
                    y: 142.30457631963455
                }, {
                    x: 232.4073314690773,
                    y: 148.62859011713655
                }, {
                    x: 210.26250457763666,
                    y: 158.95489248513206
                }, {
                    x: 190.2472509540728,
                    y: 172.96972395153068
                }, {
                    x: 172.9697239515307,
                    y: 190.24725095407277
                }, {
                    x: 158.95489248513206,
                    y: 210.26250457763666
                }, {
                    x: 148.62859011713658,
                    y: 232.40733146907723
                }, {
                    x: 142.30457631963455,
                    y: 256.0088722691214
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 142.30457631963455,
                    y: 304.69113993790967
                }, {
                    x: 148.62859011713655,
                    y: 328.29268073795373
                }, {
                    x: 158.9548924851321,
                    y: 350.4375076293944
                }, {
                    x: 172.96972395153068,
                    y: 370.4527612529582
                }, {
                    x: 190.24725095407277,
                    y: 387.73028825550034
                }, {
                    x: 210.26250457763658,
                    y: 401.7451197218989
                }, {
                    x: 232.40733146907718,
                    y: 412.07142208989444
                }, {
                    x: 256.00887226912135,
                    y: 418.3954358873965
                }, {
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 304.6911399379096,
                    y: 418.3954358873965
                }, {
                    x: 328.2926807379537,
                    y: 412.0714220898945
                }, {
                    x: 350.4375076293944,
                    y: 401.74511972189896
                }, {
                    x: 370.4527612529582,
                    y: 387.73028825550034
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529583
                }, {
                    x: 401.7451197218989,
                    y: 350.4375076293944
                }, {
                    x: 412.07142208989444,
                    y: 328.29268073795373
                }, {
                    x: 418.39543588739645,
                    y: 304.6911399379098
                }, {
                    x: 420.52500915527327,
                    y: 280.35000610351557
                }, {
                    x: 418.3954358873965,
                    y: 256.0088722691214
                }, {
                    x: 412.07142208989444,
                    y: 232.40733146907723
                }, {
                    x: 401.745119721899,
                    y: 210.26250457763672
                }, {
                    x: 387.73028825550034,
                    y: 190.2472509540728
                }, {
                    x: 370.4527612529583,
                    y: 172.96972395153074
                }, {
                    x: 350.43750762939436,
                    y: 158.95489248513206
                }, {
                    x: 328.29268073795384,
                    y: 148.6285901171366
                }, {
                    x: 304.69113993790967,
                    y: 142.30457631963455
                }, {
                    x: 280.35000610351557,
                    y: 140.17500305175776
                }],
                name: "circle"
            },
            {
                points: [{
                    x: 280.3500061035155,
                    y: 420.52500915527327
                }, {
                    x: 256.0088722691214,
                    y: 418.3954358873965
                }, {
                    x: 232.4073314690773,
                    y: 412.07142208989444
                }, {
                    x: 210.26250457763666,
                    y: 401.74511972189896
                }, {
                    x: 190.2472509540728,
                    y: 387.73028825550034
                }, {
                    x: 172.9697239515307,
                    y: 370.4527612529582
                }, {
                    x: 158.95489248513206,
                    y: 350.43750762939436
                }, {
                    x: 148.62859011713658,
                    y: 328.2926807379538
                }, {
                    x: 142.30457631963455,
                    y: 304.6911399379096
                }, {
                    x: 140.17500305175776,
                    y: 280.3500061035155
                }, {
                    x: 142.30457631963455,
                    y: 256.00887226912135
                }, {
                    x: 148.62859011713655,
                    y: 232.4073314690773
                }, {
                    x: 158.9548924851321,
                    y: 210.2625045776366
                }, {
                    x: 172.96972395153068,
                    y: 190.2472509540728
                }, {
                    x: 190.24725095407277,
                    y: 172.9697239515307
                }, {
                    x: 210.26250457763658,
                    y: 158.95489248513212
                }, {
                    x: 232.40733146907718,
                    y: 148.62859011713658
                }, {
                    x: 256.00887226912135,
                    y: 142.30457631963455
                }, {
                    x: 280.3500061035155,
                    y: 140.17500305175776
                }, {
                    x: 304.6911399379096,
                    y: 142.30457631963455
                }, {
                    x: 328.2926807379537,
                    y: 148.62859011713653
                }, {
                    x: 350.4375076293944,
                    y: 158.9548924851321
                }, {
                    x: 370.4527612529582,
                    y: 172.96972395153068
                }, {
                    x: 387.73028825550034,
                    y: 190.24725095407274
                }, {
                    x: 401.7451197218989,
                    y: 210.26250457763658
                }, {
                    x: 412.07142208989444,
                    y: 232.4073314690773
                }, {
                    x: 418.39543588739645,
                    y: 256.00887226912124
                }, {
                    x: 420.52500915527327,
                    y: 280.35000610351545
                }, {
                    x: 418.3954358873965,
                    y: 304.6911399379096
                }, {
                    x: 412.07142208989444,
                    y: 328.2926807379538
                }, {
                    x: 401.745119721899,
                    y: 350.4375076293943
                }, {
                    x: 387.73028825550034,
                    y: 370.4527612529582
                }, {
                    x: 370.4527612529583,
                    y: 387.7302882555003
                }, {
                    x: 350.43750762939436,
                    y: 401.74511972189896
                }, {
                    x: 328.29268073795384,
                    y: 412.07142208989444
                }, {
                    x: 304.69113993790967,
                    y: 418.3954358873965
                }, {
                    x: 280.35000610351557,
                    y: 420.52500915527327
                }],
                name: "circle"
            }
        ];
        this.threshold = 0.85;
        this.nbSamplePoints = 128;
        this.squareSize = 250;
        this.patterns = defaultShapes.map(shape => {
            let stroke = new Stroke(this.squareSize, this.nbSamplePoints, shape.points, shape.name);
            return stroke;
        });
    }

    spot(points) {
        const halfDiagonal = Math.hypot(this.squareSize, this.squareSize) * 0.5;
        const stroke = new Stroke(this.squareSize, this.nbSamplePoints, points);
        const result = this.patterns.reduce((acc, pattern) => {
            let distance = stroke.distanceAtBestAngle(pattern);
            let score = 1 - distance / halfDiagonal;
            if (distance < acc.bestDistance && score > this.threshold) {
                acc.bestDistance = distance;
                acc.pattern = pattern.name;
            }
            return acc;
        }, {
            pattern: null,
            bestDistance: +Infinity
        });

        return result.pattern;
    }
}

/* harmony default export */ __webpack_exports__["a"] = ShapeDetector;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resolver__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__funcs__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["init"] = init;
/* harmony export (immutable) */ __webpack_exports__["create"] = create;




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
        this.shapeDetector = new __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* default */]();
        this.resolver = __WEBPACK_IMPORTED_MODULE_1__resolver__["a" /* default */].bind(this);
        for (let key of Object.keys(__WEBPACK_IMPORTED_MODULE_2__funcs__["a" /* default */])) {
            this[key] = __WEBPACK_IMPORTED_MODULE_2__funcs__["a" /* default */][key].bind(this);
        }
    }

    init() {
        return new Promise(this.resolver);
    }
}

function init(opts) {
    const options = Object.assign({}, defaults, opts);
    const sc = new ShapeCaptchaClass(options);
    return new Promise(sc.resolver);
}

function create(opts) {
    const options = Object.assign({}, defaults, opts);
    return new ShapeCaptchaClass(options);
}


/***/ })
/******/ ]);
//# sourceMappingURL=shapecaptcha.js.map