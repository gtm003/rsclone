import {Controller} from '../controllers/Controller';

export class MainViewModel {
  constructor(appView) {
    this.appView = appView;

    this.controllers = [];
  }

  //сделать неактивное состояние кнопки закрытия вкладки

  init(sheetsNumber) {
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.sheets[sheetsNumber], this)];
    this.controllers[sheetsNumber].init();
    this.setActiveController(sheetsNumber);
  }

  setActiveController(tabId) {
    this.activeController = +tabId;
  }

  callNewController(sheetsNumber) {
    this.controllers[this.activeController].removeAllListeners();
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.sheets[sheetsNumber], this)];
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
    this.callNewController(this.appView.sheetsNumber - 1);
    this.removeActiveCondition();
    const tab = this.appView.createTabControl(this.appView.sheetsNumber - 1);
    this.appView.toolsBottomContainer.append(tab);
  }

  openTab(tabId) {
    this.changeController(tabId);
    this.changeActiveTab(tabId);
  }

  closeTab(tabId) {
    this.controllers[tabId].remove();
    this.controllers.splice(tabId, 1);
    this.removeTabControl(tabId);
    this.removeSheet(tabId);
    this.setActiveTab();
  }

  changeActiveTab(tabId) {
    const activeTab = this.appView.toolsBottomContainer.querySelector('.tools-bottom__tab-control--active');
    const targetTab = this.appView.toolsBottomContainer.querySelector(`[data-tab = "${tabId}"]`);

    activeTab.classList.remove('tools-bottom__tab-control--active');
    targetTab.classList.add('tools-bottom__tab-control--active');
  }

  removeActiveCondition() {
    const activeTab = this.appView.toolsBottomContainer.querySelector('.tools-bottom__tab-control--active');
    activeTab.classList.remove('tools-bottom__tab-control--active');
  }

  removeTabControl(tabId) {
    const removedTab = this.appView.toolsBottomContainer.querySelector(`[data-tab = "${tabId}"]`);
    removedTab.remove();

    const tabControls = this.appView.toolsBottomContainer.querySelectorAll('.tools-bottom__tab-control');
    tabControls.forEach((tab, i) => {
      tab.dataset[`${this.appView.tabsDataAttribute}`] = i;
      tab.innerHTML = `SVG ${i}<button class="tools-bottom__tab-close" type="button">x</button>`;
    });
  }

  removeSheet(tabId) {
    this.appView.sheets[tabId].remove();
    this.appView.sheets.splice(tabId, 1);
    this.appView.sheets.forEach((sheet, i) => {
      sheet.id = `sheet${i}`;
    });
    this.appView.sheetsNumber--;
  }

  setActiveTab() {
    const tabControls = [...this.appView.toolsBottomContainer.querySelectorAll('.tools-bottom__tab-control')];
    let activeTabId;

    tabControls.forEach(tabControl => {
      if (tabControl.classList.contains('tools-bottom__tab-control--active')) {
        activeTabId = +tabControl.dataset[`${this.appView.tabsDataAttribute}`];
      }
    });

    if (activeTabId === undefined) {
      activeTabId = tabControls.length - 1;
      tabControls[activeTabId].classList.add('tools-bottom__tab-control--active');
      this.controllers[activeTabId].addAllListeners();
    }

    this.setActiveController(activeTabId);
  }
}
