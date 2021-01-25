export class SwitcherLanguageController {
  constructor(appView, model, controller) {
    this.appView = appView;
    this.model = model;
    this.controller = controller;

    this.onSwitcherLanguageClick = this.onSwitcherLanguageClick.bind(this);
  }

  init() {
    this.appView.switcherContainer.addEventListener('click', this.onSwitcherLanguageClick);
  }

  onSwitcherLanguageClick({target}) {
    if (target.tagName === 'INPUT') {
      const menuButtons = [...this.appView.menuContainer.childNodes].filter((item) => item.textContent.length !== 0);
      const toolTips = [...this.appView.toolsLeftContainer.childNodes].map((item) => item.lastChild);
      const contextMenuButtons = [...this.appView.contextMenuWindow.childNodes];
      this.appView.deleteVisibilityContextMenu();
      if (target.checked) {
        this.model.changeLanguage(menuButtons, toolTips, contextMenuButtons, 'rus');
      } else {
        this.model.changeLanguage(menuButtons, toolTips, contextMenuButtons, 'en');
      }
    }
  }
}
