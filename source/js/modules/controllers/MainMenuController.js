export class MainMenuController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onMenuButtonsClick = this.onMenuButtonsClick.bind(this);
    this.onNewImageModalClick = this.onNewImageModalClick.bind(this);
    this.onImportSvgChange = this.onImportSvgChange.bind(this);
    this.onSaveModalClick = this.onSaveModalClick.bind(this);
    this.onSettingsModalClick = this.onSettingsModalClick.bind(this);
  }

  addAllListeners() {
    this.appView.menuContainer.addEventListener('click', this.onMenuButtonsClick);
    this.appView.menuContainer.addEventListener('change', this.onImportSvgChange);
    this.appView.newImageModal.addEventListener('click', this.onNewImageModalClick);
    this.appView.saveModal.addEventListener('click', this.onSaveModalClick);
    this.appView.settingsModal.addEventListener('click', this.onSettingsModalClick);
  }

  removeAllListeners() {
    this.appView.menuContainer.removeEventListener('click', this.onMenuButtonsClick);
    this.appView.menuContainer.removeEventListener('change', this.onImportSvgChange);
    this.appView.newImageModal.removeEventListener('click', this.onNewImageModalClick);
    this.appView.saveModal.removeEventListener('click', this.onSaveModalClick);
    this.appView.settingsModal.removeEventListener('click', this.onSettingsModalClick);
  }

  onMenuButtonsClick({target}) {
    this.appView.deleteVisibilityContextMenu();

    const buttonDataAttribute = target.dataset[`${this.appView.menuButtonsDataAttribute}`];

    if (buttonDataAttribute === 'Create') {
      this.model.openNewImageModal();
      this.model.selectElements = [];
      this.appView.removeVisibilityPanel(this.model.selectElements);
    } else if (buttonDataAttribute === 'Save') {
      this.model.openModalSave();
    } else if (buttonDataAttribute === 'Properties') {
      this.model.openModalSettings();
    } else if (buttonDataAttribute === 'Get the code') {
      this.model.openModalSvgCode();
      console.log(JSON.stringify(this.model.getLastCondition()));
      console.log(this.model.getLastCondition());
    } else if (buttonDataAttribute === 'Undo') {
      this.model.unDo();
      this.appView.removeVisibilityPanel(this.model.selectElements);
    } else if (buttonDataAttribute === 'Redo') {
      this.model.reDo();
      this.appView.removeVisibilityPanel(this.model.selectElements);
    }
  }

  onImportSvgChange({target}) {
    if (target.dataset[`${this.appView.menuButtonsDataAttribute}`] === 'Import') {
      this.model.uploadSVG(target);
    }
  }

  onNewImageModalClick({target}) {
    const buttonDataAttribute = target.dataset[`${this.appView.newImageDataAttribute}`];

    if (buttonDataAttribute === 'ok') {
      this.model.createNewImage();
    } else if (buttonDataAttribute === 'cancel') {
      this.model.closeNewImageModal();
    }
  }

  onSaveModalClick({target}) {
    const buttonDataAttribute = target.dataset[`${this.appView.saveElementsDataAttribute}`];

    if (buttonDataAttribute === 'save') {
      if (this.appView.saveModal.classList.contains('modal-save--server')) {
        this.model.saveFile(this.appView.inputFileName.value, 'server');
      } else {
        this.model.saveFile(this.appView.inputFileName.value, 'client');
      }
    } else if (buttonDataAttribute === 'close') {
      this.model.closeModalSave();
    }
  }

  onSettingsModalClick({target}) {
    const buttonDataAttribute = target.dataset[`${this.appView.settingsElementsDataAttribute}`];

    if (buttonDataAttribute === 'save') {
      this.model.changeProperties();
      this.model.closeModalSettings();
    } else if (buttonDataAttribute === 'close') {
      this.model.closeModalSettings();
    }
  }
}
