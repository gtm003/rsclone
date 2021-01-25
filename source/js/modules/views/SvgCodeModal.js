import {createElement} from '../../utils/createELement';

export class SvgCodeModal {
  constructor() {
  }

  createSvgCodeModal() {
    const svgCodeModal = createElement('div', ['modal-svg-code']);
    // const preElement = document.createElement('pre');
    // const codeElement = document.createElement('code');
    // preElement.appendChild(codeElement);
    // svgCodeModal.appendChild(preElement);
    // console.log(svgCodeModal)

    return svgCodeModal;
  }
}
