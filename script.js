var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

setInterval(world, 30);

var character = new Character();
var score = 0;
var points = [];
var inteval = 20;
var start = false;
var xTest = 0;

generatePoints();

var mousePress = function(event) {
    character.jump = true;
    start = true;
    if (event.pageX < character.x) {
    	xTest = randomBetween(1,5);
    };
    if (event.pageX > character.x) {
    	xTest = randomBetween(-5,-1);
    };
    if (event.pageX == character.x) {
    	xTest = 0;
    };
    score++;
}
canvas.addEventListener("click", mousePress);

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
	if (start) {
		character.update();
	};
	for (var i = 0; i < points.length; i++) {
		points[i].update().draw();
	}
	// if (score > 0) {
	// 	points[score-1].radius = 3;
	// };
	console.log(score);
}

function Point(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 1;

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
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.fillStyle = "rgba(255,255,255,0.15)";
		context.fill();

		return this;
	}
}

function Character() {
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.rad = 75;
	this.jump = false;
	this.speed = 30;
	this.spd = this.speed;
	this.acceleration = 1.01;

	this.update = function() {
		if (this.y+this.rad < canvas.height && this.y-this.rad > 0 && 
			this.x+this.rad < canvas.width && this.x-this.rad > 0) {
			this.speed *= this.acceleration;
			this.y += this.speed;
			this.x += xTest;

			if (this.jump) {
				if (this.speed > 0) {
					this.acceleration = 0.95;
					this.speed *= -1;
				};
				if (this.speed < 0) {
					this.speed = -this.spd;
				};
			};
			if (this.speed > -0.3 && this.speed < 0) {
				this.speed = 0;
				this.acceleration = 1.01;
			};
			if (this.speed < this.spd) {
				this.speed += this.spd / 10;
			};
			this.jump = false;
		};
	}
}