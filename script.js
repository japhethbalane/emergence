var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

setInterval(world, 30);

var points = [];
var inteval = 40;
var a = canvas.width/2;
var b = canvas.height/2;
var da = randomBetween(-2,2);
var db = randomBetween(-1,1);
var rad = 150;

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
function updateWorld() {
	a += da;
	b += db;
	if (a-rad < 0) {
		da *= -1;
	};
	if (a+rad > canvas.width) {
		da *= -1;
	};
	if (b-rad < 0) {
		db *= -1;
	};
	if (b+rad > canvas.height) {
		db*=-1;
	};
}

function world() {
	clearCanvas();
	for (var i = 0; i < points.length; i++) {
		points[i].update().draw();
	}
	updateWorld();
}

function Point(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 1;

	this.update = function() {
		this.radius = 1;
		if (Math.sqrt( Math.abs(this.x-a)*Math.abs(this.x-a) + 
			Math.abs(this.y-b)*Math.abs(this.y-b)) < rad) {
			this.radius = rad - Math.sqrt( Math.abs(this.x-a)*Math.abs(this.x-a) + 
				Math.abs(this.y-b)*Math.abs(this.y-b));
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