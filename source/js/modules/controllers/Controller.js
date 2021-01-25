import {Model} from '../models/SVGAreaModel';
import {MENU_BUTTONS_NAMES_EN, CONTEXTMENU_NAMES_EN, TOOLS_LEFT_NAMES_EN, MENU_BUTTONS_NAMES_RUS, CONTEXTMENU_NAMES_RUS, TOOLS_LEFT_NAMES_RUS} from '../../utils/btn-names';
import {MainMenuController} from './MainMenuController';
const FILE_TYPE = 'svg';

export class Controller {
  constructor(appView, placeForSVGCanvas) {
    this.fill = 'none';
    this.stroke = 'black';
    this.placeForSVGCanvas = placeForSVGCanvas;
    this.appView = appView;
    this.model = new Model(this.appView, this.placeForSVGCanvas);

    this.onChangeColorClick = this.onChangeColorClick.bind(this);
    this.onToolsLeftClick = this.onToolsLeftClick.bind(this);
    this.onWindowBeforeUnload = this.onWindowBeforeUnload.bind(this);

    this.onPropertiesSVGElementKeyUp = this.onPropertiesSVGElementKeyUp.bind(this);
    this.onDeleteElementsClick = this.onDeleteElementsClick.bind(this);
    this.onAlignPanelClick = this.onAlignPanelClick.bind(this);
    this.onSelectPropertyChange = this.onSelectPropertyChange.bind(this);
    this.onContextMenuClick = this.onContextMenuClick.bind(this);
    this.onContextMenuMouseDown = this.onContextMenuMouseDown.bind(this);
    this.onContextMenuElementsClick = this.onContextMenuElementsClick.bind(this);
    this.onSwitcherLanguageClick = this.onSwitcherLanguageClick.bind(this);
    this.onHotKeysKeyUp = this.onHotKeysKeyUp.bind(this);

    this.copiedElements = [];
  }

  init() {
    this.model.init();
    this.model.svgArea.mousedown(this.model.onSvgAreaMouseDown);
    this.appView.colorPicker.btnUserAnswerContainer.addEventListener('click', this.onChangeColorClick);
    this.appView.toolsLeftContainer.addEventListener('click', this.onToolsLeftClick);

    this.appView.rectContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.lineContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.ellipseContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.textContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    // this.appView.pencilContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.rectContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.lineContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.ellipseContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.textContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.selectProperty.addEventListener('change', this.onSelectPropertyChange);
    // this.appView.pencilContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.alignContainerPanel.addEventListener('click', this.onAlignPanelClick);
    this.appView.sheet.addEventListener('contextmenu', this.onContextMenuClick);
    this.appView.sheet.addEventListener('mousedown', this.onContextMenuMouseDown);
    this.appView.contextMenuWindow.addEventListener('click', this.onContextMenuElementsClick);
    this.appView.switcherContainer.addEventListener('click', this.onSwitcherLanguageClick);
    document.addEventListener('keyup', this.onHotKeysKeyUp);
    window.addEventListener('beforeunload', this.onWindowBeforeUnload);

    // тестовая часть, вариант решения с обработчиком горячих клавиш на svg
    this.model.svgArea.node.addEventListener('keydown', (e) => {
      console.log(e);
    })
    this.model.svgArea.node.addEventListener('click', (e) => {
      console.log(e);
      this.model.svgArea.node.tabIndex = '1';
      this.model.svgArea.node.focus();
    })

    // отдельный модуль контроллер Главного Меню и модалок связанных с ним
    new MainMenuController(this.appView, this.model, this).init();
  }

