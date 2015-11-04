var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

setInterval(world, 30);

var character = new Character();
var score = 0;
var points = [];
var inteval = 20;

generatePoints();

function generatePoints() {
	for (var i = 5; i < canvas.height; i += inteval) {
		for (var j = 5; j < canvas.width; j+= inteval) {
			points.push(new Point(j,i));
		}
	}
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#001634";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function world() {
	clearCanvas();
	for (var i = 0; i < points.length; i++) {
		points[i].update().draw();
	}
	character.update();
}

function Point(x,y) {
	this.x = x;
	this.y = y;

	this.update = function() {
		this.radius = 1;
		if (Math.sqrt( Math.abs(this.x-character.x)*Math.abs(this.x-character.x) + 
			Math.abs(this.y-character.y)*Math.abs(this.y-character.y)) < character.rad) {
			this.radius = character.rad - Math.sqrt( 
				Math.abs(this.x-character.x)*Math.abs(this.x-character.x) + 
				Math.abs(this.y-character.y)*Math.abs(this.y-character.y));
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, 1, Math.PI*2, false);
		context.fillStyle = "rgba(255,255,255,0.15)";
		context.fill();

		return this;
	}
}

function Character() {
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.rad = 75;

	this.update = function() {


		return this;
	}
}