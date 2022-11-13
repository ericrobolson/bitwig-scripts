class ApplicationHandler {
  public readonly application: Application;

  constructor(host: Host) {
    this.application = host.createApplication();
  }

  layout(): PanelLayout {
    return this.application.panelLayout();
  }
}
