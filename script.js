
/////////////////////////////////////////////////////////

var canvas = document.getElementById('sphere');
var context = canvas.getContext('2d');
setInterval(world, 30);

var character, gun, bullets, enemies, dirs, isFire, grid, bar, toPaintCtr, toPaint;
var isPlay,range, score, highscore, isGG, apsanHS;

/////////////////////////////////////////////////////////

// localStorage.setItem('hs', 0); // reset HS

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
	bar = new Bar();
	toPaint = 2;
	toPaintCtr = toPaint;
	range = 200;
	isPlay = false;
	isGG = false;
	apsanHS = false;
	score = 0;
	highscore = JSON.parse(localStorage.getItem("hs"));
	if (!highscore) {
		localStorage.setItem('hs',0);
		highscore = 0;
	}
}; init();

function randomBetween(min, max) {
	if (min > max) {var temp = min; min = max; max = temp; }
    return Math.floor(Math.random() * (max - min)) + min;
}
function clearCanvas() {
	context.fillStyle = "#fff";
	context.fillRect(0,0,canvas.width,canvas.height);
}
function getHypothenuse(x1,y1,x2,y2) {
	var x = Math.abs(x1-x2);
	var y = Math.abs(y1-y2);
	return Math.sqrt((x*x)+(y*y));
}
function connectBullets() {
	context.shadowBlur = 0;
	for (var i in bullets) {
		for (var j = i; j < bullets.length; j++) {
			if (j != i) {
				var b1 = bullets[i], b2 = bullets[j];
				var hyp = getHypothenuse(b1.x, b1.y, b2.x, b2.y);
				if (hyp <= range) {
					context.shadowColor = 
					'rgba('+b2.r+','+b2.g+','+b2.b+','
					+((Math.abs(hyp-range))*(3/range))+')';
					context.strokeStyle =
					'rgba('+b2.r+','+b2.g+','+b2.b+','
					+((Math.abs(hyp-range))*(3/range))+')';
					context.beginPath();
					context.moveTo(b1.x, b1.y);
					context.lineTo(b2.x, b2.y);
					context.stroke();
				}
			}
		}
	}
	context.shadowBlur = 0;
}
function hit(en,r,g,b) {
	en.life -= 3;
	en.colorize(r, g, b);
	score += en.radius;
}
function texts() {
	context.fillStyle = 'rgb('+character.r%255+','+character.g%255+','+character.b%255+')';
	context.font = '15px Arial';
	context.fillText('HP : ' + bar.life, 20, 70);
	context.fillText('bunus HP : ' + toPaint, 20, 90);
	context.fillText('get bonus in : ' + toPaintCtr, 20, 110);
	context.fillText('keep calm and paint dem circles ;)', 20, canvas.height - 20);
	context.font = '20px Arial';
	context.fillText('BEST     :' + highscore + ' points', 20, 150);
	context.fillText('SCORE : ' + score + ' points', 20, 180);
}
function drawTitle() {
	context.fillStyle = 'rgb('+character.r%255+','+character.g%255+','+character.b%255+')';
	context.font = '70px Arial';
	context.fillText('PAINter', 20, canvas.height/2);
	context.font = '30px Arial';
	context.fillText('get ready to paint dem circles... :)', 20, canvas.height/2+40);
	context.font = '15px Arial';
	context.fillText('press the \"space key\" to continue...!', 20, canvas.height/2+70);
	context.font = '10px Arial';
	context.fillText('pro tip : WASD ang controls ;) try...', 20, canvas.height/2+110);
	context.font = '10px Arial';
	context.fillText('PS pro tip : CLICK ang pag-pew*pew* sa paint ;)', 20, canvas.height/2+130);
	context.font = '20px Arial';
	context.fillText('best :' + highscore + ' points', 20, 30);
}
function drawGG() {
	context.fillStyle = 'rgb('+character.r%255+','+character.g%255+','+character.b%255+')';
	context.font = '30px Arial';
	context.fillText('you\'re score : ' + score + " XD", 20, canvas.height/2 - 30);
	if (highscore == score) {
		context.font = '70px Arial';
		context.fillText('CONGRATSz...', 20, canvas.height/2 + 50);
		context.font = '13px Arial';
		context.fillText('please press the \"space key\" to continue...', 20, canvas.height/2+75);
	} else {
		context.font = '30px Arial';
		context.fillText('gg noob... don\'t ever play this game again...', 20, canvas.height/2);
		context.font = '13px Arial';
		context.fillText('don\'t press the \"space key\" to continue... NOoooooo!', 20, canvas.height/2+25);
		context.font = '13px Arial';
		context.fillText('PLEASE SHUTDOWN THIS DEVICE NOW!', 20, canvas.height/2+50);
	}
	context.font = '20px Arial';
	context.fillText('best :' + highscore + ' points', 20, 30);
}
/////////////////////////////////////////////////////////

