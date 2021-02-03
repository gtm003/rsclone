import {SvgAreaModel} from '../models/SvgAreaModel';
import {MainMenuController} from './MainMenuController';
import {FunctionalAreaController} from './FunctionalAreaController';
import {SvgAreaController} from './SvgAreaController';
import {ToolsLeftController} from './ToolsLeftController';
import {ContextMenuController} from './ContextMenuController';
import {HotKeysController} from './HotKeysController';
import {ColorPickerController} from './ColorPickerController';
import {SignInModalController} from './SignInModalController';

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
    this.colorController = null;
    this.signInModelController = null;

    this.onOverlayClick = this.onOverlayClick.bind(this);
  }

  init() {
    this.model.init();

    this.mainMenuController = new MainMenuController(this.appView, this.model); // модуль контроллер Главного Меню и модалок связанных с ним
    this.functionalAreaController = new FunctionalAreaController(this.appView, this.model); // модуль контроллер FunctionalArea
    this.svgAreaController = new SvgAreaController(this.appView, this.model); // модуль контроллер SvgArea
    this.toolsLeftController = new ToolsLeftController(this.appView, this.model, this.svgAreaController); // модуль контроллер ToolsLeft
    this.contextMenuController = new ContextMenuController(this.appView, this.model); // модуль контроллер ContextMenu
    this.hotKeysController = new HotKeysController(this.appView, this.model); // модуль контроллер HotKeys
    this.colorController = new ColorPickerController(this.appView, this.model); // модуль контроллер ColorPicker
    this.signInModelController = new SignInModalController(this.appView, this.model); // модуль контроллер входа в систему

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
    this.mainMenuController.addAllListeners();
    this.functionalAreaController.addAllListeners();
    this.svgAreaController.addAllListeners();
    this.toolsLeftController.addAllListeners();
    this.contextMenuController.addAllListeners();
    this.hotKeysController.addAllListeners();
    this.colorController.addAllListeners();
    this.signInModelController.addAllListeners();
    this.appView.overlay.addEventListener('click', this.onOverlayClick);
  }

  removeAllListeners() {
    this.model.svgArea.node.removeEventListener('click', (e) => {
      this.model.svgArea.node.tabIndex = '1';
      this.model.svgArea.node.focus();
    });
    this.mainMenuController.removeAllListeners();
    this.functionalAreaController.removeAllListeners();
    this.svgAreaController.removeAllListeners();
    this.toolsLeftController.removeAllListeners();
    this.contextMenuController.removeAllListeners();
    this.hotKeysController.removeAllListeners();
    this.colorController.removeAllListeners();
    this.model.removeSelect();
    this.appView.overlay.removeEventListener('click', this.onOverlayClick);
  }

  onOverlayClick({target}) {
    if (target.classList.contains('overlay')) {
      this.model.closeModalSave();
      this.model.closeModalSettings();
      this.model.closeModalSvgCode();
      this.model.closeNewImageModal();
      this.appView.colorPicker.closeColorPicker();
    }
  }
}
