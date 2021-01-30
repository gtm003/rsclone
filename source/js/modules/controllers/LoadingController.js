export class LoadingController {
  constructor(model) {
    this.model = model;

    this.onWindowBeforeUnload = this.onWindowBeforeUnload.bind(this);
  }

  addAllListeners() {
    window.addEventListener('beforeunload', this.onWindowBeforeUnload);
  }

  onWindowBeforeUnload() {
    this.model.saveLastCondition();
  }
}
