import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default class WebSocketConnector {
  public socketIO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;
 
  public init = (socket: any) => {
    this.socketIO = socket;

    this.socketIO?.on("connection", (socket: any) => {
      console.log("a user connected");
    });
  }
}
