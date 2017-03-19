/*global ShapeCaptcha dat FontFaceObserver*/
const fontFamily = 'Indie Flower';
const fo = new FontFaceObserver(fontFamily);

fo.load().then(app, function () {
  console.log(`Font ${fontFamily} is not available`);
});

function app() {
    const $ = id => document.getElementById(id);
    const guiContainer = $('guiContainer');
    const trigger = $('trigger');
    const submitButton = $('submitButton');
    const areYou = $('areYou');
    const options = {
        timeout: 30, // sec
        items: 5,
        container: '',
        font: 'Indie Flower',
        bgColor: '#193441',
        drawColor: '#91AA9D',
        acceptColor: '#3E606F',
        textColor: '#3E606F',
        textBgColor: '#193441',
        helperText: '',
        drawLineWidth: 8,
        successLineWidth: 8
    };
    const gui = new dat.GUI({ autoPlace: false });
    guiContainer.appendChild(gui.domElement);
    gui.add(options, 'container', { page: '', foobar:'#foobar' } );
    gui.add(options, 'timeout', 0, 60).step(1);
    gui.add(options, 'items', 1, 10).step(1);
    gui.add(options, 'helperText');
    gui.addColor(options, 'bgColor');
    gui.addColor(options, 'drawColor');
    gui.addColor(options, 'acceptColor');
    gui.addColor(options, 'textColor');
    gui.addColor(options, 'textBgColor');
    gui.add(options, 'drawLineWidth', 2, 16).step(1);
    gui.add(options, 'successLineWidth', 2, 16).step(1);

    trigger.addEventListener('change', () => {
        ShapeCaptcha.start(options).then(() => {
                submitButton.disabled = false;
                trigger.checked = true;
                trigger.parentNode.style.color = 'green';
                trigger.parentNode.style.fontWeight = 'bold';
                areYou.style.display = 'none';
            })
            .catch(() => {
                console.log('foooo');
                trigger.checked = false;
                areYou.style.display = 'inline';
            });
    });
}