function world() {
	clearCanvas();

	if (!isPlay) {
		grid.draw();
		character.update().draw();
		gun.draw();
		drawTitle();
	}
	else if (isGG) {
		grid.draw();
		character.update().draw();
		gun.draw();
		drawGG();
	}
	else {
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

		bar.update().draw();
		texts();
	}
}

/////////////////////////////////////////////////////////

function Character() {
	this.y = canvas.height/2;
	this.x = canvas.width/2;
	this.radius = 20;
	this.speed = 5;
	this.bulletCount = 10;
	this.bulletRegen = 0;
	this.bulletRegenCtr = 0;
	this.bulletMax = 50;
	var eyes = [
		[-10,-5,10,-5,6,6],
		[-10, 5,10, 5,6,6],
		[-13,0 ,7 ,0 ,5,7],
		[-7 ,0 ,13,0 ,7,5],
		[-10,0 ,10,0 ,6,6]
	];
	var max = 255;
	var min = 0;
	this.r = randomBetween(min,max);
	this.g = randomBetween(min,max);
	this.b = randomBetween(min,max);
	this.colorDir = [1,1,1];
	this.update = function() {
		for (var en of enemies) {
			en.y += dirs[0] * this.speed;
			en.y -= dirs[1] * this.speed;
			en.x += dirs[2] * this.speed;
			en.x -= dirs[3] * this.speed;
		}

		this.r += randomBetween(0,3*this.colorDir[0]);
		this.g += randomBetween(0,3*this.colorDir[1]);
		this.b += randomBetween(0,3*this.colorDir[2]);
		if ((this.r >= max || this.r <= min) ) {
			this.colorDir[0] *= -1;
			this.r = this.r >= max ? max : min;
		}
		if ((this.g >= max || this.g <= min) ) {
			this.colorDir[1] *= -1;
			this.g = this.g >= max ? max : min;
		}
		if ((this.b >= max || this.b <= min) ) {
			this.colorDir[2] *= -1;
			this.b = this.b >= max ? max : min;
		}

		this.bulletRegenCtr += this.bulletCount < this.bulletMax ? 1 : 0;
		if (this.bulletRegenCtr >= this.bulletRegen) {
			this.bulletRegenCtr = 0;
			this.bulletCount++;
		}

		return this;
	}
	this.draw = function() {
		context.fillStyle = '#eee';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
		context.fillStyle = 'rgb('+this.r+','+this.g+','+this.b+')'
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
		// context.fillStyle = '#fff';
		context.fillStyle = 'rgb('+character.r%255+','+character.g%255+','+character.b%255+')';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
	};
}
function Bullet(ang) {
	this.x = gun.x;
	this.y = gun.y;
	this.radius = 5;
	this.angle = ang;
	this.speed = 10;
	this.acceleration = 1;
	this.r = character.r;
	this.g = character.g;
	this.b = character.b;
	this.update = function() {
		this.speed *= this.acceleration;

		var dx = Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        var dy = Math.sin(this.angle * (Math.PI / 180)) * this.speed;
        this.x += dx;
        this.y += dy;

        if (this.x + this.radius < 0 - range ||
        	this.x - this.radius > canvas.width + range || 
        	this.y + this.radius < 0 - range ||
        	this.y - this.radius > canvas.height + range) {
        	bullets.splice(bullets.indexOf(this), 1);
        }

        for (var en of enemies) {
        	if (getHypothenuse(this.x, this.y, en.x, en.y) <=
        		this.radius + en.radius) {
        		bullets.splice(bullets.indexOf(this), 1);
        		hit(en,this.r,this.g,this.b);
        	}
        }

		return this;
	}
	this.draw = function() {
		// context.fillStyle = 'rgb('+this.r%255+','+this.g%255+','+this.b%255+')';
		context.fillStyle = 'rgba(255,255,255,0)';
		context.strokeStyle = '#000';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.fill();
	}
}

