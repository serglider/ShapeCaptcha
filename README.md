# ShapeCaptcha

## Introduction

ShapeCaptcha is a not-a-bot test. Users are given an easy drawing task. They have to produce several geometric shapes: circles, triangles and rectangles. One stroke for each. The total number of the shapes is configurable, but how many particular shapes is chosen randomly. ShapeCaptcha expects very approximate similarity to those geometric shapes.

## How it works

ShapeCaptcha's recognition algorithm is based on [this work](http://depts.washington.edu/madlab/proj/dollar/index.html) - just refactored and simplified.

Upon initialization ShapeCaptcha launches drawing canvas and returns a Promise to your application. If the task is completed correctly, the Promise is resolved. If time is up, the Promise is rejected.

## Installation

Download the repository as [an archive](https://github.com/serglider/ShapeCaptcha/archive/master.zip) and grab the files in the `dist` folder or
```
npm install shapecaptcha
```
or
```
<script src="https://unpkg.com/shapecaptcha"></script>
```
There is no need for any external dependencies.

## Setting up

Include ShapeCaptcha's script in your application in a way that fits your needs. Create an instance of ShapeCaptcha via:
```
const sc = ShapeCaptcha.create(options);
```
Then launch it when you need it and provide callbacks for the Promise:
```
sc.start()
    .then(() => {
        // yep, that's your beloved user here
    })
    .catch(() => {
        // either your user suddenly decided to have a cup of coffee while solving this captcha or it's not a human
    });
```

For your convenience, there is a possibility to combine those steps. You can create an instance and run it right away:
```
ShapeCaptcha.start(options)
    .then(() => {
        // ...
    })
    .catch(() => {
        // ...
    });
```
## Options
Shapecaptcha takes just one argument - a configuration object. You can provide the following options:
```
const options = {
    timeout: 30, // sec, timeout before the task is rejected
    items: 5, // total number of shapes to draw
    container: '', //  css selector for the captha container. Any falsy value makes document.body to be your container.
    font: 'sans-serif', // If your font is not generic, make sure it's already loaded.
    bgColor: '#000',
    drawColor: '#FFFF00',
    acceptColor: '#00FF00',
    textColor: '#000',
    textBgColor: '#CCC',
    helperText: '', // In addition to the task, you can display a help text. For example: "Important! Draw a shape in one stroke."
    drawLineWidth: 4,
    successLineWidth: 8
};
```
Notes:
- ShapeCaptcha doesn't set width and height. It takes them from the container.
- ShapeCaptcha accepts CSS colors formats. For the background colors you can provide any falsy value as well. This makes it transparent.

You can change the options after initialization:
```
sc.setOptions("timeout", 60);
// or
sc.setOptions({timeout: 60});
```
Play with settings on the [demo page](https://serglider.github.io/ShapeCaptcha/)

## License

ShapeCaptcha is available under the MIT license. See the [LICENCE](https://github.com/serglider/ShapeCaptcha/blob/master/LICENSE) file.
