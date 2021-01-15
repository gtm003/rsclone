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
        let selectElements = [];
        let isDraw = false;
        let x, y, cxLast, cyLast, line, circle, rect, ellipse, text;
        //console.log(this.app);
        const viewApp = this.app;
        this.canvas.mousedown(function(e) {
            console.log(e.which);
            if (e.which === 3) ;
            canvas.each(function(i, children) {
                if (this.hasClass('selectedElem')) {
                    this.removeClass('selectedElem')
                    this.resize('stop').selectize(false);
                } 
            })
            isDraw = true;
            x = mouse.getX(e);
            y = mouse.getY(e);
            switch(type) {
                case 'line':
                    line = canvas.line(x, y, x, y).stroke('black');
                break;
                case 'circle':
                    circle = canvas.circle(0).move(x, y).stroke('black').fill('transparent');
                break;
                case 'ellipse':
                    ellipse = canvas.ellipse(0, 0).move(x, y).stroke('black').fill('transparent');
                break;
                case 'rect':
                    rect = canvas.rect(0, 0).move(x, y).stroke('black').fill('transparent');
                break;
                case 'text':
                    text = canvas.text('input text').move(x, y).stroke('none').fill('black');
                    text.addClass('selectedElem');
                    text.font({
                        family: 'Helvetica',
                        size: 16,
                        anchor:   'left',
                        leading:  '0em'
                      })
                    let textInput = '';
                    document.addEventListener('keydown', function(event) {
                        if (text.hasClass('selectedElem')) {
                            textInput += event.key;
                            console.log(textInput);
                            text.plain(`${textInput}`)
                        }
                    });
                break;
                case 'select':
                    canvas.each(function(i, children) {
                        if (this.inside(e.offsetX, e.offsetY)) {
                            //selectElements.push(this);
                            this.addClass('selectedElem');
                            this.selectize().resize();
                            console.log(this.attr());   // Attributes selected elem
                            //console.log(this.cx());
                            
                            cxLast = this.cx();
                            cyLast = this.cy();

                        } 
                        //if (this.id === 'selectedElem') this.fill('red');
                    })
                    //console.log(selectElements);
                    //console.log(selectElements[0].attr());
                    const arrayObjectsSVG = canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY));
                    if (arrayObjectsSVG.length === 1) {
                      viewApp.functionalAreaContainer.classList.remove('visibility');
                      viewApp.updateFunctionalArea(...arrayObjectsSVG);
                    } else {
                      viewApp.functionalAreaContainer.classList.add('visibility');
                    }
                break;
            }
        })

        this.canvas.mousemove(function(e) {
            if (e.metaKey || e.ctrlKey) console.log('ctrl');
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
                    case 'ellipse':
                        ellipse.attr({
                            rx: Math.abs(mouse.getX(e) - x),
                            ry: Math.abs(mouse.getY(e) - y),
                            id: 'test',
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
                    case 'text':
                        text.font({
                            family: 'Helvetica',
                            size: Math.abs(mouse.getY(e) - y),
                            //anchor:   'middle',
                            //leading:  '1.5em'
                          })
                    break;
                    case 'select':
                        canvas.each(function(i, children) {
                            //let cxLast = this.cx();
                            //let cyLast = this.cy();
                            //console.log(`cxLast: ${cxLast}`)
                            if (this.hasClass('selectedElem')) {
                                this.cx(mouse.getX(e) - x + cxLast);
                                this.cy(mouse.getY(e) - y + cyLast);
                            } 
                        })
                        
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
        this.canvas.mousedown(function(e) {
            canvas.each(function(i, children) {
                if (this.inside(e.offsetX, e.offsetY)) this.fill(color);
            })
            //canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY)).fill(color);
        })
    }
}
