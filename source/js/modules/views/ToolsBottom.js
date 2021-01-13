const toolsBottomBtnName = ['red', 'green', 'blue'];

export class ToolsBottom {
    constructor(rootElement) {
      this.rootElement = rootElement;
    }
  
    init() {
      this.renderContent();
    }
  
    renderContent() {
        toolsBottomBtnName.forEach((item) => {
            let btn = document.createElement('button');
            btn.id = `${item}`;
            btn.style.background = item;
            this.rootElement.append(btn);
        })
    }
}