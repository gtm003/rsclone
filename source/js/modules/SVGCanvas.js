import { SVG } from './../vendor/svg.js';

export class SVGCanvas {
    constructor(rootElement, mainPage,type) {
      this.rootElement = rootElement;
      this.mainPage = mainPage;
      this.type = type;
      this.canvas = null;
    }
  
    init() {
      this.renderContent();
      this.drawElem('line');
    }
  
    renderContent() {
        //this.rootElement.className = 'sheet';
        this.canvas = SVG().addTo(this.rootElement).size(2000, 1000);
        //let rect = this.canvas.rect(200, 100).attr({ fill: '#38A6FF' });
    }

    drawElem(type) {
        const canvas = this.canvas;
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
            isDraw = true;
            x = mouse.getX(e);
            y = mouse.getY(e);
            console.log(`x: ${x}, y: ${y}`);
            switch(type) {
                case 'line':
                line = canvas.line(x, y, x, y).stroke('black');
                break;
                case 'circle':
                circle = canvas.circle(0).move(x, y).stroke('black').fill('none');
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
        })
    }     
}