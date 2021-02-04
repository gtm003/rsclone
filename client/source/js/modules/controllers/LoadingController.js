export class LoadingController {
  constructor(viewModel) {
    this.viewModel = viewModel;

    this.onWindowBeforeUnload = this.onWindowBeforeUnload.bind(this);
  }

  addAllListeners() {
    window.addEventListener('beforeunload', this.onWindowBeforeUnload);
  }

  onWindowBeforeUnload() {
    this.viewModel.saveLastCondition();
  }
}
