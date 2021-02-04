import {Controller} from '../controllers/Controller';
import {SwitcherLanguageController} from '../controllers/SwitcherLanguageController';
import {TabsController} from '../controllers/TabsController';
import {LoadingController} from '../controllers/LoadingController';
import {
  MENU_BUTTONS_NAMES_EN,
  CONTEXTMENU_NAMES_EN,
  TOOLS_LEFT_NAMES_EN,
  NEW_IMAGE_NAMES_EN,
  SAVE_MODAL_NAMES_EN,
  SETTING_MODAL_NAMES_EN,
  SVG_CODE_MODAL_NAMES_EN,
  BTN_COLOR_PICKER_EN,
  MENU_BUTTONS_NAMES_RUS,
  CONTEXTMENU_NAMES_RUS,
  TOOLS_LEFT_NAMES_RUS,
  NEW_IMAGE_NAMES_RUS,
  SAVE_MODAL_NAMES_RUS,
  SETTING_MODAL_NAMES_RUS,
  SVG_CODE_MODAL_NAMES_RUS,
  BTN_COLOR_PICKER_RUS,
} from '../../utils/btn-names';

export class MainViewModel {
  constructor(appView) {
    this.appView = appView;

    this.controllers = [];
  }

  init(tabsCount) {
    new SwitcherLanguageController(this.appView, this).addAllListeners();
    new TabsController(this.appView, this).addAllListeners();
    new LoadingController(this).addAllListeners();
    this.loadLastCondition(tabsCount);
  }

  setActiveController(tabId) {
    this.activeController = +tabId;
  }

