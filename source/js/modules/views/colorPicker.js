const RGBA = ['R', 'G', 'B', 'A'];

export class ColorPicker {
  constructor(rootElement){
    this.rootElement = rootElement;
    this.pallete = null;
    this.ctxPallete = null;
    this.transparencyPicker = null;
    this.ctxTransparencyPicker = null;
    this.RGBAValueContainer = null;
    this.dataColor = [0, 0, 0, 255];
    this.color = 'rgba(0, 0, 0, 1)'
  }
  init() {
    let selectColorContainer = document.createElement('div');
    selectColorContainer.classList.add('container__color-picker');
    this.rootElement.append(selectColorContainer);

    this.renderPallete(selectColorContainer);
    this.renderTransparencyPicker(selectColorContainer);
    this.renderCurrentColor(selectColorContainer);
    this.renderNewColor(selectColorContainer);
    this.RGBAValueContainer = this.renderInputValue(selectColorContainer, RGBA);
    //this.renderInputValue(selectColorContainer, RGBA);

    this.pallete.addEventListener('click', (e) => this.pickColor(e));
  }

  renderPallete(rootElement) {
    this.pallete = document.createElement('canvas');
    this.pallete.classList.add('pallete');
    rootElement.append(this.pallete);
    this.ctxPallete = this.pallete.getContext('2d');

    let gradient = this.pallete.getContext('2d').createLinearGradient(0, 0, this.pallete.width, 0)
    gradient.addColorStop(0, '#ff0000')
    gradient.addColorStop(1 / 6, '#ffff00')
    gradient.addColorStop((1 / 6) * 2, '#00ff00')
    gradient.addColorStop((1 / 6) * 3, '#00ffff')
    gradient.addColorStop((1 / 6) * 4, '#0000ff')
    gradient.addColorStop((1 / 6) * 5, '#ff00ff')
    gradient.addColorStop(1, '#ff0000')
    this.pallete.getContext('2d').fillStyle = gradient
    this.pallete.getContext('2d').fillRect(0, 0, this.pallete.width, this.pallete.height)

    gradient = this.pallete.getContext('2d').createLinearGradient(0, 0, 0, this.pallete.height)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.pallete.getContext('2d').fillStyle = gradient
    this.pallete.getContext('2d').fillRect(0, 0, this.pallete.width, this.pallete.height)

    gradient = this.pallete.getContext('2d').createLinearGradient(0, 0, 0, this.pallete.height)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
    this.pallete.getContext('2d').fillStyle = gradient
    this.pallete.getContext('2d').fillRect(0, 0, this.pallete.width, this.pallete.height)
  }
  renderTransparencyPicker(rootElement) {
    this.transparencyPicker = document.createElement('canvas');
    this.transparencyPicker.classList.add('transparency-picker');
    this.transparencyPicker.width = 150;
    this.transparencyPicker.height = 40;
    rootElement.append(this.transparencyPicker);
    this.ctxTransparencyPicker = this.transparencyPicker.getContext('2d');

    // Create gradient
    let gradient = this.ctxTransparencyPicker.createLinearGradient(0, 0, 140, 0);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "white");

    // Fill with gradient
    this.ctxTransparencyPicker.fillStyle = gradient;
    this.ctxTransparencyPicker.fillRect(5, 5, 140, 30);

  }
  renderCurrentColor(rootElement) {
    const currenColorContainer = document.createElement('div');
    currenColorContainer.classList.add('current-color');
    rootElement.append(currenColorContainer);
  }
  renderNewColor(rootElement) {
    const newColorContainer = document.createElement('div');
    newColorContainer.classList.add('new-color');
    rootElement.append(newColorContainer);
  }
  renderInputValue(rootElement, valueNames) {
    valueNames.forEach((elem) => {
      let container = document.createElement('div');
      container.classList.add(`container-${elem}`);
      rootElement.append(container);

      let name = document.createElement('span');
      name.innerHTML = `${elem}: `;

      let valueBtn = document.createElement('input');
      valueBtn.setAttribute('type', 'text');
      valueBtn.id = `input-${elem}`;
      container.append(name, valueBtn);
    })
    //const R = document.createElement('input');
    //R.classList.add('input-R')
    //rootElement.append(R);

  }

  pickColor(e) {
    let x = e.layerX;
    let y = e.layerY;
    let pixel = this.ctxPallete.getImageData(x, y, 1, 1);
    let data = pixel.data;
    this.dataColor = pixel.data;
    let rgba = 'rgba(' + data[0] + ', ' + data[1] +
           ', ' + data[2] + ', ' + (data[3] / 255) + ')';
    this.color = `rgba(${this.dataColor[0]}, ${this.dataColor[1]}, ${this.dataColor[2]}, 1)`
    console.log(this.dataColor);
    console.log(this.color);
    return data;
  }

  pickTransparency(e) {

  }
  changeNewColor() {

  }
  changeInputValue() {
    console.log(this.RGBAValueContainer);

  }




}
