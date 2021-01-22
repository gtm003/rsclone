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

    this.elem = null;
    //this.rect = null;
    //this.ellipse = null;
    //this.line = null;
    //this.text = null;
    //this.pencil = null;
    //this.pencilNodeCount = 0;
    this.path = null;
    this.pathNodeCount = 0;
    this.segmentPathStraight = false;

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
      pencil : (e) => this.createPencilTrace(e),
      path: (e) => this.drawPath(e),
      fill: (e) => this.changeFillColor(e),
      stroke: (e) => this.changeStrokeColor(e),
    };

    this.onSVGAreaMouseMove = {
      select: (e) => this.moveElem(e),
      rect: (e) => this.drawRect(e),
      ellipse: (e) => this.drawEllipse(e),
      line: (e) => this.drawLine(e),
      text: (e) => this.sizeText(e),
      pencil: (e) => this.drawPencilTrace(e),
      path: (e) => this.addPathNewNode(e),
      //fill : (e) => this.colorElem(e),
    };

    this.history = [];
    this.historyPosition = 0;
    this.isFirstSaveHistory = false;
    this.wasMoved = false;
  }

  init() {
    this.createNewSvgWorkArea();
    this.loadLastCondition();
    this.isFirstSaveHistory = true;
    this.saveHistory();
  }

  createNewSvgWorkArea() {
    this.svgArea = SVG(this.rootElement).size('600', '400');
    this.svgArea.node.classList.add('svg-work-area');
  }

  resizeSvgArea(svgWidth, svgHeight) {
    this.svgArea.size(svgWidth, svgHeight);
  }

  selectElem(e) {
    const _that = this;
    this.svgArea.each(function (i, children) {
      if (this.inside(e.offsetX, e.offsetY) && this.node.tagName !== 'g') {
        //console.log(this);
        _that.setSelectElements.add(this);
        _that.selectElements = [..._that.setSelectElements];
        this.addClass('selectedElem');
        this.selectize().resize();
        _that.onMouseMoveG();
        _that.cxLast = this.cx();
        _that.cyLast = this.cy();
      }
    });

    this.svgArea.each(function (i, children) {
      if (this.hasClass('selectedElem')) {
        this.cxLast = this.cx();
        this.cyLast = this.cy();
      }
    });
    _that.app.removeVisibilityPanel(_that.selectElements);
    _that.app.updateFunctionalArea(_that.selectElements);
  }

  createRect(e) {
    this.elem = this.svgArea.rect(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createEllipse(e) {
    this.elem = this.svgArea.ellipse(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createLine(e) {
    this.elem = this.svgArea.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createText(e) {
    this.elem = this.svgArea.text('text').move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
    this.elem.addClass('inputText');
    this.elem.font({
      family: 'Helvetica',
      size: 16,
      anchor: 'left',
      leading: '0em',
    });
    let textInput = '';
    document.addEventListener('keydown', (event) => {
      if (this.type === 'text' && event.key.length < 2) {
        textInput += event.key;
        this.elem.plain(`${textInput}`);
      }
    });
  }

  createPencilTrace(e) {
    this.elem = this.svgArea.path([['M', e.offsetX, e.offsetY]]).stroke(this.strokeColor).fill(this.fillColor);
  }

  drawPath(e) {
    //console.log (this.pathNodeCount);
    if (this.pathNodeCount) {
      let arr = this.path.array().value;
      arr.push(['C', e.offsetX, e.offsetY, e.offsetX, e.offsetY, e.offsetX, e.offsetY]);
      this.path.plot(arr);
      //console.log(arr);
    } else {
      this.path = this.svgArea.path([['M', e.offsetX, e.offsetY]]).stroke(this.strokeColor).fill(this.fillColor);
    }
    this.pathNodeCount += 1;
  }

  changeFillColor(e) {
    const _that = this;
    this.svgArea.each(function () {
      if (this.inside(e.offsetX, e.offsetY)) {
        this.fill(_that.fillColor);
      }
    });
  }

  changeStrokeColor(e) {
    const _that = this;
    this.svgArea.each(function () {
      if (this.inside(e.offsetX, e.offsetY)) {
        this.stroke(_that.strokeColor);
      }
    });
  }

  moveElem(e) {
    const _that = this;
    if (!e.ctrlKey && _that.selectElements.length === 1) {
      _that.svgArea.each(function (i, children) {
        if (this.hasClass('selectedElem')) {
          this.cx(e.offsetX - _that.x + _that.cxLast);
          //console.log(this.cx());
          this.cy(e.offsetY - _that.y + _that.cyLast);
          _that.app.updateFunctionalArea(_that.selectElements);
          // _that.saveHistory();
        }
      });
    } else if(!e.ctrlKey && _that.selectElements.length > 1) {
      _that.svgArea.each(function (i, children) {
        if (this.hasClass('selectedElem')) {
          this.cx(e.offsetX - _that.x + this.cxLast);
          this.cy(e.offsetY - _that.y + this.cyLast);
          //console.log(this.cx());
          _that.app.updateFunctionalArea(_that.selectElements);
          // _that.saveHistory();
        }
      });
    }
  }

  drawRect(e) {
    let xNew, yNew, xDelta, yDelta;
    xDelta = Math.abs(e.offsetX - this.x);
    yDelta = Math.abs(e.offsetY - this.y);
    if (e.shiftKey) {
      if (e.offsetX < this.x) {
        xNew = this.x - Math.max(xDelta, yDelta);
      } else if (e.offsetX >= this.x) {
        xNew = this.x;
      }
      if (e.offsetY < this.y) {
        yNew = this.y - Math.max(xDelta, yDelta);
      } else if (e.offsetY >= this.y) {
        yNew = this.y;
      }
      this.elem.attr({
        width: Math.max(Math.abs(e.offsetX - this.x), Math.abs(e.offsetY - this.y)),
        height: Math.max(Math.abs(e.offsetX - this.x), Math.abs(e.offsetY - this.y)),
        x: xNew,
        y: yNew,
      });
    } else {
      xNew = Math.min(e.offsetX, this.x);
      yNew = Math.min(e.offsetY, this.y);
      this.elem.attr({
        width: Math.abs(e.offsetX - this.x),
        height: Math.abs(e.offsetY - this.y),
        x: xNew,
        y: yNew,
      });
    }
  }

  drawEllipse(e) {
    if (e.shiftKey) {
      this.elem.attr({
        rx: Math.sqrt(((e.offsetX - this.x) ** 2) + (e.offsetY - this.y) ** 2),
        ry: Math.sqrt(((e.offsetX - this.x) ** 2) + (e.offsetY - this.y) ** 2),
      });
    } else {
      this.elem.attr({
        rx: Math.abs(e.offsetX - this.x),
        ry: Math.abs(e.offsetY - this.y),
      });
    }
  }

  drawLine(e) {
    if (e.shiftKey) {
      let xDelta = Math.abs(e.offsetX - this.x);
      let yDelta = Math.abs(e.offsetY - this.y);
      let xSign = (e.offsetX - this.x) / Math.abs(e.offsetX - this.x);
      let ySign = (e.offsetY - this.y) / Math.abs(e.offsetY - this.y);
      let xEnd, yEnd;
      if (Math.min(xDelta, yDelta) / Math.max(xDelta, yDelta) > 0.5) {
        xEnd = this.x + xSign * Math.max(xDelta, yDelta);
        yEnd = this.y + ySign * Math.max(xDelta, yDelta);
      } else {
        if (xDelta < yDelta) {
          xEnd = this.x;
          yEnd = e.offsetY
        } else {
          xEnd = e.offsetX;
          yEnd = this.y;
        }
      }
      this.elem.attr({
        x2: xEnd,
        y2: yEnd,
      })
    } else {
      this.elem.attr({
        x2: e.offsetX,
        y2: e.offsetY,
      });
    }
  }

  sizeText(e) {
    this.elem.font({
      family: 'Helvetica',
      size: Math.abs(e.offsetY - this.y),
      y: e.offsetY,
    });
  }

  drawPencilTrace(e) {
    let arr = this.elem.array().value;
    arr.push(['C', e.offsetX, e.offsetY, e.offsetX, e.offsetY, e.offsetX, e.offsetY]);
    this.elem.plot(arr);
  }

  addPathNewNode(e) {
    console.log(this.segmentPathStraight);
    if (this.segmentPathStraight) {
      let arr = this.path.array().value;
      arr.push(['C', e.offsetX, e.offsetY, e.offsetX, e.offsetY, e.offsetX, e.offsetY]);
      this.path.plot(arr);
      console.log(arr);
    } else {
      console.log ('mouseMove')
    }
  }

  onSVGAreaEvent() {
    const _that = this;
    let isDraw = false;
    this.svgArea.mousedown((e) => {
      if (e.which === 1) {
        let isOnSelect = false;
        this.svgArea.each(function() {
          if (this.inside(e.offsetX, e.offsetY) && this.hasClass('selectedElem')) isOnSelect = true;
        })
        //let isOnSelect = this.selectElements.filter((item) => item.inside(e.offsetX, e.offsetY)).length;
        if (!e.ctrlKey && !isOnSelect) {
          this.removeSelect();
          this.app.removeVisibilityPanel(this.selectElements);
        }
        isDraw = true;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.onSVGAreaMouseDown[this.type](e);
      }
    });
    this.svgArea.mousemove((e) => {
      if (isDraw) {
        this.onSVGAreaMouseMove[this.type](e);
      }
    });
    this.svgArea.mouseup(function (e) {
      if (_that.elem !== null) {
        if (_that.isEmptyElem(_that.elem)) {
          console.log('create empty elem');
          _that.remove();
        }
      }
      //console.log(_that.type === 'path');
      if (_that.type === 'path') {
        _that.segmentPathStraight = true;
        console.log(_that.segmentPathStraight);
      } else {
        isDraw = false;
        if (_that.elem !== null) {
        _that.elem.selectize().resize();
        _that.elem.addClass('selectedElem');
        _that.setSelectElements.add(_that.elem);
        _that.selectElements = [..._that.setSelectElements];
        if (_that.type !== 'text') _that.elem = null;
        }
        //_that.purgeSVGArea();
        _that.saveHistory();
      }
    });
  }

  removeLastEvent() {
    this.svgArea.mousedown(null);
    this.svgArea.mousemove(null);
    this.svgArea.mouseup(null);
  }

  removeSelect() {
    this.svgArea.each(function () {
      if (this.hasClass('selectedElem')) {
        this.removeClass('selectedElem');
        this.resize('stop').selectize(false);
      }
    })
    this.setSelectElements.clear();
    this.selectElements = [...this.setSelectElements];
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
    const svgInnerWithoutSelect = this.getSvgInnerWithoutSelect();
    this.history = this.history.slice(0, this.historyPosition + 1);
    //     Предлагаю такую проверку:
    //if (!(svgInnerWithoutSelect === this.history[this.historyPosition])) {
    //  this.history.push(svgInnerWithoutSelect);
    //};
    this.history.push(svgInnerWithoutSelect);
    if (!this.isFirstSaveHistory) this.historyPosition++;
    this.isFirstSaveHistory = false;
  }

  getSvgInnerWithoutSelect() {
    const svgWorkAreaNode = this.rootElement.childNodes[0];
    const tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = svgWorkAreaNode.innerHTML;

    [...tempDivElement.childNodes].forEach(item => {
      // if (item.tagName.toLowerCase() === 'g' || item.tagName.toLowerCase() === 'defs') item.remove();
      if (item.tagName.toLowerCase() === 'g') item.remove();
      if (item.classList.contains('selectedElem')) item.classList.remove('selectedElem');
    })

    const svgInnerWithoutSelect = tempDivElement.innerHTML;
    tempDivElement.remove();

    return svgInnerWithoutSelect;
  }

  unDo() {
    if (!this.historyPosition) return;
    this.historyPosition -= 1;
    // this.rootElement.innerHTML = '';
    // this.createNewSvgWorkArea();
    this.rootElement.childNodes[0].innerHTML = '';
    this.svgArea.svg(this.history[this.historyPosition]);
  }

  reDo() {
    if (this.historyPosition > this.history.length - 2) return;
    this.historyPosition += 1;
    // this.rootElement.innerHTML = '';
    // this.createNewSvgWorkArea();
    this.rootElement.childNodes[0].innerHTML = '';
    this.svgArea.svg(this.history[this.historyPosition]);
  }

  saveLastCondition() {
    this.removeSelect();
    this.removeDefs();
    const svgAreaInner = this.rootElement.childNodes[0].innerHTML;
    localStorage.setItem('SvgEditor_lastCondition', svgAreaInner);
  }

  loadLastCondition() {
    const lastCondition = localStorage.getItem('SvgEditor_lastCondition');
    if (!lastCondition) return;
    this.svgArea.svg(lastCondition);
  }

  removeDefs() {
    const svgAreaNode = this.rootElement.childNodes[0];
    [...svgAreaNode.childNodes].forEach(item => {
      if (item.tagName.toLowerCase() === 'defs') item.remove();
    })
  }

  isEmptyElem(elem) {
    if ((elem.type === 'rect' || elem.type === 'ellipse' || elem.type === 'line' || elem.type === 'path') && elem.width() === 0 && elem.height() === 0)
    return true;
    if (elem.type === 'text' && elem.length() === 0)
    return true;
    else
    return false;
  }
  /*  purgeSVGArea() {
    const _that = this;
    this.svgArea.each(function() {
      console.log(`${this.type}, ${this.width()}, ${this.height()}, empty: ${_that.isEmptyElem(this)}`);
      if (!(this.type === 'text' || this.type === 'defs' || this.type === 'g') && this.width() === 0 && this.height() === 0) {
        //_that.removeSelect();
        //this.remove();
      }
    })
  }*/
}