  onToolsLeftClick({target}) {
    if (target.closest('button')) {
      const toolButtonId = target.closest('button').id;
      this.model.type = toolButtonId;
      this.model.svgArea.mousedown(null);
      this.model.svgArea.mousedown(this.model.onSvgAreaMouseDown);
      if (toolButtonId === 'fill' || toolButtonId === 'stroke') {
        this.appView.colorPicker.openColorPicker();
      }
    }
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

  onPropertiesSVGElementKeyUp({target}) {
    if (target.dataset['delete'] !== 'delete' && target.dataset['convert'] !== 'convert') {
      this.changePropertiesSVGElement(target);
    }
  }

  onDeleteElementsClick({target}) {
    if (target.closest('.tools-top__functional-area__container__btn--click') !== null) {
      if (target.closest('.tools-top__functional-area__container__btn--click').dataset[this.appView.propertiesDataAttribute] === 'delete') {
        this.deleteElements();
      }
    }
  }

  onAlignPanelClick({target}) {
    if (target.closest('.tools-top__functional-area__container__btn--click') !== null) {
      const dataAttribute = target.closest('.tools-top__functional-area__container__btn--click').dataset[this.appView.alignPanelDataAttribute];
      if (dataAttribute === 'disabled_by_default') {
        this.deleteElements();
      } else if (dataAttribute === 'timeline') {
      } else {
        this.alignElements(dataAttribute);
      }
    }
  }

  onSelectPropertyChange({target}) {
    this.changeSelectProperty(target);
  }

  onContextMenuClick(evt) {
    if (evt.target.parentElement.tagName === 'svg' || evt.target.tagName) {
      this.appearContextMenu(evt);
    }
  }

  onContextMenuMouseDown() {
    this.deleteVisibilityContextMenu();
  }

  onContextMenuElementsClick({target}) {
    switch (target.dataset[this.appView.propertiesDataAttribute]) {
      case 'Delete':
        this.deleteElements();
        this.appView.removeVisibilityPanel(this.model.selectElements);
        break;
      case 'Copy':
        this.copyElements();
        break;
      case 'Paste':
        this.pasteElements();
        break;
    }
  }

  onSwitcherLanguageClick({target}) {
    if (target.tagName === 'INPUT') {
      const menuButtons = [...this.appView.menuContainer.childNodes].filter((item) => item.textContent.length !== 0);
      const toolTips = [...this.appView.toolsLeftContainer.childNodes].map((item) => item.lastChild);
      const contextMenuButtons = [...this.appView.contextMenuWindow.childNodes];
      this.deleteVisibilityContextMenu();
      if (target.checked) {
        this.changeLanguage(menuButtons, toolTips, contextMenuButtons, 'rus');
      } else {
        menuButtons.forEach((item, index) => {
          if (item.textContent.length !== 0) {
            item.textContent = MENU_BUTTONS_NAMES_EN[index];
          }
        });

        toolTips.forEach((item, index) => {
          item.textContent = TOOLS_LEFT_NAMES_EN[index];
        });

        contextMenuButtons.forEach((item, index) => {
          item.textContent = CONTEXTMENU_NAMES_EN[index];
        });
      }
    }
  }

  onHotKeysKeyUp({ key, code, ctrlKey, metaKey }) {
    if (key === 'Delete') {
      this.deleteElements();
    } else if ((ctrlKey || metaKey) && code === 'KeyC') { // копировать
      this.copyElements();
    } else if ((ctrlKey || metaKey) && code === 'KeyV') { // вставить
      this.pasteElements(this.counter);
    } else if ((ctrlKey || metaKey) && code === 'KeyZ') { // назад
      this.model.unDo();
    } else if ((ctrlKey || metaKey) && code === 'KeyY') { // вперед
      this.model.reDo();
    }
  }

  alignElements(dataAttribute) {
    this.deleteVisibilityContextMenu();
    switch (dataAttribute) {
      case 'align_horizontal_left':
        this.model.selectElements.forEach((item) => item.x(0));
        break;
      case 'align_horizontal_right':
        this.model.selectElements.forEach((item) => {
          if (item.type === 'text') {
            item.x(this.model.svgArea.width() - item.length());
          } else {
            item.x(this.model.svgArea.width() - item.width());
          }
        });
        break;
      case 'align_vertical_top':
        this.model.selectElements.forEach((item) => item.y(0));
        break;
      case 'align_vertical_bottom':
        this.model.selectElements.forEach((item) => {
          if (item.type === 'text') {
            item.y(this.model.svgArea.height() - 1.11 * item.attr('size'));
          } else {
            item.y(this.model.svgArea.height() - item.height());
          }
        });
        break;
      case 'align_horizontal_center':
        this.model.selectElements.forEach((item) => item.cx(this.model.svgArea.width() / 2));
        break;
      case 'align_vertical_center':
        this.model.selectElements.forEach((item) => item.cy(this.model.svgArea.height() / 2));
        break;
    }
    this.model.saveHistory();
  }

  changePropertiesSVGElement(target) {
    this.deleteVisibilityContextMenu();
    const objSVG = this.model.selectElements[0];
    if (target.value.length !== 0) {
      switch (target.dataset[this.appView.propertiesDataAttribute]) {
        case 'angle':
          objSVG.rotate(target.value);
          break;
        case 'size':
          objSVG.attr('font-size', target.value);
          break;
        default:
          objSVG.attr(`${target.dataset[this.appView.propertiesDataAttribute]}`, target.value);
          break;
      }
    }
    this.model.saveHistory();
  }

  changeSelectProperty(target) {
    this.deleteVisibilityContextMenu();
    const objSVG = this.model.selectElements[0];
    objSVG.attr('font-family', target.value);
    this.model.saveHistory();
  }

  deleteElements() {
    for (let i = 0; i < this.model.selectElements.length; i += 1) {
      this.model.selectElements[i].resize('stop').selectize(false);
      this.model.selectElements[i].remove();
    }
    this.model.selectElements = [];
    this.appView.removeVisibilityPanel(this.model.selectElements);
    this.deleteVisibilityContextMenu();
    this.model.saveHistory();
  }

  copyElements() {
    this.copiedElements = this.model.selectElements;
    this.deleteVisibilityContextMenu();
  }

  pasteElements() {
    if (this.copiedElements.length > 0) {
      this.copiedElements.forEach((item) => {
        const elementCopy = item.clone();
        elementCopy.attr('x', this.model.x);
        elementCopy.attr('y', this.model.y);
        this.model.svgArea.add(elementCopy);
      });
    }
    this.deleteVisibilityContextMenu();
    this.model.saveHistory();
  }

  appearContextMenu(e) {
    e.preventDefault();
    this.appView.contextMenuWindow.classList.remove('visibility-modal');
    this.appView.contextMenuWindow.style.left = `${e.pageX}px`;
    this.appView.contextMenuWindow.style.top = `${e.pageY}px`;
    if (this.model.selectElements.length === 0 && this.copiedElements.length > 0) { // выделено, скопировали (вызывается на svgArea)
      this.appView.contextMenuWindow.childNodes[0].disabled = true;
      this.appView.contextMenuWindow.childNodes[1].disabled = true;
      this.appView.contextMenuWindow.childNodes[2].disabled = false;
      this.appView.contextMenuWindow.childNodes[3].disabled = true;
      this.appView.contextMenuWindow.childNodes[4].disabled = true;
    } else if (this.model.selectElements.length > 0 && this.copiedElements.length === 0) { // выделено, и не скопировали (вызывается на Element)
      this.appView.contextMenuWindow.childNodes[0].disabled = false;
      this.appView.contextMenuWindow.childNodes[1].disabled = false;
      this.appView.contextMenuWindow.childNodes[2].disabled = true;
      this.appView.contextMenuWindow.childNodes[3].disabled = false;
      this.appView.contextMenuWindow.childNodes[4].disabled = false;
    } else if (this.model.selectElements.length === 0 && this.copiedElements.length === 0) {
      this.appView.contextMenuWindow.childNodes[0].disabled = true;
      this.appView.contextMenuWindow.childNodes[1].disabled = true;
      this.appView.contextMenuWindow.childNodes[2].disabled = true;
      this.appView.contextMenuWindow.childNodes[3].disabled = true;
      this.appView.contextMenuWindow.childNodes[4].disabled = true;
    } else if (this.model.selectElements.length > 0 && this.copiedElements.length > 0) {
      this.appView.contextMenuWindow.childNodes[0].disabled = false;
      this.appView.contextMenuWindow.childNodes[1].disabled = false;
      this.appView.contextMenuWindow.childNodes[2].disabled = false;
      this.appView.contextMenuWindow.childNodes[3].disabled = false;
      this.appView.contextMenuWindow.childNodes[4].disabled = false;
    }
  }

  deleteVisibilityContextMenu() {
    this.appView.contextMenuWindow.classList.add('visibility-modal');
  }

  changeLanguage(menuButtons, toolTips, contextMenuButtons, strLang) {
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
  }

  onWindowBeforeUnload() {
    this.model.saveLastCondition();
  }
}
