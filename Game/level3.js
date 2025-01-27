var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2 + 30;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var dx2 = 2.5;
var dy2 = -2.5;
var x2 = canvas.width / 2 - 30;
var y2 = canvas.height - 30;

var ball1_is_live = true;
var ball2_is_live = true;

var paddleHeight = 10;
var paddleWidth = 250;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 8;
var brickColumnCount = 11;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 50;
var brickOffsetLeft = 30;

var game_is_fire = false;

var bricks = [];

var timer = 200;
var delete_timer;
var sound_checkbox = document.getElementById("sound");
var mysound;
var lives = 3;
var level = document.getElementById("level");
level.innerHTML = 3;
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
var colors = [];

for (var c = 0; c < brickColumnCount; c++) {
  colors[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    colors[c][r] = {
      color: "#" + (((1 << 24) * Math.random()) | 0).toString(16),
    };
  }
}

var score = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
    if (game_is_fire == false && paddleX < canvas.width - paddleWidth) {
      x += 8;
      x2 += 8;
      paddleX += 8;
    }
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
    if (game_is_fire == false && paddleX > 0) {
      x -= 8;
      x2 -= 8;
      paddleX -= 8;
    }
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX + paddleWidth < canvas.width) {
    paddleX = relativeX;
    if (game_is_fire == false) {
      x = relativeX + 100;
      x2 = relativeX + 150;
    }
  } else if (relativeX < 0) {
    paddleX = 0;
    if (game_is_fire == false) {
      x = 100;
      x2 = 150;
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#351865";
  ctx.fill();
  ctx.closePath();
}

function drawBall2() {
  ctx.beginPath();
  ctx.arc(x2, y2, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#351865";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#351865";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = colors[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          if (sound_checkbox.checked == true) {
            brick_sound = new sound("sound/brick.mp3");
            brick_sound.play();
          }
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.assign("index.html");
            clearInterval(time_count);
          }
        }
      }

      if (b.status == 1) {
        if (
          x2 > b.x &&
          x2 < b.x + brickWidth &&
          y2 > b.y &&
          y2 < b.y + brickHeight
        ) {
          if (sound_checkbox.checked == true) {
            brick_sound = new sound("sound/brick.mp3");
            brick_sound.play();
          }
          dy2 = -dy2;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
            clearInterval(time_count);
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#351865";
  ctx.fillText("Score: " + score, 870, 27);
}

function drawLives() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#351865";
  ctx.fillText("Lives: " + lives, 700, 27);
}

