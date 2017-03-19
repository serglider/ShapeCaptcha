export default function resolver(resolve, reject) {
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
    if (!this.options.container) {
        canvas.style.marginTop = `${window.scrollY}px`;
        canvas.style.marginLeft = `${window.scrollX}px`;
    }
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        self.drawTaskText(ctx, taskText);
        if (self.options.bgColor) {
            ctx.fillStyle = self.options.bgColor;
            ctx.fillRect(0, self.sizes.explanation.height, canvas.width, canvas.height);
        }
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
