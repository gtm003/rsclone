import { SVGCanvas } from "../models/SVGCanvas";

export class WorkArea {
    constructor(rootElement) {
      this.rootElement = rootElement;
    }
  
    init() {
      this.renderContent();
    }
  
    renderContent() {
        this.rootElement.className = 'workArea_container';
        const field = document.createElement('div');
        field.id = 'field';
        this.rootElement.append(field);
        /*
        let countSheet = 0;
        const btnAddSheet = document.createElement('button');
        btnAddSheet.id = 'btn_add_sheet';
        btnAddSheet.innerHTML = '+';
        field.append(btnAddSheet);
        btnAddSheet.onclick = () => {
            countSheet += 1;
            console.log(`${countSheet}`);
            const sheet = document.createElement('div');
            sheet.className = 'sheet';
            sheet.id = `sheet${countSheet}`;
            field.append(sheet);
            const labelSheet = document.createElement('button');
            labelSheet.innerHTML = `list${countSheet}`;
            labelSheet.className = 'label_sheet';
            field.append(labelSheet);
        }*/
        const sheet = document.createElement('div');
        sheet.className = 'sheet';
        field.append(sheet);

        const canvas = new SVGCanvas(sheet, 'rect');
        canvas.init();
        //let svgField = SVG().addTo('#sheet').size(500, 500);
        //console.log(document.querySelector('.sheet'));
        //let drawFirst = SVG().addTo(this.rootElement).size(700, 500);
        //let rect = drawFirst.rect(200, 100).attr({ fill: '#38A6FF' });

    }
}