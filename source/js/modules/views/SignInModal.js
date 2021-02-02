import {createElement} from '../../utils/createELement';

export class SignInModal {
  constructor(appView, rootElement) {
    this.appView = appView;
    this.rootElement = rootElement;
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
    this.rootElement.append(signInModal);

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
      this.appView.toolsRightContainer.childNodes[0].textContent = 'Sign Out';
      this.appView.toolsRightContainer.childNodes[0].dataset[this.appView.signInButtonsDataAttribute] = 'Sign Out';
    } else {
      this.appView.toolsRightContainer.childNodes[0].textContent = 'Sign In';
      this.appView.toolsRightContainer.childNodes[0].dataset[this.appView.signInButtonsDataAttribute] = 'Sign In';
    }
  }

  createProfile() {
    const buttonOpen = createElement('button', ['tools-right__open'], {'type': 'button'}, 'Open Files');
    buttonOpen.dataset[this.appView.signInButtonsDataAttribute] = 'Open';
    const buttonSave = createElement('button', ['tools-right__save'], {'type': 'button'}, 'Save in Profile');
    buttonSave.dataset[this.appView.signInButtonsDataAttribute] = 'Save';
    this.appView.toolsRightContainer.append(buttonOpen, buttonSave);
  }

  createModalOpen(arrayFiles) {
    const containerModalOpenFiles = createElement('div', ['modal--open']);
    for (let i = 0; i < arrayFiles.length; i += 1) {
      const btn = createElement('input', ['modal--open__btn'], {'type': 'button', 'value': `${arrayFiles[i]}.svg`});
      containerModalOpenFiles.append(btn);
    }
    this.rootElement.append(containerModalOpenFiles);
  }
}
