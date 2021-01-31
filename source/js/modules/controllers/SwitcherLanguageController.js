export class SwitcherLanguageController {
  constructor(appView, viewModel) {
    this.appView = appView;
    this.viewModel = viewModel;

    this.onSwitcherLanguageClick = this.onSwitcherLanguageClick.bind(this);
  }

  addAllListeners() {
    this.appView.switcherContainer.addEventListener('click', this.onSwitcherLanguageClick);
  }

  removeAllListeners() {
    this.appView.switcherContainer.removeEventListener('click', this.onSwitcherLanguageClick);
  }

  onSwitcherLanguageClick({target}) {
    if (target.tagName === 'INPUT') {
      const menuButtons = [...this.appView.menuContainer.childNodes].filter((item) => item.textContent.length !== 0);
      const toolTips = [...this.appView.toolsLeftContainer.childNodes].map((item) => item.lastChild);
      const contextMenuButtons = [...this.appView.contextMenuWindow.childNodes];
      this.appView.deleteVisibilityContextMenu();
      if (target.checked) {
        this.viewModel.changeLanguage(menuButtons, toolTips, contextMenuButtons, 'rus');
      } else {
        this.viewModel.changeLanguage(menuButtons, toolTips, contextMenuButtons, 'en');
      }
    }
  }
}
