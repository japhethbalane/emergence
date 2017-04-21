
/////////////////////////////////////////////////////////

var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');
setInterval(world, 30);
var character, gun, bullets, enemies, dirs, isFire, grid;

/////////////////////////////////////////////////////////

function init() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	character = new Character();
	gun = new Gun();
	bullets = [];
	enemies = [];
	dirs = [0,0,0,0];
	for (var i = 0; i < 5; i++) {
		enemies.push(new Enemy());
	}
	isFire = false;
	grid = new Grid();
}; init();

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function clearCanvas() {
	context.fillStyle = "#666";
	context.fillRect(0,0,canvas.width,canvas.height);
}
function getHypothenuse(x1,y1,x2,y2) {
	var x = Math.abs(x1-x2);
	var y = Math.abs(y1-y2);
	return Math.sqrt((x*x)+(y*y));
}
function connectBullets() {
	for (var i in bullets) {
		for (var j = i; j < bullets.length; j++) {
			if (j != i) {
				var range = 300;
				var b1 = bullets[i], b2 = bullets[j];
				var hyp = getHypothenuse(b1.x, b1.y, b2.x, b2.y);
				if (hyp <= range) {
					context.strokeStyle = 'rgba(255,255,255,'+((Math.abs(hyp-range))*(1/range))+')';
					context.beginPath();
					context.moveTo(b1.x, b1.y);
					context.lineTo(b2.x, b2.y);
					context.stroke();
				}
			}
		}
	}
}

/////////////////////////////////////////////////////////

function world() {
	clearCanvas();

	grid.update().draw();
	character.update().draw();
	gun.draw();
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].update().draw();	
	}

	if (isFire && character.bulletCount > 0) {
		bullets.push(new Bullet(gun.angle));
		character.bulletCount--;
	}

	connectBullets();
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].update().draw();	
	}
}

/////////////////////////////////////////////////////////

function Character() {
	this.y = canvas.height/2;
	this.x = canvas.width/2;
	this.radius = 20;
	this.speed = 5;
	this.bulletCount = 10;
	this.bulletRegen = 2;
	this.bulletRegenCtr = 0;
	this.bulletMax = 50;
	var eyes = [
		[-10,-5,10,-5,6,6],
		[-10, 5,10, 5,6,6],
		[-13,0 ,7 ,0 ,5,7],
		[-7 ,0 ,13,0 ,7,5],
		[-10,0 ,10,0 ,6,6]
	];
	this.update = function() {
		for (var en of enemies) {
			en.y += dirs[0] * this.speed;
			en.y -= dirs[1] * this.speed;
			en.x += dirs[2] * this.speed;
			en.x -= dirs[3] * this.speed;
		}

		this.bulletRegenCtr += this.bulletCount < this.bulletMax ? 1 : 0;
		if (this.bulletRegenCtr >= this.bulletRegen) {
			this.bulletRegenCtr = 0;
			this.bulletCount++;
		}

		return this;
	}
	this.draw = function() {
		context.fillStyle = '#fff';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		// context.stroke();
		context.fill();
		context.fillStyle = 'white';
		var eyesPos = dirs.indexOf(1) != -1 ? eyes[dirs.indexOf(1)] : eyes[4];
		context.beginPath();
		context.arc(this.x + eyesPos[0], this.y + eyesPos[1], eyesPos[4], Math.PI*2, false);
		context.stroke(); 
		context.fill();
		context.beginPath();
		context.arc(this.x + eyesPos[2], this.y + eyesPos[3], eyesPos[5], Math.PI*2, false);
		context.stroke(); 
		context.fill();
	}
}
function Gun() {
	this.init = function() {
		this.radius = 10;
		this.dist = 40;
		this.angle = randomBetween(0,360);
	}; this.init();
	this.draw = function() {
		this.x = canvas.width/2 + Math.cos(this.angle * (Math.PI / 180)) * this.dist;
		this.y = canvas.height/2 + Math.sin(this.angle * (Math.PI / 180)) * this.dist;
		context.fillStyle = '#fff';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		// context.stroke();
		context.fill();
	};
}
function Bullet(ang) {
	this.x = gun.x;
	this.y = gun.y;
	this.radius = gun.radius/20;
	this.angle = ang;
	this.speed = 10;
	this.acceleration = 1;
	this.update = function() {
		this.speed *= this.acceleration;

		var dx = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var dy = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        this.x += dx;
        this.y += dy;

        if (this.x + this.radius < 0 ||
        	this.x - this.radius > canvas.width || 
        	this.y + this.radius < 0 ||
        	this.y - this.radius > canvas.height) {
        	bullets.splice(bullets.indexOf(this), 1);
        }

        for (var en of enemies) {
        	if (getHypothenuse(this.x, this.y, en.x, en.y) <=
        		this.radius + en.radius) {
        		bullets.splice(bullets.indexOf(this), 1);
        		en.life -= 3;
        		en.radius -= 2;
        	}
        }

		return this;
	}
	this.draw = function() {
		context.fillStyle = '#fff'
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		// context.stroke();
		context.fill();
	}
}

