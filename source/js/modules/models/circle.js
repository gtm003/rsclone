import { SVG, extend as SVGextend, Element as SVGElement } from '../../vendor/svg.js';

export class CircleModel {
    constructor(id, r = '100', fill = 'red', stroke = 'black', cx = '400', cy = '200') {
        this.id = id;
        this.r = r;
        this.fill = fill;
        this.stroke = stroke;
        this.cx = cx;
        this.cy =cy;
    }

    addCircle(id, r, fill, stroke, cx, cy) {
        console.log('add circle model');
        var canvas = document.querySelectorAll('svg');
        console.log(canvas);
        //var draw = SVG().addTo('body').size(300, 300);
        //console.log(draw);
        //var rect = canvas.rect(100, 100).attr({ fill: '#f06' })
    }
}