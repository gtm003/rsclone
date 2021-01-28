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
      // tabDataId === 'new' ? console.log('create' + tabDataId + 'tab') : console.log('open tab' + tabDataId);
      if (tabDataId === 'new') {
        this.appView.renderSheet();
        this.viewModel.createNewTab();
      } else {
        this.viewModel.openTab(tabDataId);
      }
    }

    if (target.classList.contains('tools-bottom__tab-close')) {
      const numberClosedTab = target.parentElement.dataset[`${this.appView.tabsDataAttribute}`];
      console.log('tab for close' + numberClosedTab)
      // this.model.closeTab(numberClosedTab);
      this.viewModel.closeTab(numberClosedTab);
    }
  }
}
