import * as signalR from "@microsoft/signalr";

export default class QuixConnector {
  private workspaceId = process.env.QUIX_WORKSPACE_ID;
  private accessToken = process.env.QUIX_ACCESS_TOKEN;

  private options = {
    accessTokenFactory: () => this.accessToken || "",
  };

  public connection: signalR.HubConnection;

  constructor(apiType: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://${apiType}-${this.workspaceId}.platform.quix.ai/hub`,
        this.options
      )
      .build();
   
  }
}
