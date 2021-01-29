import {Controller} from '../controllers/Controller';

export class MainViewModel {
  constructor(appView) {
    this.appView = appView;

    this.controllers = [];
  }

  //сделать неактивное состояние кнопки закрытия вкладки

  init(sheetsNumber) {
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[sheetsNumber], this)];
    this.controllers[sheetsNumber].init();
    this.setActiveController(sheetsNumber);
  }

  setActiveController(tabId) {
    this.activeController = +tabId;
  }

  callNewController(sheetsNumber) {
    this.controllers[this.activeController].removeAllListeners();
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[sheetsNumber], this)];
    this.controllers[this.controllers.length - 1].init();
    this.setActiveController(sheetsNumber);
  }

  changeController(tabId) {
    if (this.activeController === +tabId) return;
    this.controllers[this.activeController].removeAllListeners();
    this.controllers[tabId].addAllListeners();
    this.setActiveController(tabId);
  }

  createNewTab() {
    this.appView.renderTab();
    this.callNewController(this.appView.tabs.length - 1);
    this.removeActiveConditionTabControl();
    this.appView.renderTabControl();
  }

  openTab(tabId) {
    this.changeController(tabId);
    this.changeActiveTabControl(tabId);
  }

  closeTab(tabId) {
    if (this.appView.tabs.length === 1) return;
    this.controllers[tabId].remove();
    this.controllers.splice(tabId, 1);
    this.removeTabControl(tabId);
    this.removeTab(tabId);
    this.setActiveTabControl();
  }

  changeActiveTabControl(tabId) {
    if (this.appView.tabControls.length === 1) return;
    const activeTab = this.appView.toolsBottomContainer.querySelector('.tools-bottom__tab-control--active');
    const targetTab = this.appView.toolsBottomContainer.querySelector(`[data-tab = "${tabId}"]`);

    activeTab.classList.remove('tools-bottom__tab-control--active');
    targetTab.classList.add('tools-bottom__tab-control--active');
  }

  removeActiveConditionTabControl() {
    const activeTab = this.appView.toolsBottomContainer.querySelector('.tools-bottom__tab-control--active');
    activeTab.classList.remove('tools-bottom__tab-control--active');
  }

  removeTabControl(tabId) {
    const removedTab = this.appView.toolsBottomContainer.querySelector(`[data-tab = "${tabId}"]`);
    removedTab.remove();
    this.appView.tabControls.splice(tabId, 1);

    this.appView.tabControls.forEach((tab, i) => {
      tab.dataset[`${this.appView.tabsDataAttribute}`] = i;
      tab.innerHTML = `SVG ${i}<button class="tools-bottom__tab-close" type="button">x</button>`;
    });
  }

  removeTab(tabId) {
    this.appView.tabs[tabId].remove();
    this.appView.tabs.splice(tabId, 1);
    this.appView.tabs.forEach((sheet, i) => {
      sheet.id = `sheet${i}`;
    });
  }

  setActiveTabControl() {
    let activeTabId;

    this.appView.tabControls.forEach(tabControl => {
      if (tabControl.classList.contains('tools-bottom__tab-control--active')) {
        activeTabId = +tabControl.dataset[`${this.appView.tabsDataAttribute}`];
      }
    });

    if (activeTabId === undefined) {
      activeTabId = 0;
      this.appView.tabControls[activeTabId].classList.add('tools-bottom__tab-control--active');
      this.controllers[activeTabId].addAllListeners();
    }

    this.setActiveController(activeTabId);
  }
}
