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

    this.fillColor = 'transparent';
    this.strokeColor = 'rgba(0, 0, 0, 1)';

    this.rect = null;
    this.ellipse = null;
    this.line = null;
    this.text = null;

    this.cxLast = null;
    this.cyLast = null;
    this.x = null;
    this.y = null;

    this.onSVGAreaMouseDown = {
      select: (e) => this.selectElem(e),
      rect: (e) => this.createRect(e),
      ellipse: (e) => this.createEllipse(e),
      line: (e) => this.createLine(e),
      text: (e) => this.createText(e),
      polyline: (e) => this.createPolyline(e),
      path: (e) => this.createPath(e),
      color: (e) => this.colorElem(e),
    };

    this.onSVGAreaMouseMove = {
      select: (e) => this.moveElem(e),
      rect: (e) => this.drawRect(e),
      ellipse: (e) => this.drawEllipse(e),
      line: (e) => this.drawLine(e),
      text: (e) => this.drawText(e),
      polyline: (e) => this.drawPolyline(e),
      path: (e) => this.drawPath(e),
      //color : (e) => this.colorElem(e),
    };

    this.history = [];
    this.historyPosition = -1;
    this.unDo = this.unDo.bind(this);
    this.reDo = this.reDo.bind(this);
  }

  init() {
    this.createSvgWorkArea('600', '400');
  }

  createSvgWorkArea(svgWidth, svgHeight) {
    this.svgArea = SVG(this.rootElement).size(svgWidth, svgHeight);
    this.svgArea.node.classList.add('svg-work-area');
  }

  selectElem(e) {
    const _that = this;
    this.svgArea.each(function (i, children) {
      if (this.inside(e.offsetX, e.offsetY) && this.node.tagName !== 'g') {
        _that.setSelectElements.add(this);
        _that.selectElements = [..._that.setSelectElements];
        this.addClass('selectedElem');
        this.selectize().resize();
        _that.onMouseMoveG();
        _that.cxLast = this.cx();
        _that.cyLast = this.cy();
      }
    });
    _that.app.removeVisibilityPanel(_that.selectElements);
    _that.app.updateFunctionalArea(_that.selectElements);
  }

  createRect(e) {
    this.rect = this.svgArea.rect(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createEllipse(e) {
    this.ellipse = this.svgArea.ellipse(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
    //console.log(this.ellipse);
  }

  createLine(e) {
    this.line = this.svgArea.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createText(e) {
    this.text = this.svgArea.text('input text').move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
    this.text.addClass('inputText');
    this.text.font({
      family: 'Helvetica',
      size: 16,
      anchor: 'left',
      leading: '0em',
    });
    let textInput = '';
    document.addEventListener('keydown', (event) => {
      if (this.text.hasClass('inputText') && event.key.length < 2) {
        textInput += event.key;
        this.text.plain(`${textInput}`);
      }
    });
  }

  moveElem(e) {
    const _that = this;
    if (!e.ctrlKey && _that.selectElements.length === 1) {
      _that.svgArea.each(function (i, children) {
        if (this.hasClass('selectedElem')) {
          this.cx(e.offsetX - _that.x + _that.cxLast);
          this.cy(e.offsetY - _that.y + _that.cyLast);
          _that.app.updateFunctionalArea(_that.selectElements);
          // _that.saveHistory();
        }
      });
    }
  }

  drawRect(e) {
    let xNew; let yNew;
    if (e.offsetX < this.x) {
      xNew = e.offsetX;
    } else if (e.offsetX >= this.x) {
      xNew = this.x;
    }
    if (e.offsetY < this.y) {
      yNew = e.offsetY;
    } else if (e.offsetY >= this.y) {
      yNew = this.y;
    }
    this.rect.attr({
      width: Math.abs(e.offsetX - this.x),
      height: Math.abs(e.offsetY - this.y),
      x: xNew,
      y: yNew,
    });
  }

  drawEllipse(e) {
    this.ellipse.attr({
      rx: Math.abs(e.offsetX - this.x),
      ry: Math.abs(e.offsetY - this.y),
    });
  }

  drawLine(e) {
    this.line.attr({
      x2: e.offsetX,
      y2: e.offsetY,
    });
  }

  drawText(e) {
    this.text.font({
      family: 'Helvetica',
      size: Math.abs(e.offsetY - this.y),
    });
  }

  onSVGAreaEvent() {
    const _that = this;
    let isDraw = false;
    this.svgArea.mousedown((e) => {
      if (!e.ctrlKey) {
        this.removeSelect();
        this.app.removeVisibilityPanel(this.selectElements);
        this.svgArea.each(function (i, children) {
          if (this.hasClass('inputText') && !this.inside(e.offsetX, e.offsetY)) {
            this.removeClass('inputText');
          }
        });
      }
      isDraw = true;
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.onSVGAreaMouseDown[this.type](e);
    });
    this.svgArea.mousemove((e) => {
      if (isDraw) {
        this.onSVGAreaMouseMove[this.type](e);
      }
    });
    this.svgArea.mouseup(function (e) {
      isDraw = false;
      _that.saveHistory();
    });
  }

  removeLastEvent() {
    this.svgArea.mousedown(null);
    this.svgArea.mousemove(null);
    this.svgArea.mouseup(null);
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
    const _that = this;
    this.svgArea.mousedown((e) => {
      this.svgArea.each(function (i, children) {
        if (this.inside(e.offsetX, e.offsetY)) {
          this.fill(color);
          _that.saveHistory();
        }
      });
    });
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

  saveHistory() {
    this.history = this.history.slice(0, this.historyPosition + 1);
    this.history.push(this.rootElement.childNodes[0].innerHTML);
    this.incrementPosition();
  }

  incrementPosition() {
    this.historyPosition += 1;
  }

  decrementPosition() {
    this.historyPosition -= 1;
  }

  unDo() {
    if (this.historyPosition < 0) return;
    this.decrementPosition();
    this.rootElement.innerHTML = '';
    this.init();
    this.svgArea.svg(this.history[this.historyPosition]);
  }

  reDo() {
    if (this.historyPosition > this.history.length - 2) return;
    this.incrementPosition();
    this.rootElement.innerHTML = '';
    this.init();
    this.svgArea.svg(this.history[this.historyPosition]);
  }
}
