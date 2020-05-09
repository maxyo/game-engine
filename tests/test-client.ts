import {connect, Socket} from "net";

export class TestClient {
    private socket: Socket;

    constructor(config: TestClientConfig) {
        this.socket = connect(config.port, config.address);
        this.socket.on('data', function(data) {
            console.log(data.toString());
        });
        this.socket.on('end', function() {
            console.log('disconnected from server');
        });
        this.socket.write('HELLO');
    }
}

export interface TestClientConfig {
    address: string;
    port: number;
    nickname: string;
}
