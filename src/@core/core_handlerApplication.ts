class ApplicationHandler {
  public readonly application: Application;
  private panelLayout: PanelLayout;
  constructor(host: Host) {
    this.panelLayout = PanelLayout.arrange;
    this.application = host.createApplication();
    const observer = this.application.panelLayout();
    observer.markInterested();
    observer.addValueObserver((layout) => {
      this.panelLayout = layout;
    });
  }

  layout(): PanelLayout {
    return this.panelLayout;
  }
}
