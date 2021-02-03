const RGBA = ['R', 'G', 'B', 'A'];
const USER_ANSWER = ['OK', 'CANСEL']

export class ColorPicker {
  constructor(rootElement){
    this.rootElement = rootElement;
    this.selectColorContainer =null
    this.pallete = null;
    this.ctxPallete = null;
    this.transparency = null;
    this.ctxTransparency = null;
    this.ctxNewColor = null;
    this.selectRGBA = null;
    this.currenColorContainer = null;
    this.rgba = [0, 0, 0, 1];
    this.color = 'rgba(0, 0, 0, 1)';

    this.onPalleteClick = this.onPalleteClick.bind(this);
    this.onTransparencyClick = this.onTransparencyClick.bind(this);
    this.onSelectRGBAChange = this.onSelectRGBAChange.bind(this);
  }
  init() {
    this.selectColorContainer = document.createElement('div');
    this.selectColorContainer.classList.add('color-picker');
    this.rootElement.append(this.selectColorContainer);

    this.renderPallete(this.selectColorContainer);
    this.renderTransparency(this.selectColorContainer);
    this.renderNewColor(this.selectColorContainer);
    this.renderSelectRGBA(this.selectColorContainer, RGBA);
    this.renderBtnUserAnswerContainer(this.selectColorContainer, USER_ANSWER);

    this.pallete.addEventListener('click', this.onPalleteClick);
    this.transparency.addEventListener('click', this.onTransparencyClick);
    this.selectRGBA.addEventListener('change', this.onSelectRGBAChange);
  }

  onPalleteClick(e) {
    this.pickColor(e);
    this.updateTransparency();
    this.updateSelectRGBA();
    this.updateNewColor();
  }

  onTransparencyClick(e) {
    this.pickTransparency(e);
    this.updateSelectRGBA();
    this.updateNewColor();
  }

  onSelectRGBAChange() {
    this.changeSelectRGBA();
    this.updateTransparency();
    this.updateNewColor();
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
  renderTransparency(rootElement) {
    this.transparency = document.createElement('canvas');
    this.transparency.classList.add('transparency');
    this.transparency.width = 210;
    this.transparency.height = 30;
    rootElement.append(this.transparency);
    this.ctxTransparency = this.transparency.getContext('2d');

    this.renderUnderlayer(this.ctxTransparency, 210, 30, 5);

    let gradient = this.ctxTransparency.createLinearGradient(0, 0, 210, 0);
    let colorStart = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, 1)`
    gradient.addColorStop(0, colorStart);
    let colorEnd = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, 0)`;
    gradient.addColorStop(1, colorEnd);

    this.ctxTransparency.fillStyle = gradient;
    this.ctxTransparency.fillRect(0, 0, 210, 30);
  }
  renderUnderlayer(ctx, width, height, cellSize) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ccc';
    for (let i = 0; i < width / cellSize; i += 2) {
      for (let j = 0; j < height / cellSize; j += 2) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        ctx.fillRect((i + 1) * cellSize, (j + 1) * cellSize, cellSize, cellSize);
      }
    }
  }
  renderNewColor(rootElement) {
    const newColor = document.createElement('canvas');
    newColor.classList.add('new-color');
    newColor.width = 60;
    newColor.height = 30;
    rootElement.append(newColor);
    this.ctxNewColor = newColor.getContext('2d');
    this.renderUnderlayer(this.ctxNewColor, 60, 30, 5);
    this.ctxNewColor.fillStyle = this.color;
    this.ctxNewColor.fillRect(0, 0, 60, 30);
  }
  renderSelectRGBA(rootElement, valueNames) {
    this.selectRGBA = document.createElement('div');
    this.selectRGBA.classList.add('btn-RGBA_container');
    rootElement.append(this.selectRGBA);
    valueNames.forEach((elem, index) => {
      let name = document.createElement('span');
      name.innerHTML = `${elem}: `;

      let btnValue = document.createElement('input');
      btnValue.setAttribute('type', 'text');
      btnValue.id = `input-${elem}`;
      btnValue.setAttribute('placeholder', `${this.rgba[index]}`);
      this.selectRGBA.append(name, btnValue);
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
    for (let i = 0; i < 3; i += 1) {
      this.rgba[i] = pixel.data[i];
    }
    this.color = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, ${this.rgba[3]})`
  }
  pickTransparency(e) {
    this.rgba[3] = (1 - e.layerX / 210).toFixed(2);
    this.color = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, ${this.rgba[3]})`
  }
  changeSelectRGBA() {
    const btnValue = [...this.selectRGBA.childNodes].filter((node) => node.tagName === 'INPUT');
    btnValue.forEach((btn, index) => {
      if (btn.value !== '') this.rgba[index] = Number(btn.value);
      this.color = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, ${this.rgba[3]})`;
    });
  }
  updateTransparency() {
    this.renderUnderlayer(this.ctxTransparency, 210, 30, 5);
    let gradient = this.ctxTransparency.createLinearGradient(0, 0, 210, 0);
    let colorStart = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, 1)`
    gradient.addColorStop(0, colorStart);
    let colorEnd = `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, 0)`;
    gradient.addColorStop(1, colorEnd);
    this.ctxTransparency.fillStyle = gradient;
    this.ctxTransparency.fillRect(0, 0, 210, 30);
  }
  updateNewColor() {
    this.renderUnderlayer(this.ctxNewColor, 60, 30, 5);

    this.ctxNewColor.fillStyle = this.color;
    this.ctxNewColor.fillRect(0, 0, 60, 30);
  }
  updateSelectRGBA() {
    const btnValue = [...this.selectRGBA.childNodes].filter((node) => node.tagName === 'INPUT');
    btnValue.forEach((btn, index) => btn.value = this.rgba[index]);
  }
  openColorPicker() {
    this.selectColorContainer.classList.add('open');
  }
  closeColorPicker() {
    this.selectColorContainer.classList.remove('open');
  }
}
