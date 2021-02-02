import {createElement} from '../../utils/createELement';

export class NewImageModal {
  constructor(newImageDataAttribute) {
    this.newImageDataAttribute = newImageDataAttribute;
  }

  createNewImageModal() {
    const newImageModal = createElement('div', ['modal-new-image']);

    const modalText = createElement('div', ['modal-new-image__text']);
    const p1 = createElement('div', false, false, 'Do you want to clear the drawing?');
    const p2 = createElement('div', false, false, 'This will also erase your undo history!');
    modalText.append(p1, p2);

    const buttonsContainer = createElement('div', ['modal-new-image__btns']);
    const okButton = createElement('button', false, {type: 'button'}, 'Ok');
    okButton.dataset[`${this.newImageDataAttribute}`] = 'ok';
    const cancelButton = createElement('button', false, {type: 'button'}, 'Cancel');
    cancelButton.dataset[`${this.newImageDataAttribute}`] = 'cancel';
    buttonsContainer.append(okButton, cancelButton);

    newImageModal.append(modalText, buttonsContainer);

    return newImageModal;
  }
}
