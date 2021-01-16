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
    this.canvas.mousedown(function (e) {
      if (pressKey !== 'Control') {
        canvas.each(function (i, children) {
          if (this.hasClass('selectedElem') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('selectedElem');
            this.resize('stop').selectize(false);
            selectElements = [];
            console.log(this.node.tagName);
          }
          if (this.hasClass('inputText') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('inputText');
          }
        });
      }

      isDraw = true;
      x = mouse.getX(e);
      y = mouse.getY(e);
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
            if (text.hasClass('inputText')) {
              textInput += event.key;
              text.plain(`${textInput}`)
            }
          });
          break;
        case 'select':
          canvas.each(function (i, children) {
            if (this.inside(e.offsetX, e.offsetY) && !this.hasClass('selectedElem')) {
              selectElements.push(this);
              this.addClass('selectedElem');
              this.selectize().resize();
              const arrayG = [...document.querySelector('#SvgjsSvg1001').childNodes].filter((value) => value.tagName === 'g');
              const arrayElementG = [...arrayG[0].childNodes];
              arrayElementG.shift();
              for (let i = 0; i < arrayElementG.length; i += 1) {
                arrayElementG[i].addEventListener('mousemove', () => {
                  viewApp.updateFunctionalArea(selectElements[0], true, false);
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

            // Delete SVG Element
            const deleteBtn = [...viewApp.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'BUTTON')[0];
            deleteBtn.addEventListener('click', () => {
              for (let i = 0; i < selectElements.length; i += 1) {
                selectElements[i].resize('stop').selectize(false);
                selectElements[i].remove();
                selectElements = [];
              }
              viewApp.removeFunctionalAreaDataElements();
            });
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
                  console.log(arrayProperties[i].childNodes[1].value);
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
          } else {
            viewApp.removeFunctionalAreaDataElements();
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
            if (pressKey !== 'Control') {
              canvas.each(function (i, children) {
                if (this.hasClass('selectedElem')) {
                  this.cx(mouse.getX(e) - x + cxLast);
                  this.cy(mouse.getY(e) - y + cyLast);
                  viewApp.updateFunctionalArea(this, true, false);
                }
              })
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
