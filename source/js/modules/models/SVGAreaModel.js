import { } from '../../vendor/svg.js';
import { } from '../../vendor/svg.select.js';
import { } from '../../vendor/svg.resize.js';
import { } from '../../vendor/svg.path.js';

const FILE_TYPE = 'svg';

export class SvgAreaModel {
  constructor(appView, rootElement, lastCondition) {
    this.appView = appView;
    this.rootElement = rootElement;
    this.lastCondition = lastCondition;

    this.svgArea = null;
    this.type = 'select';
    this.selectElements = [];
    this.copiedElements = [];
    this.setSelectElements = new Set();

    this.fillColor = 'transparent';
    this.strokeColor = 'rgba(0, 0, 0, 1)';

    this.elem = null;
    this.selectFrame = null;
    this.mouseDownElemSVG = null;

    this.text = '';
    this.isActiveText = false;
    this.path = null;
    this.isStartPath = false;
    this.isEndPath = false;
    this.pathNodeCount = 0;
    this.segmentPathStraight = false;

    this.elemCounter = 0;
    this.target = null;
    this.x = null;
    this.y = null;

    this.history = [];
    this.historyPosition = 0;
    this.isFirstSaveHistory = false;
    this.wasMoved = false;

    this.inputText = this.inputText.bind(this);
  }

  getTypeOfMouseDownAction(type, e) {
    const mouseDownActions = {
      select: (e) => this.selectDown(e),
      rect: (e) => this.createRect(e),
      ellipse: (e) => this.createEllipse(e),
      line: (e) => this.createLine(e),
      text: (e) => this.textDown(e),
      pencil : (e) => this.createPencilTrace(e),
      path: (e) => this.pathDown(e),
      fill: (e) => this.changeFillColor(e),
      stroke: (e) => this.changeStrokeColor(e),
    }

    return mouseDownActions[type](e);
  }

  getTypeOfMouseMoveAction(type, e) {
    const mouseMoveActions = {
      select: (e) => this.selectMove(e),
      rect: (e) => this.drawRect(e, this.elem),
      ellipse: (e) => this.drawEllipse(e),
      line: (e) => this.drawLine(e),
      text: (e) => this.resizeText(e),
      pencil: (e) => this.drawPencilTrace(e),
      path: (e) => this.pathMove(e),
      fill : (e) => this.thinkAboutIt(e),
      stroke : (e) => this.thinkAboutIt(e),
    }

    return mouseMoveActions[type](e);
  }

  getTypeOfMouseUpAction(type) {
    const mouseUpActions = {
      select: () => this.selectUp(),
      rect: () => this.finishDrawElem(),
      ellipse: () => this.finishDrawElem(),
      line: () => this.finishDrawElem(),
      text: () => this.finishResizeText(),
      pencil: () => this.finishDrawElem(),
      path: () => this.pathUp(),
      fill : () => this.thinkAboutIt(),
      stroke : () => this.thinkAboutIt(),
    }

    return mouseUpActions[type]();
  }

  selectDown(e) {
    this.mouseDownElemSVG = e.target.instance;
    //console.log('select down');
    //console.log(this.mouseDownElemSVG);
    if (this.mouseDownElemSVG.type === 'tspan') {
      this.mouseDownElemSVG = this.mouseDownElemSVG.parent();
    }
    if (this.mouseDownElemSVG.type === 'svg') {
      this.selectElements.forEach((elem) => this.removeSelectSingleElem(elem));
      this.selectFrame = this.svgArea.rect(0, 0).move(e.offsetX, e.offsetY).stroke('rgba(0, 90, 180, 0.8)').fill('rgba(0, 90, 180, 0.5)');
      this.selectFrame.attr('id', 'select-frame');
    } else {
      if (!e.ctrlKey) {
        if (!this.mouseDownElemSVG.hasClass('selectedElem')) {
          this.selectElements.forEach((elem) => {
            if (this.mouseDownElemSVG !== elem) this.removeSelectSingleElem(elem);
          });
        }
      }
      this.rememberCoordCenter(this.mouseDownElemSVG);
      this.selectElements.forEach((elem) => this.rememberCoordCenter(elem));
    }
  }

  selectMove(e) {
    if (this.mouseDownElemSVG.type === 'svg') {
      this.drawRect(e, this.selectFrame);
    } else {
      if (this.selectElements.length === 0) {
        this.moveSingleElem(e, this.mouseDownElemSVG);
      } else {
        this.selectElements.forEach((elem) => this.moveSingleElem(e, elem));
      }
    }
  }

