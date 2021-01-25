export class FunctionalAreaController {
  constructor(appView, model) {
    this.appView = appView;
    this.model = model;

    this.onPropertiesSVGElementKeyUp = this.onPropertiesSVGElementKeyUp.bind(this);
    this.onDeleteElementsClick = this.onDeleteElementsClick.bind(this);
    this.onSelectPropertyChange = this.onSelectPropertyChange.bind(this);
    this.onAlignPanelClick = this.onAlignPanelClick.bind(this);
  }

  init() {
    this.appView.rectContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.lineContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.ellipseContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.textContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);
    this.appView.pencilContainerPanel.addEventListener('keyup', this.onPropertiesSVGElementKeyUp);

    this.appView.rectContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.lineContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.ellipseContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.textContainerPanel.addEventListener('click', this.onDeleteElementsClick);
    this.appView.selectProperty.addEventListener('change', this.onSelectPropertyChange);
    this.appView.pencilContainerPanel.addEventListener('click', this.onDeleteElementsClick);

    this.appView.alignContainerPanel.addEventListener('click', this.onAlignPanelClick);
  }

  onPropertiesSVGElementKeyUp({target}) {
    if (target.dataset['delete'] !== 'delete' && target.dataset['convert'] !== 'convert') {
      this.playSound();
      this.model.changePropertiesSVGElement(target);
    }
  }

  onDeleteElementsClick({target}) {
    if (target.closest('.tools-top__functional-area__container__btn--click') !== null) {
      if (target.closest('.tools-top__functional-area__container__btn--click').dataset[this.appView.propertiesDataAttribute] === 'delete') {
        this.model.deleteElements();
      }
    }
  }

  onSelectPropertyChange({target}) {
    this.model.changeSelectProperty(target);
  }

  onAlignPanelClick({target}) {
    if (target.closest('.tools-top__functional-area__container__btn--click') !== null) {
      const dataAttribute = target.closest('.tools-top__functional-area__container__btn--click').dataset[this.appView.alignPanelDataAttribute];
      if (dataAttribute === 'disabled_by_default') {
        this.model.deleteElements();
      } else if (dataAttribute === 'timeline') {
      } else {
        this.model.alignElements(dataAttribute);
      }
    }
  }

  playSound() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gainNode = context.createGain();
    osc.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.value = 0.1;
    osc.frequency.value = 200;
    osc.type = 'triangle';
    osc.start();

    setTimeout(function() {
      osc.stop();
    }, 150);
  }
}
