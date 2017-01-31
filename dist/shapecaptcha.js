(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ShapeCaptcha"] = factory();
	else
		root["ShapeCaptcha"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.init = init;
	
	var _shape = __webpack_require__(1);
	
	var _shape2 = _interopRequireDefault(_shape);
	
	var _resolver = __webpack_require__(2);
	
	var _resolver2 = _interopRequireDefault(_resolver);
	
	var _funcs = __webpack_require__(3);
	
	var _funcs2 = _interopRequireDefault(_funcs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ShapeCaptcha = function ShapeCaptcha(options) {
	    _classCallCheck(this, ShapeCaptcha);
	
	    this.options = options;
	    this.shapeDetector = new _shape2.default();
	    this.resolver = _resolver2.default.bind(this);
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = Object.keys(_funcs2.default)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var key = _step.value;
	
	            this[key] = _funcs2.default[key].bind(this);
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	};
	
	function init(opts) {
	    var defaults = {
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
	    var options = Object.assign({}, defaults, opts);
	    var sc = new ShapeCaptcha(options);
	    return new Promise(sc.resolver);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Stroke = function () {
	    function Stroke(squareSize, nbSamplePoints, points, name) {
	        _classCallCheck(this, Stroke);
	
	        this.squareSize = squareSize;
	        this.nbSamplePoints = nbSamplePoints;
	        this.points = points;
	        this.name = name;
	        this.processStroke();
	    }
	
	    _createClass(Stroke, [{
	        key: "getDistance",
	        value: function getDistance(a, b) {
	            var dx = b.x - a.x;
	            var dy = b.y - a.y;
	            return Math.hypot(dx, dy);
	        }
	    }, {
	        key: "processStroke",
	        value: function processStroke() {
	            this.points = this.resample();
	            this.setCentroid();
	            this.points = this.rotateBy(-this.indicativeAngle());
	            this.points = this.scaleToSquare();
	            this.setCentroid();
	            this.points = this.translateToOrigin();
	            return this;
	        }
	    }, {
	        key: "resample",
	        value: function resample() {
	            var interval = this.strokeLength() / (this.nbSamplePoints - 1);
	            var newPoints = [this.points[0]];
	            var distance = 0;
	
	            for (var i = 1; i < this.points.length; i++) {
	                var localDistance = this.getDistance(this.points[i - 1], this.points[i]);
	
	                if (distance + localDistance >= interval) {
	                    var q = {
	                        x: this.points[i - 1].x + (interval - distance) / localDistance * (this.points[i].x - this.points[i - 1].x),
	                        y: this.points[i - 1].y + (interval - distance) / localDistance * (this.points[i].y - this.points[i - 1].y)
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
	    }, {
	        key: "rotateBy",
	        value: function rotateBy(angle) {
	            var _this = this;
	
	            var cos = Math.cos(angle);
	            var sin = Math.sin(angle);
	            return this.points.map(function (point) {
	                return {
	                    x: (point.x - _this.c.x) * cos - (point.y - _this.c.y) * sin + _this.c.x,
	                    y: (point.x - _this.c.x) * sin + (point.y - _this.c.y) * cos + _this.c.y
	                };
	            });
	        }
	    }, {
	        key: "scaleToSquare",
	        value: function scaleToSquare() {
	            var _this2 = this;
	
	            var box = {
	                minX: +Infinity,
	                maxX: -Infinity,
	                minY: +Infinity,
	                maxY: -Infinity
	            };
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var point = _step.value;
	
	                    box.minX = Math.min(box.minX, point.x);
	                    box.minY = Math.min(box.minY, point.y);
	                    box.maxX = Math.max(box.maxX, point.x);
	                    box.maxY = Math.max(box.maxY, point.y);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator.return) {
	                        _iterator.return();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	
	            box.width = box.maxX - box.minX;
	            box.height = box.maxY - box.minY;
	
	            return this.points.map(function (point) {
	                return {
	                    x: point.x * (_this2.squareSize / box.width),
	                    y: point.y * (_this2.squareSize / box.height)
	                };
	            });
	        }
	    }, {
	        key: "translateToOrigin",
	        value: function translateToOrigin() {
	            var _this3 = this;
	
	            var _origin = {
	                x: 0,
	                y: 0
	            };
	            return this.points.map(function (point) {
	                return {
	                    x: point.x + _origin.x - _this3.c.x,
	                    y: point.y + _origin.y - _this3.c.y
	                };
	            });
	        }
	    }, {
	        key: "setCentroid",
	        value: function setCentroid() {
	            this.c = this.points.reduce(function (acc, point) {
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
	    }, {
	        key: "indicativeAngle",
	        value: function indicativeAngle() {
	            return Math.atan2(this.c.y - this.points[0].y, this.c.x - this.points[0].x);
	        }
	    }, {
	        key: "strokeLength",
	        value: function strokeLength() {
	            var _this4 = this;
	
	            return this.points.reduce(function (acc, point, i, arr) {
	                if (i > 0) {
	                    acc += _this4.getDistance(arr[i - 1], point);
	                }
	                return acc;
	            }, 0);
	        }
	    }, {
	        key: "distanceAtBestAngle",
	        value: function distanceAtBestAngle(pattern) {
	            var _phi = 0.5 * (-1 + Math.sqrt(5));
	            var deg2Rad = function deg2Rad(d) {
	                return d * Math.PI / 180;
	            };
	            var _angleRange = deg2Rad(45);
	            var _anglePrecision = deg2Rad(2);
	            var a = -_angleRange;
	            var b = _angleRange;
	            var x1 = _phi * a + (1 - _phi) * b;
	            var f1 = this.distanceAtAngle(pattern, x1);
	            var x2 = (1 - _phi) * a + _phi * b;
	            var f2 = this.distanceAtAngle(pattern, x2);
	
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
	    }, {
	        key: "distanceAtAngle",
	        value: function distanceAtAngle(pattern, angle) {
	            var _this5 = this;
	
	            var strokePoints = this.rotateBy(angle);
	            var d = strokePoints.reduce(function (acc, point, i) {
	                acc += _this5.getDistance(point, pattern.points[i]);
	                return acc;
	            }, 0);
	            return d / strokePoints.length;
	        }
	    }]);
	
	    return Stroke;
	}();
	
	var ShapeDetector = function () {
	    function ShapeDetector() {
	        var _this6 = this;
	
	        _classCallCheck(this, ShapeDetector);
	
	        var defaultShapes = [{
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }, {
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
	        }];
	        this.threshold = 0.85;
	        this.nbSamplePoints = 128;
	        this.squareSize = 250;
	        this.patterns = defaultShapes.map(function (shape) {
	            var stroke = new Stroke(_this6.squareSize, _this6.nbSamplePoints, shape.points, shape.name);
	            return stroke;
	        });
	    }
	
	    _createClass(ShapeDetector, [{
	        key: "spot",
	        value: function spot(points) {
	            var _this7 = this;
	
	            var halfDiagonal = Math.hypot(this.squareSize, this.squareSize) * 0.5;
	            var stroke = new Stroke(this.squareSize, this.nbSamplePoints, points);
	            var result = this.patterns.reduce(function (acc, pattern) {
	                var distance = stroke.distanceAtBestAngle(pattern);
	                var score = 1 - distance / halfDiagonal;
	                if (distance < acc.bestDistance && score > _this7.threshold) {
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
	    }]);
	
	    return ShapeDetector;
	}();
	
	exports.default = ShapeDetector;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = resolver;
	function resolver(resolve, reject) {
	    var container = this.getContainer(this.options.container);
	    var self = this;
	    var shapes = [];
	    var canvas = document.createElement('canvas');
	    var ctx = canvas.getContext('2d');
	    var delay = this.options.timeout ? this.options.timeout * 1000 : 3600000;
	    var timer = setTimeout(function () {
	        container.removeChild(canvas);
	        canvas = null;
	        reject('time out!');
	    }, delay);
	    var shape = [];
	
	    var task = this.getRandItemSet(this.options.items);
	    var taskText = this.getText(task);
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
	        var pathData = self.getPathData(shape);
	        if (pathData.shape !== null) {
	            proccessData(pathData);
	        } else {
	            drawScene(ctx);
	        }
	        shape = [];
	    }
	
	    function proccessData(data) {
	        var len = shapes.filter(function (item) {
	            return item.shape === data.shape;
	        }).length;
	        if (task[data.shape] && task[data.shape] > len) {
	            shapes.push(data);
	        }
	        var done = self.checkResults(shapes, task);
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
	            shapes.forEach(function (item) {
	                self.drawDots(ctx, item.dots, self.options.acceptColor);
	            });
	        }
	    }
	
	    function onMouseMove(e) {
	        var dot = self.getPointerPos(e);
	        shape.push(dot);
	        self.drawDots(ctx, shape, self.options.drawColor);
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    getContainer: function getContainer(selector) {
	        if (!selector) {
	            return document.body;
	        }
	        var container = document.querySelector(selector);
	        return container ? container : document.body;
	    },
	    getSizes: function getSizes(container, ctx, text1) {
	        var width = void 0,
	            height = void 0;
	        if (container === document.body) {
	            width = window.innerWidth - 4;
	            height = window.innerHeight - 4;
	        } else {
	            var bcr = container.getBoundingClientRect();
	            width = bcr.width;
	            height = bcr.height;
	        }
	
	        var f1 = 0.05;
	        var font1 = Math.round(height * f1);
	        ctx.font = font1 + 'px sans-serif';
	        while (ctx.measureText(text1).width > width) {
	            f1 *= 0.95;
	            font1 = Math.round(height * f1);
	            ctx.font = font1 + 'px sans-serif';
	        }
	
	        var text2 = this.options.helperText;
	        var f2 = 0.03;
	        var font2 = Math.round(height * f2);
	        if (text2) {
	            ctx.font = font2 + 'px sans-serif';
	            while (ctx.measureText(text2).width > width) {
	                f2 *= 0.95;
	                font2 = Math.round(height * f2);
	                ctx.font = font2 + 'px sans-serif';
	            }
	        }
	        var text1Y = text2 ? Math.round(height * 0.07) : Math.round(height * 0.1);
	        return {
	            width: width,
	            height: height,
	            explanation: {
	                height: Math.round(height * 0.2),
	                font1: font1,
	                font2: font2,
	                text1Y: text1Y,
	                text2Y: Math.round(height * 0.15)
	            }
	        };
	    },
	    checkResults: function checkResults(shapes, task) {
	        var res = shapes.reduce(function (acc, item) {
	            acc[item.shape] -= 1;
	            return acc;
	        }, Object.assign({}, task));
	        return Object.keys(res).every(function (key) {
	            return res[key] === 0;
	        });
	    },
	    drawTaskText: function drawTaskText(ctx, text) {
	        var s = this.sizes.explanation;
	        ctx.fillStyle = this.options.textBgColor;
	        ctx.fillRect(0, 0, ctx.canvas.width, s.height);
	        ctx.textAlign = 'center';
	        ctx.fillStyle = this.options.textColor;
	        ctx.font = s.font1 + 'px sans-serif';
	        ctx.fillText(text, ctx.canvas.width / 2, s.text1Y);
	        if (this.options.helperText) {
	            ctx.font = s.font2 + 'px sans-serif';
	            ctx.fillText(this.options.helperText, ctx.canvas.width / 2, s.text2Y);
	        }
	    },
	    getRandItemSet: function getRandItemSet(n) {
	        var items = ['circle', 'triangle', 'square'];
	        var result = this.shuffle(items).reduce(function (acc, item, idx) {
	            var total = Object.keys(acc).reduce(function (total, key) {
	                total += acc[key];
	                return total;
	            }, 0);
	            var rest = n - total;
	            if (idx === 2) {
	                acc[item] = rest;
	            } else {
	                acc[item] = Math.ceil(Math.random() * rest);
	            }
	            return acc;
	        }, {});
	        return result;
	    },
	    getText: function getText(obj) {
	        var text = Object.keys(obj).reduce(function (str, key) {
	            if (obj[key]) {
	                if (obj[key] === 1) {
	                    str += ' a ' + key + ',';
	                } else {
	                    str += ' ' + obj[key] + ' ' + key + 's,';
	                }
	            }
	            return str;
	        }, 'Please draw');
	        return text.replace(/,$/, '.').replace(/,(?=[^,]*$)/, ' and');
	    },
	    shuffle: function shuffle(arr) {
	        var i = arr.length,
	            randi = void 0;
	        while (i) {
	            randi = Math.floor(Math.random() * i--);
	            arr[i] = [arr[randi], arr[randi] = arr[i]][0];
	        }
	        return arr;
	    },
	    drawDots: function drawDots(ctx, dots, color) {
	        ctx.strokeStyle = color;
	        ctx.beginPath();
	        dots.forEach(function (dot, i) {
	            if (i) {
	                ctx.lineTo(dot.x, dot.y);
	            } else {
	                ctx.moveTo(dot.x, dot.y);
	            }
	        });
	        ctx.stroke();
	    },
	    getPathData: function getPathData(dots) {
	        var shape = this.shapeDetector.spot(dots);
	        var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
	        return {
	            shape: shape,
	            dots: dots,
	            color: color
	        };
	    },
	    getPointerPos: function getPointerPos(e) {
	        var bcr = e.target.getBoundingClientRect();
	        return {
	            x: e.pageX - bcr.left,
	            y: e.pageY - bcr.top
	        };
	    }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=shapecaptcha.js.map