  selectUp() {
    if ( this.selectFrame !== null) {
      this.svgArea.children().forEach((elem) => {
        if (this.rectanglesOverlap(this.selectFrame, elem) && this.selectFrame !== elem) {
          this.selectSingleElem(elem);
        }
      });
      this.selectFrame.remove();
      this.selectFrame = null;
    }
    if (this.mouseDownElemSVG.type !== 'svg') {
      if (!this.mouseDownElemSVG.hasClass('selectedElem')) {
        this.selectSingleElem(this.mouseDownElemSVG);
      }
    }
  }

  selectSingleElem(elem) {
    elem.selectize().resize();
    elem.addClass('selectedElem');
    this.setSelectElements.add(elem);
    this.selectElements = [...this.setSelectElements];
  }

  rectanglesOverlap(r1, r2) {
    let dimX = 0;
    let dimY = 0;
    if (r1.x() < r2.x()) dimX = r2.x() + r2.width() - r1.x();
    else dimX = r1.x() + r1.width() - r2.x();
    if (r1.y() < r2.y()) dimY = r2.y() + r2.height() - r1.y();
    else dimY = r1.y() + r1.height() - r2.y();
    return (dimX < (r1.width() + r2.width())) && (dimY < (r1.height() + r2.height()));
  }

  removeSelectSingleElem(elem) {
    elem.resize('stop').selectize(false);
    elem.removeClass('selectedElem');
    this.setSelectElements.delete(elem);
    this.selectElements = [...this.setSelectElements];
  }

  moveSingleElem(e, elem) {
    elem.x(e.offsetX - this.x + elem.xLast);
    elem.y(e.offsetY - this.y + elem.yLast);
    //this.appView.updateFunctionalArea(this.selectElements);
  }

  rememberCoordCenter(elem) {
    elem.xLast = elem.x();
    elem.yLast = elem.y();
  }
  /*
  checkSelectedElem(e) {
    let isOnSelect = false;
    this.svgArea.each(function() {
      if (this.inside(e.offsetX, e.offsetY) && this.hasClass('selectedElem')) isOnSelect = true;
    })
    if (!e.ctrlKey && !isOnSelect) {
      this.removeSelect();
      this.appView.removeVisibilityPanel(this.selectElements);                                                          //Лешин метод
    }
    this.x = e.offsetX;
    this.y = e.offsetY;
  }*/

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

  thinkAboutIt() {
    console.log(`${this.type}: mouseEvent: ${this.target}. Whats should happen?`)
  }

  /*
  selectElem(e) {
    const _that = this;
    this.svgArea.each(function (i, children) {
      if (this.inside(e.offsetX, e.offsetY) && this.node.tagName !== 'g') {
        _that.setSelectElements.add(this);
        _that.selectElements = [..._that.setSelectElements];
        this.addClass('selectedElem');
        this.selectize().resize();
        _that.onMouseMoveG();                                                                // Лешин метод
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
    _that.appView.removeVisibilityPanel(_that.selectElements);                         // Лешин метод
    _that.appView.updateFunctionalArea(_that.selectElements);                         // Лешин метод
  }
  */