function Enemy() {
	this.init = function() {
		this.x = randomBetween(0, canvas.width);
		this.y = randomBetween(0, canvas.height);
		this.radius = 10 + randomBetween(10,50);
		if (randomBetween(0,2) == 0) {
			this.y = randomBetween(0,2) == 0 ? 0 - this.radius : canvas.height + this.radius;
		} else {
			this.x = randomBetween(0,2) == 0 ? 0 - this.radius : canvas.width + this.radius
		}
		this.angle = randomBetween(0,4) == 1 ? 
			-1 * (Math.atan2(this.x - canvas.width/2, this.y - canvas.height/2) * (180 / Math.PI) + 90) : 
			randomBetween(0,360);
		this.minAng = this.angle - randomBetween(0, 0);
		this.maxAng = this.angle + randomBetween(0, 0);
		this.angSpd = 1;
		this.angDir = randomBetween(0,2) == 0 ? -1 : 1;
		this.speed = 3;
		this.stability = 3;
		this.life = this.radius/2;
	}; this.init();
	this.update = function() {
		if (this.life <= 0) {
			this.stability = 0;
			enemies.push(new Enemy());
			this.init();
		}
		if (getHypothenuse(this.x, this.y, character.x, character.y) <= 
			this.radius + character.radius) {
			this.init();
		}
		this.angle += this.angSpd * this.angDir;
		if (this.angle >= this.maxAng || this.angle <= this.minAng) {
			this.angDir *= -1;
		}
		var dx = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var dy = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        this.x += dx;
        this.y += dy;

		if (this.y < 0 - this.radius*2 ||
			this.y > canvas.height + this.radius*2 ||
			this.x < 0 - this.radius*2 ||
			this.x > canvas.width + this.radius*2 ) {
			this.init();
		}

		if (this.radius <= 0) {
			this.init();
		}

		return this;
	}
	this.draw = function() {
		context.fillStyle = '#fff';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
		context.fillStyle = this.radius <= character.radius ? '#fff' : '#000';
		context.beginPath();
		context.arc(this.x + this.radius/2 + randomBetween(-this.stability, this.stability + 1), this.y + randomBetween(-this.stability, this.stability + 1), this.radius/2.5, Math.PI*2, false);
		context.stroke();
		// context.fill();
		context.beginPath();
		context.arc(this.x - this.radius/2 + randomBetween(-this.stability, this.stability + 1), this.y + randomBetween(-this.stability, this.stability + 1), this.radius/2.5, Math.PI*2, false);
		context.stroke();
		// context.fill();
	}
}

function Grid() {
	this.gap = 145;
	this.horizontal = 0;
	this.vertical = 0;
	this.update = function() {
		if (dirs[0]) {
			this.horizontal += character.speed;
			this.horizontal++;
		} else if (dirs[1]) {
			this.horizontal -= character.speed;
			this.horizontal--;
		} else if (dirs[2]) {
			this.vertical += character.speed;
			this.vertical++;
		} else if (dirs[3]) {
			this.vertical -= character.speed;
			this.vertical--;
		}

		if (this.vertical < 0) {
			this.vertical = this.gap;
		}
		if (this.vertical > this.gap) {
			this.vertical = 0;
		}
		if (this.horizontal < 0) {
			this.horizontal = this.gap;
		}
		if (this.horizontal > this.gap) {
			this.horizontal = 0;
		}
		return this;
	}
	this.draw = function() {
		context.strokeStyle = 'rgba(255,255,255,0.5)';
		var g = this.vertical;
		while (g < canvas.width) {
			context.beginPath();
			context.moveTo(g, 0);
			context.lineTo(g, canvas.height);
			context.stroke();
			g += this.gap;
		}
		var g = this.horizontal;
		while (g < canvas.height) {
			context.beginPath();
			context.moveTo(0, g);
			context.lineTo(canvas.width, g);
			context.stroke();
			g += this.gap;
		}
	}
}

/////////////////////////////////////////////////////////

window.addEventListener('resize', init);

// [up, down, left, right]
window.addEventListener("keypress", function(e) {
	// console.log(e.keyCode);
    if (e.keyCode == 119) {
    	dirs = [0,0,0,0];
    	dirs[0] = 1;
    	dirs[1] = 0;
    }
    else if (e.keyCode == 115) {
    	dirs = [0,0,0,0];
    	dirs[0] = 0;
    	dirs[1] = 1;
    }
    else if (e.keyCode == 97)  {
    	dirs = [0,0,0,0];
    	dirs[2] = 1;
    	dirs[3] = 0;
    }
    else if (e.keyCode == 100) {
    	dirs = [0,0,0,0];
    	dirs[2] = 0;
    	dirs[3] = 1;
    }
    else if (e.keyCode == 32) {
    	dirs = [0,0,0,0];
    }
});

window.addEventListener("mousemove", function(e) {
	var diffx = canvas.width/2 - e.pageX;
	var diffy = canvas.height/2 - e.pageY;
	gun.angle = -1 * (Math.atan2(diffx, diffy) * (180 / Math.PI) + 90);
});

window.addEventListener('mousedown', function() {
	isFire = true;
});

window.addEventListener('mouseup', function() {
	isFire = false;
});

/////////////////////////////////////////////////////////






