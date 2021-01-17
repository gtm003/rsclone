export class ColorPicker {
  constructor(rootElement){
    this.rootElement = rootElement;
    this.pallete = null;
    this.color = null
  }
  init() {
    let selectColorContainer = document.createElement('div');
    selectColorContainer.classList.add('pallete_canvas');
    this.rootElement.append(selectColorContainer);

    let palleteCanvas = document.createElement('canvas');
    palleteCanvas.classList.add('pallete_canvas');
    selectColorContainer.append(palleteCanvas);
    let ctx = palleteCanvas.getContext('2d');
    //ctx.fillStyle = 'rgb(200, 0, 0)';
    //ctx.fillRect(10, 10, 50, 50);

    let gradient = palleteCanvas.getContext('2d').createLinearGradient(0, 0, palleteCanvas.width, 0)
    gradient.addColorStop(0, '#ff0000')
    gradient.addColorStop(1 / 6, '#ffff00')
    gradient.addColorStop((1 / 6) * 2, '#00ff00')
    gradient.addColorStop((1 / 6) * 3, '#00ffff')
    gradient.addColorStop((1 / 6) * 4, '#0000ff')
    gradient.addColorStop((1 / 6) * 5, '#ff00ff')
    gradient.addColorStop(1, '#ff0000')
    palleteCanvas.getContext('2d').fillStyle = gradient
    palleteCanvas.getContext('2d').fillRect(0, 0, palleteCanvas.width, palleteCanvas.height)

    gradient = palleteCanvas.getContext('2d').createLinearGradient(0, 0, 0, palleteCanvas.height)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    palleteCanvas.getContext('2d').fillStyle = gradient
    palleteCanvas.getContext('2d').fillRect(0, 0, palleteCanvas.width, palleteCanvas.height)

    gradient = palleteCanvas.getContext('2d').createLinearGradient(0, 0, 0, palleteCanvas.height)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
    palleteCanvas.getContext('2d').fillStyle = gradient
    palleteCanvas.getContext('2d').fillRect(0, 0, palleteCanvas.width, palleteCanvas.height)

    function pick(e) {
      let x = e.layerX;
      let y = e.layerY;
      let pixel = ctx.getImageData(x, y, 1, 1);
      let data = pixel.data;
      let rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
      console.log(rgba)
    }
    palleteCanvas.addEventListener('click', pick);
  }
}
