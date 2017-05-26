var http = require("http");
var express = require("express");
var socket_io = require("socket.io");

var app = express();
app.use(express.static("public"));

var server = http.Server(app);
var io = socket_io(server);

io.on("connection", function(client) {
	console.log("Client Connected", client.id);
	client.on("position", function(position){
		client.broadcast.emit("draw", position);
	});

	client.on("guessName",(guess) => {
		client.broadcast.emit("guessMade",
			guess + " guessed by " + client.nickname);
	})

	client.on("setNickname", (nickname) => {
		client.nickname = nickname;
	});

});

server.listen(process.env.PORT || 8080);
