
/////////////////////////////////////////////////////////

var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');
setInterval(world, 30);
var character, gun, bullets, enemies, dirs, isFire;

/////////////////////////////////////////////////////////

function init() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	character = new Character();
	gun = new Gun();
	bullets = [];
	enemies = [];
	dirs = [0,0,0,0];
	for (var i = 0; i < 100; i++) {
		enemies.push(new Enemy());
	}
	isFire = false;
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

/////////////////////////////////////////////////////////

function world() {
	clearCanvas();

	character.update().draw();
	gun.draw();
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].update().draw();	
	}

	if (isFire && character.bulletCount > 0) {
		bullets.push(new Bullet(gun.angle));
		character.bulletCount--;
	}
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
	this.bulletRegen = 5;
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
		context.stroke(); context.fill();
		context.fillStyle = 'white';
		var eyesPos = dirs.indexOf(1) != -1 ? eyes[dirs.indexOf(1)] : eyes[4];
		context.beginPath();
		context.arc(this.x + eyesPos[0], this.y + eyesPos[1], eyesPos[4], Math.PI*2, false);
		context.stroke(); context.fill();
		context.beginPath();
		context.arc(this.x + eyesPos[2], this.y + eyesPos[3], eyesPos[5], Math.PI*2, false);
		context.stroke(); context.fill();
	}
}
function Gun() {
	this.init = function() {
		this.radius = 5;
		this.dist = 28;
		this.angle = randomBetween(0,360);
	}; this.init();
	this.draw = function() {
		this.x = canvas.width/2 + Math.cos(this.angle * (Math.PI / 180)) * this.dist;
		this.y = canvas.height/2 + Math.sin(this.angle * (Math.PI / 180)) * this.dist;
		context.fillStyle = '#fff';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
	};
}

function Bullet(ang){
	this.x = character.x;
	this.y = character.y;
	this.radius = 5;
	this.angle = ang;
	this.speed = 30;
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

		return this;
	}
	this.draw = function() {
		context.fillStyle = '#fff'
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
	}
}

function Enemy(){
	this.init = function() {
		this.x = randomBetween(0, canvas.width);
		this.y = randomBetween(0, canvas.height);
		this.radius = randomBetween(15,25);
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
		this.speed = 2;
		this.acceleration = 1.00;
	}; this.init();
	this.update = function() {
		this.angle += this.angSpd * this.angDir;
		if (this.angle >= this.maxAng || this.angle <= this.minAng) {
			this.angDir *= -1;
		}
		this.speed *= this.acceleration;
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

		return this;
	}
	this.draw = function() {
		context.fillStyle = '#fff';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
		context.fillStyle = '#000';
		context.beginPath();
		context.arc(this.x + this.radius/2, this.y, this.radius/2.5, Math.PI*2, false);
		context.stroke();
		context.fill();
		context.beginPath();
		context.arc(this.x - this.radius/2, this.y, this.radius/2.5, Math.PI*2, false);
		context.stroke();
		context.fill();
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






