import { SVGCanvas } from "../models/SVGCanvas";

export class Controller {
    constructor() {
        this.canvas = new SVGCanvas(document.querySelector('.sheet'));
        this.fill = 'none';
        this.stroke = 'black';
        this.activToolsLeftBtn = 'select';
        this.select = null;
        this.mouse = null;
    }

    init() {
        this.getActivToolsLeftBtn();
        this.getFill();
        this.canvas.init();
    }
  
    getActivToolsLeftBtn() {
        const toolsLeft = document.querySelector('.toolsLeft_container');
        toolsLeft.addEventListener('click', (event) => {
            let target = event.target;
            while (target !== toolsLeft) {
                if (target.nodeName === 'BUTTON') {
                    this.activToolsLeftBtn = target.id;
                    console.log(this.activToolsLeftBtn);
                    this.canvas.removeLastEvent();
                    this.canvas.drawElem(target.id);
                    //this.canvas.getData();
                    return;
                }
                target = target.parentNode;
            }
        })
    }

    getFill() {
        const toolsBottom = document.querySelector('.toolsBottom_container');
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