import signalR from "@microsoft/signalr";
import QuixConnector from "./Connector";

export interface EventData {
  id: string;
  timestamp: number;
  tags: any;
  value: string;
}

export default class QuixWriter {
  private connector: signalR.HubConnection;

  constructor() {
    this.connector = new QuixConnector("writer").connection 

    this.connector.start().then(() => {
        console.log("Quix writer connected.");
      });
  }

  public createStream = (
    streamDetails: any,
    topic: string
  ): Promise<{
    streamId: string;
  }> => {
    return this.connector
      .invoke("CreateStream", topic, streamDetails)
      .then((response) => {
        return response;
      });
  };

  public sendParameterData = (
    streamId: string,
    parameterData: any,
    topic: string
  ) => {
    return this.connector
      .invoke("SendParameterData", topic, streamId, parameterData)
      .then((response) => {
        return response;
      });
  };

  public sendEventData = (
    streamId: string,
    eventData: EventData[],
    topic: string
  ) => {
    return this.connector
      .invoke("SendEventData", topic, streamId, eventData)
      .then((response) => {
        return response;
      }).catch((reason) => {
          console.log(reason)
      } );
  };
}
