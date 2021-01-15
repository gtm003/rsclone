import {} from '../../vendor/svg.js';
import {} from '../../vendor/svg.select.js';
import {} from '../../vendor/svg.resize.js';

export class SVGCanvas {
    constructor(app, rootElement) {
        this.rootElement = rootElement;
        this.canvas = null;
        this.app = app;
    }

    init() {
      this.createSvgWorkArea('600', '400');
    }

    createSvgWorkArea(svgWidth, svgHeight) {
      this.canvas = SVG(this.rootElement).size(svgWidth, svgHeight);
      this.canvas.node.classList.add('svg-work-area');
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
        // console.log(this.canvas.attr().width)
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
                            selectElements.push(this);
                            console.log(selectElements);
                            this.addClass('selectedElem');
                            this.selectize().resize();
                            viewApp.functionalAreaContainer.classList.remove('visibility');
                            if (selectElements.length === 1) {
                              viewApp.updateFunctionalArea(selectElements[0], true);
                              const arrayProperties = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'LABEL');
                              for (let i = 0; i < arrayProperties.length; i += 1) {
                                arrayProperties[i].childNodes[1].addEventListener('keyup', () => {
                                  const objSVG = selectElements[0];
                                  if (arrayProperties[i].childNodes[1].value.length === 0) {
                                    switch (i) {
                                      case 2:
                                        objSVG.rotate(`${arrayProperties[i].childNodes[1].value}`);
                                        break;
                                      case 3:


                                      default:
                                        objSVG.attr(`${arrayProperties[i].textContent}`, arrayProperties[i].childNodes[1].getAttribute('placeholder'));
                                        break
                                    }
                                  } else {
                                    switch (i) {
                                      case 2:
                                        objSVG.rotate(`${arrayProperties[i].childNodes[1].value}`);
                                        break;
                                      case 3:


                                      default:
                                        objSVG.attr(`${arrayProperties[i].textContent}`, arrayProperties[i].childNodes[1].value);
                                        break
                                    }
                                  }
                                });
                              }
                            } else {
                              viewApp.updateFunctionalArea(selectElements, false);
                              const arrayAlignment = viewApp.functionalAreaContainer.childNodes;
                              for (let i = 0; i < arrayAlignment.length; i += 1) {
                                arrayAlignment[i].addEventListener('click', () => {
                                  for (let j = 0; j < selectElements.length; j += 1) {
                                    const x = selectElements[j].attr().x;
                                    const y = selectElements[j].attr().y;
                                    switch (i) {
                                      case 2:
                                        selectElements[j].attr('x', 0);
                                        break;
                                      case 3:
                                        selectElements[j].attr('x', canvas.attr().width - selectElements[j].attr().width);
                                        break;
                                      case 4:
                                        selectElements[j].attr('y', 0);
                                        break;
                                      case 5:
                                        selectElements[j].attr('y', canvas.attr().height - selectElements[j].attr().height);
                                        break;
                                      case 6:
                                        selectElements[j].attr('x', (canvas.attr().width - selectElements[j].attr().width) / 2);
                                        break;
                                      case 7:
                                        selectElements[j].attr('y', (canvas.attr().height - selectElements[j].attr().height) / 2);
                                        break;
                                    }
                                  }
                                });
                              }
                            }
                            // Delete SVG Element
                            const deleteBtn = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'BUTTON')[0];
                            deleteBtn.addEventListener('click', () => {
                              const arrayG = [...document.querySelector('#SvgjsSvg1001').childNodes].filter((value) => value.tagName === 'g');
                              for (let i = 0; i < selectElements.length; i += 1) {
                                selectElements[i].remove();
                                arrayG[i].remove();
                              }
                              viewApp.removeFunctionalAreaDataElements();
                            });
                            cxLast = this.cx();
                            cyLast = this.cy();
                        } else {
                          viewApp.functionalAreaContainer.classList.add('visibility');
                          selectElements.length = 0;
                          console.log('Я тут');
                        }
                    });
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
                                viewApp.updateFunctionalArea(this, true);
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
