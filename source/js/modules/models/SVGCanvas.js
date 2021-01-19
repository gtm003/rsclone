import { } from '../../vendor/svg.js';
import { } from '../../vendor/svg.select.js';
import { } from '../../vendor/svg.resize.js';

export class SVGCanvas {
  constructor(app, rootElement) {
    this.rootElement = rootElement;
    this.canvas = null;
    this.app = app;
    this.selectElements = [];
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
    const _that = this;
    let mouse = {
      getX: function (e) {
        return e.offsetX;
      },
      getY: function (e) {
        return e.offsetY;
      }
    };
    //let selectElements = [];
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
        _that.selectElements = [...setSelectElements];
        this.removeSelect();
        viewApp.removeVisibilityPanel(_that.selectElements);
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

              setSelectElements.add(this);
              _that.selectElements = [...setSelectElements];         // Возможно и дальше использовать множество? И массив тогда лишняя переменная.
              this.addClass('selectedElem');
              this.selectize().resize();
              _that.onMouseMoveG();
              cxLast = this.cx();
              cyLast = this.cy();
            }
          });
          viewApp.removeVisibilityPanel(_that.selectElements);
          viewApp.updateFunctionalArea(_that.selectElements);
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
            if (pressKey !== 'Control' && _that.selectElements.length === 1) {
              canvas.each(function (i, children) {
                if (this.hasClass('selectedElem')) {
                  this.cx(mouse.getX(e) - x + cxLast);
                  this.cy(mouse.getY(e) - y + cyLast);
                  viewApp.updateFunctionalArea(_that.selectElements);
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

  onMouseMoveG() {
    const arrayG = [...[...this.app.sheet.childNodes][0].childNodes].filter((value) => value.tagName === 'g');
    const arrayElementG = [...arrayG[0].childNodes];
    arrayElementG.shift();
    for (let i = 0; i < arrayElementG.length; i += 1) {
      arrayElementG[i].addEventListener('mousemove', () => {
        if (this.selectElements.length === 1) {
          this.app.updateFunctionalArea(this.selectElements);
        }
      });
    }
  }
}
