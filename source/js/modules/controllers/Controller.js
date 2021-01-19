import {Model} from '../models/SVGAreaModel';
import {toolsBottomBtnName, MENU_BUTTONS_NAMES_EN, CONTEXTMENU_NAMES_EN, TOOLS_LEFT_NAMES_EN, MENU_BUTTONS_NAMES_RUS, CONTEXTMENU_NAMES_RUS, TOOLS_LEFT_NAMES_RUS} from '../../utils/btn-names';

const FILE_TYPE = 'svg';

export class Controller {
  constructor(appView, placeForSVGCanvas) {
    this.fill = 'none';
    this.stroke = 'black';
    //this.select = null;
    //this.mouse = null;
    this.placeForSVGCanvas = placeForSVGCanvas;
    this.appView = appView;
    this.model = new Model(this.appView, this.placeForSVGCanvas);
    this.onMenuButtonsClick = this.onMenuButtonsClick.bind(this);
    this.onSaveModalClick = this.onSaveModalClick.bind(this);
    this.onSettingsModalClick = this.onSettingsModalClick.bind(this);
    this.onImportSvgChange = this.onImportSvgChange.bind(this);
    this.copiedElements = [];
  }

  init() {
    this.model.init();
    this.onToolsLeftClick();
    this.changeColor();
    //[...this.appView.palleteCanvas.btnUserAnswerContainer.childNodes][0].addEventListener('click', this.changeColor);
    this.getFill();
    this.appView.menuContainer.addEventListener('click', this.onMenuButtonsClick);
    this.appView.menuContainer.addEventListener('change', this.onImportSvgChange);
    this.appView.saveModalWindow.addEventListener('click', this.onSaveModalClick);
    this.appView.settingsModalWindow.addEventListener('click', this.onSettingsModalClick);

    this.keyUpProperties();
    this.clickAlignPanel();
    this.clickDelete();
    this.appearContextMenu();
    this.clickContextMenuElements();
    this.changeLanguage();
    this.clickHotKeys();
  }

  onToolsLeftClick() {
    this.appView.toolsLeftContainer.addEventListener('click', (event) => {
      let target = event.target;
      while (target !== this.appView.toolsLeftContainer) {
        if (target.nodeName === 'BUTTON') {
          this.model.type = target.id;
          this.model.removeLastEvent();
          this.model.onSVGAreaEvent();
          if (target.id === 'fill' || target.id === 'stroke') {
            this.appView.palleteCanvas.openColorPicker();
          }
          return;
        }
        target = target.parentNode;
      }
    });
  }

  changeColor() {
    [...this.appView.palleteCanvas.btnUserAnswerContainer.childNodes][0].addEventListener('click', () => {
      if (this.model.type === 'fill') {
        this.model.fillColor = this.appView.palleteCanvas.color;
        [...this.appView.toolsLeftContainer.childNodes][7].style.background = this.appView.palleteCanvas.color;
      }
      else if (this.model.type === 'stroke') {
        this.model.strokeColor = this.appView.palleteCanvas.color;
      }
      this.appView.palleteCanvas.closeColorPicker();
    });
    [...this.appView.palleteCanvas.btnUserAnswerContainer.childNodes][1].addEventListener('click', () => {
      this.appView.palleteCanvas.closeColorPicker();
    });
  }

  getFill() {
    const toolsBottom = document.querySelector('.tools-bottom');
    toolsBottom.addEventListener('click', (event) => {
      let target = event.target;
      while (target !== toolsBottom) {
        if (target.nodeName === 'BUTTON') {
          this.fill = target.id;
          // console.log(this.fill);
          this.model.removeLastEvent();
          this.model.fillElem(target.id);
          return;
        }
        target = target.parentNode;
      }
    });
  }

  onImportSvgChange({target}) {
    if (target.dataset['menu'] === 'Import SVG') {
      this.uploadSVG(target);
    }
  }

  onMenuButtonsClick({target}) {
    this.deleteVisibilityContextMenu();
    if (target.dataset['menu'] === 'New Image') {
      this.createNewImage();
      this.model.selectElements = [];
      this.appView.removeVisibilityPanel(this.model.selectElements);
      this.appearContextMenu();
    }

    if (target.dataset['menu'] === 'Save SVG') {
      this.openModalSave();
    }

    if (target.dataset['menu'] === 'Document Properties') {
      this.openModalSettings();
    }

    if (target.dataset['menu'] === 'Get SVG-code') {
      this.openModalSvgCode();
    }

    if (target.dataset['menu'] === 'Undo') {
      this.model.unDo();
    }

    if (target.dataset['menu'] === 'Redo') {
      this.model.reDo();
    }
  }

