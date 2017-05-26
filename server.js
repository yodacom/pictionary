var http = require("http");
var express = require("express");
var socket_io = require("socket.io");

var app = express();
app.use(express.static("public"));

var server = http.Server(app);
var io = socket_io(server);
var guesserNumber = 0;
var guesserNickname = 0;

io.on("connection", function(socket) {
	console.log("Client Connected", socket.id);
	guesserNumber++;
	guesserNickname++;
	socket.nickName = `nickname ${guesserNickname}`;
	socket.emit("nickName", `nickname ${guesserNickname}`);
	io.emit("clientNumber", guesserNumber);
	socket.on("position", function(position) {
		socket.broadcast.emit("draw", position);
	});

	socket.on("guesserName", guess => {
		socket.broadcast.emit("guessMade", guess);
	});
});

server.listen(process.env.PORT || 8080);

