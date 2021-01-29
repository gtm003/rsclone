export class TabsController {
  constructor(appView, viewModel) {
    this.appView = appView;
    this.viewModel = viewModel;

    this.onToolsBottomClick = this.onToolsBottomClick.bind(this);
  }

  addAllListeners() {
    this.appView.toolsBottomContainer.addEventListener('click', this.onToolsBottomClick);
  }

  removeAllListeners() {
    this.appView.toolsBottomContainer.removeEventListener('click', this.onToolsBottomClick);
  }

  onToolsBottomClick({ target }) {
    const tabDataId = target.dataset[`${this.appView.tabsDataAttribute}`];

    if (tabDataId) {
      if (tabDataId === 'new') {
        this.viewModel.createNewTab();
      } else {
        this.viewModel.openTab(tabDataId);
      }
    }

    if (target.classList.contains('tools-bottom__tab-close')) {
      const numberClosedTab = target.parentElement.dataset[`${this.appView.tabsDataAttribute}`];
      this.viewModel.closeTab(numberClosedTab);
    }

    console.log(this.viewModel.controllers);
    console.log(this.appView.tabs);
    console.log(this.appView.tabControls);
    console.log(this.viewModel.activeController);
  }
}
