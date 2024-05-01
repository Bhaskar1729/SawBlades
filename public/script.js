// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmVdHkNgeCcFjjcijerCPZEEySCn1q7ZA",
  authDomain: "sawblades-f9106.firebaseapp.com",
  projectId: "sawblades-f9106",
  storageBucket: "sawblades-f9106.appspot.com",
  messagingSenderId: "815820681728",
  appId: "1:815820681728:web:f365f7b5d6f5bcbe351ee5",
  measurementId: "G-KLXENKYCDM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

async function getCities() {
    const CitiesCol = db.collections("Cities");
    let CitiesSnapshot = await CitiesCol.get();
    const citiesList = CitiesSnapshot.docs.map(doc => doc.data());
    return citiesList;
}

const array = getCities();

console.log(citiesList);



canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");

let radius = 20;                    //bladeRadius = radius
let y = canvas.height - radius;
let x = canvas.width/2;
let g = 1;
let vy = 0;
let vx = 6;
let boost = 17;
let timer = 3;  
let score = 0;

const err = 5;

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
        let vx = randInt(2, 3);
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

const interval = setInterval(makeSaw, 2000);

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

function collisionDetection() {
    for (let i = 0; i < blades.length; i++) {
        let blade = blades[i];
        if (y < blade.y && (x > blade.x-err && x < blade.x+err)) {
            blades[i].status = 1;
            blades[i].color = "green";
        }

        if (distance(blade.x, blade.y, x, y) < 2*radius) {
            alert("Game over");
            document.location.reload();
            clearInterval(interval);
            x = -1000;
            y = -1000;
        }
    }
}

function displayScore() {
    ctx.font = "32px Arial"
    ctx.fillStyle = "black";
    ctx.fillText(""+score, canvas.width/2, canvas.height/2);
}

function handleKeyDown(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }

    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }

    else if ((e.key == "Up" || e.key == "ArrowUp") && jumps) {
        vy = -boost;
        jumps -= 1;
    }
}

function handleKeyUp(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
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

draw();
