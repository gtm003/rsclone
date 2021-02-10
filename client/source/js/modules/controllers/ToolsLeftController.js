export class ToolsLeftController {
  constructor(appView, model, svgAreaController) {
    this.appView = appView;
    this.model = model;
    this.svgAreaController = svgAreaController; // убрать

    this.onToolsLeftClick = this.onToolsLeftClick.bind(this);
  }

  addAllListeners() {
    this.appView.toolsLeftContainer.addEventListener('click', this.onToolsLeftClick);
  }

  removeAllListeners() {
    this.appView.toolsLeftContainer.removeEventListener('click', this.onToolsLeftClick);
  }

  onToolsLeftClick({target}) {
    this.appView.deleteVisibilityContextMenu();
    this.model.removeSelect();
    this.appView.removeVisibilityPanel(this.model.selectElements);

    if (target.closest('button')) {
      if (this.model.isActiveText) this.model.onTextBlur();
      const toolButtonId = target.closest('button').id;
      this.model.type = toolButtonId;
      this.model.changeActiveButton(toolButtonId);
      if (toolButtonId === 'fill' || toolButtonId === 'stroke') {
        this.appView.colorPicker.openColorPicker();
        this.model.addOverlay();
      }
    }
  }
}
