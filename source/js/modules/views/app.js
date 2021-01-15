import {Controller} from '../controllers/Controller';

const toolsBottomBtnName = ['red', 'green', 'blue'];
const toolsLeftBtnName = ['select', 'rect', 'circle', 'line', 'polyline', 'text', 'path', 'ellipse'];
const MENU_BUTTONS_NAMES = ['New Image', 'Save SVG', 'Document Properties', 'Get SVG-code', 'Undo', 'Redo'];

export class appView {
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
    this.menuContainer = null;
    this.functionalAreaContainer = null;
    this.saveModalWindow = null;
    this.inputFileName = null;
    this.sheet = null;
    this.settingsModalWindow = null;

    this.menuButtonsDataAttribute = 'menu';
    this.saveElementsDataAttribute = 'modalSave';
    this.settingsElementsDataAttribute = 'modalSettings';
  }

  init() {
    const wrapper = this.createWrapper();
    this.renderHeader();
    this.renderContent();
    this.renderFooter();
    this.rootElement.appendChild(wrapper);
    wrapper.append(this.headerElement, this.contentElement, this.footerElement);

    const controller = new Controller(this, this.sheet);
    controller.init();
  }

  createMenuContainer() {
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('tools-top__menu-area');

    return menuContainer;
  }

  createFunctionalArea() {
    const functionalArea = document.createElement('div');
    functionalArea.classList.add('tools-top__functional-area', 'visibility');

    return functionalArea;
  }

  createToolsTop() {
    const toolsTop = document.createElement('div');
    toolsTop.classList.add('tools-top');
    this.menuContainer = this.createMenuContainer();
    this.functionalAreaContainer = this.createFunctionalArea();
    toolsTop.append(this.menuContainer, this.functionalAreaContainer);

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
    field.append(this.sheet);

    return workAreaContainer;
  }

  createToolsBottom() {
    const toolsBottomContainer = document.createElement('div');
    toolsBottomContainer.className = 'tools-bottom';

    toolsBottomBtnName.forEach((item) => {
      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.style.background = item;
      toolsBottomContainer.append(btn);
    });

    return toolsBottomContainer;
  }

  createToolsLeft() {
    const toolsLeftContainer = document.createElement('div');
    toolsLeftContainer.className = 'tools-left';

    toolsLeftBtnName.forEach((item) => {
      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.innerHTML = item;
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

    this.contentContainer.append(this.toolsTopContainer, this.toolsLeftContainer, this.toolsRightContainer, this.toolsBottomContainer, this.workAreaContainer);
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

  createFunctionalAreaDataElements(type) {
    let arrayNameBtn;
    switch (type) {
      case 'rect':
        arrayNameBtn = ['delete', 'convert', 'id', 'class', 'angle', 'blur', 'x', 'y', 'width', 'height'];
        break;
      case 'circle':
        arrayNameBtn = ['delete', 'convert', 'id', 'class', 'angle', 'blur', 'cx', 'cy', 'r'];
        break;
      case 'line':
        arrayNameBtn = ['delete', 'convert', 'id', 'class', 'angle', 'blur', 'x1', 'y1', 'x2', 'y2'];
        break;
    }

    for (let i = 0; i < arrayNameBtn.length; i += 1) {
      if (i === 0 || i === 1) {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.classList.add(`tools-top__functional-area__btn-${arrayNameBtn[i]}`);
        this.functionalAreaContainer.append(btn);
        if (i === 0) {
          btn.innerHTML = '<i class="material-icons">disabled_by_default</i>';
        } else {
          btn.innerHTML = '<i class="material-icons">timeline</i>';
        }
      } else {
        const btn = document.createElement('input');
        const label = document.createElement('label');
        const span = document.createElement('span');
        span.textContent = arrayNameBtn[i];
        btn.setAttribute('type', 'text');
        btn.setAttribute('placeholder', `${arrayNameBtn[i]}`);
        btn.classList.add(`tools-top__functional-area__btn-${arrayNameBtn[i]}`);
        label.append(span, btn);
        this.functionalAreaContainer.append(label);
      }
    }
  }

  removeFunctionalAreaDataElements() {
    for (let i = 0; i < this.functionalAreaContainer.childNodes.length; i += 1) {
      this.functionalAreaContainer.childNodes[i].remove();
      i -= 1;
    }
  }

  updateFunctionalArea(item) {
    this.removeFunctionalAreaDataElements();
    const attribute = item.attr();
    this.createFunctionalAreaDataElements(item.type, item);
    const arrayChildFunctionalArea = [...this.functionalAreaContainer.childNodes].filter((value) => value.tagName === 'LABEL');
    switch (item.type) {
      case 'rect':
        arrayChildFunctionalArea[0].childNodes[1].setAttribute('placeholder', attribute.id); // id
        arrayChildFunctionalArea[2].childNodes[1].setAttribute('placeholder', 0); // angle
        arrayChildFunctionalArea[3].childNodes[1].setAttribute('placeholder', 0); // blur
        arrayChildFunctionalArea[4].childNodes[1].setAttribute('placeholder', attribute.x); // x
        arrayChildFunctionalArea[5].childNodes[1].setAttribute('placeholder', attribute.y); // y
        arrayChildFunctionalArea[6].childNodes[1].setAttribute('placeholder', attribute.width); // width
        arrayChildFunctionalArea[7].childNodes[1].setAttribute('placeholder', attribute.height); // height
        break;
      case 'circle':
        arrayChildFunctionalArea[0].childNodes[1].setAttribute('placeholder', attribute.id); // id
        arrayChildFunctionalArea[2].childNodes[1].setAttribute('placeholder', 0); // angle
        arrayChildFunctionalArea[3].childNodes[1].setAttribute('placeholder', 0); // blur
        arrayChildFunctionalArea[4].childNodes[1].setAttribute('placeholder', attribute.cx); // cx
        arrayChildFunctionalArea[5].childNodes[1].setAttribute('placeholder', attribute.cy); // cy
        arrayChildFunctionalArea[6].childNodes[1].setAttribute('placeholder', attribute.r); // r
        break;
      case 'line':
        arrayChildFunctionalArea[0].childNodes[1].setAttribute('placeholder', attribute.id); // id
        arrayChildFunctionalArea[2].childNodes[1].setAttribute('placeholder', 0); // angle
        arrayChildFunctionalArea[3].childNodes[1].setAttribute('placeholder', 0); // blur
        arrayChildFunctionalArea[4].childNodes[1].setAttribute('placeholder', attribute.x1);
        arrayChildFunctionalArea[5].childNodes[1].setAttribute('placeholder', attribute.y1);
        arrayChildFunctionalArea[6].childNodes[1].setAttribute('placeholder', attribute.x2);
        arrayChildFunctionalArea[7].childNodes[1].setAttribute('placeholder', attribute.y1);
        break;
    }
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

  createMenuContainer() {
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('tools-top__menu-area');

    MENU_BUTTONS_NAMES.forEach((item) => {
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.dataset[`${this.menuButtonsDataAttribute}`] = `${item}`;
      button.textContent = item;
      menuContainer.appendChild(button);
    });

    return menuContainer;
  }

  createFunctionalArea() {
    const functionalArea = document.createElement('div');
    functionalArea.classList.add('tools-top__functional-area');

    return functionalArea;
  }

  createToolsTop() {
    const toolsTop = document.createElement('div');
    toolsTop.classList.add('tools-top');
    this.menuContainer = this.createMenuContainer();
    this.functionalAreaContainer = this.createFunctionalArea();
    toolsTop.append(this.menuContainer, this.functionalAreaContainer);

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

    toolsBottomBtnName.forEach((item) => {
      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.style.background = item;
      toolsBottomContainer.append(btn);
    });

    return toolsBottomContainer;
  }

  createToolsLeft() {
    const toolsLeftContainer = document.createElement('div');
    toolsLeftContainer.className = 'tools-left';

    toolsLeftBtnName.forEach((item) => {
      let btn = document.createElement('button');
      btn.id = `${item}`;
      btn.innerHTML = item;
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
    this.settingsModalWindow = this.createSettingsModal();
    this.saveModalWindow = this.createSaveModal();
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

    this.contentContainer.append(this.toolsTopContainer, this.toolsLeftContainer, this.toolsRightContainer, this.toolsBottomContainer, this.workAreaContainer, this.saveModalWindow, this.settingsModalWindow);
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
