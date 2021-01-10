const toolsLeftBtnName = ['select', 'rect', 'circle', 'line', 'polyline', 'text', 'path'];

export class ToolsLeft {
    constructor(rootElement, mainPage) {
      this.rootElement = rootElement;
      this.mainPage = mainPage;
      this.type = 'select';
    }
  
    init() {
      this.renderContent();
      this.addListeners();
    }
  
    renderContent() {
        this.rootElement.className = 'toolsLeft_container';
        toolsLeftBtnName.forEach((item) => {
            let btn = document.createElement('button');
            btn.id = `${item}`;
            btn.innerHTML = item;
            this.rootElement.append(btn);
        })
    }

    addListeners() {
        this.rootElement.addEventListener('click', (event) => {
            let target = event.target;
            while (target != this) {
                if (target.nodeName == 'BUTTON') {
                    this.mainPage.type = target.id;
                    console.log(this.mainPage.type);
                    return;
                }
                target = target.parentNode;
            }
        })
    }
}