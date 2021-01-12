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
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    field.append(sheet);

    const canvas = new SVGCanvas(sheet);
    canvas.init();
  }
}