import {MENU_BUTTONS_NAMES_EN} from '../../utils/btn-names';

export class MainMenu {
  constructor(menuButtonsDataAttribute) {
    this.menuButtonsDataAttribute = menuButtonsDataAttribute;
  }

  createMenuContainer() {
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('tools-top__menu-area');

    MENU_BUTTONS_NAMES_EN.forEach((item) => {
      if (item !== 'Import SVG') {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.dataset[`${this.menuButtonsDataAttribute}`] = `${item}`;
        button.textContent = item;
        menuContainer.appendChild(button);
      } else {
        const inputFileUpload = document.createElement('input');
        inputFileUpload.setAttribute('type', 'file');
        inputFileUpload.setAttribute('id', 'upload-file');
        inputFileUpload.dataset[`${this.menuButtonsDataAttribute}`] = `${item}`;
        inputFileUpload.style.display = 'none';

        const labelFileUpload = document.createElement('label');
        labelFileUpload.setAttribute('for', 'upload-file');
        labelFileUpload.textContent = item;
        menuContainer.append(labelFileUpload, inputFileUpload);
      }
    });

    return menuContainer;
  }
}