  openModalSvgCode() {
    this.appView.svgCodeModalWindow.innerHTML = '';
    this.appView.svgCodeModalWindow.classList.toggle('modal-svg-code--show');
    this.model.removeSelect();
    this.appView.svgCodeModalWindow.textContent = this.appView.sheet.innerHTML;
  }

  openModalSettings() {
    this.appView.settingsModalWindow.classList.add('modal-settings--show');
  }

  closeModalSettings() {
    this.appView.settingsModalWindow.classList.remove('modal-settings--show');
  }

  onSettingsModalClick({target}) {
    if (target.dataset['modalSettings'] === 'save') {
      this.changeProperties();
      this.closeModalSettings();
    }

    if (target.dataset['modalSettings'] === 'close') {
      this.closeModalSettings();
    }
  }

  changeProperties() {
    const svgWidth = this.appView.settingsModalWindow.querySelector('[data-modal-settings="width"]').value;
    const svgHeight = this.appView.settingsModalWindow.querySelector('[data-modal-settings="height"]').value;
    this.placeForSVGCanvas.innerHTML = '';
    this.model.createSvgWorkArea(svgWidth, svgHeight);
  }

  onSaveModalClick({target}) {
    if (target.dataset['modalSave'] === 'save') {
      this.saveFile(this.appView.inputFileName.value);
    }

    if (target.dataset['modalSave'] === 'close') {
      this.closeModalSave();
    }
  }

  openModalSave() {
    this.appView.saveModalWindow.classList.add('modal-save--show');
  }

  closeModalSave() {
    this.appView.inputFileName.value = '';
    this.appView.errorMessage.style.visibility = 'hidden';
    this.appView.saveModalWindow.classList.remove('modal-save--show');
  }

  createNewImage() {
    this.placeForSVGCanvas.innerHTML = '';
    this.model.createSvgWorkArea('600', '400');
  }

  saveFile(fileName) {
    if (fileName === '') {
      this.appView.errorMessage.style.visibility = 'visible';
      return;
    }
    this.closeModalSave();
    this.model.removeSelect();
    this.download(this.model.svgArea.svg(), fileName, 'image/svg+xml');
  }

  download(data, filename, type) {
    let file = new Blob([data], {type});
    if (window.navigator.msSaveOrOpenBlob) { // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
      let a = document.createElement('a');
      let url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }

  uploadSVG(input) {
    const file = input.files[0];
    const fileName = file.name.toLowerCase();

    if(fileName.endsWith(FILE_TYPE)) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.model.svgArea.svg(reader.result);
      });

