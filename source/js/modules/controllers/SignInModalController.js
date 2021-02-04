import {SignInModal} from '../views/SignInModal';
import {createElement} from '../../utils/createELement';

export class SignInModalController {
  constructor(appView, model, viewModel) {
    this.appView = appView;
    this.model = model;
    this.viewModel = viewModel;
    this.signInModalObject = new SignInModal(this.appView, this.appView.contentContainer);

    this.openSignInModal = this.openSignInModal.bind(this);
    this.onSignInModalClick = this.onSignInModalClick.bind(this);
    this.onSignUpModalClick = this.onSignUpModalClick.bind(this);
    this.onToolsRightProfileClick = this.onToolsRightProfileClick.bind(this);
    this.onContainerModalOpenFilesClick = this.onContainerModalOpenFilesClick.bind(this);
  }

  addAllListeners() {
    this.appView.toolsRightContainer.addEventListener('click', this.openSignInModal);
  }

  openSignInModal({target}) {
    const button = target.closest('[data-register]');
    if (!button) return;
    console.log(button);
    if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Sign In') {
      this.model.addOverlay();
      this.appView.signInModal = this.signInModalObject.createSignInModal(true);
      this.appView.signInModal.addEventListener('click', this.onSignInModalClick);
    } else if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Out') {
      this.signInModalObject.changeButtonSign(false);
      const lengthContainer = this.appView.toolsRightContainer.childNodes.length - 1;
      for (let i = 0; i < lengthContainer; i += 1) {
        this.appView.toolsRightContainer.childNodes[1].remove();
      }
    }
  }

  onSignInModalClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign In') {
      target.setAttribute('disabled', 'disabled');
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://rs-demo-back.herokuapp.com/auth/login');
      xhr.responseType = 'json';
      const email = this.appView.signInModal.childNodes[0].childNodes[0].value;
      const password = this.appView.signInModal.childNodes[0].childNodes[1].value;
      if (email !== '' && password !== '') {
        const json = {
          email,
          password,
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
          if (xhr.response.statusCode === 200) {
            this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
            this.appView.signInModal.remove();
            this.model.removeOverlay();
            this.model.idClient = xhr.response.id;
            this.signInModalObject.changeButtonSign(true);
            this.signInModalObject.createProfile();
            this.appView.toolsRightContainer.addEventListener('click', this.onToolsRightProfileClick);
          } else {
            this.appView.signInModal.childNodes[1].textContent = xhr.response.reason;
          }
        };
      }
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Up') {
      this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
      this.appView.signInModal = this.signInModalObject.createSignInModal(false);
      this.appView.signInModal.addEventListener('click', this.onSignUpModalClick);
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
      this.appView.signInModal.remove();
      this.model.removeOverlay();
    }
  }

  onSignUpModalClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Sign Up') {
      target.setAttribute('disabled', 'disabled');
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://rs-demo-back.herokuapp.com/auth/register');
      xhr.responseType = 'json';
      const username = this.appView.signInModal.childNodes[0].childNodes[0].value;
      const email = this.appView.signInModal.childNodes[0].childNodes[1].value;
      const password = this.appView.signInModal.childNodes[0].childNodes[2].value;
      if (username !== '' && email !== '' && password !== '') {
        const json = {
          username,
          email,
          password,
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json));
        xhr.onload = () => {
          if (xhr.response.statusCode === 200) {
            this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
            this.appView.signInModal.remove();
            this.model.removeOverlay();
          } else {
            this.appView.signInModal.childNodes[1].textContent = xhr.response.reason;
          }
        };
      }
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.appView.signInModal.removeEventListener('click', this.onSignInModalClick);
      this.appView.signInModal.remove();
      this.model.removeOverlay();
    }
  }

  onToolsRightProfileClick({target}) {
    const button = target.closest('[data-register]');
    if (!button) return;
    if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Open') {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `https://rs-demo-back.herokuapp.com/auth/login/${this.model.idClient}`);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      xhr.onload = () => {
        this.filenames = xhr.response.filenames;
        this.projects = xhr.response.projects;
        this.signInModalObject.createModalOpen(this.filenames);
        this.signInModalObject.containerModalOpenFiles.addEventListener('click', this.onContainerModalOpenFilesClick);
        this.model.addOverlay();
      };
    } else if (button.dataset[this.appView.signInButtonsDataAttribute] === 'Save') {
      this.model.openModalSave('server');
    }
  }

  onContainerModalOpenFilesClick({target}) {
    if (target.dataset[this.appView.signInButtonsDataAttribute] === 'File') {
      const index = this.filenames.indexOf(target.value);
      const projects = this.projects[index];
      const projectArray = this.projects[index].split('@');
      let arrayOut = [];
      let arrayIn = [];
      projectArray.forEach((itemOut) => {
        const elem = itemOut.split('$');
        elem.forEach((itemIn) => {
          // console.log(elem);
          arrayIn.push(JSON.parse(itemIn));
        });
        arrayOut.push(arrayIn);
        arrayIn = [];
      });

      this.viewModel.createNewTab(arrayOut);
      this.viewModel.openTab(this.appView.tabs.length - 1);
      // вот здесь делать создание нового холста по клику, мб придется перефакторить код
    } else if (target.dataset[this.appView.signInButtonsDataAttribute] === 'Cancel') {
      this.signInModalObject.containerModalOpenFiles.removeEventListener('click', this.onContainerModalOpenFilesClick);
      this.signInModalObject.containerModalOpenFiles.remove();
      this.model.removeOverlay();
    }
  }
}
