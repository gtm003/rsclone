import { SVGCanvas } from "../models/SVGCanvas";

export class Controller {
    constructor(appView, placeForSVGCanvas) {
        this.fill = 'none';
        this.stroke = 'black';
        this.activToolsLeftBtn = 'select';
        this.select = null;
        this.mouse = null;
        // this.app = app;
        // this.placeForSVGCanvas = placeForSVGCanvas;
        this.canvas = new SVGCanvas(appView, placeForSVGCanvas);
    }

    init() {
        this.getActivToolsLeftBtn();
        this.getFill();
        // this.canvas.init();
    }
  
    getActivToolsLeftBtn() {
        const toolsLeft = document.querySelector('.tools-left');
        toolsLeft.addEventListener('click', (event) => {
            let target = event.target;
            while (target !== toolsLeft) {
                if (target.nodeName === 'BUTTON') {
                    this.activToolsLeftBtn = target.id;
                    console.log(this.activToolsLeftBtn);
                    this.canvas.removeLastEvent();
                    this.canvas.drawElem(target.id);
                    return;
                }
                target = target.parentNode;
            }
        })
    }

    getFill() {
        const toolsBottom = document.querySelector('.tools-bottom');
        toolsBottom.addEventListener('click', (event) => {
            let target = event.target;
            while (target !== toolsBottom) {
                if (target.nodeName === 'BUTTON') {
                    this.fill = target.id; 
                    console.log(this.fill);
                    //this.canvas.removeLastEvent();
                    this.canvas.fillElem(target.id);
                    return;
                }
                target = target.parentNode;
            }
        })
    }
}