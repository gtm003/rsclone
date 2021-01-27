import {SvgAreaModel} from '../models/SvgAreaModel';
import {MainMenuController} from './MainMenuController';
import {FunctionalAreaController} from './FunctionalAreaController';
import {SvgAreaController} from './SvgAreaController';
import {ToolsLeftController} from './ToolsLeftController';
import {ContextMenuController} from './ContextMenuController';
import {SwitcherLanguageController} from './SwitcherLanguageController';
import {HotKeysController} from './HotKeysController';
import {TabsController} from './TabsController';

export class Controller {
  constructor(appView, tab) {
    this.appView = appView;
    this.tab = tab;
    this.model = new SvgAreaModel(this.appView, this.tab);

    this.onChangeColorClick = this.onChangeColorClick.bind(this);
    this.onWindowBeforeUnload = this.onWindowBeforeUnload.bind(this);
  }

  init() {
    this.model.init();
    this.appView.colorPicker.btnUserAnswerContainer.addEventListener('click', this.onChangeColorClick);

    window.addEventListener('beforeunload', this.onWindowBeforeUnload);

    // тестовая часть, вариант решения с обработчиком горячих клавиш на svg
    this.model.svgArea.node.addEventListener('keydown', (e) => {
      // console.log(e);
    });
    this.model.svgArea.node.addEventListener('click', (e) => {
      // console.log(e);
      this.model.svgArea.node.tabIndex = '1';
      this.model.svgArea.node.focus();
    });


    new MainMenuController(this.appView, this.model).init(); // модуль контроллер Главного Меню и модалок связанных с ним
    this.functionalAreaController = new FunctionalAreaController(this.appView, this.model).init(); // модуль контроллер FunctionalArea
    const svgAreaController = new SvgAreaController(this.appView, this.model); // модуль контроллер SvgArea
    svgAreaController.init();

    new ToolsLeftController(this.appView, this.model, svgAreaController).init(); // модуль контроллер ToolsLeft
    new ContextMenuController(this.appView, this.model).init(); // модуль контроллер ContextMenu
    new SwitcherLanguageController(this.appView, this.model).init(); // модуль контроллер SwitcherLanguage
    new HotKeysController(this.appView, this.model).init(); // модуль контроллер HotKeys
    new TabsController(this.appView, this.model).init(); // модуль контроллер вкладок
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
