var http = require("http");
var express = require("express");
var socket_io = require("socket.io");

var app = express();
app.use(express.static("public"));

var server = http.Server(app);
var io = socket_io(server);

var drawer = null;
var guessers = [];

io.on("connection", function(client) {

	if(!drawer){
		drawer = client;
		client.emit("role", "drawer");
	}else{
		guessers.push(client);
		client.emit("role", "guesser");
	}

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

	client.on("disconnect", () => {
		client.broadcast.emit ("ClientLeft", `${client.nickname} has left the game`);
	})

});

server.listen(process.env.PORT || 8080);
