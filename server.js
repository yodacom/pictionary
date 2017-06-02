const http = require("http");
const express = require("express");
const socket_io = require("socket.io");

const app = express();
app.use(express.static("public"));

const server = http.Server(app);
const io = socket_io(server);

let drawer = null;
const guessers = [];

io.on("connection", (client) => {
  if (!drawer) {
    drawer = client;
    client.emit("role", "drawer");
  } else {
    guessers.push(client);
    client.emit("role", "guesser");
  }

  client.on("position", (position) => {
    client.broadcast.emit("draw", position);
  });

  client.on("guessName", (guess) => {
    client.broadcast.emit(
      "guessMade",
      `${guess} guessed by ${client.nickname}`,
    );
  });
  client.on("setNickname", (nickname) => {
    client.nickname = nickname;
  });

  client.on("disconnect", () => {
    client.broadcast.emit("ClientLeft", `${client.nickname} has left the game`);
  });
});

server.listen(process.env.PORT || 8080);
