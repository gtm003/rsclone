export class SvgController {
  constructor(model) {
    this.model = model;
    this.wasMoved = false;

    this.onSvgAreaMouseDown = this.onSvgAreaMouseDown.bind(this);
    this.onSvgAreaMouseMove = this.onSvgAreaMouseMove.bind(this);
    this.onSvgAreaMouseUp = this.onSvgAreaMouseUp.bind(this);
  }

  onSvgAreaMouseDown(e) {
    this.model.foo(e);
    this.model.getTypeOfMouseDownAction(this.model.type, e);
    if (this.model.type !== 'fill' && this.model.type !== 'stroke') {
      this.model.svgArea.mousemove(this.onSvgAreaMouseMove);
    }
    this.model.svgArea.mouseup(this.onSvgAreaMouseUp);
  }

  onSvgAreaMouseMove(e) {
    this.model.getTypeOfMouseMoveAction(this.model.type, e);
    this.wasMoved = true;
  }

  onSvgAreaMouseUp() {
    if (this.wasMoved) this.model.saveHistory();
    this.wasMoved = false;
    this.model.svgArea.mousemove(null);
    this.model.svgArea.mouseup(null);
  }
}
