import {createElement} from '../../utils/createELement';

export class SettingsModal {
  constructor(settingsElementsDataAttribute) {
    this.settingsElementsDataAttribute = settingsElementsDataAttribute;
  }

  createSettingsModal() {
    const settingsModal = createElement('div', ['modal-settings']);
    const modalTitle = createElement('div', ['modal-settings__title'], false, 'SVG-Document Settings');
    const widthSvg = createElement('div', ['modal-settings__svg-width']);

    const widthSvgInput = createElement('input', false, {type: 'text', id: 'svg-width-input'});
    widthSvgInput.dataset[`${this.settingsElementsDataAttribute}`] = 'width';

    const widthSvgLabel = createElement('label', false, {for: 'svg-width-input'}, 'SVG-area Width');
    widthSvg.append(widthSvgLabel, widthSvgInput);

    const heightSvg = createElement('div', ['modal-settings__svg-height']);
    const heightSvgInput = createElement('input', false, {type: 'text', id: 'svg-height-input'});
    heightSvgInput.dataset[`${this.settingsElementsDataAttribute}`] = 'height';

    const heightSvgLabel = createElement('label', false, {for: 'svg-height-input'}, 'SVG-area Height');
    heightSvg.append(heightSvgLabel, heightSvgInput);

    const saveButton = createElement('button', ['modal-settings__save-btn'], {type: 'button'}, 'Save');
    saveButton.dataset[`${this.settingsElementsDataAttribute}`] = 'save';

    const closeButton = createElement('button', ['modal-settings__close-btn'], {type: 'button'}, 'Cancel');
    closeButton.dataset[`${this.settingsElementsDataAttribute}`] = 'cancel';

    const btnsContainer = createElement('div', ['modal-settings__btns']);
    btnsContainer.append(saveButton, closeButton);

    settingsModal.append(modalTitle, widthSvg, heightSvg, btnsContainer);

    return settingsModal;
  }
}
