/* global $ */

$(document).ready(function(){

var socket = io();

var guesserNumber = $("#guesserNumber");
var guesserNickname = $("#guesserNickname");
var addMessage = function(message) {
		messages.append(`<div> ${message} </div>`);


var 
});

var pictionary = function() {
	var canvas, context, drawing;

	var draw = function(position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	};

	canvas = $("canvas");
	context = canvas[0].getContext("2d");
	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;
	canvas.on("mousemove", function(event) {
		if (drawing) {
			var offset = canvas.offset();
			var position = {
				x: event.pageX - offset.left,
				y: event.pageY - offset.top
			};
			socket.emit("position", position);
			draw(position);
		}
	});
	canvas.on("mousedown", function(event) {
		drawing = true;
	});

	canvas.on("mouseup", function(event) {
		drawing = false;
	});
	socket.on("draw", draw);

	var guessBox;

	var onKeyDown = function(event) {
		if (event.keyCode !== 13) {
			return;
		}
		socket.emit("guessName", guessBox.val());
		guessBox.val("");
	};

	guessBox = $("#guess input");
	guessBox.on("keydown", onKeyDown);

	var guessAnswer = function(guess) {
		$("#clientGuess").text(guess);
	};

	socket.on("guessMade", guessAnswer);
};

$(document).ready(function() {
	pictionary();
});
