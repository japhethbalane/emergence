///////////////////////////////////////////////////////////////

var canvas = document.getElementById('swarm');
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

///////////////////////////////////////////////////////////////

var particles = [];

///////////////////////////////////////////////////////////////

function generateParticles(count) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(randomBetween(0, canvas.width-0), randomBetween(0, canvas.height-0)));
    }
}; generateParticles(100);

function randomBetween(min, max) {
    if (min > max) {
        var temp = min;
        min = max; max = temp;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
    context.fillStyle = 'rgba(255,255,255,0.01)';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function getHypothenuse(p1, p2) {
    var x = Math.abs(p1.x - p2.x);
    var y = Math.abs(p1.y - p2.y);
    return Math.sqrt((x * x) + (y * y));
}

///////////////////////////////////////////////////////////////

setInterval(world, 30);
function world() {
    clearCanvas();
    for (let particle of particles) {
        particle.update().draw();
    }
}

///////////////////////////////////////////////////////////////

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.speed = randomBetween(1,3);
    this.innerRadius = 30;
    this.outerRadius = 120;
    this.angle = randomBetween(0,359);
    this.toAngle = this.angle;
    this.rotationSpeed = randomBetween(1,5);
    this.wiggleRange = 30;
    this.wiggle = randomBetween(-this.wiggleRange,this.wiggleRange);
    this.wiggleDir = randomBetween(0,2) == 0 ? -1 : 1;

    this.alignment = function() {
        let sum = this.angle;
        let ctr = 1;
        for (let particle of particles) {
            if (particle != this && getHypothenuse(this, particle) <= this.outerRadius) {
                sum += particle.angle;
                ctr++;
            }
        }
        this.angle = this.angle % 360;
        this.toAngle = (sum / ctr) % 360;
        if (this.toAngle > this.angle) {
            this.angle += this.rotationSpeed;
        } else if (this.toAngle < this.angle) {
            this.angle -= this.rotationSpeed;
        }
    }

    this.updateWiggle = function() {
        this.wiggle += this.wiggleDir == 1 ? 1: -1;

        if (this.wiggle <= -this.wiggleRange) {
            this.wiggleDir = 1;
        } else if (this.wiggle >= this.wiggleRange) {
            this.wiggleDir = -1;
        }
    }

    this.move = function() {
        let ang = this.angle + this.wiggle;
        var dx = Math.cos(ang * (Math.PI / 180)) * this.speed;
        var dy = Math.sin(ang * (Math.PI / 180)) * this.speed;
        this.x += dx;
        this.y += dy;
    }

    this.update = function() {
        this.alignment();
        this.updateWiggle();
        this.move();
        return this;
    }

    this.draw = function() {
        let ang = this.angle + this.wiggle;
        let nosex = this.x + Math.cos(ang * (Math.PI / 180)) * 20;
        let nosey = this.y + Math.sin(ang * (Math.PI / 180)) * 20;
        let rwingx = this.x + Math.cos((ang + 120) * (Math.PI / 180)) * 15;
        let rwingy = this.y + Math.sin((ang + 120) * (Math.PI / 180)) * 15;
        let lwingx = this.x + Math.cos((ang - 120) * (Math.PI / 180)) * 15;
        let lwingy = this.y + Math.sin((ang - 120) * (Math.PI / 180)) * 15;

        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(nosex, nosey);
        context.lineTo(lwingx, lwingy);
        context.lineTo(this.x, this.y);
        context.lineTo(rwingx, rwingy);
        context.lineTo(nosex, nosey);
        context.stroke();

        // context.strokeStyle = 'pink';
        // context.beginPath();
        // context.arc(this.x, this.y, this.innerRadius, Math.PI*2, false);
        // context.stroke();
        //
        // context.strokeStyle = 'lightgreen';
        // context.beginPath();
        // context.arc(this.x, this.y, this.outerRadius, Math.PI*2, false);
        // context.stroke();
    }
}

///////////////////////////////////////////////////////////////

window.addEventListener('click', function(e) {
    // console.log(e.pageX, e.pageY);
});

///////////////////////////////////////////////////////////////
