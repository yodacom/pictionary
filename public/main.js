const WORDS = [
	"word",
	"letter",
	"number",
	"person",
	"pen",
	"class",
	"people",
	"sound",
	"water",
	"side",
	"place",
	"man",
	"men",
	"woman",
	"women",
	"boy",
	"girl",
	"year",
	"day",
	"week",
	"month",
	"name",
	"sentence",
	"line",
	"air",
	"land",
	"home",
	"hand",
	"house",
	"picture",
	"animal",
	"mother",
	"father",
	"brother",
	"sister",
	"world",
	"head",
	"page",
	"country",
	"question",
	"answer",
	"school",
	"plant",
	"food",
	"sun",
	"state",
	"eye",
	"city",
	"tree",
	"farm",
	"story",
	"sea",
	"night",
	"day",
	"life",
	"north",
	"south",
	"east",
	"west",
	"child",
	"children",
	"example",
	"paper",
	"music",
	"river",
	"car",
	"foot",
	"feet",
	"book",
	"science",
	"room",
	"friend",
	"idea",
	"fish",
	"mountain",
	"horse",
	"watch",
	"color",
	"face",
	"wood",
	"list",
	"bird",
	"body",
	"dog",
	"family",
	"song",
	"door",
	"product",
	"wind",
	"ship",
	"area",
	"rock",
	"order",
	"fire",
	"problem",
	"piece",
	"top",
	"bottom",
	"king",
	"space",
];
const server = io();
const pictionary = function () {
	let canvas,
		context,
		drawing;

	const draw = function (position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	};

	canvas = $("canvas");
	context = canvas[0].getContext("2d");
	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;
	canvas.on("mousemove", (event) => {
		if (drawing) {
			const offset = canvas.offset();
			const position = {
				x: event.pageX - offset.left,
				y: event.pageY - offset.top,
			};

			server.emit("position", position);
			draw(position);
		}
	});
	canvas.on("mousedown", (event) => {
		drawing = true;
	});

	canvas.on("mouseup", (event) => {
		drawing = false;
	});

	let guessBox;

	let wordSelected = function (event) {
		server.emit("guessName", guessBox.val());
		$("#clientGuess").text(guessBox.val());
	};

	guessBox = $("#guessWords");
	guessBox.on("change", wordSelected);

	let guessAnswer = function (guess) {
		$("#clientGuess").text(guess);
	};

  // User enters nickname
	let addNickName = function (event) {
		if (event.keyCode !== 13) {
			return;
		}
		let nickname = $("#nickname").val();
		$(".yourname").text(nickname);
		$(".overlay").hide();
		server.emit("setNickname", nickname);
	};

	$("#nickname").on("keydown", addNickName);

  // set the user role
	let setRole = function (role) {
		$(".rolename").text(role);
    // disable canvas for guessers etc
	};

	server.on("draw", draw);
	server.on("guessMade", guessAnswer);
	server.on("role", setRole);

  // Set up the words drop down
	WORDS.forEach((word) => {
		const option = $("<option>", { value: word, text: word });
		$("#guessWords").append(option);
	});

	const clientLeft = function (Message) {
		$("#leftGame").text(Message);
	};
	server.on("ClientLeft", clientLeft);
};

$(document).ready(() => {
	pictionary();
});
