import { SVG, extend as SVGextend, Element as SVGElement } from '../../vendor/svg.js';
import { CircleModel } from "./circle";


export class SVGCanvas {
    constructor(rootElement, controller, type) {
        this.rootElement = rootElement;
        //this.mainPage = mainPage;
        this.controller = controller;
        this.type = 'circle';
        this.canvas = SVG().addTo(this.rootElement).size('100%', '100%');
        this.elements = {
            circles: [],
            lines: [],
        }
    }
  
    init() {
      this.renderContent();
      this.drawElem(this.type);
      //this.addCircle();
    }
  
    renderContent() {
        //this.canvas = SVG().addTo(this.rootElement).size('100%', '100%');
        this.canvas.id = 'canvas_1';
        console.log('render content');
        console.log(this.canvas);
        var rect = this.canvas.rect(100, 100).attr({ fill: '#f06' });
    }
    
    drawElem(type) {
        const canvas = this.canvas;
        const control = this.controller;
        let mouse = {
            getX: function(e) {
              return e.offsetX;
            },
            getY: function(e) {
              return e.offsetY;
            }
        };

        let isDraw = false;
        let x, y, line, circle;
        this.canvas.mousedown(function(e) {
            console.log(control.type);
            console.log(type);
            isDraw = true;
            x = mouse.getX(e);
            y = mouse.getY(e);
            console.log(`x: ${x}, y: ${y}`);
            switch(type) {
                case 'line':
                line = canvas.line(x, y, x, y).stroke('black');
                break;
                case 'circle':
                circle = canvas.circle(0).move(x, y).stroke('black').fill('red');
                circle.attr('id', '50');
                circle.click(function() {
                    this.stroke({ color: '#f06', width:  '5'})
                  })
                break;
            }
        })

        this.canvas.mousemove(function(e) {
            //x2 = mouse.getX(e);
            //y2 = mouse.getY(e);
            //console.log(`x2: ${x2}, y2: ${y2}`);
            if (isDraw) {
                switch(type) {
                    case 'line':
                    line.attr({
                        x2: mouse.getX(e),
                        y2: mouse.getY(e)
                    });
                    break;
                    case 'circle':
                    circle.attr({
                        r: Math.sqrt(((mouse.getX(e) - x) ** 2) + (mouse.getY(e) - y) ** 2),
                    });
                    break;
                }
            }
        })
          
        this.canvas.mouseup(function(e) {
            isDraw = false;
            var rect = new SVG.Rect().size(200, 200).addTo(canvas);
        })
    }
    
    addCircle() {
        console.log(`add circle`);
        console.log(this.canvas);
        //const canvas = this.canvas;
        this.canvas.id = 'canvas_2';
        console.log(this.canvas);
        const canvas = this.canvas;
        var rect = new SVG.Rect().size(100, 100).addTo(canvas);
    }
}