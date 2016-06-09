// constants
heliWidth = 40;
heliHeight = 25;
planeWidth = 80;
planeHeight = 50;
heliSpeedX = -2;

planeSpeed = 5;
bulletSpeed = 6;

var canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
var heliImage = document.getElementById('heli');
var planeImage = document.getElementById('plane');
var bulletImage = document.getElementById('bullet');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function GameObject(type, startX, startY, deltaX, deltaY, width, height) {
    this.img = heliImage;
    if (type === 'plane') {
        this.img = planeImage;
    }   else if (type === 'bullet') {
        this.img = bulletImage;
    }
    this.gameOb = {
        img: this.img,
        left: startX,
        top: startY,
        width:width,
        height: height,
    };

    this.move = function() {
        var newX = this.gameOb.left + deltaX;
        var newY = this.gameOb.top + deltaY;
        this.gameOb.left = newX;
        this.gameOb.top = newY;
    }

    this.addToCanvas = function() {
        ctx.drawImage(this.gameOb.img, this.gameOb.left, this.gameOb.top,
            this.gameOb.width, this.gameOb.height);
    }
}

var helis = [];
var plane = null;
var bullets = [];

function addHeli(number) {
    var startX = 1000;
    var startY = getRandomInt(0, 500 - heliHeight);
    var deltaX = heliSpeedX;
    var deltaY = 0;
    for (var i=0; i < number; i++) {
        var gameOb = new GameObject(
            'heli', startX, startY, deltaX, deltaY, heliWidth, heliHeight);
        startX += heliWidth + 10;
        helis.push(gameOb);
        gameOb.addToCanvas();
    }
}


function startAddingHeli() {
    addHeli(1);
    setTimeout(function() {
        startAddingHeli();
    }, 700);
}

function moveHelis() {
    var toRemove = [];
    for (var i=helis.length - 1; i >= 0 ; i--) {
        helis[i].move();
        if (helis[i].gameOb.left + heliWidth < 0) {
            helis.splice(i, 1);
        }
    }

    for (var i=bullets.length - 1; i >= 0; i--) {
        bullets[i].move();
        var hasRemove = false;
        for (var j=helis.length - 1; j >= 0; j--) {
            // console.log(i);
            // console.log(bullets.length);
            // console.log(bullets[i].gameOb);
            if (i < bullets.length) {
                if (checkCollision(bullets[i].gameOb, helis[j].gameOb)) {
                    bullets.splice(i, 1);
                    helis.splice(j, 1);
                    hasRemove = true;
                }
            }
        }
        if (!hasRemove) {
            if (bullets[i].gameOb.left + 10 > 1000) {
                bullets.splice(i, 1);
            }
        }
    }
}

function repaint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveHelis();
    plane.addToCanvas();
    for (var i=0; i < helis.length; i++) {
        helis[i].addToCanvas();
        if (checkCollision(plane.gameOb, helis[i].gameOb)) {
            alert('GAMEOVER');
            return;
            setTimeout(location.reload, 500);
        }
    }
    for (var i=0; i < bullets.length; i++) {
        bullets[i].addToCanvas();
    }
    setTimeout(function() {
        repaint();
    }, 20);
}


function addPlane() {
    plane = new GameObject(
        'plane', 200, 250, 0, 0, planeWidth, planeHeight);
    plane.addToCanvas();
}

function addBullet(startX, startY) {
    var bullet = new GameObject(
        'bullet', startX, startY, bulletSpeed, 0, 10, 10);
    bullets.push(bullet);
}

function movePlane(direction) {
    if (direction === 119 && plane.gameOb.top - planeSpeed > 0) { // up
        plane.gameOb.top -= planeSpeed;
    }  else if (direction === 115 && plane.gameOb.top + planeHeight + planeSpeed <= 500) {
        plane.gameOb.top += planeSpeed;
    }   else if (direction === 100 && plane.gameOb.left + planeWidth + planeSpeed <= 1000) {
        plane.gameOb.left += planeSpeed;
    }   else if (direction === 97 && plane.gameOb.left - planeSpeed > 0) {
        plane.gameOb.left -= planeSpeed;
    }

}

function checkCollision(object1, object2) {
    if (object1.left < object2.left + object2.width  && object1.left + object1.width  > object2.left &&
		object1.top < object2.top + object2.height && object1.top + object1.height > object2.top) {
        return true;
    }
    return false;
}

function allowPlaneMovement() {
    document.onkeypress = function(e) {
        if (e.keyCode === 32) {
            addBullet(plane.gameOb.left + planeWidth, plane.gameOb.top + (planeHeight / 2));
        }
        movePlane(e.keyCode);
    };
}

function start() {
    startAddingHeli();
    addPlane();
    repaint();
    allowPlaneMovement();
}

start();
