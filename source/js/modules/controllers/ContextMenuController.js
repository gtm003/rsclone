export class ContextMenuController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onContextMenuClick = this.onContextMenuClick.bind(this);
    this.onContextMenuMouseDown = this.onContextMenuMouseDown.bind(this);
    this.onContextMenuElementsClick = this.onContextMenuElementsClick.bind(this);
  }

  init() {
    this.model.svgArea.node.addEventListener('contextmenu', this.onContextMenuClick);
    this.model.svgArea.node.addEventListener('mousedown', this.onContextMenuMouseDown);
    this.appView.contextMenuWindow.addEventListener('click', this.onContextMenuElementsClick);
  }

  onContextMenuClick(evt) {
    this.model.appearContextMenu(evt);
  }

  onContextMenuMouseDown() {
    this.appView.deleteVisibilityContextMenu();
  }

  onContextMenuElementsClick({target}) {
    switch (target.dataset[this.appView.propertiesDataAttribute]) {
      case 'Delete':
        this.model.deleteElements();
        this.appView.removeVisibilityPanel(this.model.selectElements);
        break;
      case 'Copy':
        this.model.copyElements();
        break;
      case 'Paste':
        this.model.pasteElements();
        break;
      case 'Bring to Front':
        this.model.bringToFront();
        break;
      case 'Send to Back':
        this.model.sendToBack();
        break;
    }
  }
}
