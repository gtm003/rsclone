export class SvgAreaController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onSvgAreaMouseDown = this.onSvgAreaMouseDown.bind(this);
    this.onSvgAreaMouseMove = this.onSvgAreaMouseMove.bind(this);
    this.onSvgAreaMouseUp = this.onSvgAreaMouseUp.bind(this);
    this.onSvgAreaMouseLeave = this.onSvgAreaMouseLeave.bind(this);
  }

  addAllListeners() {
    this.model.svgArea.mousedown(this.onSvgAreaMouseDown);
  }

  removeAllListeners() {
    this.model.rootElement.childNodes[0].removeEventListener('mouseleave', this.onSvgAreaMouseLeave);
    this.model.svgArea.mousedown(null);
    this.model.svgArea.mousemove(null);
    this.model.svgArea.mouseup(null);
  }

  onSvgAreaMouseDown(e) {
    if (e.which !== 1) return;
    e.preventDefault();

    this.model.rootElement.childNodes[0].addEventListener('mouseleave', this.onSvgAreaMouseLeave);

    this.model.target = e.target;
    this.model.x = e.offsetX;
    this.model.y = e.offsetY;
    if (this.model.isActiveText && e.target.instance.parent() !== this.model.elem) this.model.onTextBlur();
    this.model.getTypeOfMouseDownAction(this.model.type, e);
    if (this.model.type !== 'path') { // This is a temporary option
      this.model.svgArea.mousemove(this.onSvgAreaMouseMove);
    } else if (this.model.isStartPath) {
      this.model.svgArea.mousemove(this.onSvgAreaMouseMove);
    }
    this.model.svgArea.mouseup(this.onSvgAreaMouseUp);
  }

  onSvgAreaMouseMove(e) {
    e.preventDefault();
    this.model.wasMoved = true;
    if (!(this.model.type === 'fill' || this.model.type === 'stroke'))
    this.model.getTypeOfMouseMoveAction(this.model.type, e);
  }

  onSvgAreaMouseUp(e) {
    e.preventDefault();
    if (!(this.model.type === 'fill' || this.model.type === 'stroke'))
    this.model.getTypeOfMouseUpAction(this.model.type);
    if (this.model.wasMoved && !this.model.isSelectFrame && !this.model.isPath) {
      this.model.saveHistory();
    }
    this.model.wasMoved = false;
    this.model.isSelectFrame = false;
    this.appView.removeVisibilityPanel(this.model.selectElements);
    console.log(this.model.selectElements);
    if (this.model.selectElements.length === 1) {
      this.appView.updateFunctionalArea(this.model.getAttr(this.model.selectElements[0]));
    }
    if (this.model.type !== 'path') {
      this.model.svgArea.mousemove(null);
    } else if (this.model.isEndPath) {
      this.model.svgArea.mousemove(null);
    }
    this.model.svgArea.mouseup(null);
  }

  onSvgAreaMouseLeave(e) {
    e.preventDefault();

    this.model.svgArea.fire('mouseup');
    this.model.svgArea.mousemove(null);
    this.model.svgArea.mouseup(null);

    //для окончания рисования path
    this.model.isEndPath = true;
    this.model.pathNodeCount = 0;
  }
}
