
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http,{
    cors: {
        origin: "https://172.17.83.140:3000",
        methods: ["GET","POST"],
        transports: ['websocket','polling'],
        credentials: true
    },
    allowEIO3: true
});
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.emit('con','Connection Successfull');

    socket.on('room', data => {
        if(io.sockets.adapter.rooms.has(data)){
            console.log("Rooms Exits");
        }else{
            console.log(data);
            var roomName = data;
            socket.join(roomName);

            socket.on('message', msg => {
                io.to(roomName).emit("message",msg);
                console.log(msg);
            });
            socket.on('location', data => {
                io.to(roomName).emit("location",data);
                console.log(data);
            });
        }       
    });

    socket.on('j_room', data => {

        if(io.sockets.adapter.rooms.has(data)){

            socket.emit('err','1');

            console.log(data);
            var roomName = data;
            socket.join(roomName);

            socket.on('message', msg => {
                io.to(roomName).emit("message",msg);
                console.log(msg);
            });
            socket.on('location', data => {
                io.to(roomName).emit("location",data);
                console.log(data);
            });
        }else{
            socket.emit('err','0');
        }      
    });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
