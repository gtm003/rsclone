const RGBA = ['R', 'G', 'B', 'A'];
const USER_ANSWER = ['OK', 'CANSEL']

export class ColorPicker {
  constructor(rootElement){
    this.rootElement = rootElement;
    this.selectColorContainer =null
    this.pallete = null;
    this.ctxPallete = null;
    this.transparencyPicker = null;
    this.ctxTransparencyPicker = null;
    this.btnRGBAContainer = null;
    this.currenColorContainer = null;
    this.dataColor = [0, 0, 0, 255];
    this.color = 'rgba(0, 0, 0, 1)';
  }
  init() {
    this.selectColorContainer = document.createElement('div');
    this.selectColorContainer.classList.add('container__color-picker');
    this.rootElement.append(this.selectColorContainer);

    this.renderPallete(this.selectColorContainer);
    this.renderTransparencyPicker(this.selectColorContainer);
    this.renderNewColor(this.selectColorContainer);
    this.renderBtnRGBAContainer(this.selectColorContainer, RGBA);
    this.renderBtnUserAnswerContainer(this.selectColorContainer, USER_ANSWER);

    this.pallete.addEventListener('click', (e) => {
      this.pickColor(e);
      this.changeTransparencyPicker();
      this.changeInputValue();
      this.changeNewColor();
    });
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
    this.transparencyPicker.width = 225;
    this.transparencyPicker.height = 40;
    rootElement.append(this.transparencyPicker);
    this.ctxTransparencyPicker = this.transparencyPicker.getContext('2d');

    // Create gradient
    let gradient = this.ctxTransparencyPicker.createLinearGradient(0, 0, 215, 0);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "white");

    // Fill with gradient
    this.ctxTransparencyPicker.fillStyle = gradient;
    this.ctxTransparencyPicker.fillRect(5, 5, 215, 30);

  }
  renderNewColor(rootElement) {
    this.newColorContainer = document.createElement('div');
    this.newColorContainer.classList.add('new-color');
    rootElement.append(this.newColorContainer);
  }
  renderBtnRGBAContainer(rootElement, valueNames) {
    this.btnRGBAContainer = document.createElement('div');
    this.btnRGBAContainer.classList.add('btn-RGBA_container');
    rootElement.append(this.btnRGBAContainer);
    valueNames.forEach((elem) => {
      let name = document.createElement('span');
      name.innerHTML = `${elem}: `;

      let btnValue = document.createElement('input');
      btnValue.setAttribute('type', 'text');
      btnValue.id = `input-${elem}`;
      this.btnRGBAContainer.append(name, btnValue);
    })
  }

  renderBtnUserAnswerContainer(rootElement, value) {
    this.btnUserAnswerContainer = document.createElement('div');
    this.btnUserAnswerContainer.classList.add('btn-user-answer_container');
    rootElement.append(this.btnUserAnswerContainer);
    value.forEach((elem) => {
      let btn = document.createElement('input');
      btn.setAttribute('type', 'button');
      btn.setAttribute('value', elem);
      btn.setAttribute('id', elem);
      this.btnUserAnswerContainer.append(btn);
    })
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
  }
  pickTransparency(e) {

  }
  changeTransparencyPicker() {
    let gradient = this.ctxTransparencyPicker.createLinearGradient(0, 0, 215, 0);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "white");
    this.ctxTransparencyPicker.fillStyle = gradient;
    this.ctxTransparencyPicker.fillRect(5, 5, 215, 30);
  }
  changeNewColor() {
    this.newColorContainer.style.background = this.color;
  }
  changeInputValue() {
    const btnValue = [...this.btnRGBAContainer.childNodes].filter((node) => node.tagName === 'INPUT');
    btnValue.forEach((btn, index) => btn.setAttribute('placeholder', `${this.dataColor[index]}`));
  }
  openColorPicker() {
    this.selectColorContainer.classList.add('open');
  }
  closeColorPicker() {
    this.selectColorContainer.classList.remove('open');
  }
}
