var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

setInterval(world, 30);

var character;
var score = 0;
var points = [];
var obstacles = [];
var lines = [];

var start = false;
var gameSpeed = 5;

generate();

window.addEventListener("keypress", function(e) {
	if (e.keyCode == 32) {
		if (!start) {
			start = !start;
		};
		if (start) {

		};
	}
});

function generate() {
	generateObstacles(5);
	generatePoints(500);
	generateLines();
	character = new Character()
}

function generatePoints(count) {
	for (var i = 0; i <= count; i++) {
			points.push(new Point());
	}
}

function generateObstacles(count) {
	for (var i = 0; i < count; i++) {
		obstacles.push(new Obstacle());
	}
}

function generateLines() {
	var interval = 50;
	lines.push(new Line(interval));
	lines.push(new Line(canvas.height - interval));
}

function drawTitle() {
	
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
		// for (var i = 0; i < obstacles.length; i++) {
		// 	obstacles[i].update().draw();
		// }
		for (var i = 0; i < lines.length; i++) {
			lines[i].update().draw();
		}
	}
	if (!start) {
		drawTitle();
	};
	character.draw();
	for (var i = 0; i < points.length; i++) {
		points[i].update().draw();
	}
}

function Point() {
	this.x = randomBetween(0,canvas.width);
	this.y = randomBetween(0,canvas.height);
	this.radius = 1;
	this.speed = gameSpeed;

	this.update = function() {
		// this.radius = 1;
		// if (Math.sqrt( Math.abs(this.x-gameSpeed-character.x)*Math.abs(this.x-character.x) + 
		// 			   Math.abs(this.y-character.y)*Math.abs(this.y-character.y)) < character.radius) {
		// 		this.radius = character.radius - Math.sqrt( 
		// 		Math.abs(this.x-gameSpeed-character.x)*Math.abs(this.x-character.x) + 
		// 		Math.abs(this.y-character.y)*Math.abs(this.y-character.y));
		// };
		this.x-=this.speed;
		if (this.x <= 0) {
			this.x = canvas.width + ( 0 - this.x );
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
	this.x = canvas.width/3;
	this.y = canvas.height/2;
	this.radius = 45;

	this.speed = 10;
	this.acceleration = 1.49;

	this.isJumping = false;

	this.update = function() {
		if (start) {
			if (this.y+this.radius <= lines[1].y && this.y-this.radius >= lines[0].y) {
				this.y += this.speed;
				this.speed *= this.acceleration;
			};
			if (this.y+this.radius > lines[1].y) {
				this.y = lines[1].y - this.radius;
			};
			if (this.y-this.radius < lines[0].y) {
				this.y = lines[0].y + this.radius;
			};

			
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.strokeStyle = "rgba(255,255,255,0.45)";
		context.fillStyle = "rgba(255,255,255,0.15)";
		context.stroke();
		context.fill();

		return this;
	}
}

function Obstacle() {
	this.x = randomBetween(canvas.width, canvas.width*2);
	this.y = randomBetween(0, canvas.height);
	this.dim = randomBetween(100, 200);

	this.update = function() {
		this.x-=gameSpeed;
		if (this.x + this.dim < 0) {
			this.x = canvas.width;
		};
		
		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x, this.y);
		context.lineTo(this.x, this.y+this.dim);
		context.lineTo(this.x+this.dim, this.y+this.dim);
		context.lineTo(this.x+this.dim, this.y);
		context.lineTo(this.x, this.y);
		context.strokeStyle = "#fff";
		context.stroke();

		return this;
	}
}

function Line(y) {
	this.y = y;
	this.x1 = 0;
	this.x2 = canvas.width;

	this.update = function() {

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x1, this.y);
		context.lineTo(this.x2, this.y);
		context.strokeStyle = "rgba(255,255,255,0.15)";
		context.stroke();

		return this;
	}
}