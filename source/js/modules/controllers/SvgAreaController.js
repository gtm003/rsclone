export class SvgAreaController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onSvgAreaMouseDown = this.onSvgAreaMouseDown.bind(this);
    this.onSvgAreaMouseMove = this.onSvgAreaMouseMove.bind(this);
    this.onSvgAreaMouseUp = this.onSvgAreaMouseUp.bind(this);
  }

  addAllListeners() {
    this.model.svgArea.mousedown(this.onSvgAreaMouseDown);
  }

  removeAllListeners() {
    this.model.svgArea.mousedown(null);
  }

  onSvgAreaMouseDown(e) {
    e.preventDefault();
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
    //console.log(e.type)
    console.log('something')
  }

  onSvgAreaMouseMove(e) {
    e.preventDefault();
    this.model.getTypeOfMouseMoveAction(this.model.type, e);
    this.model.wasMoved = true;
    //console.log(e.type)
  }

  onSvgAreaMouseUp(e) {
    e.preventDefault();
    console.log(this.model.wasMoved)
    this.model.getTypeOfMouseUpAction(this.model.type);
    if (this.model.wasMoved && !this.model.isSelectFrame) this.model.saveHistory();
    this.model.wasMoved = false;
    this.model.isSelectFrame = false;
    //this.appView.removeVisibilityPanel(this.model.selectElements);
    //this.appView.updateFunctionalArea(this.model.selectElements);
    if (this.model.type !== 'path') {
      this.model.svgArea.mousemove(null);
    } else if (this.model.isEndPath) {
      this.model.svgArea.mousemove(null);
    }
    this.model.svgArea.mouseup(null);
    //console.log(e.type)
  }
}
