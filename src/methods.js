export default {

    getContainer(selector) {
        if (!selector) {
            return document.body;
        }
        const container = document.querySelector(selector);
        return container ? container : document.body;
    },

    getSizes(container, ctx, text1) {
        const fontFamily = this.options.font;
        let width, height;
        if (container === document.body) {
            width = window.innerWidth - 4;
            height = window.innerHeight - 4;
        } else {
            const bcr = container.getBoundingClientRect();
            width = bcr.width;
            height = bcr.height;
        }

        let f1 = 0.05;
        let font1 = Math.round(height * f1);
        ctx.font = `${font1}px ${fontFamily}`;
        while (ctx.measureText(text1).width > width) {
            f1 *= 0.95;
            font1 = Math.round(height * f1);
            ctx.font = `${font1}px ${fontFamily}`;
        }

        const text2 = this.options.helperText;
        let f2 = 0.03;
        let font2 = Math.round(height * f2);
        if (text2) {
            ctx.font = `${font2}px ${fontFamily}`;
            while (ctx.measureText(text2).width > width) {
                f2 *= 0.95;
                font2 = Math.round(height * f2);
                ctx.font = `${font2}px ${fontFamily}`;
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
        const fontFamily = this.options.font;
        const s = this.sizes.explanation;
        if (this.options.textBgColor) {
            ctx.fillStyle = this.options.textBgColor;
            ctx.fillRect(0, 0, ctx.canvas.width, s.height);
        }
        ctx.textAlign = 'center';
        ctx.fillStyle = this.options.textColor;
        ctx.font = `${s.font1}px ${fontFamily}`;
        ctx.fillText(text, ctx.canvas.width / 2, s.text1Y);
        if (this.options.helperText) {
            ctx.font = `${s.font2}px ${fontFamily}`;
            ctx.fillText(this.options.helperText, ctx.canvas.width / 2, s.text2Y);
        }
    },

    getRandItemSet(n) {
        let items = ['circle', 'triangle', 'square'];
        let result = this.shuffle(items).reduce((acc, item, idx) => {
            let total = Object.keys(acc).reduce((sum, key) => {
                sum += acc[key];
                return sum;
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
        let shape;
        try {
            shape = this.shapeDetector.spot(dots);
        } catch (e) {
            shape = null;
        }
        return {
            shape,
            dots
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
