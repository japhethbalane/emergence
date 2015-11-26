var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

setInterval(world, 30);

var character;
var score = 0;
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
			if (!character.jump && !character.isJumping) {
				character.jump = true;
			};
		};
	}
});

function generate() {
	generateObstacles(5);
	generateLines();
	character = new Character()
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
		for (var i = 0; i < lines.length; i++) {
			lines[i].update().draw();
		}
	}
	if (!start) {
		drawTitle();
	};
	character.draw();
	// console.log(character.isJumping);
	// console.log(character.speed);
}

function Character() {
	this.x = canvas.width/3;
	this.y = canvas.height/2;
	this.radius = 45;

	this.speed = 15;
	this.acceleration = 1.15;

	this.jump = false;
	this.isJumping = false;

	this.update = function() {
		if (start) {
			if (this.jump) {
				this.isJumping = true;
				this.acceleration = 0.85;
				this.speed *= -1;
				this.jump = false;
			};

			if (this.isJumping) {
				if (this.speed >= -0.75) {
					this.speed *= -1;
					this.acceleration = 1.15;
					this.isJumping = false;
				};
			};

			if (this.y+this.radius <= lines[1].y && this.y-this.radius >= lines[0].y) {
				this.y += this.speed;
				this.speed *= this.acceleration;
				if (this.speed > 15) {
					character.speed = 15;
				};
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