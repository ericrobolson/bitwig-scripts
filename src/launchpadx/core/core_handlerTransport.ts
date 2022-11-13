class TransportHandler {
  public readonly transport: Transport;

  constructor(host: Host) {
    this.transport = host.createTransport();
  }
}
