import { decode} from "msgpack-lite";

const io = require('socket.io-client');

const socket = io('http://localhost:3000');
socket.on('connect', function () {
    console.log('Connected');
});
socket.on('events', function (data) {
    console.log('event', data);
});
socket.on('exception', function (data) {
    console.log('event', data);
});
socket.on('disconnect', function () {
    console.log('Disconnected');
});
socket.on('data', function (data) {
    console.log(decode(data));
});


process.stdin.on('data', function (data: string) {
    data = data.toString();
    let command = data.split(' ')[0];
    data = data.split(' ').splice(1).join(' ');

    switch (command) {
        case 'raw' :
            socket.send(data);
            break;
        case 'action':
            socket.emit('action', data);
            break;
        default:
            return;
    }

});
