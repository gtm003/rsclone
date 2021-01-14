import {} from '../../vendor/svg.js';
import {} from '../../vendor/svg.select.js';
import {} from '../../vendor/svg.resize.js';

export class SVGCanvas {
    constructor(app, rootElement, svgWidth, svgHeight) {
        this.rootElement = rootElement;
        //this.type = 'circle';
        this.svgWidth = svgWidth;
        this.svgHeight = svgHeight;
        this.canvas = SVG(this.rootElement).size(this.svgWidth, this.svgHeight);
        this.app = app;
    }

    init() {
      //this.drawElem(this.type);
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
        let x, y, line, circle, rect;
        console.log(this.app);
        const viewApp = this.app;
        this.canvas.mousedown(function(e) {
            isDraw = true;
            x = mouse.getX(e);
            y = mouse.getY(e);
            switch(type) {
                case 'line':
                    line = canvas.line(x, y, x, y).stroke('black');
                break;
                case 'circle':
                    circle = canvas.circle(0).move(x, y).stroke('black').fill('none');
                break;
                case 'rect':
                    rect = canvas.rect(0, 0).move(x, y).stroke('black').fill('none');
                    rect.selectize().resize();
                break;
                case 'select':
                    const arrayObjectsSVG = canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY));
                    if (arrayObjectsSVG.length === 1) {
                      viewApp.functionalAreaContainer.classList.remove('visibility');
                      viewApp.updateFunctionalArea(...arrayObjectsSVG);
                      // Delete SVG Element
                      const deleteBtn = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'BUTTON')[0];
                      deleteBtn.addEventListener('click', () => {
                        for (let i = 0; i < arrayObjectsSVG.length; i += 1) {
                          arrayObjectsSVG[i].remove();
                        }
                      });
                      // Properties
                      const arrayProperties = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'LABEL');
                      for (let i = 0; i < arrayProperties.length; i += 1) {
                        arrayProperties[i].childNodes[1].addEventListener('keyup', () => {
                          const [...objSVG] = arrayObjectsSVG;
                          console.log(arrayProperties[i].childNodes[1].value);
                          if (arrayProperties[i].childNodes[1].value.length === 0) {
                            objSVG.attr(`${arrayProperties[i].textContent}`, arrayProperties[i].childNodes[1].getAttribute('placeholder'));
                          } else {
                            objSVG.attr(`${arrayProperties[i].textContent}`, arrayProperties[i].childNodes[1].value);
                          }
                        });
                      }
                    } else {
                      viewApp.functionalAreaContainer.classList.add('visibility');
                    }
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
                    case 'rect':
                        let xNew, yNew;
                        if (mouse.getX(e) < x) {
                          xNew = mouse.getX(e);
                        } else if (mouse.getX(e) >= x) {
                          xNew = x;
                        }
                        if (mouse.getY(e) < y) {
                          yNew = mouse.getY(e);
                        } else if (mouse.getY(e) >= y) {
                          yNew = y;
                        }
                        rect.attr({
                            width: Math.abs(mouse.getX(e) - x),
                            height: Math.abs(mouse.getY(e) - y),
                            x: xNew,
                            y: yNew,
                            id: 'test',
                        });
                    break;
                }
            }
        })

        this.canvas.mouseup(function(e) {
            isDraw = false;
        })
    }

    removeLastEvent() {
        this.canvas.mousedown(null);
        this.canvas.mousemove(null);
    }

    fillElem(color) {
        const canvas = this.canvas;
        canvas.each(function(i, children) {
            this.fill('#f06')
          })
        this.canvas.mousedown(function(e) {
            console.log(canvas.children());
            //canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY)).fill(color);
            
        })
    }
}
