var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

setInterval(world, 30);

var character = new Character();
var score = 0;
var points = [];
var intervalx = canvas.width/75;
var intervaly = intervalx;
var start = false;
var gameSpeed = 20;

generatePoints();

var mousePress = function(event) {
	if (!start && character.y == canvas.height/2 && character.x == canvas.width/3) {
    	start = true;
    };
    if (!start && ( character.y != canvas.height/2 || character.x != canvas.width/3)) {
    	character.x = canvas.width/3;
    	character.y = canvas.height/2;
    };
    if (start) {
	    character.jump = true;
	    score++;
    };
}
canvas.addEventListener("click", mousePress);

function generatePoints() {
	for (var i = 0; i <= canvas.height; i += intervaly) {
		for (var j = 0; j <= canvas.width; j+= intervalx) {
			points.push(new Point(j,i));
		}
	}
}

function drawLines(){
	context.beginPath();
	context.moveTo(0,50);
	context.lineTo(canvas.width,50);
	context.stroke();

	context.beginPath();
	context.moveTo(0,canvas.height-50);
	context.lineTo(canvas.width,canvas.height-50);
	context.stroke();
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
	drawLines();
	if (start) {
		character.update();
	}
	if (!start) {

	};
	character.draw();
	// for (var i = 0; i < points.length; i++) {
	// 	points[i].update().draw();
	// }
	for (var i = 0; i < points.length; i++) {
		points[i].draw();
	}
}

function Point(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 1;
	this.speed = gameSpeed/2;

	this.update = function() {
		this.radius = 1;
		if (Math.sqrt( Math.abs(this.x-character.x)*Math.abs(this.x-character.x) + 
					   Math.abs(this.y-character.y)*Math.abs(this.y-character.y)) < character.radius) {
			this.radius = character.radius - Math.sqrt( 
				Math.abs(this.x-character.x)*Math.abs(this.x-character.x) + 
				Math.abs(this.y-character.y)*Math.abs(this.y-character.y));
		};
		if (start) {
			this.x-=this.speed;
   		};
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
	this.radius = 75;
	this.jump = false;
	this.speed = 40;
	this.spd = this.speed;
	this.acceleration = 1.01;

	this.update = function() {
		if (this.x+this.radius < canvas.width && this.x-this.radius > 0) {
			this.speed *= this.acceleration;
			this.y += this.speed;

			if (this.jump) {
				if (this.speed > 0) {
					this.acceleration = 0.95;
					this.speed *= -1;
				};
				if (this.speed < 0) {
					this.speed = -this.spd;
				};
			};
			if (this.speed > -0.5 && this.speed < 0) {
				this.speed = 0;
				this.acceleration = 1.01;
			};
			if (this.speed < this.spd) {
				this.speed += this.spd / 20;
			};
			this.jump = false;
		};
		if (this.x+this.radius >= canvas.width || this.x-this.radius <= 0) {
			start = false;
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.strokeStyle = "rgba(255,255,255,0.15)";
		context.stroke();

		context.beginPath();
		context.arc(this.x, this.y, this.radius-5, Math.PI * 2, false);
		context.strokeStyle = "rgba(255,255,255,0.5)";
		context.stroke();

		context.beginPath();
		context.arc(this.x, this.y, this.radius-10, Math.PI * 2, false);
		context.strokeStyle = "rgba(255,255,255,1)";
		context.fillStyle = "rgba(255,255,255,0.5)";
		context.stroke();
		context.fill();

		return this;
	}
}

function Obstacle() {
	

	this.update = function() {
		
		return this;
	}

	this.draw = function() {

		return this;
	}
}