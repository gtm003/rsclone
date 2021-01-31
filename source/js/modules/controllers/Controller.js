import {SvgAreaModel} from '../models/SvgAreaModel';
import {MainMenuController} from './MainMenuController';
import {FunctionalAreaController} from './FunctionalAreaController';
import {SvgAreaController} from './SvgAreaController';
import {ToolsLeftController} from './ToolsLeftController';
import {ContextMenuController} from './ContextMenuController';
import {HotKeysController} from './HotKeysController';

export class Controller {
  constructor(appView, svgRootElement, viewModel, lastCondition) {
    this.appView = appView;
    this.svgRootElement = svgRootElement;
    this.viewModel = viewModel;
    this.model = new SvgAreaModel(this.appView, this.svgRootElement, lastCondition);

    this.mainMenuController = null;
    this.functionalAreaController = null;
    this.svgAreaController = null;
    this.toolsLeftController = null;
    this.contextMenuController = null;
    this.hotKeysController = null;

    this.onChangeColorClick = this.onChangeColorClick.bind(this);
  }

  init() {
    this.model.init();

    this.mainMenuController = new MainMenuController(this.appView, this.model); // модуль контроллер Главного Меню и модалок связанных с ним
    this.functionalAreaController = new FunctionalAreaController(this.appView, this.model); // модуль контроллер FunctionalArea
    this.svgAreaController = new SvgAreaController(this.appView, this.model); // модуль контроллер SvgArea
    this.toolsLeftController = new ToolsLeftController(this.appView, this.model, this.svgAreaController); // модуль контроллер ToolsLeft
    this.contextMenuController = new ContextMenuController(this.appView, this.model); // модуль контроллер ContextMenu
    this.hotKeysController = new HotKeysController(this.appView, this.model); // модуль контроллер HotKeys

    this.addAllListeners();
  }

  remove() {
    this.removeAllListeners();
    this.model.svgArea = null;
    this.model = null;
  }

  addAllListeners() {
    this.model.svgArea.node.addEventListener('click', (e) => {
      this.model.svgArea.node.tabIndex = '1';
      this.model.svgArea.node.focus();
    });
    this.appView.colorPicker.btnUserAnswerContainer.addEventListener('click', this.onChangeColorClick);
    this.mainMenuController.addAllListeners();
    this.functionalAreaController.addAllListeners();
    this.svgAreaController.addAllListeners();
    this.toolsLeftController.addAllListeners();
    this.contextMenuController.addAllListeners();
    this.hotKeysController.addAllListeners();
  }

  removeAllListeners() {
    this.model.svgArea.node.removeEventListener('click', (e) => {
      this.model.svgArea.node.tabIndex = '1';
      this.model.svgArea.node.focus();
    });
    this.appView.colorPicker.btnUserAnswerContainer.removeEventListener('click', this.onChangeColorClick);
    this.mainMenuController.removeAllListeners();
    this.functionalAreaController.removeAllListeners();
    this.svgAreaController.removeAllListeners();
    this.toolsLeftController.removeAllListeners();
    this.contextMenuController.removeAllListeners();
    this.hotKeysController.removeAllListeners();
    this.model.removeSelect()
  }

  onChangeColorClick({target}) {
    if (target.id === 'OK') {
      if (this.model.type === 'fill') {
        this.model.fillColor = this.appView.colorPicker.color;
        [...this.appView.toolsLeftContainer.childNodes][7].style.background = this.appView.colorPicker.color;
      }
      else if (this.model.type === 'stroke') {
        this.model.strokeColor = this.appView.colorPicker.color;
      }
      this.appView.colorPicker.closeColorPicker();
    }
    if (target.id === 'CANSEL') {
      this.appView.colorPicker.closeColorPicker();
    }
  }
}
