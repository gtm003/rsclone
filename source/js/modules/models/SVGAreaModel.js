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
    this.pathArray = [];
    this.isStartPath = false;
    this.isEndPath = false;
    this.isPath = false;
    this.pathNodeCount = 0;
    this.segmentPathStraight = false;

    this.elemCounter = 0;
    this.target = null;
    this.x = null;
    this.y = null;
    this.xLast = null;
    this.yLast = null;

    this.history = [];
    this.historyPosition = 0;
    this.isFirstSaveHistory = false;
    this.wasMoved = false;
    this.isSelectFrame = false;

    this.inputText = this.inputText.bind(this);

    this.idClient = null;
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
    }

    return mouseUpActions[type]();
  }

  selectDown(e) {
    //console.log(this.getAttr(e.target.instance));
    //console.log(e.target.instance.attr());
    this.mouseDownElemSVG = e.target.instance;
    if (this.mouseDownElemSVG.type === 'tspan') {
      this.mouseDownElemSVG = this.mouseDownElemSVG.parent();
    }
    if (this.mouseDownElemSVG.type === 'svg') {
      this.selectElements.forEach((elem) => this.removeSelectSingleElem(elem));
      this.selectFrame = this.svgArea.rect(0, 0).stroke('rgba(0, 90, 180, 0.8)').fill('rgba(0, 90, 180, 0.5)');
      this.selectFrame.transform({x : e.offsetX}).transform({y : e.offsetY});
      this.selectFrame.attr('id', 'select-frame');
      this.isSelectFrame = true;
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
    if (this.mouseDownElemSVG.type === 'svg' && this.selectFrame !== null) {
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
      console.log(this.mouseDownElemSVG.x());
      console.log(this.mouseDownElemSVG.transform('x'));
      console.log(this.mouseDownElemSVG.cx());
      console.log(this.mouseDownElemSVG.rbox().cx);
      this.onMouseMoveG();
    }
  }

  selectSingleElem(elem) {
    elem.selectize().resize();
    elem.addClass('selectedElem');
    this.setSelectElements.add(elem);
    this.selectElements = [...this.setSelectElements];
    //console.log(this.getAttr(elem));
  }

  rectanglesOverlap(r1, r2) {
    let dimX = 0;
    let dimY = 0;
    if (r1.transform('x') < r2.transform('x')) dimX = r2.transform('x') + r2.width() - r1.transform('x');
    else dimX = r1.transform('x') + r1.width() - r2.transform('x');
    if (r1.transform('y') < r2.transform('y')) dimY = r2.transform('y') + r2.height() - r1.transform('y');
    else dimY = r1.transform('y') + r1.height() - r2.transform('y');
    return (dimX < (r1.width() + r2.width())) && (dimY < (r1.height() + r2.height()));
  }

  removeSelectSingleElem(elem) {
    elem.resize('stop').selectize(false);
    elem.removeClass('selectedElem');
    this.setSelectElements.delete(elem);
    this.selectElements = [...this.setSelectElements];
  }

  moveSingleElem(e, elem) {
    elem.transform({x : e.offsetX - this.x + elem.xLast});
    elem.transform({y : e.offsetY - this.y + elem.yLast});
    this.appView.updateFunctionalArea(this.selectElements);                        // Почему-то не срабатывает на move
  }

  rememberCoordCenter(elem) {
    elem.xLast = elem.transform('x');
    elem.yLast = elem.transform('y');
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

  // resizeSvgArea(svgWidth, svgHeight) {
  //   this.svgArea.size(svgWidth, svgHeight);
  // }

  createRect(e) {
    this.elem = this.svgArea.rect(0, 0).stroke(this.strokeColor).fill(this.fillColor);
    this.elem.attr('stroke-width', 2);
    this.elem.transform({x : e.offsetX}).transform({y : e.offsetY});
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
    this.elem = this.svgArea.text('').stroke(this.strokeColor).fill(this.fillColor);
    this.elem.transform({x : e.offsetX}).transform({y : e.offsetY});
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

  resizeText(e) {
    if (this.elem !== null && this.text === '') {
      this.elem.selectize().resize();
      this.elem.font({
        family: 'Helvetica',
        size: Math.abs(e.offsetY - this.y),
      });
      this.elem.transform({y : e.offsetY});
    }
  }

  finishResizeText() {
    if (this.text === '') {
      let tspan = this.elem.tspan('l');
      tspan.fill('transparent').stroke('transparent');
      tspan.dy(`${1.3 * this.elem.font('size')}`);
      let yLast = this.elem.transform('y');
      this.elem.transform({y : yLast - 1.3 * this.elem.font('size')})
      //this.elem.dy(`${-1.3 * this.elem.font('size')}`);
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
    this.saveHistory();
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
    this.elem.attr('stroke-width', 2);
  }

  pathDown(e) {
    this.isPath = true;
    if (this.pathNodeCount) {
      this.isStartPath = false;
      let xFirst = this.elem.transform('x');
      let yFirst = this.elem.transform('y');
      if (this.xLast === e.offsetX && this.yLast === e.offsetY) {
        this.isEndPath = true;
      } else {
        this.elem.removeSegment(this.pathNodeCount);
        if (e.shiftKey) {
          this.drawDirectAnglePath(e);
        } else {
          this.elem.L({x: e.offsetX - xFirst, y: e.offsetY - yFirst});
        }
      }
    } else {
      this.elem = this.svgArea.path().M(0, 0).stroke(this.strokeColor).fill(this.fillColor);
      this.elem.transform({x : e.offsetX}).transform({y : e.offsetY});
      this.elem.attr('stroke-width', 2);
      this.isStartPath = true;
      this.isEndPath = false;
    }
    this.pathNodeCount += 1;
    console.log(this.elem.array());
  }

  drawDirectAnglePath(e) {
    let lastPoinCoord = this.getPointsCoord(this.elem).pop();
    let xFirst = this.elem.transform('x');
    let yFirst = this.elem.transform('y');
    let xLast = lastPoinCoord[0];
    let yLast = lastPoinCoord[1];
    let xDelta = Math.abs(e.offsetX - xLast - xFirst);
    let yDelta = Math.abs(e.offsetY - yLast - yFirst);
    let xSign = (e.offsetX - xLast - xFirst) / Math.abs(e.offsetX - xLast - xFirst);
    let ySign = (e.offsetY - yLast - yFirst) / Math.abs(e.offsetY - yLast - yFirst);
    let xEnd, yEnd;
    if (Math.min(xDelta, yDelta) / Math.max(xDelta, yDelta) > 0.5) {
      xEnd = xLast + xSign * Math.max(xDelta, yDelta);
      yEnd = yLast + ySign * Math.max(xDelta, yDelta);
      this.elem.L({x: xEnd, y: yEnd})
    } else {
      if (xDelta < yDelta) {
        this.elem.V(e.offsetY - yFirst)
      } else {
        this.elem.H(e.offsetX - xFirst)
      }
    }
  }

  pathMove(e) {
    let xFirst = this.elem.transform('x');
    let yFirst = this.elem.transform('y');
    if (e.shiftKey) {
      this.elem.removeSegment(this.pathNodeCount);
      this.drawDirectAnglePath(e);
    } else {
      this.elem.removeSegment(this.pathNodeCount);
      this.elem.L({x: e.offsetX - xFirst, y: e.offsetY - yFirst});
    }
  }

  pathUp(e) {
    if (this.isEndPath) {
      this.isPath = false;
      this.saveHistory();
      this.pathNodeCount = 0;
      //console.log(this.elem.array());
      //console.log(this.getPathArray(this.elem));
      //this.elem.plot(this.getPathArray(this.elem));
      //console.log(this.elem.array());
      console.log(this.getPointsCoord(this.elem));
    }
    this.xLast = this.x;
    this.yLast = this.y;
  }

  getPointsCoord(elem) {
    let allPointsCoord = [];
    let segmentCount = elem.getSegmentCount();
    for (let i = 0; i < segmentCount; i += 1) {
      let pointCoord = [];
      switch (elem.getSegment(i).type) {
        case 'M':
        case 'L':
          pointCoord = pointCoord.concat(elem.getSegment(i).coords);
          break;
        case 'H':
          pointCoord = pointCoord.concat([elem.getSegment(i).coords[0], allPointsCoord[i - 1][1]]);
          break;
        case 'V':
          pointCoord = pointCoord.concat([allPointsCoord[i - 1][0], elem.getSegment(i).coords[0]]);
          break;
      }
      allPointsCoord.push(pointCoord);
    }
    return allPointsCoord;
  }

  getPathArray(elem) {
    let pathArray = [];
    let pathNodeCount = elem.getSegmentCount();
    for (let i = 0; i < pathNodeCount; i += 1) {
      let nodeArray = [elem.getSegment(i).type];
      nodeArray = nodeArray.concat(elem.getSegment(i).coords);
      pathArray.push(nodeArray);
    }
    return pathArray;
  }

  changeFillColor(e) {
    e.target.instance.fill(this.fillColor);
    this.saveHistory();
  }

  changeStrokeColor(e) {
    e.target.instance.stroke(this.strokeColor);
    this.saveHistory();
  }

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
      });
      elem.transform({x : xNew}).transform({y : yNew});
    } else {
      xNew = Math.min(e.offsetX, this.x);
      yNew = Math.min(e.offsetY, this.y);
      elem.attr({
        width: Math.abs(e.offsetX - this.x),
        height: Math.abs(e.offsetY - this.y),
      });
      elem.transform({x : xNew}).transform({y : yNew});
    }
  }

  createEllipse(e) {
    this.elem = this.svgArea.ellipse(0, 0).stroke(this.strokeColor).fill(this.fillColor);
    this.elem.attr('stroke-width', 2);
    this.elem.transform({x : e.offsetX}).transform({y : e.offsetY});
  }

  drawEllipse(e) {
    if (e.shiftKey) {
      this.elem.attr({
        rx: Math.sqrt(((e.offsetX - this.x) ** 2) + (e.offsetY - this.y) ** 2),
        ry: Math.sqrt(((e.offsetX - this.x) ** 2) + (e.offsetY - this.y) ** 2),
      });
      this.elem.transform({x : e.offsetX}).transform({y : e.offsetY});
    } else {
      this.elem.attr({
        rx: Math.abs(e.offsetX - this.x),
        ry: Math.abs(e.offsetY - this.y),
      });
    }
  }

  createLine(e) {
    this.elem = this.svgArea.line(0, 0, 0, 0).stroke(this.strokeColor).fill(this.fillColor);
    this.elem.attr('stroke-width', 3);
    this.elem.transform({x : e.offsetX}).transform({y : e.offsetY});
  }

  drawLine(e) {
    if (e.shiftKey) {
      let xDelta = Math.abs(e.offsetX - this.x);
      let yDelta = Math.abs(e.offsetY - this.y);
      let xSign = (e.offsetX - this.x) / Math.abs(e.offsetX - this.x);
      let ySign = (e.offsetY - this.y) / Math.abs(e.offsetY - this.y);
      let xEnd, yEnd;
      if (Math.min(xDelta, yDelta) / Math.max(xDelta, yDelta) > 0.5) {
        xEnd = xSign * Math.max(xDelta, yDelta);
        yEnd = ySign * Math.max(xDelta, yDelta);
      } else {
        if (xDelta < yDelta) {
          xEnd = 0;
          yEnd = ySign * yDelta;
        } else {
          xEnd = xSign * xDelta;
          yEnd = 0;
        }
      }
      this.elem.attr({
        x2: xEnd,
        y2: yEnd,
      })
    } else {
      this.elem.attr({
        x2: e.offsetX - this.x,
        y2: e.offsetY - this.y,
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

  //                  GetAttribute
  getAttr(elem) {
    let svgAreaX = this.svgArea.rbox().x;
    let svgAreaY = this.svgArea.rbox().y;
    let matrix = new SVG.Matrix(elem);
    let pointStart = new SVG.Point(0, 0);
    let pointEnd = new SVG.Point(0, 0);
    let size = null;
    if (elem.type === 'line') {
      pointEnd = new SVG.Point(elem.attr('x2'), elem.attr('y2'));
    }
    if (elem.type === 'text') {
      size = elem.font('size');
    }
    let attrOBJ = {
      type : elem.type,
      id: elem.attr('id'),
      class: elem.attr('class'),
      angle : elem.transform('rotation'),
      stroke : elem.attr('stroke-width'),
      x: (elem.rbox().x - svgAreaX),
      y: (elem.rbox().y - svgAreaY),
      width: (elem.width()),
      height: (elem.height()),
      cx: (elem.rbox().cx - svgAreaX),
      cy: (elem.rbox().cy - svgAreaY),
      rx: (elem.width()) / 2,
      ry: (elem.height()) / 2,
      x1 : pointStart.transform(matrix).x,
      y1 : pointStart.transform(matrix).y,
      x2 : pointEnd.transform(matrix).x,
      y2 : pointEnd.transform(matrix).y,
      size : size,
    }
    return attrOBJ;
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
          this.appView.updateFunctionalArea(this.getAttr(this.selectElements[0]));
        }
      });
    }
  }

  // из контроллера часть alexk08

  saveHistory() {
    const svgElements = this.svgArea.children();

    const svgElementsWithoutG = svgElements
      .filter(initializer => initializer.type !== 'g')
      .map(initializer => {
        if (initializer.type === 'defs') {
          return initializer;
        }
        if (initializer.type === 'text') {
          return [
            initializer.type,
            initializer.attr(),
            initializer.node.childNodes[0].textContent
          ];
        }
        if (initializer.type === 'path') {
          if (initializer._segments) {
            return [
              initializer.type,
              initializer._segments
            ];
          }
          return [
            initializer.type,
            initializer.attr()
          ]
        }
        return [
          initializer.type,
          initializer.attr()
        ];
      });

    const svgProp = [
      this.svgArea.type,
      this.svgArea.attr()
    ];

    svgElementsWithoutG.push(svgProp);
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
    // this.history[this.historyPosition].forEach(initializer => this.svgArea.add(initializer));
    this.history[this.historyPosition].forEach(data => {
      if (data.type === 'defs') {
        this.svgArea.add(data);
        return;
      }
      this.drawAfterFirstLoading(data)
    });
  }

  reDo() {
    this.selectElements = [];
    if (this.historyPosition > this.history.length - 2) return;
    this.historyPosition += 1;

    this.svgArea.clear();
    // this.history[this.historyPosition].forEach(initializer => this.svgArea.add(initializer));
    this.history[this.historyPosition].forEach(data => {
      if (data.type === 'defs') {
        this.svgArea.add(data);
        return;
      }
      this.drawAfterFirstLoading(data)
    });
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
        if (initializer.type === 'path') {
          if (initializer._segments) {
            return [
              initializer.type,
              initializer._segments
            ];
          }
          return [
            initializer.type,
            initializer.attr()
          ]
        }
        return [
          initializer.type,
          initializer.attr()
        ]
      }
    )];

    const svgProp = [
      this.svgArea.type,
      this.svgArea.attr()
    ];

    svgData.push(svgProp);

    return svgData;
  }

  loadLastCondition() {
    if (!this.lastCondition || this.lastCondition.length === 0) return;
    this.lastCondition.forEach(data => this.drawAfterFirstLoading(data));
  }

  drawAfterFirstLoading(data) {
    const type = data[0];
    const attr = data[1] || []; //костыль из-за pencil
    const text = data[2];

    if (type === 'svg') {
      this.svgArea.size(attr.width, attr.height);
    } else if (type === 'rect') {
      this.svgArea.rect().attr(attr);
    } else if (type === 'ellipse') {
      this.svgArea.ellipse().attr(attr);
    } else if (type === 'line') {
      this.svgArea.line().attr(attr);
    } else if (type === 'text') {
      this.svgArea.text(`${text}`).attr(attr);
    } else if (type === 'path') {
      Array.isArray(attr) ? this.drawPathAfterLoading(attr) : this.svgArea.path().attr(attr);
    }
  }

  drawPathAfterLoading(segments) {
    const elem = this.svgArea.path();
    segments.forEach(segment => {

      if (segment.type === 'M') {
        elem.M(segment.coords[0], segment.coords[1]);
      } else if (segment.type === 'L') {
        elem.L(segment.coords[0], segment.coords[1]);
      } else if (segment.type === 'V') {
        elem.V(segment.coords[0]);
      } else if (segment.type === 'H') {
        elem.H(segment.coords[0]);
      }
    });

    elem.stroke(this.strokeColor).fill(this.fillColor);
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
    // this.resizeSvgArea(svgWidth, svgHeight);
    this.svgArea.size(svgWidth, svgHeight);
    this.saveHistory();
  }

  openModalSave(flagStr) {
    if (flagStr === 'server') {
      this.appView.saveModal.classList.add('modal-save--server');
    } else {
      this.appView.saveModal.classList.add('modal-save--show');
    }
  }

  closeModalSave() {
    this.appView.inputFileName.value = '';
    this.appView.errorMessage.style.visibility = 'hidden';
    this.appView.saveModal.classList.remove('modal-save--show', 'modal-save--server');
  }

  saveFile(fileName, flagStr) {
    if (fileName === '') {
      this.appView.errorMessage.style.visibility = 'visible';
      return;
    }
    this.closeModalSave();
    this.removeSelect();
    if (flagStr === 'client') {
      this.downloadClient(this.svgArea.svg(), fileName, 'image/svg+xml');
    } else if (flagStr === 'server') {
      this.downloadServer(this.svgArea.svg(), fileName, 'image/svg+xml');
    }
  }

  downloadClient(data, filename, type) {
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

  downloadServer(data, filename, type) {
    let xhr = new XMLHttpRequest();
    console.log(this.idClient);
    xhr.open('PUT', 'https://rs-demo-back.herokuapp.com/auth/save');
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json');
    const id = this.idClient;
    const filenames = filename;
    const projects = this.getLastCondition();
    const json = {
      id,
      filenames,
      projects
    };
    console.log(json);
    xhr.send(JSON.stringify(json)); // почему-то пишет cors, хотя все есть
    xhr.onload = () => {
      console.log(xhr.response);
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
    let svgAreaX = this.svgArea.rbox().x;
    let svgAreaY = this.svgArea.rbox().y;
    switch (target.dataset[this.appView.propertiesDataAttribute]) {
      case 'angle':
        if (target.value.length !== 0) {
          objSVG.rotate(target.value);
        } else {
          objSVG.rotate(0);
        }
        break;
        case 'x':
          let xDelta = objSVG.transform('x') - objSVG.rbox().x + svgAreaX;
          objSVG.transform({x : Number(target.value) + xDelta});
          break;
        case 'y':
          let yDelta = objSVG.transform('y') - objSVG.rbox().y + svgAreaY;
          objSVG.transform({y : Number(target.value) + yDelta});
          break;
        case 'cx':
            objSVG.transform({x : Number(target.value)});
            break;
            case 'cy':
              objSVG.transform({y : Number(target.value)});
              break;
      case 'size':
        if (target.value.length !== 0) {
          objSVG.attr('font-size', target.value);
        } else {
          objSVG.attr('font-size', target.getAttribute('placeholder'));
        }
        break;
        case 'stroke':
          if (target.value.length !== 0) {
            objSVG.attr('stroke-width', target.value);
          } else {
            objSVG.attr('stroke', target.getAttribute('placeholder'));
          }
          break;
      default:
        if (target.value.length !== 0) {
          console.log(`${target.dataset[this.appView.propertiesDataAttribute]}`);
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
        this.selectElements.forEach((item) => {
          let xLast = item.transform('x');
          item.transform({x : xLast - item.rbox().x + this.svgArea.rbox().x})
        });
        break;
      case 'align_horizontal_right':
        this.selectElements.forEach((item) => {
          let xLast = item.transform('x');
          item.transform({x : xLast - item.rbox().x2 + this.svgArea.rbox().x2})
        });
        break;
      case 'align_vertical_top':
        this.selectElements.forEach((item) => {
          let yLast = item.transform('y');
          item.transform({y : yLast - item.rbox().y + this.svgArea.rbox().y});
        });
        break;
      case 'align_vertical_bottom':
        this.selectElements.forEach((item) => {
          let yLast = item.transform('y');
          item.transform({y : yLast - item.rbox().y2 + this.svgArea.rbox().y2});
        });
        break;
      case 'align_horizontal_center':

        this.selectElements.forEach((item) => {
          let xLast = item.transform('x');
          item.transform({x : xLast - item.rbox().cx + this.svgArea.rbox().cx});
        });
        break;
      case 'align_vertical_center':
        this.selectElements.forEach((item) => {
          let yLast = item.transform('y');
          item.transform({y : yLast - item.rbox().cy + this.svgArea.rbox().cy});
        });
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