function drawTimer() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#351865";
  ctx.fillText("Timer: " + parseInt(timer), 500, 27);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  if (ball1_is_live) drawBall();
  if (ball2_is_live) drawBall2();
  drawPaddle();
  collisionDetection();
  drawLives();
  drawScore();
  drawTimer();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    if (sound_checkbox.checked == true) {
      paddle_sound = new sound("sound/paddle.mp3");
      paddle_sound.play();
    }
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    if (sound_checkbox.checked == true) {
      paddle_sound = new sound("sound/paddle.mp3");
      paddle_sound.play();
    }
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      /* if(sound_checkbox.checked==true)
                            {
                                paddle_sound=new sound("sound/paddle.mp3");
                                paddle_sound.play();
                            }*/
      dy = -dy;
    } else {
      ball1_is_live = false;
      if (ball2_is_live == false) {
        lives--;
        if (lives < 1) {
          if (sound_checkbox.checked == true) {
            gameover_sound = new sound("sound/gameover.mp3");
            gameover_sound.play();
          }

          alert("GAME OVER");
          clearInterval(delete_timer);
          setTimeout(function () {
            document.location.replace("index.html");
          }, 3000);
        } else {
          ball1_is_live = true;
          ball2_is_live = true;
          x = canvas.width / 2 + 30;
          y = canvas.height - 30;
          x2 = canvas.width / 2 - 30;
          y2 = canvas.height - 30;
          drawBall();
          drawBall2();
          dx = 2;
          dy = -2;
          dx2 = 2.5;
          dy2 = -2.5;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
  }

  if (x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) {
    if (sound_checkbox.checked == true) {
      paddle_sound = new sound("sound/paddle.mp3");
      paddle_sound.play();
    }
    dx2 = -dx2;
  }
  if (y2 + dy2 < ballRadius) {
    if (sound_checkbox.checked == true) {
      paddle_sound = new sound("sound/paddle.mp3");
      paddle_sound.play();
    }
    dy2 = -dy2;
  } else if (y2 + dy2 > canvas.height - ballRadius) {
    if (x2 >= paddleX && x2 <= paddleX + paddleWidth) {
      /*  if(sound_checkbox.checked==true)
                             {
                                paddle_sound=new sound("sound/paddle.mp3");
                                paddle_sound.play();
                                
                            }*/
      dy2 = -dy2;
    } else {
      ball2_is_live = false;
      if (ball1_is_live == false) {
        lives--;
        if (lives < 1) {
          if (sound_checkbox.checked == true) {
            gameover_sound = new sound("sound/gameover.mp3");
            gameover_sound.play();
          }

          alert("GAME OVER");
          clearInterval(delete_timer);
          setTimeout(function () {
            document.location.replace("index.html");
          }, 3000);
        } else {
          ball1_is_live = true;
          ball2_is_live = true;
          x = canvas.width / 2 + 30;
          y = canvas.height - 30;
          x2 = canvas.width / 2 - 30;
          y2 = canvas.height - 30;
          drawBall();
          drawBall2();
          dx = 2;
          dy = -2;
          dx2 = 2.5;
          dy2 = -2.5;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  timer -= 0.01;

  if (parseInt(timer) == 0) {
    timer = 10;
    //clearInterval(delete_timer);
    alert("sorry u lose timeout");
    lives--;
    if (lives < 0) {
      if (sound_checkbox.checked == true) {
        gameover_sound = new sound("sound/gameover.mp3");
        gameover_sound.play();
      }
      alert("GAME OVER");
      clearInterval(delete_timer);
      setTimeout(function () {
        document.location.replace("index.html");
      }, 3000);
    } else {
      if (sound_checkbox.checked == true) {
        loselife_sound = new sound("sound/loselife.mp3");
        loselife_sound.play();
      }

      ctx.clearRect(
        x - ballRadius,
        y - ballRadius,
        ballRadius * 4,
        ballRadius * 4
      );
      x = canvas.width / 2 + 30;
      y = canvas.height - 30;
      drawBall();
      dx = 2;
      dy = -2;
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }
  x += dx;
  y += dy;

  x2 += dx2;
  y2 += dy2;
}

function begining() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  ctx.beginPath();
  ctx.arc(x, y + 10, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#351865";
  ctx.fill();
  ctx.closePath();
  drawPaddle();
  ctx.beginPath();
  ctx.arc(x2, y2 + 10, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#351865";
  ctx.fill();
  ctx.closePath();
  collisionDetection();
  drawLives();
  drawScore();
  drawTimer();
}

var time_count = setInterval(begining, 10);
function startGame(e) {
  if (e.code == "Space" && game_is_fire == false) {
    game_is_fire = true;
    clearInterval(time_count);
    delete_timer = setInterval(draw, 10);
    if (sound_checkbox.checked == true) {
      mysound = new sound("sound/go.mp3");
      mysound.play();
    }
    instruct = document.getElementById("instructions");
    instruct.style.display = "none";
    //lives--;
  }
  if (e.code == "Escape" && game_is_fire == true) {
    game_is_fire = false;
    clearInterval(delete_timer);
  }
  if (e.code == "ArrowUp" && game_is_fire == false) {
    document.location.assign("level3.html");
  }
  if (e.code == "ArrowDown" && game_is_fire == false) {
    document.location.assign("level2.html");
  }
}
