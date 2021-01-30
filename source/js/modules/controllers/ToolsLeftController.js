export class ToolsLeftController {
  constructor(appView, model, svgAreaController) {
    this.appView = appView;
    this.model = model;
    this.svgAreaController = svgAreaController;

    this.onToolsLeftClick = this.onToolsLeftClick.bind(this);
  }

  addAllListeners() {
    this.appView.toolsLeftContainer.addEventListener('click', this.onToolsLeftClick);
  }

  removeAllListeners() {
    this.appView.toolsLeftContainer.removeEventListener('click', this.onToolsLeftClick);
  }

  onToolsLeftClick({target}) {
    console.log(target)
    if (target.closest('button')) {
      if (this.model.isActiveText) this.model.onTextBlur();
      this.model.removeSelect();
      const toolButtonId = target.closest('button').id;
      this.model.type = toolButtonId;
      this.model.svgArea.mousedown(null);
      this.model.svgArea.mousedown(this.svgAreaController.onSvgAreaMouseDown);
      if (toolButtonId === 'fill' || toolButtonId === 'stroke') {
        this.appView.colorPicker.openColorPicker();
      }
    }
  }
}
