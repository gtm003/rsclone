const toolsLeftBtnName = ['select', 'rect', 'circle', 'line', 'polyline', 'text', 'path'];

export class ToolsLeft {
    constructor(rootElement) {
      this.rootElement = rootElement;
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
        this.rootElement.addEventListener('click', function(event) {
            let target = event.target;
            console.log(this.type);
            while (target != this) {
                if (target.nodeName == 'BUTTON') {
                    this.type = target.id;
                    return;
                }
                target = target.parentNode;
            }
        })
    }
}