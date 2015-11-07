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
var xTest = 0;
var gameSpeed = 5;

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
	    xTest = 0;
	    if (event.pageX > character.x + character.rad) {
	    	xTest = randomBetween(1,10);
	    };
	    if (event.pageX < character.x - character.rad) {
	    	xTest = randomBetween(-10,-1);
	    };
	    score++;
    };
}
canvas.addEventListener("click", mousePress);

// window.addEventListener("keypress", function(e) {
// 	if (!start && character.y == canvas.height/2 && character.x == canvas.width/3) {
//     	start = true;
//     };
//     if (!start && (character.y != canvas.height/2 || character.x != canvas.width/3)) {
//     	character.x = canvas.width/3;
//     	character.y = canvas.height/2;
//     };
// 	if (start && e.keyCode == 32) {
// 		character.jump = true;
// 	};
// });

function generatePoints() {
	for (var i = 5; i < canvas.height; i += intervaly) {
		for (var j = 5; j < canvas.width; j+= intervalx) {
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
	if (!start) {

	};
	for (var i = 0; i < points.length; i++) {
		points[i].update().draw();
	}
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
		// if (!start && character.y == canvas.height/2 && character.x == canvas.width/3 || start) {
		if (start) {
			this.x-=gameSpeed;
   		};
		if (this.x <= 0) {
			this.x = canvas.width;
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
	this.rad = 75;
	this.jump = false;
	this.speed = 50;
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
			if (this.speed > -0.5 && this.speed < 0) {
				this.speed = 0;
				this.acceleration = 1.01;
			};
			if (this.speed < this.spd) {
				this.speed += this.spd / 10;
			};
			this.jump = false;
		};
		if (this.y+this.rad >= canvas.height || this.y-this.rad <= 0 || 
			this.x+this.rad >= canvas.width || this.x-this.rad <= 0) {
			start = false;
		};
	}
}