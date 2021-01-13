const toolsLeftBtnName = ['select', 'rect', 'circle', 'line', 'polyline', 'text', 'path'];

export class ToolsLeft {
    constructor(rootElement, mainPage) {
      this.rootElement = rootElement;
      this.mainPage = mainPage;
      this.type = 'select';
    }
  
    init() {
      this.renderContent();
    }
  
    renderContent() {
        toolsLeftBtnName.forEach((item) => {
            let btn = document.createElement('button');
            btn.id = `${item}`;
            btn.innerHTML = item;
            this.rootElement.append(btn);
        })
    }
}