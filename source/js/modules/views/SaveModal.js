import {createElement} from '../../utils/createELement';

export class SaveModal {
  constructor(saveElementsDataAttribute) {
    this.saveElementsDataAttribute = saveElementsDataAttribute;
    this.inputFileName = null;
    this.errorMessage = null;
  }

  createInputFileName() {
    return this.inputFileName;
  }

  createErrorMessage() {
    return this.errorMessage;
  }

  createSaveModal() {
    const saveModal = createElement('div', ['modal-save']);

    this.inputFileName = createElement('input', ['modal-save__file-name'], {type: 'text'});
    this.inputFileName.dataset[`${this.saveElementsDataAttribute}`] = 'name';

    const saveButton = createElement('button', ['modal-save__save-btn'], {type: 'button'}, 'Save');
    saveButton.dataset[`${this.saveElementsDataAttribute}`] = 'save';

    const closeButton = createElement('button', ['modal-save__close-btn'], {type: 'button'}, 'Close');
    closeButton.dataset[`${this.saveElementsDataAttribute}`] = 'close';

    this.errorMessage = createElement('div', false, false, 'Please enter the file name');
    this.errorMessage.style.visibility = 'hidden';

    saveModal.append(this.errorMessage, this.inputFileName, saveButton, closeButton);

    return saveModal;
  }
}
