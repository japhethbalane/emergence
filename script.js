///////////////////////////////////////////////////////////////

var canvas = document.getElementById('swarm');
var context = canvas.getContext('2d');
setInterval(world, 30);

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

///////////////////////////////////////////////////////////////

var particles = [];
var obstacles = [];

///////////////////////////////////////////////////////////////

function generateParticles(count) {
	for (var i = 0; i < count; i++) {
		particles.push(new Particle(randomBetween(0, canvas.width-0), randomBetween(0, canvas.height-0)));
	}
}; generateParticles(1000);

function generateObs(count) {
	for (var i = 0; i < count; i++) {
		obstacles.push(new Obstacle(randomBetween(0, canvas.width-0), randomBetween(0, canvas.height-0)));
	}
}; generateObs(200);

function randomBetween(min, max) {
	if (min > max) {
		var temp = min;
		min = max; max = temp;
	}
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "rgba(0,0,0,0.5)";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function getHypothenuse(p1, p2) {
	var x = Math.abs(p1.x - p2.x);
	var y = Math.abs(p1.y - p2.y);
	return Math.sqrt((x * x) + (y * y));
}

///////////////////////////////////////////////////////////////

function world() {
	clearCanvas();
	for (var particle of particles) {
		particle.update().draw();
	}
	// for (var o of obstacles) {
	// 	o.update().draw();
	// }
}

///////////////////////////////////////////////////////////////

function Particle(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 3;
	this.speed = 0.1;
	this.initialSpeed = this.speed;
	this.angle = randomBetween(0, 360);
	this.sensingRadius = 10;
	this.sensedParticles = [];
	this.isSwingRight = randomBetween(0,2) == 1 ? true : false;
	this.steer = randomBetween(0, 2) == 1 ? 0 : 1;
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);
	this.setMinMaxAngs = function() {
		this.minAngle = this.angle - 50;
		this.maxAngle = this.angle + 50;
	}; this.setMinMaxAngs();
	this.move = function() {
		var dx = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var dy = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        this.x += dx;
        this.y += dy;
	}
	this.remove = function() {
		for (var i = 0; i < particles.length; i++) {
			if (particles[i] == this) {
				particles.splice(i, 1);
			}
		}
	}
	this.checkIfRemove = function() {
		if (this.y - this.radius > canvas.height) 
			this.y = 0;
		else if (this.y + this.radius < 0) 
			this.y = canvas.height;
		if (this.x - this.radius > canvas.width) 
			this.x = 0;
		else if (this.x + this.radius < 0) 
			this.x = canvas.width;
	}
	this.alignment = function() {
		let sum = this.angle;
		for (let sensed of this.sensedParticles) {
			sum += sensed.angle;
		}
		this.angle = sum / (this.sensedParticles.length + 1);
	}
	this.changeColor = function() {
		let r = this.r;
		let g = this.g;
		let b = this.b;
		for(let p of this.sensedParticles){
			r += p.r;
			b += p.b;
			g += p.g;
		}
		this.r = r / (this.sensedParticles.length + 1 );
		this.b = b / (this.sensedParticles.length + 1 );
		this.g = g / (this.sensedParticles.length + 1 );
	}
	this.checkSense = function() {
		for (let particle of particles) {
			let hyp = getHypothenuse(this, particle);
			if (hyp < this.sensingRadius * 2) {
				this.sensedParticles.push(particle);
			}
		}
		this.alignment();
		this.changeColor();
	}
	this.swing = function() {
		if (this.isSwingRight) {
			this.angle += 1;
			if (this.angle > this.maxAngle) {
				this.isSwingRight = !this.isSwingRight;
			}
		} else {
			this.angle -= 1;
			if (this.angle < this.minAngle) {
				this.isSwingRight = !this.isSwingRight;
			}
		}
	}
	this.checkObstacle = function() {
		for (var o of obstacles) {
			if (getHypothenuse(this, o) < this.sensingRadius * 5) {
				if(this.left || this.right || this.up || this.down){
					if(this.left){
						this.angle = 270;
					} else if(this.right){
						this.angle = 90;
					} else if(this.up){
						this.angle = 180;
					} else if(this.down){
						this.angle = 0;
					}
				} else{
					if (this.angle >= 180 && this.angle <= 225 || this.angle >= 315 && this.angle <= 360) {
						this.angle = 270;
						this.left = true;
					} else if (this.angle >= 135 && this.angle <= 180 || this.angle >= 0 && this.angle <= 45) {
						this.angle = 90;
						this.right = true;
					} 
					else if (this.angle >= 90 && this.angle <= 135 || this.angle >= 225 && this.angle <= 270) {
						this.angle = 180;
						this.up = true;
					} else if (this.angle >= 45 && this.angle <= 90 || this.angle >= 270 && this.angle <= 315) {
						this.angle = 0;
						this.down = true;
					}
			}
			} else {
				this.up = false;
				this.down = false;
				this.left = false;
				this.right = false;
			}
		}
	}
	this.update = function() {
		this.checkIfRemove();
		this.checkSense();
		this.swing();
		this.speed += this.sensedParticles.length;
		this.sensedParticles = [];
		this.move();
		this.speed = this.initialSpeed;
		return this;
	}
	this.draw = function() {
		context.shadowBlur = 0;
		context.shadowColor = 'white';
		var my_gradient=context.createLinearGradient(0,0,0,canvas.height);
		my_gradient.addColorStop(0,"black");
		my_gradient.addColorStop(0.25,"white");
		my_gradient.addColorStop(0.5,"white");
		my_gradient.addColorStop(0.75,"white");
		my_gradient.addColorStop(1,"black");
		context.fillStyle = my_gradient;
		context.beginPath();
		context.arc(this.x,this.y,this.radius,Math.PI*2,false);
		// context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
		context.fillStyle = 'white';
		context.fill();
		context.shadowBlur = 0;
	}
}

function Obstacle(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 100;
	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);
	this.checkIfRemove = function() {
		if (this.y - this.radius > canvas.height) 
			this.y = 0;
		else if (this.y + this.radius < 0) 
			this.y = canvas.height;
		if (this.x - this.radius > canvas.width) 
			this.x = 0;
		else if (this.x + this.radius < 0) 
			this.x = canvas.width;
	}
	this.update = function() {
		this.x-=1;
		this.checkIfRemove();
		return this;
	}
	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.fillStyle = 'rgba(255,255,255,0.005)';
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.005)";
		context.fill();
	}
}

///////////////////////////////////////////////////////////////

window.addEventListener('click', function(e) {
	console.log(e.pageX, e.pageY);
	for (var i = 0; i < 200; i++) {
		particles.push(new Particle(e.pageX, e.pageY));
	}
	for (var i = 0; i < 100; i++) {
		particles.shift();
	}
});

///////////////////////////////////////////////////////////////