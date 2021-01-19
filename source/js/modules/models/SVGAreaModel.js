import { } from '../../vendor/svg.js';
import { } from '../../vendor/svg.select.js';
import { } from '../../vendor/svg.resize.js';

export class Model {
  constructor(app, rootElement) {
    this.rootElement = rootElement;
    this.svgArea = null;
    this.type = 'select';
    this.app = app;
    this.selectElements = [];
    this.setSelectElements = new Set();

    this.rect = null;
    this.ellipse = null;
    this.line = null;
    this.text = null;

    this.createElem = {
      rect : (e) => this.createRect(e),
      ellipse : (e) => this.createEllipse(e),
      line : (e) => this.createLine(e),
      text : (e) => this.createText(e),
    };
  }
  init() {
    this.createSvgWorkArea('600', '400');
  }

  createSvgWorkArea(svgWidth, svgHeight) {
    this.svgArea = SVG(this.rootElement).size(svgWidth, svgHeight);
    this.svgArea.node.classList.add('svg-work-area');
  }

  createRect(e) {
    this.rect = this.svgArea.rect(0, 0).move(e.offsetX, e.offsetY).stroke('blue').fill('transparent');
  }

  createEllipse(e) {
    this.ellipse = this.svgArea.ellipse(0, 0).move(e.offsetX, e.offsetY).stroke('red').fill('transparent');
    //console.log(this.ellipse);
  }

  createLine(e) {
    this.line = this.svgArea.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY).stroke('blue');
  }

  createText(e) {
    this.text = this.svgArea.text('input text').move(e.offsetX, e.offsetY).stroke('none').fill('blue');
    this.text.addClass('inputText');
    this.text.font({
      family: 'Helvetica',
      size: 16,
      anchor: 'left',
      leading: '0em'
    })
    let textInput = '';
    document.addEventListener('keydown', (event) => {
      if (this.text.hasClass('inputText') && event.key.length < 2) {
        textInput += event.key;
        this.text.plain(`${textInput}`)
      }
    });
  }

  drawElem() {
    const _that = this;
    let isDraw = false;
    let x, y, cxLast, cyLast;
    this.svgArea.mousedown((e) => {
      if (!e.ctrlKey) {
        this.removeSelect();
        this.svgArea.each(function (i, children) {
          if (this.hasClass('inputText') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('inputText');
          }
        });
      }
      isDraw = true;
      x = e.offsetX;
      y = e.offsetY;
      switch (this.type) {
        case 'line':
        case 'ellipse':
        case 'rect':
        case 'text':
          _that.createElem[this.type](e);
        break;
        case 'select':
          _that.svgArea.each(function (i, children) {
            if (this.inside(e.offsetX, e.offsetY) && this.node.tagName !== 'g') {
              _that.setSelectElements.add(this);
              _that.selectElements = [..._that.setSelectElements];
              this.addClass('selectedElem');
              this.selectize().resize();
              _that.onMouseMoveG();
              cxLast = this.cx();
              cyLast = this.cy();
            }
          });
          _that.app.removeVisibilityPanel(_that.selectElements);
          _that.app.updateFunctionalArea(_that.selectElements);
          break;
      }
    });

    this.svgArea.mousemove((e) => {
      if (isDraw) {
        switch (this.type) {
          case 'line':
            _that.line.attr({
              x2: e.offsetX,
              y2: e.offsetY
            });
            break;
          case 'ellipse':
            _that.ellipse.attr({
              rx: Math.abs(e.offsetX - x),
              ry: Math.abs(e.offsetY - y),
            });
            break;
          case 'rect':
            let xNew, yNew;
            if (e.offsetX < x) {
              xNew = e.offsetX;
            } else if (e.offsetX >= x) {
              xNew = x;
            }
            if (e.offsetY < y) {
              yNew = e.offsetY;
            } else if (e.offsetY >= y) {
              yNew = y;
            }
            _that.rect.attr({
              width: Math.abs(e.offsetX - x),
              height: Math.abs(e.offsetY - y),
              x: xNew,
              y: yNew,
            });
            break;
          case 'text':
            _that.text.font({
              family: 'Helvetica',
              size: Math.abs(e.offsetY - y),
            })
            break;
          case 'select':
            if (!e.ctrlKey && _that.selectElements.length === 1) {
              _that.svgArea.each(function (i, children) {
                if (this.hasClass('selectedElem')) {
                  this.cx(e.offsetX - x + cxLast);
                  this.cy(e.offsetY - y + cyLast);
                  _that.app.updateFunctionalArea(_that.selectElements);
                }
              });
            }
            break;
        }
      }
    });

    this.svgArea.mouseup(function (e) {
      isDraw = false;
    });
  }

  removeLastEvent() {
    this.svgArea.mousedown(null);
    this.svgArea.mousemove(null);
  }

  removeSelect() {
    this.svgArea.each(function (i, children) {
      if (this.hasClass('selectedElem')) {
        this.removeClass('selectedElem');
        this.resize('stop').selectize(false);
      }
    })
    this.setSelectElements.clear();
    this.selectElements = [...this.setSelectElements];
  }

  fillElem(color) {
    this.svgArea.mousedown((e) => {
      this.svgArea.each(function (i, children) {
        if (this.inside(e.offsetX, e.offsetY)) this.fill(color);
      })
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
