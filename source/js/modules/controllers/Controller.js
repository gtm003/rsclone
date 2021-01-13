import {SVGCanvas} from '../models/SVGCanvas';

export class Controller {
  constructor(appView, placeForSVGCanvas) {
    this.fill = 'none';
    this.stroke = 'black';
    this.activToolsLeftBtn = 'select';
    this.select = null;
    this.mouse = null;
    this.placeForSVGCanvas = placeForSVGCanvas;
    this.appView = appView;
    this.canvas = new SVGCanvas(this.appView, this.placeForSVGCanvas, '100%', '100%');
    this.onMenuButtonsClick = this.onMenuButtonsClick.bind(this);
    this.onSaveModalClick = this.onSaveModalClick.bind(this);
    this.onSettingsModalClick = this.onSettingsModalClick.bind(this);
  }

  init() {
    this.getActivToolsLeftBtn();
    this.getFill();
    this.appView.menuContainer.addEventListener('click', this.onMenuButtonsClick);
    this.appView.saveModalWindow.addEventListener('click', this.onSaveModalClick);
    this.appView.settingsModalWindow.addEventListener('click', this.onSettingsModalClick);
  }

  getActivToolsLeftBtn() {
    const toolsLeft = document.querySelector('.tools-left');
    toolsLeft.addEventListener('click', (event) => {
      let target = event.target;
      while (target !== toolsLeft) {
        if (target.nodeName === 'BUTTON') {
          this.activToolsLeftBtn = target.id;
          // console.log(this.activToolsLeftBtn);
          this.canvas.removeLastEvent();
          this.canvas.drawElem(target.id);
          return;
        }
        target = target.parentNode;
      }
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
          this.canvas.fillElem(target.id);
          return;
        }
        target = target.parentNode;
      }
    });
  }

  onMenuButtonsClick({target}) {
    if (target.dataset['menu'] === 'New Image') {
      this.createNewImage();
    }

    if (target.dataset['menu'] === 'Save SVG') {
      this.openModalSave();
    }

    if (target.dataset['menu'] === 'Document Properties') {
      this.openModalSettings();
    }
  }

  openModalSettings() {
    this.appView.settingsModalWindow.classList.add('modal-settings--show');
  }

  closeModalSettings() {
    this.appView.settingsModalWindow.classList.remove('modal-settings--show');
  }

  onSettingsModalClick({target}) {
    // console.log(target)
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
    this.canvas = new SVGCanvas(this.appView, this.placeForSVGCanvas, svgWidth, svgHeight);
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
    this.canvas = new SVGCanvas(this.appView, this.placeForSVGCanvas, '100%', '100%');
  }

  saveFile(fileName) {
    if (fileName === '') {
      this.appView.errorMessage.style.visibility = 'visible';
      return;
    }
    this.closeModalSave();
    this.download(this.canvas.canvas.svg(), fileName, 'image/svg+xml');
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
}
