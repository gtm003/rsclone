export class HotKeysController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onHotKeysKeyUp = this.onHotKeysKeyUp.bind(this);
  }

  addAllListeners() {
    this.model.svgArea.node.addEventListener('keyup', this.onHotKeysKeyUp);
  }

  removeAllListeners(){
    this.model.svgArea.node.removeEventListener('keyup', this.onHotKeysKeyUp);
  }

  onHotKeysKeyUp({key, code, ctrlKey, metaKey}) {
    if (key === 'Delete') {
      this.model.deleteElements();
    } else if ((ctrlKey || metaKey) && code === 'KeyC') { // копировать
      this.model.copyElements();
    } else if ((ctrlKey || metaKey) && code === 'KeyV') { // вставить
      this.model.pasteElements();
    } else if ((ctrlKey || metaKey) && code === 'KeyZ') { // назад
      this.model.unDo();
    } else if ((ctrlKey || metaKey) && code === 'KeyY') { // вперед
      this.model.reDo();
    }
  }
}