  createRect(e) {
    this.elem = this.svgArea.rect(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createEllipse(e) {
    this.elem = this.svgArea.ellipse(0, 0).move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createLine(e) {
    this.elem = this.svgArea.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
  }

  createCursor() {
    const cursor = this.elem.tspan('׀').fill('#000').stroke('none');
    let cursorColor = '#000';
    function cursorFlicker() {
      if (cursorColor === '#000') {
        cursorColor = 'transparent';
        cursor.fill(cursorColor);
      } else {
        cursorColor = '#000';
        cursor.fill(cursorColor);
      }
      setTimeout(cursorFlicker, 500);
    }
    cursorFlicker();
  }

  textDown(e) {
    if (!this.isActiveText) {
      if (e.target.instance.type === 'tspan') {
        this.editText(e);
      } else {
        this.createText(e)
      }
    }
  }

  createText(e) {
    this.isActiveText = true;
    //this.text = '';
    this.elem = this.svgArea.text('').move(e.offsetX, e.offsetY).stroke(this.strokeColor).fill(this.fillColor);
    let tspan = this.elem.tspan('');
    this.elem.build(true);
    this.createCursor();
    this.elem.build(false);

    this.elem.font({
      family: 'Helvetica',
      size: 20,
      anchor: 'left',
      leading: '0em',
    });
  }

  finishResizeText() {
    if (this.text === '') {
      let tspan = this.elem.tspan('new text');
      tspan.dy(`${1.3 * this.elem.font('size')}`);
      this.elem.dy(`${-1.3 * this.elem.font('size')}`);
      this.elem.build(true);
      this.createCursor();
      this.elem.build(false);
      document.addEventListener('keydown', this.inputText);
    }
  }

  onTextBlur() {
    if (this.elem !== null) {
      if (this.text === '') {
        this.elem.resize('stop').selectize(false);
        this.elem.remove();
        this.elem = null;
        //this.type = 'select';
      } else {
        let tspan = this.elem.tspan(this.text);
        tspan.dy(`${1.3 * this.elem.font('size')}`);
        this.elem.resize('stop').selectize(false);
        this.text = '';
      }
    }
    this.isActiveText = false;
    document.removeEventListener('keydown', this.inputText);
    this.saveHistory();                                                            // почему-то не сохраняется
  }

  editText(e) {
    this.isActiveText = true;
    this.elem = e.target.instance.parent();
    this.text = this.elem.text();
    this.elem.build(true);
    this.createCursor();
    this.elem.build(false);
    document.addEventListener('keydown', this.inputText);
  }

  inputText(event) {
    if (this.type === 'text' && event.key.length < 2) {
      this.text += event.key;
      let tspan = this.elem.tspan(this.text);
      tspan.dy(`${1.3 * this.elem.font('size')}`);
      //this.elem.text(`${this.text}`).dy(`${1.3 * this.elem.font('size')}`);
      this.elem.build(true);
      this.createCursor();
      this.elem.build(false);

      this.elem.resize('stop').selectize(false);
      this.elem.selectize().resize();
    }
    if (this.type === 'text' && event.key === 'Backspace') {
      this.text = this.text.slice(0, -1);
      let tspan = this.elem.tspan(this.text);
      tspan.dy(`${1.3 * this.elem.font('size')}`);
      this.elem.build(true);
      this.createCursor();
      this.elem.build(false);
      this.elem.resize('stop').selectize(false);
      this.elem.selectize().resize();
    }
  }

  createPencilTrace(e) {
    this.elem = this.svgArea.path([['M', e.offsetX, e.offsetY]]).stroke(this.strokeColor).fill(this.fillColor);
  }

  pathDown(e) {
    if (this.pathNodeCount) {
      this.isStartPath = false;
      let lastCoord = this.elem.getSegment(this.pathNodeCount - 1).coords;
      //console.log([e.offsetX, e.offsetY]);
      if (lastCoord[0] === e.offsetX && lastCoord[1] === e.offsetY) {
        this.isEndPath = true;
        console.log('end path');
      }
      this.elem.L({x: e.offsetX, y: e.offsetY});
    } else {
      console.log('start path');
      this.elem = this.svgArea.path().M({x: e.offsetX, y: e.offsetY}).stroke(this.strokeColor).fill(this.fillColor);
      this.isStartPath = true;
      this.isEndPath = false;
    }
    this.pathNodeCount += 1;
  }

  pathMove(e) {
    this.isEndPath = false;
    this.elem.removeSegment(this.pathNodeCount);
    this.elem.L({x: e.offsetX, y: e.offsetY});
  }

  pathUp(e) {
    if (this.isEndPath) {
      this.pathNodeCount = 0;
    }
  }

  changeFillColor(e) {
    const _that = this;
    this.svgArea.each(function () {
      if (this.inside(e.offsetX, e.offsetY)) {
        _that.elem = this;
      }
    });
    this.elem.fill(this.fillColor);
  }

  changeStrokeColor(e) {
    const _that = this;
    this.selectElements.forEach((elem) => elem.stroke(this.strokeColor));
    this.svgArea.each(function () {
      if (this.inside(e.offsetX, e.offsetY)) {
        _that.elem = this;
      }
    });
    this.elem.stroke(this.strokeColor);
  }

  /*
  moveElem(e) {
    const _that = this;
    if (!e.ctrlKey && _that.selectElements.length === 1) {
      _that.svgArea.each(function (i, children) {
        if (this.hasClass('selectedElem')) {
          this.cx(e.offsetX - _that.x + _that.cxLast);
          //console.log(this.cx());
          this.cy(e.offsetY - _that.y + _that.cyLast);
          _that.appView.updateFunctionalArea(_that.selectElements);                                // Лешин метод - перенесла
          // _that.saveHistory();
        }
      });
    } else if(!e.ctrlKey && _that.selectElements.length > 1) {
      _that.svgArea.each(function (i, children) {
        if (this.hasClass('selectedElem')) {
          this.cx(e.offsetX - _that.x + this.cxLast);
          this.cy(e.offsetY - _that.y + this.cyLast);
          //console.log(this.cx());
          _that.appView.updateFunctionalArea(_that.selectElements);                                   // Лешин метод - перенесла
          // _that.saveHistory();
        }
      });
    }
  }*/

  drawRect(e, elem) {
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
      elem.attr({
        width: Math.max(Math.abs(e.offsetX - this.x), Math.abs(e.offsetY - this.y)),
        height: Math.max(Math.abs(e.offsetX - this.x), Math.abs(e.offsetY - this.y)),
        x: xNew,
        y: yNew,
      });
    } else {
      xNew = Math.min(e.offsetX, this.x);
      yNew = Math.min(e.offsetY, this.y);
      elem.attr({
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

  resizeText(e) {
    if (this.elem !== null && this.text === '') {
      this.elem.selectize().resize();
      this.elem.font({
        family: 'Helvetica',
        size: Math.abs(e.offsetY - this.y),
        y: e.offsetY
      });
    }
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

  finishDrawElem() {
    if (this.isEmptyElem(this.elem)) {
      this.elem.remove();
      this.elem = this.svgArea.last();
      if (this.target.nodeName !== 'svg') {
        this.type = 'select';
      }
    } else {
      if (this.elem !== null) {
        this.elemCounter += 1;
        this.elem.attr('id', `svg_${this.elemCounter}`);
        let previousElem = this.elem.previous();
        if (previousElem.node.nodeName !== 'defs') {
          this.removeSelectSingleElem(previousElem.previous());
        }
        if (this.elem.type === 'text') {
          this.elem = this.elem.node.instance;
        }
        this.selectSingleElem(this.elem);
      }
    }
  }

  isEmptyElem(elem) {
    if (elem !== null) {
      if (elem.width() === 0 && elem.height() === 0)
      return true;
      else
      return false;
    }
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
    const arrayG = [...[...this.rootElement.childNodes][0].childNodes].filter((value) => value.tagName === 'g');
    const arrayElementG = [...arrayG[0].childNodes];
    arrayElementG.shift();
    for (let i = 0; i < arrayElementG.length; i += 1) {
      arrayElementG[i].addEventListener('mousemove', () => {
        if (this.selectElements.length === 1) {
          this.appView.updateFunctionalArea(this.selectElements);
        }
      });
    }
  }

  // из контроллера часть alexk08

  saveHistory() {
    const svgElements = this.svgArea.children();
    const svgElementsWithoutG = svgElements.filter(initializer => initializer.type !== 'g');
    this.history = this.history.slice(0, this.historyPosition + 1);
    this.history.push(svgElementsWithoutG);
    if (!this.isFirstSaveHistory) this.historyPosition++;
    this.isFirstSaveHistory = false;
  }

  unDo() {
    this.selectElements = [];
    if (!this.historyPosition) return;
    this.historyPosition -= 1;

    this.svgArea.clear();
    this.history[this.historyPosition].forEach(initializer => this.svgArea.add(initializer));
  }

  reDo() {
    this.selectElements = [];
    if (this.historyPosition > this.history.length - 2) return;
    this.historyPosition += 1;

    this.svgArea.clear();
    this.history[this.historyPosition].forEach(initializer => this.svgArea.add(initializer));
  }

  getLastCondition() {
    this.removeSelect();

    const svgElements = this.svgArea.children();
    const svgData = [...svgElements
      .filter(initializer => initializer.type !== 'defs')
      .map(initializer => {
        if (initializer.type === 'text') {
          return [
            initializer.type,
            initializer.attr(),
            initializer.node.childNodes[0].textContent
          ]
        }
        return [
          initializer.type,
          initializer.attr()
        ]
      }
    )];

    return svgData;
  }

  loadLastCondition() {
    if (!this.lastCondition || this.lastCondition.length === 0) return;
    this.lastCondition.forEach(data => this.drawAfterFirstLoading(data));
  }

  drawAfterFirstLoading(data) {
    const type = data[0];
    const attr = data[1];
    const text = data[2];

    if (type === 'rect') {
      this.svgArea.rect().attr(attr);
    } else if (type === 'ellipse') {
      this.svgArea.ellipse().attr(attr);
    } else if (type === 'line') {
      this.svgArea.line().attr(attr);
    } else if (type === 'text') {
      this.svgArea.text(`${text}`).attr(attr);
    } else if (type === 'path') {
      this.svgArea.path().attr(attr);
    }
  }

  createNewImage() {
    this.selectElements = [];
    this.svgArea.each(function() {
      if (this.type !== 'defs') this.remove();
    });
    this.closeNewImageModal();

    this.history = [];
    this.historyPosition = 0;
    this.isFirstSaveHistory = true;
    this.saveHistory();
  }

  openNewImageModal() {
    this.appView.newImageModal.classList.add('modal-new-image--show');
  }

  closeNewImageModal() {
    this.appView.newImageModal.classList.remove('modal-new-image--show');
  }

  openModalSvgCode() {
    this.appView.svgCodeModal.innerHTML = '';
    this.appView.svgCodeModal.classList.toggle('modal-svg-code--show');
    this.removeSelect();
    this.appView.svgCodeModal.textContent = this.rootElement.innerHTML;
  }

  openModalSettings() {
    this.appView.settingsModal.classList.add('modal-settings--show');
  }

  closeModalSettings() {
    this.appView.settingsModal.classList.remove('modal-settings--show');
  }

  changeProperties() {
    const svgWidth = this.appView.settingsModal.querySelector('[data-modal-settings="width"]').value;
    const svgHeight = this.appView.settingsModal.querySelector('[data-modal-settings="height"]').value;
    this.resizeSvgArea(svgWidth, svgHeight);
  }

  openModalSave() {
    this.appView.saveModal.classList.add('modal-save--show');
  }

  closeModalSave() {
    this.appView.inputFileName.value = '';
    this.appView.errorMessage.style.visibility = 'hidden';
    this.appView.saveModal.classList.remove('modal-save--show');
  }

  saveFile(fileName) {
    if (fileName === '') {
      this.appView.errorMessage.style.visibility = 'visible';
      return;
    }
    this.closeModalSave();
    this.removeSelect();
    this.download(this.svgArea.svg(), fileName, 'image/svg+xml');
  }

  download(data, filename, type) {
    let file = new Blob([data], {type});
    if (window.navigator.msSaveOrOpenBlob) { // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
      let a = document.createElement('a');
      let url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  uploadSVG(input) {
    const file = input.files[0];
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(FILE_TYPE)) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.svgArea.svg(reader.result);
      });

      reader.readAsText(file);
    }
  }

  // часть по functionalArea 11alexey11
  changePropertiesSVGElement(target) {
    this.appView.deleteVisibilityContextMenu();
    const objSVG = this.selectElements[0];
    switch (target.dataset[this.appView.propertiesDataAttribute]) {
      case 'angle':
        if (target.value.length !== 0) {
          objSVG.rotate(target.value);
        } else {
          objSVG.rotate(0);
        }
        break;
      case 'size':
        if (target.value.length !== 0) {
          objSVG.attr('font-size', target.value);
        } else {
          objSVG.attr('font-size', target.getAttribute('placeholder'));
        }
        break;
      default:
        if (target.value.length !== 0) {
          objSVG.attr(`${target.dataset[this.appView.propertiesDataAttribute]}`, target.value);
        } else {
          objSVG.attr(`${target.dataset[this.appView.propertiesDataAttribute]}`, target.getAttribute('placeholder'));
        }
        break;
    }
    this.saveHistory();
  }

  changeSelectProperty(target) {
    this.appView.deleteVisibilityContextMenu();
    const objSVG = this.selectElements[0];
    objSVG.attr('font-family', target.value);
    this.saveHistory();
  }

  alignElements(dataAttribute) {
    this.appView.deleteVisibilityContextMenu();
    switch (dataAttribute) {
      case 'align_horizontal_left':
        this.selectElements.forEach((item) => item.x(0));
        break;
      case 'align_horizontal_right':
        this.selectElements.forEach((item) => {
          if (item.type === 'text') {
            item.x(this.svgArea.width() - item.length());
          } else {
            item.x(this.svgArea.width() - item.width());
          }
        });
        break;
      case 'align_vertical_top':
        this.selectElements.forEach((item) => item.y(0));
        break;
      case 'align_vertical_bottom':
        this.selectElements.forEach((item) => {
          if (item.type === 'text') {
            item.y(this.svgArea.height() - 1.11 * item.attr('size'));
          } else {
            item.y(this.svgArea.height() - item.height());
          }
        });
        break;
      case 'align_horizontal_center':
        this.selectElements.forEach((item) => item.cx(this.svgArea.width() / 2));
        break;
      case 'align_vertical_center':
        this.selectElements.forEach((item) => item.cy(this.svgArea.height() / 2));
        break;
    }
    this.saveHistory();
  }

  deleteElements() {
    for (let i = 0; i < this.selectElements.length; i += 1) {
      this.selectElements[i].resize('stop').selectize(false);
      this.selectElements[i].remove();
    }
    this.setSelectElements.clear();
    this.selectElements = [];
    //this.appView.removeVisibilityPanel(this.selectElements);
    //this.appView.deleteVisibilityContextMenu();
    this.saveHistory();
  }

  bringToFront() {
    if (this.selectElements.length === 1) {
      this.selectElements[0].front();
    }
    this.appView.deleteVisibilityContextMenu();
    this.saveHistory();
  }

  sendToBack() {
    if (this.selectElements.length === 1) {
      this.selectElements[0].back();
    }
    this.appView.deleteVisibilityContextMenu();
    this.saveHistory();
  }

  copyElements() {
    this.copiedElements = this.selectElements;
    this.appView.deleteVisibilityContextMenu();
  }

  pasteElements() {
    if (this.copiedElements.length > 0) {
      this.copiedElements.forEach((item) => {
        const elementCopy = item.clone();
        elementCopy.attr('x', this.x);
        elementCopy.attr('y', this.y);
        this.svgArea.add(elementCopy);
      });
    }
    this.appView.deleteVisibilityContextMenu();
    this.saveHistory();
  }

  appearContextMenu(e) {
    e.preventDefault();
    this.appView.contextMenuWindow.classList.remove('visibility-modal');
    this.appView.contextMenuWindow.style.left = `${e.pageX}px`;
    this.appView.contextMenuWindow.style.top = `${e.pageY}px`;
    if (this.selectElements.length === 0 && this.copiedElements.length > 0) { // выделено, скопировали (вызывается на svgArea)
      this.appView.contextMenuWindow.childNodes[0].disabled = true;
      this.appView.contextMenuWindow.childNodes[1].disabled = true;
      this.appView.contextMenuWindow.childNodes[2].disabled = false;
      this.appView.contextMenuWindow.childNodes[3].disabled = true;
      this.appView.contextMenuWindow.childNodes[4].disabled = true;
    } else if (this.selectElements.length > 0 && this.copiedElements.length === 0) { // выделено, и не скопировали (вызывается на Element)
      this.appView.contextMenuWindow.childNodes[0].disabled = false;
      this.appView.contextMenuWindow.childNodes[1].disabled = false;
      this.appView.contextMenuWindow.childNodes[2].disabled = true;
      this.appView.contextMenuWindow.childNodes[3].disabled = false;
      this.appView.contextMenuWindow.childNodes[4].disabled = false;
    } else if (this.selectElements.length === 0 && this.copiedElements.length === 0) {
      this.appView.contextMenuWindow.childNodes[0].disabled = true;
      this.appView.contextMenuWindow.childNodes[1].disabled = true;
      this.appView.contextMenuWindow.childNodes[2].disabled = true;
      this.appView.contextMenuWindow.childNodes[3].disabled = true;
      this.appView.contextMenuWindow.childNodes[4].disabled = true;
    } else if (this.selectElements.length > 0 && this.copiedElements.length > 0) {
      this.appView.contextMenuWindow.childNodes[0].disabled = false;
      this.appView.contextMenuWindow.childNodes[1].disabled = false;
      this.appView.contextMenuWindow.childNodes[2].disabled = false;
      this.appView.contextMenuWindow.childNodes[3].disabled = false;
      this.appView.contextMenuWindow.childNodes[4].disabled = false;
    }
  }
}
