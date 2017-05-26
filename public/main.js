/* global $ */

var server = io();
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
			server.emit("position", position);
			draw(position);
		}
	});
	canvas.on("mousedown", function(event) {
		drawing = true;
	});

	canvas.on("mouseup", function(event) {
		drawing = false;
	});

	var guessBox;

	var onKeyDown = function(event) {
		if (event.keyCode !== 13) {
			return;
		}
		server.emit("guessName", guessBox.val());
		guessBox.val("");
	};

	guessBox = $("#guess input");
	guessBox.on("keydown", onKeyDown);

	var guessAnswer = function(guess) {
		$("#clientGuess").text(guess);
	};

	//User enters nickname
	var addNickName = function(event){
        if (event.keyCode !== 13) {
            return;
        }
        var nickname = $("#nickname").val();
        $(".yourname").text(nickname);
        $(".nickname").hide();
        $("#main").show();
        server.emit("setNickname", nickname);
	}

	$("#nickname").on("keydown", addNickName);


    server.on("draw", draw);
	server.on("guessMade", guessAnswer);
};

$(document).ready(function() {
	pictionary();
});
