import { addToLeaderboard, getLeaderboardItems } from "./index.js";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let radius = 20;                    //bladeRadius = radius
let y = canvas.height - radius;
let x = canvas.width/2;
let g = 0.8;
let vy = 0;
let vx = 6;
let boost = 17;
let timer = 3;  
let score = 0;
let jumps;
let minHighest = 500;

const err = 6;

let leftPressed = false;
let rightPressed = false;

const blades = [];

function randInt(a, b) {
    let x = Math.floor(Math.random()*(b-a+1));
    x += a;
    return x;
}

function makeSaw() {
    let numBlades = randInt(1, 3);
    for (let i = 0; i < numBlades; i++) {
        let x = randInt(radius, canvas.width-radius);
        let y = 0;
        let vx = randInt(3, 4);
        let vy = randInt(3, 4);
        let sign = randInt(0, 1);
        if (sign == 1) {
            vx = -vx;
        }
        blades.push({
            x: x,
            y: y,
            vy: vy,
            vx: vx,
            color: "red",
            status: 0               // status: 0 means red, 1 means green
        })
    }
}

let interval;

function drawBlades() {
    for (let i = 0; i < blades.length; i++) {
        let blade = blades[i];

        ctx.beginPath();
        ctx.arc(blade.x, blade.y, radius, 0, 2*Math.PI, false);
        ctx.fillStyle = blade.color;
        ctx.fill();
        ctx.closePath();

        blades[i].x += blade.vx;
        blades[i].y += blade.vy;

        if (blade.x + radius > canvas.width || blade.x < radius) {
            blades[i].vx *= -1;
        }

        if (blade.y + radius > canvas.height) {
            blades[i].vy *= -1;
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function updateBall() {
    vy += g;
    y = Math.min(canvas.height -radius, y + vy);
    if (y == canvas.height - radius) {
        vy = 0;
        jumps = 2;
    }

    if (rightPressed) {
        x = Math.min(canvas.width - radius, x + vx);
    }

    if (leftPressed) {
        x = Math.max(radius, x - vx);
    }
}

function updateBlades() {
    let l = 0;
    let r = blades.length-1;

    if (blades.length == 0) {
        return;
    }

    while (l < r && r > 0 && l < blades.length) {
        if (blades[r].status == 1 || blades[r].y < 0) {
            r -= 1;
            continue;
        }
        if (blades[l].status == 1 || blades[l].y < 0) {
            let temp = blades[l];
            blades[l] = blades[r];
            blades[r] = temp;
            r -= 1;
        }

        l += 1;


    }

    while (blades.length > 0 && (blades[blades.length-1].status == 1 || blades[blades.length-1].y < 0)) {
        let temp = blades.pop();
        if (temp.status == 1) {
            score += 1;
        }
    }
}

function distance(x1, y1, x2, y2) {
    let dist = (x1-x2)**2 + (y1-y2)**2;
    
    return dist**0.5;
}

function getCookie (name) {
	let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

async function collisionDetection() {
    for (let i = 0; i < blades.length; i++) {
        let blade = blades[i];
        if (y < blade.y && (x > blade.x-err && x < blade.x+err)) {
            blades[i].status = 1;
            blades[i].color = "green";
        }

        if (distance(blade.x, blade.y, x, y) < 2*radius) {
            let val = getCookie("name");
            if (!val) {
                val = prompt("Enter a name for the Leaderboard. Your score is " + score);
                document.cookie = "name="+val+";";
            }
            x = -1000;
            y = -1000;
            if (val != null && val != "" && score > minHighest) {
                console.log(val + " " + score);
                await addToLeaderboard(val, score);
            }
            clearInterval(interval);
            document.location.reload();
            
        }
    }
}


function displayScore() {
    ctx.font = "32px Arial"
    ctx.fillStyle = "black";
    ctx.fillText(""+score, canvas.width/2, canvas.height/2);
}

function handleKeyDown(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
        rightPressed = true;
    }

    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
        leftPressed = true;
    }

    else if ((e.key == "Up" || e.key == "ArrowUp" || e.key == ' ') && jumps) {
        if (jumps == 1)
            vy = -boost*0.8;
        else {
            vy = -boost;
        }
        jumps -= 1;
    }
}

function handleKeyUp(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
        leftPressed = false;
    }
}


document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    displayScore();
    collisionDetection();
    updateBall();
    drawBall();
    if (y == canvas.height-radius) {
        updateBlades();
    }
    drawBlades();

    requestAnimationFrame(draw);
}

async function fillLeaderboard() {
    const arr = await getLeaderboardItems();
    console.log(arr);
    const table = document.getElementById("leaderboard");
    let text = "";
    console.log(arr);
    for (let doc of arr) {
        console.log(doc);
        let name = doc["name"];
        let score = doc["score"];
        minHighest = Math.min(minHighest, score);
        text += "<tr><td>"+name+"</td><td>" +score+"</td></tr>";
    }
    table.innerHTML = text;
    console.log(minHighest)
}

function start() {
    
    fillLeaderboard();
    y = canvas.height - radius;
    x = canvas.width/2;
    vy = 0;
    jumps = 2;
    score = 0;
    while (blades.length) {
        blades.pop();
    }
    vx = 6;
    leftPressed = false;
    rightPressed = false;

    interval = setInterval(makeSaw, 2000);
    requestAnimationFrame(draw);
}





start();


