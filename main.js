"use strict";

var net = require('net');
var firmata = require('firmata');
var five = require('johnny-five');

var ip = '127.0.0.1';
var port = 3000;
var server = require('./webServer').start(ip, port);

var io = require('./socketServer').start(server);

var serialPort = '/dev/ttyACM0';
var serialOptions = {
  host: '192.168.3.36',
  port: 23
}

var client = net.connect(serialOptions, function() {
  console.log('Connected to ESP8266 Server');

  var socketClient = this;
  var socketESP = new firmata.Board(socketClient);

  socketESP.once('ready', function() {
    console.log('Arduino Ready !');
    socketESP.isReady = true;

    var board = new five.Board({io:socketESP, repl:false});

    board.on('ready', function() {
      var led = new five.Led(13);

      io.sockets.on('connection', function(socket) {

        console.log('client connected ' + socket.id);
        led.toggle();
        
        socket.on('disconnect', function(){
          console.log('client disconnected ' + socket.id);
          led.toggle();
        });
      });
      
    });
  })
});