      reader.readAsText(file);
    }
  }

  onKeyDownProperties() {
    console.log(this.appView);
  }

  keyUpProperties() {
    const childrenFunctionalAreaContainer = this.appView.functionalAreaContainer.childNodes;
    for (let i = 0; i < childrenFunctionalAreaContainer.length; i += 1) {
      const label = [...childrenFunctionalAreaContainer[i].childNodes].filter((item) => item.tagName === 'LABEL');
      for (let j = 0; j < label.length; j += 1) {
        const input = label[j].childNodes[1];
        input.addEventListener('keyup', () => {
          this.deleteVisibilityContextMenu();
          const objSVG = this.model.selectElements[0];
          if (input.value.length === 0) {
            switch (label[j].childNodes[0].textContent) {
              case 'angle':
                objSVG.rotate(0);
                break;
              case 'blur':
                break;
              case 'size':
                objSVG.attr('font-size', input.getAttribute('placeholder'));
                break;
              default:
                objSVG.attr(`${label[j].textContent}`, input.getAttribute('placeholder'));
                break;
            }
          } else {
            switch (label[j].childNodes[0].textContent) {
              case 'angle':
                objSVG.rotate(`${input.value}`);
                break;
              case 'blur':
                break;
              case 'size':
                objSVG.attr('font-size', input.value);
                break;
              default:
                objSVG.attr(`${label[j].textContent}`, input.value);
                break;
            }
          }
          this.model.saveHistory();
        });
      }
    }
  }

  clickAlignPanel() {
    const alignPanelBtn = this.appView.functionalAreaContainer.childNodes[this.appView.functionalAreaContainer.childNodes.length - 1].childNodes;
    for (let i = 0; i < alignPanelBtn.length; i += 1) {
      alignPanelBtn[i].addEventListener('click', () => {
        switch (i) {
          case 2:
            this.model.selectElements.forEach((item) => item.x(0));
            break;
          case 3:
            this.model.selectElements.forEach((item) => {
              if (item.type === 'text') {
                item.x(this.model.svgArea.width() - item.length());
              } else {
                item.x(this.model.svgArea.width() - item.width());
              }
            });
            break;
          case 4:
            this.model.selectElements.forEach((item) => item.y(0));
            break;
          case 5:
            this.model.selectElements.forEach((item) => {
              if (item.type === 'text') {
                item.y(this.model.svgArea.height() - 1.11 * item.attr('size'));
              } else {
                item.y(this.model.svgArea.height() - item.height());
              }
            });
            break;
          case 6:
            this.model.selectElements.forEach((item) => item.cx(this.model.svgArea.width() / 2));
            break;
          case 7:
            this.model.selectElements.forEach((item) => item.cy(this.model.svgArea.height() / 2));
            break;
        }
        this.model.saveHistory();
      });
    }
  }

  deleteElements() {
    for (let i = 0; i < this.model.selectElements.length; i += 1) {
      this.model.selectElements[i].resize('stop').selectize(false);
      this.model.selectElements[i].remove();
    }
    this.model.selectElements = [];
    this.appView.removeVisibilityPanel(this.model.selectElements);
  }

  clickDelete() {
    const childrenFunctionalAreaContainer = this.appView.functionalAreaContainer.childNodes;
    for (let i = 0; i < childrenFunctionalAreaContainer.length; i += 1) {
      const deleteBtn = [...childrenFunctionalAreaContainer[i].childNodes].filter((item) => item.tagName === 'BUTTON')[0];
      deleteBtn.addEventListener('click', () => {
        this.deleteElements();
        this.deleteVisibilityContextMenu();
        this.model.saveHistory();
      });
    }
  }

  appearContextMenu() {
    const svgArea = this.appView.sheet.childNodes[0];
    svgArea.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.model.selectElements.length > 0) {
        this.appView.contextMenuWindow.classList.remove('visibility-modal');
        this.appView.contextMenuWindow.style.left = `${e.pageX}px`;
        this.appView.contextMenuWindow.style.top = `${e.pageY}px`;
      } else {
        this.appView.contextMenuWindow.classList.add('visibility-modal');
      }
    });

    svgArea.addEventListener('mousedown', () => {
      this.deleteVisibilityContextMenu();
    });
  }

  deleteVisibilityContextMenu() {
    this.appView.contextMenuWindow.classList.add('visibility-modal');
  }

  clickContextMenuElements() {
    const deleteBtn = this.appView.contextMenuWindow.childNodes[0];

    deleteBtn.addEventListener('click', () => {
      this.deleteElements();
      this.deleteVisibilityContextMenu();
      this.appView.removeVisibilityPanel(this.model.selectElements);
      this.model.saveHistory();
    });
  }

  changeLanguage() {
    const checkbox = this.appView.switcherContainer.childNodes[0];
    const menuButtons = [...this.appView.menuContainer.childNodes].filter((item) => item.textContent.length !== 0);
    const toolTips = [...this.appView.toolsLeftContainer.childNodes].map((item) => item.lastChild);
    const contextMenuButtons = [...this.appView.contextMenuWindow.childNodes];
    checkbox.addEventListener('click', () => {
      this.deleteVisibilityContextMenu();
      if (checkbox.checked) {
        menuButtons.forEach((item, index) => {
          if (item.textContent.length !== 0) {
            item.textContent = MENU_BUTTONS_NAMES_RUS[index];
          }
        });

        toolTips.forEach((item, index) => {
          item.textContent = TOOLS_LEFT_NAMES_RUS[index];
        });

        contextMenuButtons.forEach((item, index) => {
          item.textContent = CONTEXTMENU_NAMES_RUS[index];
        });
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
    });
  }

  clickHotKeys() {
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Delete') {
        this.deleteElements();
        this.deleteVisibilityContextMenu();
      } else if ((e.ctrlKey && e.key === 'c') || (e.ctrlKey && e.key === 'C')) { // копировать
        this.copiedElements = this.model.selectElements;
      } else if ((e.ctrlKey && e.key === 'x') || (e.ctrlKey && e.key === 'X')) { // вырезать
        this.copiedElements = this.model.selectElements;
        this.deleteElements();
      } else if ((e.ctrlKey && e.key === 'v') || (e.ctrlKey && e.key === 'V')) {
        if (this.copiedElements.length > 0) {
          for (let i = 0; i < this.copiedElements.length; i += 1) { // вставить
            switch (this.copiedElements[i].type) {
              case 'rect':

                break;
              case 'ellipse':
                break;
              case 'line':
                break;
              case 'text':
                break;
              case 'polyline':
                break;
              case 'path':
                break;
            }
          }
        }
      }
    });
  }
}
