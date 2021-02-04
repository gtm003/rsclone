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
    const button = target.closest('[data-tab]');

    if (!button) return;
    const tabDataId = button.dataset[`${this.appView.tabsDataAttribute}`];

    if (tabDataId) {
      if (tabDataId === 'new') {
        this.viewModel.createNewTab();
      } else if (tabDataId !== 'close') {
        this.viewModel.openTab(tabDataId);
      }
    }

    const closeBtn = target.closest('.tools-bottom__tab-close');

    if (closeBtn) {
      const numberClosedTab = closeBtn.previousSibling.dataset[`${this.appView.tabsDataAttribute}`];
      this.viewModel.closeTab(numberClosedTab);
    }
  }
}