function Enemy() {
	this.init = function() {
		this.x = randomBetween(0, canvas.width);
		this.y = randomBetween(0, canvas.height);
		this.radius = randomBetween(0, 20) == 1 ?
			randomBetween(100, 150) : randomBetween(20,25);
		if (randomBetween(0,2) == 0) {
			this.y = randomBetween(0,2) == 0 ? 0 - this.radius : canvas.height + this.radius;
		} else {
			this.x = randomBetween(0,2) == 0 ? 0 - this.radius : canvas.width + this.radius
		}
		// this.angle = randomBetween(0,4) == 1 ? 
		// 	-1 * (Math.atan2(this.x - canvas.width/2, this.y - canvas.height/2) * (180 / Math.PI) + 90) : 
		// 	randomBetween(0,360);
		this.angle = randomBetween(0,360);
		this.minAng = this.angle - randomBetween(0, 90);
		this.maxAng = this.angle + randomBetween(0, 90);
		this.angSpd = 1;
		this.angDir = randomBetween(0,2) == 0 ? -1 : 1;
		this.speed = randomBetween(2,8);
		this.stability = randomBetween(0,0);
		this.life = this.radius;
		this.r = 255;
		this.g = 255;
		this.b = 255;
	}; this.init();
	this.colorize = function(r,g,b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	this.update = function() {
		if (this.life <= 0) {
			enemies.push(new Enemy());
			this.init();
			toPaintCtr--;
			if (toPaintCtr <= 0) {
				bar.life += toPaint;
				toPaint *= 2;
				toPaintCtr = toPaint;
			}
		}
		if (getHypothenuse(this.x, this.y, character.x, character.y) <= 
			this.radius + character.radius) {
			this.init();
			// bar.life--;
			bar.life -= this.radius/5;
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
		context.fillStyle = 'rgb('+this.r+','+this.g+','+this.b+')';
		context.strokeStyle = 'rgba(0,0,0,0.3)';
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI*2, false);
		context.stroke();
		context.fill();
		context.fillStyle = '#fff';
		context.beginPath();
		context.arc(this.x + this.radius/2 + randomBetween(-this.stability, this.stability + 1), this.y + randomBetween(-this.stability, this.stability + 1), this.radius/2.5, Math.PI*2, false);
		context.stroke();
		context.fill();
		context.beginPath();
		context.arc(this.x - this.radius/2 + randomBetween(-this.stability, this.stability + 1), this.y + randomBetween(-this.stability, this.stability + 1), this.radius/2.5, Math.PI*2, false);
		context.stroke();
		context.fill();
	}
}

function Grid() {
	this.gap = 30;
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
		context.strokeStyle = 'rgba(0,0,0,0.2)';
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
function Bar() {
	this.life = 1;
	this.maxLife = this.life * 2;
	this.r = character.r;
	this.g = character.g;
	this.b = character.b;
	this.update = function() {
		this.r = character.r;
		this.g = character.g;
		this.b = character.b;

		if (this.life < 0) {
			this.life = 0;
		}
		if (this.life > this.maxLife) {
			this.life = this.maxLife;
		}
		if (this.life == 0) {
			isGG = true;
			if (score > highscore) {
				highscore = score;
			}
			localStorage.setItem('hs',highscore);
			apsanHS= true;
		}

		return this;
	}
	this.draw = function() {
		context.fillStyle = 'rgb('+this.r+','+this.g+','+this.b+')';
		context.fillRect(canvas.width/2-(canvas.width/2*(this.life/this.maxLife)),25,
			canvas.width*(this.life/this.maxLife),15);
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
    	if (!isPlay) {
    		isPlay = true;
    	}
    	if (isGG) {
    		init();
    	}
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






