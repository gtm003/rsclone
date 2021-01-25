// import { Color } from '@svgdotjs/svg.js';
import {Controller} from '../controllers/Controller';
import {ColorPicker} from './ColorPicker';
import {toolsBottomBtnName, CONTEXTMENU_NAMES_EN, TOOLS_LEFT_NAMES_EN, FUNCTIONAL_AREA_ICONS, ALIGNMENT_ICONS} from '../../utils/btn-names';
import {MainMenu} from './MainMenu';

// const toolsBottomBtnName = ['red', 'green', 'blue'];
// const MENU_BUTTONS_NAMES_EN = ['New Image', 'Save SVG', 'Import SVG', 'Document Properties', 'Get SVG-code', 'Undo', 'Redo'];
// const CONTEXTMENU_NAMES_EN = ['Delete', 'Bring to Front', 'Send to Back'];
// const TOOLS_LEFT_NAMES_EN = ['select', 'rect', 'ellipse', 'line', 'text', 'polyline', 'path', 'color'];
// const MENU_BUTTONS_NAMES_RUS = ['Создать', 'Сохранить', 'Импортировать', 'Свойства документа', 'Получить код', 'Назад', 'Вперед'];
// const CONTEXTMENU_NAMES_RUS = ['Удалить', 'На передний план', 'На задний план'];
// const TOOLS_LEFT_NAMES_RUS = ['Выбрать элемент', 'Прямоугольник', 'Эллипс', 'Линия', 'Текст', 'Ломаная линия', 'Путь', 'Цвет'];

export class AppView {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.headerElement = null;
    this.headerContainer = null;
    this.footerElement = null;
    this.footerContainer = null;
    this.contentElement = null;
    this.contentContainer = null;

    this.toolsTopContainer = null;
    this.toolsBottomContainer = null;
    this.toolsLeftContainer = null;
    this.workAreaContainer = null;
    this.functionalAreaContainer = null;
    this.switcherContainer = null;
    this.saveModalWindow = null;
    this.inputFileName = null;
    this.sheet = null;
    this.settingsModalWindow = null;
    this.svgCodeModalWindow = null;
    this.contextMenuWindow = null;
    this.newImageModal = null;

    this.menuButtonsDataAttribute = 'menu';
    this.saveElementsDataAttribute = 'modalSave';
    this.settingsElementsDataAttribute = 'modalSettings';
    this.propertiesDataAttribute = 'property';
    this.alignPanelDataAttribute = 'align';
    this.newImageDataAttribute = 'newImage';

    
    
    
    this.menuContainer = new MainMenu(this.menuButtonsDataAttribute).createMenuContainer();

    this.countFamily = 5;
    // this.countAnchor = 3;

    this.colorPicker = null;

