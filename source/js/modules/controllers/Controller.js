import {SvgAreaModel} from '../models/SvgAreaModel';
import {MainMenuController} from './MainMenuController';
import {FunctionalAreaController} from './FunctionalAreaController';
import {SvgAreaController} from './SvgAreaController';
import {ToolsLeftController} from './ToolsLeftController';
import {ContextMenuController} from './ContextMenuController';
import {SwitcherLanguageController} from './SwitcherLanguageController';
import {HotKeysController} from './HotKeysController';

const FILE_TYPE = 'svg';

export class Controller {
  constructor(appView, placeForSVGCanvas) {
    this.appView = appView;
    this.placeForSVGCanvas = placeForSVGCanvas;
    this.model = new SvgAreaModel(this.appView, this.placeForSVGCanvas);

    this.menuController = null;
    this.svgAreaController = null;
    this.toolsLeftController = null;

    this.onChangeColorClick = this.onChangeColorClick.bind(this);
    this.onWindowBeforeUnload = this.onWindowBeforeUnload.bind(this);
  }

  init() {
    this.model.init();
    this.appView.colorPicker.btnUserAnswerContainer.addEventListener('click', this.onChangeColorClick);

    window.addEventListener('beforeunload', this.onWindowBeforeUnload);

    // тестовая часть, вариант решения с обработчиком горячих клавиш на svg
    this.model.svgArea.node.addEventListener('keydown', (e) => {
      console.log(e);
    });
    this.model.svgArea.node.addEventListener('click', (e) => {
      console.log(e);
      this.model.svgArea.node.tabIndex = '1';
      this.model.svgArea.node.focus();
    });

    // модуль контроллер Главного Меню и модалок связанных с ним
    this.menuController = new MainMenuController(this.appView, this.model, this);
    this.menuController.init();
    // модуль контроллер FunctionalArea
    this.functionalAreaController = new FunctionalAreaController(this.appView, this.model, this);
    this.functionalAreaController.init();
    // модуль контроллер SvgArea
    this.svgAreaController = new SvgAreaController(this.appView, this.model, this);
    this.svgAreaController.init();
    // модуль контроллер ToolsLeft
    this.toolsLeftController = new ToolsLeftController(this.appView, this.model, this, this.svgAreaController);
    this.toolsLeftController.init();
    // модуль контроллер ContextMenu
    this.contextMenuController = new ContextMenuController(this.appView, this.model, this);
    this.contextMenuController.init();
    // модуль контроллер SwitcherLanguage
    this.switcherLanguageController = new SwitcherLanguageController(this.appView, this.model, this);
    this.switcherLanguageController.init();
    // модуль контроллер HotKeys
    this.hotKeysController = new HotKeysController(this.appView, this.model, this);
    this.hotKeysController.init();
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

  onWindowBeforeUnload() {
    this.model.saveLastCondition();
  }
}
