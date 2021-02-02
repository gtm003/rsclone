export class ColorPickerController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onChangeColorClick = this.onChangeColorClick.bind(this);
  }

  addAllListeners() {
    this.appView.colorPicker.btnUserAnswerContainer.addEventListener('click', this.onChangeColorClick);
  }

  removeAllListeners() {
    this.appView.colorPicker.btnUserAnswerContainer.removeEventListener('click', this.onChangeColorClick);
  }

  onChangeColorClick({target}) {
    if (target.id === 'OK') {
      if (this.model.type === 'fill') {
        this.model.fillColor = this.appView.colorPicker.color;
        // [...this.appView.toolsLeftContainer.childNodes][7].style.background = this.appView.colorPicker.color;
        [...this.appView.toolsLeftContainer.childNodes][7].querySelector('svg').style.fill = this.appView.colorPicker.color;
      }
      else if (this.model.type === 'stroke') {
        this.model.strokeColor = this.appView.colorPicker.color;
        [...this.appView.toolsLeftContainer.childNodes][8].querySelector('svg').style.fill = this.appView.colorPicker.color;
      }
      this.appView.colorPicker.closeColorPicker();
    }
    if (target.id === 'CANSEL') {
      this.appView.colorPicker.closeColorPicker();
    }
  }
}
