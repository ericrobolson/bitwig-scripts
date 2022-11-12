const setupTransportHandler = (transport: Transport): Transport => {
  transport.isPlaying().markInterested();
  transport.isArrangerRecordEnabled().markInterested();
  return transport;
};
