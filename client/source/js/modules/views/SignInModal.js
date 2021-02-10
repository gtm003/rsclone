import {createElement} from '../../utils/createELement';

export class SignInModal {
  constructor(appView) {
    this.appView = appView;
  }

  createSignInModal(flag) {
    this.removeSignInModal();
    const signInModal = createElement('div', ['modal-sign-in']);

    if (flag) {
      const containerField = createElement('div', ['modal-sign-in__field']);
      const emailField = createElement('input', [], {'type': 'text', 'placeholder': 'Email'});
      const passwordField = createElement('input', [], {'type': 'password', 'placeholder': 'Password'});
      containerField.append(emailField, passwordField);
      const containerMessage = createElement('div', ['modal-sign-in__message']);
      const signUpAddInformationContainer = createElement('div', ['modal-sign-in__unregistered']);
      const signUpDiv = createElement('div', ['modal-sign-in__inf'], {}, 'Not registered?');
      const signUpButton = createElement('input', ['modal-sign-in__btn'], {'type': 'button', 'value': 'Sign Up'});
      signUpButton.dataset[this.appView.signInButtonsDataAttribute] = 'Sign Up';
      signUpAddInformationContainer.append(signUpDiv, signUpButton);
      const signUpButtonsContainer = createElement('div', ['modal-sign-in__container-btn']);
      const signInButton = createElement('input', ['modal-sign-in__container-btn__sign-in'], {'type': 'submit', 'value': 'Sign In'});
      signInButton.dataset[this.appView.signInButtonsDataAttribute] = 'Sign In';
      const cancelButton = createElement('input', ['modal-sign-in__container-btn__cancel'], {'type': 'submit', 'value': 'Cancel'});
      cancelButton.dataset[this.appView.signInButtonsDataAttribute] = 'Cancel';
      signUpButtonsContainer.append(signInButton, cancelButton);
      signInModal.append(containerField, containerMessage, signUpAddInformationContainer, signUpButtonsContainer);
    } else {
      const containerField = createElement('div', ['modal-sign-in__field']);
      const usernameField = createElement('input', ['modal-sign-in__field'], {'type': 'text', 'placeholder': 'Username'});
      const emailField = createElement('input', ['modal-sign-in__field'], {'type': 'text', 'placeholder': 'Email'});
      const passwordField = createElement('input', ['modal-sign-in__field'], {'type': 'password', 'placeholder': 'Password'});
      containerField.append(usernameField, emailField, passwordField);
      const containerMessage = createElement('div', ['modal-sign-in__message']);
      const signUpButtonsContainer = createElement('div', ['modal-sign-in__container-btn']);
      const signInButton = createElement('input', ['modal-sign-in__container-btn__sign-in'], {'type': 'submit', 'value': 'Sign Up'});
      signInButton.dataset[this.appView.signInButtonsDataAttribute] = 'Sign Up';
      const cancelButton = createElement('input', ['modal-sign-in__container-btn__cancel'], {'type': 'submit', 'value': 'Cancel'});
      cancelButton.dataset[this.appView.signInButtonsDataAttribute] = 'Cancel';
      signUpButtonsContainer.append(signInButton, cancelButton);
      signInModal.append(containerField, containerMessage, signUpButtonsContainer);
    }

    this.appView.contentContainer.append(signInModal);

    return signInModal;
  }

  removeSignInModal() {
    const container = this.appView.signInModal;

    if (container !== null) {
      container.remove();
    }
  }

  changeButtonSign(flag) {
    if (flag) {
      this.appView.toolsRightContainer.childNodes[0].innerHTML = '<svg width="36" height="36"><use xlink:href="#icon-sign-out"></use></svg>';
      this.appView.toolsRightContainer.childNodes[0].dataset[this.appView.signInButtonsDataAttribute] = 'Sign Out';
    } else {
      this.appView.toolsRightContainer.childNodes[0].innerHTML = '<svg width="35" height="35"><use xlink:href="#icon-sign-in"></use></svg>';
      this.appView.toolsRightContainer.childNodes[0].dataset[this.appView.signInButtonsDataAttribute] = 'Sign In';
    }
  }

  renderProfile() { // правильнее эту функцию будет назвать renderProfile
    const buttonOpen = createElement('button', ['tools-right__open'], {'type': 'button'}, 'Open Files');
    buttonOpen.dataset[this.appView.signInButtonsDataAttribute] = 'Open';
    buttonOpen.innerHTML = '<svg width="30" height="28"><use xlink:href="#icon-open"></use></svg>';
    const buttonSave = createElement('button', ['tools-right__save'], {'type': 'button'}, 'Save in Profile');
    buttonSave.innerHTML = '<svg width="28" height="28"><use xlink:href="#icon-save"></use></svg>';
    buttonSave.dataset[this.appView.signInButtonsDataAttribute] = 'Save';
    this.appView.toolsRightContainer.append(buttonOpen, buttonSave);
  }

  renderModalOpen(arrayFiles) { // правильнее эту функцию будет назвать renderModalOpen
    this.containerModalOpenFiles = createElement('div', ['modal-open']);
    const contentButtons = createElement('div', ['modal-open__content']);
    if (arrayFiles === null) {
      const message = createElement('div', ['modal-open__message']);
      message.textContent = 'There are no files in the profile yet.';
      contentButtons.append(message);
    } else {
      for (let i = 0; i < arrayFiles.length; i += 1) {
        const btn = createElement('input', ['modal-open__content__btn'], {'type': 'button', 'value': `${arrayFiles[i]}`});
        btn.dataset[this.appView.signInButtonsDataAttribute] = 'File';
        contentButtons.append(btn);
      }
    }
    const btnCancel = createElement('input', ['modal-open__content__cancel'], {'type': 'button', 'value': 'Cancel'});
    btnCancel.dataset[this.appView.signInButtonsDataAttribute] = 'Cancel';
    this.containerModalOpenFiles.append(contentButtons, btnCancel);
    this.appView.contentContainer.append(this.containerModalOpenFiles);
  }
}
