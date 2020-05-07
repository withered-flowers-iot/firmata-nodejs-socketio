"use strict";

var ip = '127.0.0.1';
var port = 3000;
var server = require('./webServer').start(ip, port);

var io = require('./socketServer').start(server);

var serialPort = '/dev/ttyACM0';
var board = require('./firmataConnector').start(serialPort);

board.on('connection', function() {
  board.pinMode(13, board.OUTPUT);

  io.sockets.on('connection', function(socket) {
    console.log('client connected ' + socket.id);
    board.digitalWrite(13, board.HIGH);
    
    socket.on('disconnect', function(){
      console.log('client disconnected ' + socket.id);
      board.digitalWrite(13, board.LOW);
    });
  });
  
});