    this.rectContainerPanel = null;
    this.lineContainerPanel = null;
    this.ellipseContainerPanel = null;
    this.textContainerPanel = null;
    this.pencilContainerPanel = null;
    this.alignContainerPanel = null;
    this.selectProperty = null;
  }

  init() {
    const wrapper = this.createWrapper();
    this.renderHeader();
    this.renderContent();
    this.renderFooter();
    this.rootElement.appendChild(wrapper);
    wrapper.append(this.headerElement, this.contentElement, this.footerElement);

    this.colorPicker = new ColorPicker(this.workAreaContainer);
    this.colorPicker.init();

    const controller = new Controller(this, this.sheet);
    controller.init();
  }

  createElement(tagName, classList, attributes, textContent) {
    // tagName - string
    // classList - array of string
    // attributes - object
    // dataAttributes - object - пока без дата-атрибутов
    // textContent - string

    classList = Array.isArray(classList) ?  classList : false;
    attributes = typeof attributes !== undefined ? attributes : false;
    attributes = typeof textContent === 'string' ? attributes : false;

    const element = document.createElement(tagName);
    if (classList) classList.forEach(item => element.classList.add(item));
    if (attributes) {
      for (let prop in attributes) {
        element.setAttribute(prop, attributes[prop])
      }
    }
    if (textContent) element.textContent = textContent;

    return element;
  }

  createNewImageModal() {
    const newImageModal = this.createElement('div', ['modal-new-image']);

    const modalText = this.createElement('div', ['modal-new-image__text']);
    const p1 = this.createElement('div', false, false, 'Do you want to clear the drawing?');
    const p2 = this.createElement('div', false, false, 'This will also erase your undo history!');
    modalText.append(p1, p2);

    const buttonsContainer = this.createElement('div', ['modal-new-image__btns']);
    const okButton = this.createElement('button', false, {type: 'button'}, 'Ok');
    okButton.dataset[`${this.newImageDataAttribute}`] = 'ok';
    const cancelButton = this.createElement('button', false, {type: 'button'}, 'Cancel');
    cancelButton.dataset[`${this.newImageDataAttribute}`] = 'cancel';
    buttonsContainer.append(okButton, cancelButton);

    newImageModal.append(modalText, buttonsContainer);

    return newImageModal;
  }

  getCurrentRotation(item) {
    const transform = item.attr().transform;
    if (typeof transform !== 'undefined') {
      const values = transform.split('(')[1].split(')')[0].split(',');
      const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
      return (angle < 0 ? angle + 360 : angle);
    }
    return 0;
  }

  createSvgCodeModal() {
    const svgCodeModal = document.createElement('div');
    svgCodeModal.classList.add('modal-svg-code');
    // const preElement = document.createElement('pre');
    // const codeElement = document.createElement('code');
    // preElement.appendChild(codeElement);
    // svgCodeModal.appendChild(preElement);
    // console.log(svgCodeModal)

    return svgCodeModal;
  }

  createSettingsModal() {
    const settingsModal = document.createElement('div');
    settingsModal.classList.add('modal-settings');

    const modalTitle = document.createElement('div');
    modalTitle.textContent = 'SVG-Document Settings';
    modalTitle.classList.add('modal-settings__title');

    const widthSvg = document.createElement('div');
    widthSvg.classList.add('modal-settings__svg-width');

    const widthSvgInput = document.createElement('input');
    widthSvgInput.setAttribute('type', 'text');
    widthSvgInput.setAttribute('id', 'svg-width-input');
    widthSvgInput.dataset[`${this.settingsElementsDataAttribute}`] = 'width';

    const widthSvgLabel = document.createElement('label');
    widthSvgLabel.setAttribute('for', 'svg-width-input');
    widthSvgLabel.textContent = 'SVG-area Width';

    widthSvg.append(widthSvgLabel, widthSvgInput);

    const heightSvg = document.createElement('div');
    heightSvg.classList.add('modal-settings__svg-height');

    const heightSvgInput = document.createElement('input');
    heightSvgInput.setAttribute('type', 'text');
    heightSvgInput.setAttribute('id', 'svg-height-input');
    heightSvgInput.dataset[`${this.settingsElementsDataAttribute}`] = 'height';

    const heightSvgLabel = document.createElement('label');
    heightSvgLabel.setAttribute('for', 'svg-height-input');
    heightSvgLabel.textContent = 'SVG-area Height';

    heightSvg.append(heightSvgLabel, heightSvgInput);

    const saveButton = document.createElement('button');
    saveButton.setAttribute('type', 'button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('modal-settings__save-btn');
    saveButton.dataset[`${this.settingsElementsDataAttribute}`] = 'save';

    const closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('modal-settings__close-btn');
    closeButton.dataset[`${this.settingsElementsDataAttribute}`] = 'close';

    settingsModal.append(modalTitle, widthSvg, heightSvg, saveButton, closeButton);

    return settingsModal;
  }

  createSaveModal() {
    const saveModal = document.createElement('div');
    saveModal.classList.add('modal-save');

    this.inputFileName = document.createElement('input');
    this.inputFileName.setAttribute('type', 'text');
    this.inputFileName.classList.add('modal-save__file-name');
    this.inputFileName.dataset[`${this.saveElementsDataAttribute}`] = 'name';

    const saveButton = document.createElement('button');
    saveButton.setAttribute('type', 'button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('modal-save__save-btn');
    saveButton.dataset[`${this.saveElementsDataAttribute}`] = 'save';

    const closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('modal-save__close-btn');
    closeButton.dataset[`${this.saveElementsDataAttribute}`] = 'close';

    this.errorMessage = document.createElement('div');
    this.errorMessage.textContent = 'Please enter the file name';
    this.errorMessage.style.visibility = 'hidden';

    saveModal.append(this.errorMessage, this.inputFileName, saveButton, closeButton);

    return saveModal;
  }

  createContextMenuModal() {
    const contextMenuModal = document.createElement('div');
    contextMenuModal.classList.add('modal-contextmenu', 'visibility-modal');

    CONTEXTMENU_NAMES_EN.forEach((item) => {
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.dataset[this.propertiesDataAttribute] = item;
      button.classList.add(`modal-contextmenu__btn-${item.toLowerCase().split(' ').join('-')}`);
      button.textContent = item;
      contextMenuModal.append(button);
    });

    return contextMenuModal;
  }

  deleteVisibilityContextMenu() {
    this.contextMenuWindow.classList.add('visibility-modal');
  }

  removeVisibilityPanel(selectElements) {
    if (selectElements.length === 0) {
      [...this.functionalAreaContainer.childNodes].forEach((item) => item.classList.add('visibility'));
    } else if (selectElements.length === 1) {
      [...this.functionalAreaContainer.childNodes].forEach((item) => item.classList.add('visibility'));
      switch (selectElements[0].type) {
        case 'rect':
          this.rectContainerPanel.classList.remove('visibility');
          break;
        case 'line':
          this.lineContainerPanel.classList.remove('visibility');
          break;
        case 'text':
          this.textContainerPanel.classList.remove('visibility');
          break;
        case 'ellipse':
          this.ellipseContainerPanel.classList.remove('visibility');
          break;
        case 'path':
          this.pencilContainerPanel.classList.remove('visibility');
          break;
      }
    } else {
      [...this.functionalAreaContainer.childNodes].forEach((item) => item.classList.add('visibility'));
      this.alignContainerPanel.classList.remove('visibility');
    }
  }

  updateFunctionalArea(selectElements) {
    if (selectElements.length === 1) {
      // const arrayChildFunctionalArea = [...this.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'LABEL');
      const attribute = selectElements[0].attr();
      switch (selectElements[0].type) {
        case 'rect':
          const arrayLabelRect = [...this.rectContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelRect[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelRect[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelRect[3].childNodes[1].setAttribute('placeholder', 0);
          arrayLabelRect[4].childNodes[1].setAttribute('placeholder', attribute.x);
          arrayLabelRect[5].childNodes[1].setAttribute('placeholder', attribute.y);
          arrayLabelRect[6].childNodes[1].setAttribute('placeholder', attribute.width);
          arrayLabelRect[7].childNodes[1].setAttribute('placeholder', attribute.height);
          break;
        case 'line':
          const arrayLabelLine = [...this.lineContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelLine[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelLine[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelLine[3].childNodes[1].setAttribute('placeholder', 0);
          arrayLabelLine[4].childNodes[1].setAttribute('placeholder', attribute.x1);
          arrayLabelLine[5].childNodes[1].setAttribute('placeholder', attribute.y1);
          arrayLabelLine[6].childNodes[1].setAttribute('placeholder', attribute.x2);
          arrayLabelLine[7].childNodes[1].setAttribute('placeholder', attribute.y1);
          break;
        case 'text':
          const arrayLabelText = [...this.textContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelText[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelText[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelText[3].childNodes[1].setAttribute('placeholder', 0);
          arrayLabelText[4].childNodes[1].setAttribute('placeholder', attribute.x);
          arrayLabelText[5].childNodes[1].setAttribute('placeholder', attribute.y);
          arrayLabelText[6].childNodes[1].setAttribute('placeholder', attribute['font-size']);
          // здесь долджно быть начертание
          break;
        case 'ellipse':
          const arrayLabelEllipse = [...this.ellipseContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelEllipse[0].childNodes[1].setAttribute('placeholder', attribute.id);
          arrayLabelEllipse[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelEllipse[3].childNodes[1].setAttribute('placeholder', 0);
          arrayLabelEllipse[4].childNodes[1].setAttribute('placeholder', attribute.cx);
          arrayLabelEllipse[5].childNodes[1].setAttribute('placeholder', attribute.cy);
          arrayLabelEllipse[6].childNodes[1].setAttribute('placeholder', attribute.rx);
          arrayLabelEllipse[7].childNodes[1].setAttribute('placeholder', attribute.ry);
          break;
        case 'path':
          const arrayLabelPencil = [...this.pencilContainerPanel.childNodes].filter((item) => typeof item.childNodes[1] !== 'undefined');
          arrayLabelPencil[0].childNodes[1].setAttribute('placeholder', attribute.id); // id
          arrayLabelPencil[2].childNodes[1].setAttribute('placeholder', this.getCurrentRotation(selectElements[0]));
          arrayLabelPencil[3].childNodes[1].setAttribute('placeholder', 0);
          break;
      }
    }
  }

  createArrayNameBtn(type) {
    if (type === 'rect') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'x', 'y', 'width', 'height'];
    } else if (type === 'line') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'x1', 'y1', 'x2', 'y2'];
    } else if (type === 'text') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'x', 'y', 'size', 'family', 'mark'];
    } else if (type === 'ellipse') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke', 'cx', 'cy', 'rx', 'ry'];
    } else if (type === 'path') {
      return ['delete', 'convert', 'id', 'class', 'angle', 'stroke'];
    }

    return ['delete', 'convert', 'left', 'right', 'top', 'bottom', 'center', 'middle'];
  }

  createSelectElement(typeElement) {
    this.selectProperty = document.createElement('select');
    this.selectProperty.classList.add(`tools-top__functional-area__container--${typeElement}`);
    if (typeElement === 'family') {
      const familyClasses = ['serif', 'sans-serif', 'cursive', 'fantasy', 'monospace'];
      for (let i = 0; i < this.countFamily; i += 1) {
        const option = document.createElement('option');
        option.textContent = familyClasses[i];
        this.selectProperty.append(option);
      }
    }

    return this.selectProperty;
  }

  createFunctionalAreaAlignmentElements(containerPanel) {
    ALIGNMENT_ICONS.forEach((item) => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.dataset[this.alignPanelDataAttribute] = item;
      btn.classList.add('tools-top__functional-area__container__btn--click');
      btn.innerHTML = `<i class="material-icons">${item}</i>`;
      containerPanel.append(btn);
    });
  }

  createFunctionalAreaElements(containerPanel, arrayBtn) {
    let j = 0;
    for (let i = 0; i < arrayBtn.length; i += 1) {
      const containerButton = document.createElement('div');
      containerButton.classList.add('tools-top__functional-area__container');
      if (arrayBtn[i] === 'delete' || arrayBtn[i] === 'convert') {
        const button = document.createElement('button');
        button.dataset[this.propertiesDataAttribute] = arrayBtn[i];
        button.classList.add('tools-top__functional-area__container__btn--click');
        if (arrayBtn[i] === 'delete') {
          button.innerHTML = '<i class="material-icons">disabled_by_default</i>';
        } else {
          button.innerHTML = '<i class="material-icons">timeline</i>';
        }
        containerButton.append(button);
        containerPanel.append(containerButton);
      } else if (arrayBtn[i] === 'stroke' || arrayBtn[i] === 'angle' || arrayBtn[i] === 'width' || arrayBtn[i] === 'height') {
        const icon = document.createElement('img');
        icon.setAttribute('src', `../../img/content/${FUNCTIONAL_AREA_ICONS[j]}`);
        icon.setAttribute('alt', arrayBtn[i]);
        const button = document.createElement('input');
        button.setAttribute('input', 'text');
        button.dataset[this.propertiesDataAttribute] = arrayBtn[i];
        button.classList.add('tools-top__functional-area__container__btn--keyup');
        containerButton.append(icon, button);
        containerPanel.append(containerButton);
        j += 1;
      } else if (arrayBtn[i] === 'family') {
        containerButton.append(this.createSelectElement(arrayBtn[i]));
        containerPanel.append(containerButton);
      } else {
        const span = document.createElement('span');
        span.textContent = arrayBtn[i];
        const button = document.createElement('input');
        button.setAttribute('input', 'text');
        button.dataset[this.propertiesDataAttribute] = arrayBtn[i];
        button.classList.add('tools-top__functional-area__container__btn--keyup');
        containerButton.append(span, button);
        containerPanel.append(containerButton);
      }
    }
  }

  createFunctionalAreaPanels(functionalArea) {
    this.rectContainerPanel = document.createElement('div');
    this.rectContainerPanel.classList.add('tools-top__functional-area__rect', 'visibility');
    const arrayRectBtn = this.createArrayNameBtn('rect');
    this.createFunctionalAreaElements(this.rectContainerPanel, arrayRectBtn);

    this.lineContainerPanel = document.createElement('div');
    this.lineContainerPanel.classList.add('tools-top__functional-area__line', 'visibility');
    const arrayLineBtn = this.createArrayNameBtn('line');
    this.createFunctionalAreaElements(this.lineContainerPanel, arrayLineBtn);

    this.textContainerPanel = document.createElement('div');
    this.textContainerPanel.classList.add('tools-top__functional-area__text', 'visibility');
    const arrayTextBtn = this.createArrayNameBtn('text');
    this.createFunctionalAreaElements(this.textContainerPanel, arrayTextBtn);

    this.ellipseContainerPanel = document.createElement('div');
    this.ellipseContainerPanel.classList.add('tools-top__functional-area__ellipse', 'visibility');
    const arrayEllipseBtn = this.createArrayNameBtn('ellipse');
    this.createFunctionalAreaElements(this.ellipseContainerPanel, arrayEllipseBtn);

    this.pencilContainerPanel = document.createElement('div');
    this.pencilContainerPanel.classList.add('tools-top__functional-area__pencil', 'visibility');
    const arrayPencilBtn = this.createArrayNameBtn('path');
    this.createFunctionalAreaAlignmentElements(this.pencilContainerPanel, arrayPencilBtn);

    this.alignContainerPanel = document.createElement('div');
    this.alignContainerPanel.classList.add('tools-top__functional-area__align', 'visibility');
    this.createFunctionalAreaAlignmentElements(this.alignContainerPanel);

    functionalArea.append(this.rectContainerPanel, this.lineContainerPanel, this.textContainerPanel, this.ellipseContainerPanel, this.pencilContainerPanel, this.alignContainerPanel);
  }

  createFunctionalArea() {
    const functionalArea = document.createElement('div');
    functionalArea.classList.add('tools-top__functional-area');
    this.createFunctionalAreaPanels(functionalArea);

    return functionalArea;
  }

  createSwitcherContainer() {
    const switcherContainer = document.createElement('div');
    switcherContainer.classList.add('tools-top__switcher-area');

    this.checkSwitcher = document.createElement('input');
    const labelForSwitcher = document.createElement('label');
    this.checkSwitcher.classList.add('tools-top__switcher-area__switcher-lang');
    this.checkSwitcher.setAttribute('type', 'checkbox');
    this.checkSwitcher.setAttribute('id', 'switcher-lang');
    labelForSwitcher.setAttribute('for', 'switcher-lang');
    labelForSwitcher.textContent = 'RU';
    switcherContainer.append(this.checkSwitcher, labelForSwitcher);

    return switcherContainer;
  }

  createToolsTop() {
    const toolsTop = document.createElement('div');
    toolsTop.classList.add('tools-top');
    this.functionalAreaContainer = this.createFunctionalArea();
    this.switcherContainer = this.createSwitcherContainer();
    toolsTop.append(this.menuContainer, this.functionalAreaContainer, this.switcherContainer);

    return toolsTop;
  }

  createWorkArea() {
    const workAreaContainer = document.createElement('div');
    workAreaContainer.className = 'work-area';

    const field = document.createElement('div');
    field.id = 'field';
    workAreaContainer.append(field);

    this.sheet = document.createElement('div');
    this.sheet.className = 'sheet';
    this.sheet.id = 'sheet';
    field.append(this.sheet);

    return workAreaContainer;
  }

  createToolsBottom() {
    const toolsBottomContainer = document.createElement('div');
    toolsBottomContainer.className = 'tools-bottom';
    toolsBottomContainer.innerHTML = "УБРАТЬ?"
    /*
    toolsBottomBtnName.forEach((item) => {
      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.style.background = item;
      toolsBottomContainer.append(btn);
    });*/

    return toolsBottomContainer;
  }

  createToolsLeft() {
    const toolsLeftContainer = document.createElement('div');
    toolsLeftContainer.className = 'tools-left';

    TOOLS_LEFT_NAMES_EN.forEach((item) => {
      const tooltip = document.createElement('span');
      tooltip.classList.add('tooltip', 'tooltip-right');
      tooltip.textContent = item;
      toolsLeftContainer.append(tooltip);

      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.innerHTML = item;
      btn.append(tooltip);

      toolsLeftContainer.append(btn);
    });

    return toolsLeftContainer;
  }

  createWrapper() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    return wrapper;
  }

  renderHeader() {
    this.headerElement = document.createElement('header');
    this.headerElement.classList.add('header');
    this.headerContainer = document.createElement('div');
    this.headerContainer.classList.add('container');
    this.headerContainer.textContent = 'SVG EDITOR';
    this.headerElement.appendChild(this.headerContainer);
  }

  renderContent() {
    this.newImageModal = this.createNewImageModal();
    this.svgCodeModalWindow = this.createSvgCodeModal();
    this.settingsModalWindow = this.createSettingsModal();
    this.saveModalWindow = this.createSaveModal();
    this.contextMenuWindow = this.createContextMenuModal();
    this.toolsTopContainer = this.createToolsTop();
    this.toolsBottomContainer = this.createToolsBottom();
    this.toolsLeftContainer = this.createToolsLeft();
    this.workAreaContainer = this.createWorkArea();

    this.contentElement = document.createElement('main');
    this.contentElement.classList.add('main');
    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('container');
    this.contentElement.appendChild(this.contentContainer);

    this.toolsRightContainer = document.createElement('div');

    this.toolsRightContainer.className = 'tools-right';
    this.contentContainer.append(this.toolsTopContainer, this.toolsLeftContainer, this.toolsRightContainer, this.toolsBottomContainer, this.workAreaContainer, this.saveModalWindow, this.settingsModalWindow, this.svgCodeModalWindow, this.contextMenuWindow, this.newImageModal);
  }

  renderFooter() {
    const yearSpan = document.createElement('span');
    yearSpan.classList.add('copyright__year');
    yearSpan.textContent = '2020 ©';

    const by = document.createElement('span');
    by.textContent = 'by';

    const student1Link = document.createElement('a');
    student1Link.classList.add('copyright__student-link');
    student1Link.setAttribute('href', 'https://github.com/alexk08');
    student1Link.setAttribute('target', '__blank');
    student1Link.textContent = 'Aleksandr Krasinikov';

    const student2Link = document.createElement('a');
    student2Link.classList.add('copyright__student-link');
    student2Link.setAttribute('href', 'https://github.com/11alexey11');
    student2Link.setAttribute('target', '__blank');
    student2Link.textContent = 'Alexey Yanvarev';

    const student3Link = document.createElement('a');
    student3Link.classList.add('copyright__student-link');
    student3Link.setAttribute('href', 'https://github.com/gtm003');
    student3Link.setAttribute('target', '__blank');
    student3Link.textContent = 'Tatyana Grigorovich';

    const logo = document.createElement('img');
    logo.classList.add('copyright__logo-rs');
    logo.setAttribute('src', 'img/svg/rs_school_js.svg');
    logo.setAttribute('alt', 'Logo RS School');
    logo.setAttribute('width', '100px');

    const courseLink = document.createElement('a');
    courseLink.classList.add('copyright__course-link');
    courseLink.setAttribute('href', 'https://rs.school/js/');
    courseLink.setAttribute('target', '__blank');
    courseLink.appendChild(logo);

    const copyrightElement = document.createElement('div');
    copyrightElement.classList.add('copyright');
    copyrightElement.append(yearSpan, by, student1Link, student2Link, student3Link, courseLink);

    this.footerElement = document.createElement('footer');
    this.footerElement.classList.add('footer');
    this.footerContainer = document.createElement('div');
    this.footerContainer.classList.add('container');
    this.footerContainer.append(copyrightElement);
    this.footerElement.appendChild(this.footerContainer);
  }
}
