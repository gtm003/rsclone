import { } from '../../vendor/svg.js';
import { } from '../../vendor/svg.select.js';
import { } from '../../vendor/svg.resize.js';

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
      getX: function (e) {
        return e.offsetX;
      },
      getY: function (e) {
        return e.offsetY;
      }
    };
    let selectElements = [];
    let setSelectElements = new Set();
    let isDraw = false;
    let pressKey = '';
    let x, y, cxLast, cyLast, line, circle, rect, ellipse, text;
    document.addEventListener('keydown', function (event) {
      pressKey = event.key;
      //console.log(pressKey);
    });
    document.addEventListener('keyup', function (event) {
      pressKey = 'null';
      //console.log(pressKey);
    });

    const viewApp = this.app;
    this.canvas.mousedown((e) => {
      if (pressKey !== 'Control') {
        setSelectElements.clear();
        selectElements = [...setSelectElements];
        this.removeSelect();
        canvas.each(function (i, children) {
          /*
          if (this.hasClass('selectedElem') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('selectedElem');
            this.resize('stop').selectize(false);
            selectElements = [];
          }*/
          if (this.hasClass('inputText') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('inputText');
          }
        });
      }

      isDraw = true;
      x = mouse.getX(e);
      y = mouse.getY(e);
      viewApp.removeFunctionalAreaDataElements();
      switch (type) {
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
          text.addClass('inputText');
          text.font({
            family: 'Helvetica',
            size: 16,
            anchor: 'left',
            leading: '0em'
          })
          let textInput = '';
          document.addEventListener('keydown', function (event) {
            if (text.hasClass('inputText') && event.key.length < 2) {
              textInput += event.key;
              text.plain(`${textInput}`)
            }
          });
          break;
        case 'select':
          if (pressKey !== 'Control') {
            setSelectElements.clear();
            //this.removeSelect();
          }
          canvas.each(function (i, children) {
            if (this.inside(e.offsetX, e.offsetY) && this.node.tagName !== 'g') {
              /*
              if (this.hasClass('selectedElem')) {
                selectElements = [];
                selectElements.push(this);
              } else {
                selectElements.push(this);
              }*/
              this.addClass('selectedElem');
              this.selectize().resize();
              setSelectElements.add(this);
              selectElements = [...setSelectElements];         // Возможно и дальше использовать множество? И массив тогда лишняя переменная.

              const arrayG = [...document.querySelector('#SvgjsSvg1001').childNodes].filter((value) => value.tagName === 'g');
              const arrayElementG = [...arrayG[0].childNodes];
              arrayElementG.shift();
              for (let i = 0; i < arrayElementG.length; i += 1) {
                arrayElementG[i].addEventListener('mousemove', () => {
                  if (selectElements.length === 1) {
                    viewApp.updateFunctionalArea(selectElements[0], true, false);
                  }
                });
              }
              cxLast = this.cx();
              cyLast = this.cy();
            }
          });

          viewApp.functionalAreaContainer.classList.remove('visibility');
          if (selectElements.length === 1) {
            viewApp.updateFunctionalArea(selectElements[0], true, true);
            const arraySelect = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'SELECT');
            if (arraySelect.length !== 0) {
              viewApp.createEventForSelect(arraySelect[0], selectElements[0], 'family');
            }

            const arrayProperties = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'LABEL');
            for (let i = 0; i < arrayProperties.length; i += 1) {
              arrayProperties[i].childNodes[1].addEventListener('keyup', () => {
                const objSVG = selectElements[0];
                if (arrayProperties[i].childNodes[1].value.length === 0) {
                  switch (arrayProperties[i].textContent) {
                    case 'angle':
                      objSVG.rotate(`${arrayProperties[i].childNodes[1].value}`);
                      break;
                    case 'blur':

                      break;
                    case 'size':
                      objSVG.attr('font-size', arrayProperties[i].childNodes[1].getAttribute('placeholder'));
                      break;
                    default:
                      objSVG.attr(`${arrayProperties[i].textContent}`, arrayProperties[i].childNodes[1].getAttribute('placeholder'));
                      break;
                  }
                } else {
                  switch (arrayProperties[i].textContent) {
                    case 'angle':
                      objSVG.rotate(`${arrayProperties[i].childNodes[1].value}`);
                      break;
                    case 'blur':

                      break;
                    case 'size':
                      objSVG.attr('font-size', arrayProperties[i].childNodes[1].value);
                      break;
                    default:
                      objSVG.attr(`${arrayProperties[i].textContent}`, arrayProperties[i].childNodes[1].value);
                      break;
                  }
                }
              });
            }
          } else if (selectElements.length > 1) {
            viewApp.updateFunctionalArea(selectElements, false, true);
            const arrayAlignment = viewApp.functionalAreaContainer.childNodes;
            for (let i = 0; i < arrayAlignment.length; i += 1) {
              arrayAlignment[i].addEventListener('click', () => {
                switch (i) {
                  case 2:
                    selectElements.forEach((item) => item.x(0));
                    break;
                  case 3:
                    selectElements.forEach((item) => {
                      if (item.type === 'text') {
                        item.x(canvas.width() - item.length());
                      } else {
                        item.x(canvas.width() - item.width());
                      }
                    });
                    break;
                  case 4:
                    selectElements.forEach((item) => item.y(0));
                    break;
                  case 5:
                    selectElements.forEach((item) => {
                      if (item.type === 'text') {
                        item.y(canvas.height() - 1.11 * item.attr('size'));
                      } else {
                        item.y(canvas.height() - item.height());
                      }
                    });
                    break;
                  case 6:
                    selectElements.forEach((item) => item.cx(canvas.width() / 2));
                    break;
                  case 7:
                    selectElements.forEach((item) => item.cy(canvas.height() / 2));
                    break;
                }
              });
            }
          } else {
            viewApp.removeFunctionalAreaDataElements();
          }
          // Delete SVG Element
          const deleteBtn = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'BUTTON')[0];
          if (typeof deleteBtn !== 'undefined') {
            deleteBtn.addEventListener('click', () => {
              for (let i = 0; i < selectElements.length; i += 1) {
                selectElements[i].resize('stop').selectize(false);
                selectElements[i].remove();
              }
              selectElements = [];
              viewApp.removeFunctionalAreaDataElements();
            });
          }
          break;
      }
    });

    this.canvas.mousemove(function (e) {
      if (isDraw) {
        switch (type) {
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
            if (pressKey !== 'Control' && selectElements.length === 1) {
              //console.log(selectElements);
              canvas.each(function (i, children) {
                if (this.hasClass('selectedElem')) {
                  this.cx(mouse.getX(e) - x + cxLast);
                  this.cy(mouse.getY(e) - y + cyLast);
                  if (selectElements.length === 1) {
                    viewApp.updateFunctionalArea(this, true, false);
                  }
                }
              });
            }
            break;
        }
      }
    });

    this.canvas.mouseup(function (e) {
      isDraw = false;
      //console.log('reload block')
    });
  }

  removeLastEvent() {
    this.canvas.mousedown(null);
    this.canvas.mousemove(null);
  }

  removeSelect() {
    this.canvas.each(function (i, children) {
      if (this.hasClass('selectedElem')) {
        this.removeClass('selectedElem');
        this.resize('stop').selectize(false);
      }
    })
  }

  fillElem(color) {
    const canvas = this.canvas;
    this.canvas.mousedown(function (e) {
      canvas.each(function (i, children) {
        if (this.inside(e.offsetX, e.offsetY)) this.fill(color);
      })
      //canvas.children().filter((item) => item.inside(e.offsetX, e.offsetY)).fill(color);
    })
  }
}
