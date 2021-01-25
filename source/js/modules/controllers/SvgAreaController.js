export class SvgAreaController {
  constructor(appView, model, controller) {
    this.appView = appView;
    this.model = model;
    this.controller = controller;

    this.onSvgAreaMouseDown = this.onSvgAreaMouseDown.bind(this);
    this.onSvgAreaMouseMove = this.onSvgAreaMouseMove.bind(this);
    this.onSvgAreaMouseUp = this.onSvgAreaMouseUp.bind(this);
  }

  init() {
    this.model.svgArea.mousedown(this.onSvgAreaMouseDown);
  }

  onSvgAreaMouseDown(e) {
    this.model.target = e.target.nodeName;
    console.log(this.model.target);
    this.model.checkSelectedElem(e);
    this.model.getTypeOfMouseDownAction(this.model.type, e);
    if (this.model.type !== 'fill' && this.model.type !== 'stroke') { // This is a temporary option
      this.model.svgArea.mousemove(this.onSvgAreaMouseMove);
    }
    this.model.svgArea.mouseup(this.onSvgAreaMouseUp);
  }

  onSvgAreaMouseMove(e) {
    this.model.getTypeOfMouseMoveAction(this.model.type, e);
    this.model.wasMoved = true;
  }

  onSvgAreaMouseUp() {
    this.model.getTypeOfMouseUpAction(this.model.type);
    if (this.model.wasMoved) this.model.saveHistory();
    this.model.wasMoved = false;
    this.appView.removeVisibilityPanel(this.model.selectElements);
    this.appView.updateFunctionalArea(this.model.selectElements);
    this.model.svgArea.mousemove(null);
    this.model.svgArea.mouseup(null);
  }
}
