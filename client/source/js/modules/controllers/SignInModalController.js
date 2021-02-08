import {SignInModal} from '../views/SignInModal';

export class SignInModalController {
  constructor(appView, model, viewModel) {
    this.appView = appView;
    this.model = model;
    this.viewModel = viewModel;

    this.onSignInModalClick = this.onSignInModalClick.bind(this);
    this.onSignUpModalClick = this.onSignUpModalClick.bind(this);
    this.onToolsRightProfileClick = this.onToolsRightProfileClick.bind(this);
    this.onContainerModalOpenFilesClick = this.onContainerModalOpenFilesClick.bind(this);
  }

  addAllListeners() {
    this.appView.toolsRightContainer.addEventListener('click', this.onToolsRightProfileClick);
  }

  removeAllListeners() {
    this.appView.toolsRightContainer.removeEventListener('click', this.onToolsRightProfileClick);
  }

  onSignInModalClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign In') {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://rs-demo-back.herokuapp.com/auth/login');
      xhr.responseType = 'json';
      xhr.timeout = 5000;
      const email = this.appView.signInModal.childNodes[0].childNodes[0].value;
      const password = this.appView.signInModal.childNodes[0].childNodes[1].value;
      if (email !== '' && password !== '') {
        target.setAttribute('disabled', 'disabled'); // вот это левая тема. disabled поставить, даже если мы ничего не ввели в поле email password
        const json = {
          email,
          password,
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
          if (xhr.response.statusCode === 200) {
            this.viewModel.idClient = xhr.response.id;
            this.closeModalSignIn();
            this.appView.signInModalInstance.changeButtonSign(true);
            this.appView.signInModalInstance.renderProfile();
          }
        };
        xhr.ontimeout = () => {
          this.appView.signInModal.childNodes[1].textContent = 'Timeout';
        };
        xhr.onerror = () => {
          this.appView.signInModal.childNodes[1].textContent = 'Error';
        };
      } else {
        this.appView.signInModal.childNodes[1].textContent = 'Enter email and password';
      }
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Up') {
      this.closeModalSignIn();
      this.openModalSignUp();
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.closeModalSignIn();
    }
  }

  onSignUpModalClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Up') {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://rs-demo-back.herokuapp.com/auth/register');
      xhr.responseType = 'json';
      xhr.timeout = 5000;
      const username = this.appView.signInModal.childNodes[0].childNodes[0].value;
      const email = this.appView.signInModal.childNodes[0].childNodes[1].value;
      const password = this.appView.signInModal.childNodes[0].childNodes[2].value;
      if (username !== '' && email !== '' && password !== '') {
        target.setAttribute('disabled', 'disabled');
        const json = {
          username,
          email,
          password,
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
          if (xhr.response.statusCode === 200) {
            this.closeModalSignUp();
          }
        };
        xhr.ontimeout = () => {
          this.appView.signInModal.childNodes[1].textContent = 'Timeout';
        };
        xhr.onerror = () => {
          this.appView.signInModal.childNodes[1].textContent = 'Error';
        };
      } else {
        this.appView.signInModal.childNodes[1].textContent = 'Please enter username, email and password';
      }
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.closeModalSignUp();
    }
  }

  onToolsRightProfileClick({target}) {
    const button = target.closest('[data-register]');
    if (!button) return;
    if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Open') { // вот этот метод должен быть в моделе MainViewModel, он общий для всей аппы
      this.sendFilesRequest();
    } else if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Save') {
      this.model.openModalSave('server');
    } else if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Sign In') {
      this.openModalSignIn();
    } else if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Out') { // ну тут обработчик кнопки this.onSignInModalClick тож нужно удалять
      this.singOut();
    }
  }

  onContainerModalOpenFilesClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'File') {
      this.openFileFromProfile(target);
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.closeModalFilesInProfile();
    }
  }

  singOut() {
    this.appView.signInModalInstance.changeButtonSign(false);
    const lengthContainer = this.appView.toolsRightContainer.childNodes.length - 1;
    for (let i = 0; i < lengthContainer; i += 1) {
      this.appView.toolsRightContainer.childNodes[1].remove(); // вот тут удаляем лишние ноды при выходе из профиля
    }
  }

  openModalSignIn() {
    this.model.addOverlay();
    this.appView.signInModal = this.appView.signInModalInstance.createSignInModal(true); // вот тут метод модели MainViewModel нужно вызвать
    this.appView.signInModal.addEventListener('click', this.onSignInModalClick);
  }

  openModalSignUp() {
    this.model.addOverlay();
    this.appView.signInModal = this.appView.signInModalInstance.createSignInModal(false);
    this.appView.signInModal.addEventListener('click', this.onSignUpModalClick);
  }

  closeModalSignIn() {
    this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
    this.appView.signInModal.remove();
    this.model.removeOverlay();
  }

  closeModalSignUp() {
    this.appView.signInModal.removeEventListener('click', this.onSignUpModalClick);
    this.appView.signInModal.remove();
    this.model.removeOverlay();
  }

  sendFilesRequest() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://rs-demo-back.herokuapp.com/auth/login/${this.viewModel.idClient}`);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = () => {
      this.filenames = xhr.response.filenames;
      this.projects = xhr.response.projects;
      this.openModalFilesInProfile(this.filenames);
    };
  }

  openFileFromProfile(target) {
    const index = this.filenames.indexOf(target.value);
    const projects = this.projects[index];
    const projectArray = this.projects[index].split('@');
    let arrayOut = [];
    let arrayIn = [];
    projectArray.forEach((itemOut) => {
      const elem = itemOut.split('$');
      elem.forEach((itemIn) => {
        arrayIn.push(JSON.parse(itemIn));
      });
      arrayOut.push(arrayIn);
      arrayIn = [];
    });

    this.viewModel.createNewTab(arrayOut);
    this.viewModel.openTab(this.appView.tabs.length - 1);
    this.closeModalFilesInProfile();
  }

  openModalFilesInProfile(filenames) {
    this.appView.signInModalInstance.renderModalOpen(filenames);
    this.appView.signInModalInstance.containerModalOpenFiles.addEventListener('click', this.onContainerModalOpenFilesClick);
    this.model.addOverlay();
  }

  closeModalFilesInProfile() {
    this.appView.signInModalInstance.containerModalOpenFiles.removeEventListener('click', this.onContainerModalOpenFilesClick);
    this.appView.signInModalInstance.containerModalOpenFiles.remove();
    this.model.removeOverlay();
  }
}
