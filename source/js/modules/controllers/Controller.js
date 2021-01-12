import { CircleModel } from "../models/circle";
import { SVGCanvas } from "../models/SVGCanvas";

export class Controller {
    constructor() {
        this.canvas = new SVGCanvas();
        this.fill = 'none';
        this.stroke = 'black';
        this.activToolsLeftBtn = 'select';
        this.select = null;
        this.mouse = null;
    }

    init() {
        this.getActivToolsLeftBtn();
        this.getMouseEvent();
    }
  
    getActivToolsLeftBtn() {
        const toolsLeft = document.querySelector('.toolsLeft_container');
        console.log(toolsLeft);
        toolsLeft.addEventListener('click', (event) => {
            let target = event.target;
            while (target != this) {
                if (target.nodeName == 'BUTTON') {
                    this.activToolsLeftBtn = target.id;
                    console.log(this.canvas.canvas);
                    //let rect2 = this.canvas.canvas.rect(200, 100).attr({ fill: '#38A6FF' });
                    this.canvas.type = target.id;
                    this.canvas.addCircle();
                    //const NewCircle = new CircleModel(this.activToolsLeftBtn);
                    //console.log(NewCircle.addCircle());
                    console.log(this.canvas.type);
                    return;
                }
                target = target.parentNode;
            }
        })
    }

    getMouseEvent() {
        const canvas = document.querySelector('SVG');
        console.log(canvas);
        this.mouse = {
            getX: function(e) {
              return e.offsetX;
            },
            getY: function(e) {
              return e.offsetY;
            }
        };

        //console.log(this.mouse.getX());
    }
}