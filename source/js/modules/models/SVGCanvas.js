import { SVG, extend as SVGextend, Element as SVGElement } from '../../vendor/svg.js';

export class SVGCanvas {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.type = 'circle';
        this.canvas = SVG().addTo(this.rootElement).size('100%', '100%');
    }
  
    init() {
      this.drawElem(this.type);
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