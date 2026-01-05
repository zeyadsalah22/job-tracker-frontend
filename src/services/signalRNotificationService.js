import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async connect(hubUrl, accessToken) {
    if (this.connection) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(hubUrl, {
        accessTokenFactory: () => accessToken
      })
      .build();

    await this.connection.start();
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  on(methodName, callback) {
    if (this.connection) {
      this.connection.on(methodName, callback);
    }
  }

  off(methodName, callback) {
    if (this.connection) {
      this.connection.off(methodName, callback);
    }
  }
}

export default new SignalRService();
