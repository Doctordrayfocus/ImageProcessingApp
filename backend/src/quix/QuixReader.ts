import QuixConnector from "./Connector";

export interface IncomingEventData {
    dateTime: string
    streamId: string
    topicName: string
    type:string
    value: string
}

export default class QuixReader {
    public connector: signalR.HubConnection | undefined;

    constructor(){
        this.connector = new QuixConnector('reader').connection
    }

    public listenToTopic = (topic: string, callback: Function) => {
        this.connector?.invoke("SubscribeToPackages", topic)

        this.connector?.on("PackageReceived", (data) => {
            console.log(data)
            let model: IncomingEventData =  data
            // handle event data
            callback(model)
            // this.connector.invoke("UnsubscribeFromPackages",  topic);
        })
    }
}