  callNewController(tabsCount, lastCondition) {
    this.controllers[this.activeController].removeAllListeners();
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[tabsCount], this, lastCondition)];
    this.controllers[this.controllers.length - 1].init();
    this.setActiveController(tabsCount);
  }

  changeController(tabId) {
    this.controllers[this.activeController].removeAllListeners();
    this.controllers[tabId].addAllListeners();
    this.setActiveController(tabId);
    this.controllers[tabId].model.changeActiveButton(this.controllers[tabId].model.type);
  }

  createNewTab(lastCondition) {
    this.removeActiveConditionTab();
    this.removeActiveConditionTabControl();

    this.appView.renderTab();
    this.appView.renderTabControl();

    this.callNewController(this.appView.tabs.length - 1, lastCondition);
  }

  openTab(tabId) {
    if (this.activeController === +tabId) return;

    this.changeController(tabId);

    this.removeActiveConditionTabControl();
    this.setActiveConditionTabControl(tabId);

    this.removeActiveConditionTab();
    this.setActiveConditionTab(tabId);
  }

  closeTab(tabId) {
    if (this.appView.tabs.length === 1) return;
    this.controllers[tabId].remove();
    this.controllers.splice(tabId, 1);
    this.removeTabControl(tabId);
    this.removeTab(tabId);
    this.setActiveTab();
  }

  setActiveConditionTabControl(tabId) {
    this.appView.tabControls[tabId].classList.add('tools-bottom__tab-control--active');
  }

  removeActiveConditionTabControl() {
    this.appView.tabControls.forEach(tabControl => {
      if (tabControl.classList.contains('tools-bottom__tab-control--active')) tabControl.classList.remove('tools-bottom__tab-control--active');
    });
  }

  setActiveConditionTab(tabId) {
    this.appView.tabs[tabId].classList.add('tab--active');
  }

  removeActiveConditionTab() {
    this.appView.tabs.forEach(tab => {
      if (tab.classList.contains('tab--active')) tab.classList.remove('tab--active');
    });
  }

  removeTabControl(tabId) {
    this.appView.tabControls[tabId].parentElement.remove();
    this.appView.tabControls.splice(tabId, 1);
    this.appView.tabControls.forEach((tabControl, i) => {
      tabControl.dataset[`${this.appView.tabsDataAttribute}`] = i;
      tabControl.textContent = `SVG ${i}`;
    });
  }

  removeTab(tabId) {
    this.appView.tabs[tabId].remove();
    this.appView.tabs.splice(tabId, 1);
    this.appView.tabs.forEach((sheet, i) => {
      sheet.id = `sheet${i}`;
    });
  }

  setActiveTab() {
    let activeTabId;

    this.appView.tabControls.forEach(tabControl => {
      if (tabControl.classList.contains('tools-bottom__tab-control--active')) {
        activeTabId = +tabControl.dataset[`${this.appView.tabsDataAttribute}`];
      }
    });

    if (activeTabId === undefined) {
      activeTabId = 0;
      this.appView.tabControls[activeTabId].classList.add('tools-bottom__tab-control--active');
      this.appView.tabs[activeTabId].classList.add('tab--active');
      this.controllers[activeTabId].addAllListeners();
    }

    this.setActiveController(activeTabId);
  }

  saveLastCondition() {
    let appLastCondition = [];

    this.controllers.forEach(controller => {
      const tabLastCondition = controller.model.getLastCondition();
      appLastCondition = [...appLastCondition, tabLastCondition];
    });

    localStorage.setItem('SvgEditor_lastCondition', JSON.stringify(appLastCondition));
  }

  loadLastCondition(tabsCount) {
    const lastConditions = JSON.parse(localStorage.getItem('SvgEditor_lastCondition'));

    if (lastConditions === null || lastConditions.length === 0) {
      this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[tabsCount], this)];
      this.controllers[tabsCount].init();
      this.setActiveController(tabsCount);
      return
    }

    lastConditions.forEach((lastCondition, i) => {
      if (i === 0) {
        this.controllers = [...this.controllers, new Controller(this.appView, this.appView.tabs[i], this, lastCondition)];
        this.controllers[i].init();
        this.setActiveController(i);
      } else {
        this.createNewTab(lastCondition);
      }
    });

    this.openTab(tabsCount);
  }

  changeLanguage(menuButtons, toolTips, contextMenuButtons, newImageModal, saveModal, settingsModal, svgCodeModal, btnColorPicker, strLang) {
    menuButtons.forEach((item, index) => {
      if (strLang === 'rus') {
        item.textContent = MENU_BUTTONS_NAMES_RUS[index];
      } else {
        item.textContent = MENU_BUTTONS_NAMES_EN[index];
      }
    });

    toolTips.forEach((item, index) => {
      if (strLang === 'rus') {
        item.textContent = TOOLS_LEFT_NAMES_RUS[index];
      } else {
        item.textContent = TOOLS_LEFT_NAMES_EN[index];
      }
    });

    contextMenuButtons.forEach((item, index) => {
      if (strLang === 'rus') {
        item.textContent = CONTEXTMENU_NAMES_RUS[index];
      } else {
        item.textContent = CONTEXTMENU_NAMES_EN[index];
      }
    });

    newImageModal.forEach((item, index) => {
      if (strLang === 'rus') {
        item.childNodes[0].textContent = NEW_IMAGE_NAMES_RUS[index][0];
        item.childNodes[1].textContent = NEW_IMAGE_NAMES_RUS[index][1];
      } else {
        item.childNodes[0].textContent = NEW_IMAGE_NAMES_EN[index][0];
        item.childNodes[1].textContent = NEW_IMAGE_NAMES_EN[index][1];
      }
    });

    saveModal.forEach((item, index) => {
      if (index !== 2 && index !== 3) {
        if (strLang === 'rus') {
          item.textContent = SAVE_MODAL_NAMES_RUS[index];
        } else {
          item.textContent = SAVE_MODAL_NAMES_EN[index];
        }
      } else if (index === 3) {
        if (strLang === 'rus') {
          item.childNodes[0].textContent = SAVE_MODAL_NAMES_RUS[index - 1][0];
          item.childNodes[1].textContent = SAVE_MODAL_NAMES_RUS[index - 1][1];
        } else {
          item.childNodes[0].textContent = SAVE_MODAL_NAMES_EN[index - 1][0];
          item.childNodes[1].textContent = SAVE_MODAL_NAMES_EN[index - 1][1];
        }
      }
    });

    settingsModal.forEach((item, index) => {
      if (index === 0) {
        if (strLang === 'rus') {
          item.textContent = SETTING_MODAL_NAMES_RUS[index];
        } else {
          item.textContent = SETTING_MODAL_NAMES_EN[index];
        }
      } else if (index === 1 || index === 2) {
        if (strLang === 'rus') {
          item.childNodes[0].textContent = SETTING_MODAL_NAMES_RUS[index];
        } else {
          item.childNodes[0].textContent = SETTING_MODAL_NAMES_EN[index];
        }
      } else {
        if (strLang === 'rus') {
          item.childNodes[0].textContent = SETTING_MODAL_NAMES_RUS[index][0];
          item.childNodes[1].textContent = SETTING_MODAL_NAMES_RUS[index][1];
        } else {
          item.childNodes[0].textContent = SETTING_MODAL_NAMES_EN[index][0];
          item.childNodes[1].textContent = SETTING_MODAL_NAMES_EN[index][1];
        }
      }
    });

    svgCodeModal.forEach((item, index) => {
      if (index === 0) {
        if (strLang === 'rus') {
          item.textContent = SVG_CODE_MODAL_NAMES_RUS[index];
        } else {
          item.textContent = SVG_CODE_MODAL_NAMES_EN[index];
        }
      } else if (index === 2) {
        if (strLang === 'rus') {
          item.childNodes[0].textContent = SVG_CODE_MODAL_NAMES_RUS[index - 1];
        } else {
          item.childNodes[0].textContent = SVG_CODE_MODAL_NAMES_EN[index - 1];
        }
      }
    });

    btnColorPicker.forEach((item, index) => {
      if (strLang === 'rus') {
        item.value = BTN_COLOR_PICKER_RUS[index];
      } else {
        item.value = BTN_COLOR_PICKER_EN[index];
      }
    });
  }
}
