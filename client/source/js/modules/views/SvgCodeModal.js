import {createElement} from '../../utils/createELement';

export class SvgCodeModal {
  constructor(dataAttribute) {
    this.svgCodeDataAttribute = dataAttribute;
  }

  createSvgCodeModal() {
    const svgCodeModal = createElement('div', ['modal-svg-code']);
    const textArea = createElement('textarea', ['modal-svg-code__textarea'], {readonly: 'true', spellcheck: 'false'});
    const title = createElement('div', ['modal-svg-code__title'], false, 'SVG-code');
    const btnsContainer = createElement('div', ['modal-svg-code__btns']);
    const btnClose = createElement('button', ['modal-svg-code__close'], {type: 'button'}, 'Cancel');
    btnClose.dataset[this.svgCodeDataAttribute] = 'cancel';
    btnsContainer.append(btnClose);
    svgCodeModal.append(title, textArea, btnsContainer);

    return svgCodeModal;
  }
}
