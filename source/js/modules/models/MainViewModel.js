import {Controller} from '../controllers/Controller';

export class MainViewModel {
  constructor(appView) {
    this.appView = appView;

    this.controller1 = null;
    this.controller2 = null;

    this.controllers = [];
  }

  init(sheetsNumber) {
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.sheets[sheetsNumber - 1], this)];
    this.controllers[sheetsNumber - 1].init();
    this.activeController = sheetsNumber - 1;
    // this.controller1 = new Controller(this.appView, this.appView.sheet1, this);
    // this.controller1.init();
  }

  setActiveController(tabId) {
    this.activeController = +tabId;
  }

  callNewController(sheetsNumber) {
    // console.log(this.appView.sheet2)
    this.controllers[this.activeController].removeAllListeners();
    this.controllers = [...this.controllers, new Controller(this.appView, this.appView.sheets[sheetsNumber], this)];
    this.controllers[this.controllers.length - 1].init();
    this.setActiveController(sheetsNumber);
    // this.controller2 = new Controller(this.appView, this.appView.sheet2, this)
    // this.controller2.init();
    // this.controller1.removeAllListeners();
  }

  changeController(tabId) {
    // if (tabId === '1') {
    //   this.controller2.removeAllListeners();
    //   this.controller1.addAllListeners();
    // } else if (tabId === '2') {
    //   this.controller1.removeAllListeners();
    //   this.controller2.addAllListeners();
    // }
    console.log(this.activeController)
    console.log(tabId)
    this.controllers[this.activeController].removeAllListeners();
    this.controllers[tabId].addAllListeners();
    this.setActiveController(tabId);
  }

  createNewTab() {
    // this.appView.init();
    // this.appView.sheet2 = this.appView.createSheet('2');
    // this.appView.workAreaContainer.append(this.appView.sheet2);
    // this.createNewSvgWorkArea();
    this.callNewController(this.appView.sheetsNumber - 1);
    const tab = this.appView.createTabControl(this.appView.sheetsNumber - 1);
    this.appView.toolsBottomContainer.append(tab);
  }

  openTab(tabId) {
    this.changeController(tabId);
  }

  closeTab(tabId) {

  }
}
