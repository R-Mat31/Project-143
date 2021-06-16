var paddle2 = 10, paddle1 = 10;
var paddle1X = 10, paddle1Height = 110;
var paddle2Y = 685, paddle2Height = 70;
var score1 = 0, score2 = 0;
var paddle1Y;
var playerscore = 0;
var audio1;
var pcscore = 0;
var ball = {
 x:350 / 2,
 y:480 / 2,
 r:20,
 dx:3,
 dy:3
}
var wristX = 0;
var wristY = 0;
var wristAccuracy = 0;
var status = "";
function preload(){
 touch = loadSound("ball_touch_paddel.wav");
 missed = loadSound("missed.wav");
}
function setup(){
 var canvas =  createCanvas(700, 460);
 canvas.parent("canvas");
 video = createCapture(VIDEO);
 video.size(700, 460);
 video.hide();
 poseNet = ml5.poseNet(video, model_loaded);
 poseNet.on("pose", got_poses);
}
function draw(){
 if(status = "started"){
  background(0); 
  fill("black");
  stroke("black");
  rect(680, 0, 20, 700);
  fill("black");
  stroke("black");
  rect(0, 0, 20, 700);
  paddleInCanvas();
  fill(250, 0, 0);
  stroke(0, 0, 250);
  strokeWeight(0.5);
  paddle1Y = wristY; 
  rect(paddle1X, paddle1Y, paddle1, paddle1Height, 100);
  fill("#FFA500");
  stroke("#FFA500");
  var paddle2y = ball.y - paddle2Height/2;  rect(paddle2Y, paddle2y, paddle2, paddle2Height, 100);
  midline();
  drawScore();
  models();
  move();
  image(video, 0, 415, 45, 45);
  if(wristAccuracy > 0.2){
   fill(172, 172, 172);
   stroke(172, 172, 172);
   circle(wristX, wristY, 5);
  }
 }
}
function reset(){
 ball.x = width/2+100,
 ball.y = height/2+100;
 ball.dx=3;
 ball.dy =3;
}
function midline(){
 for(i = 0;i < 480; i += 10) {
  var y = 0;
  fill("white");
  stroke(0);
  rect(width / 2, y + i, 10, 480);
 }
}
function drawScore(){
 textAlign(CENTER);
 textSize(20);
 fill("white");
 stroke(250, 0, 0)
 text("Player: ", 100, 50)
 text(playerscore, 140, 50);
 text("Computer: ", 500, 50)
 text(pcscore, 555, 50)
}
function move(){
 fill(50,350,0);
 stroke(255,0,0);
 strokeWeight(0.5);
 ellipse(ball.x, ball.y, ball.r, 20)
 ball.x = ball.x + ball.dx;
 ball.y = ball.y + ball.dy;
 if(ball.x + ball.r > width-ball.r / 2){
  ball.dx =- ball.dx - 0.5;       
 }
 if(ball.x - 2.5 * ball.r / 2 < 0){
  if(ball.y >= paddle1Y && ball.y <= paddle1Y + paddle1Height){
   ball.dx = -ball.dx+0.5;
   touch.play();
   playerscore = playerscore + 1;
   text(playerscore, 140, 50)
  }
  else{
   pcscore++;
   reset();
   navigator.vibrate(100);
   missed.play();
  }
 }
 if(pcscore == 4){
  fill("#FFA500");
  stroke(0)
  rect(0, 0, width, height - 1);
  fill("white");
  stroke("white");
  textSize(25)
  text("Game Over!☹☹", width / 2, height / 2);
  text("Press 'Restart' Button", width / 2, height / 2 + 30)
  noLoop();
  pcscore = 0;
 }
 if(ball.y + ball.r > height || ball.y - ball.r < 0){
  ball.dy =- ball.dy;
 }    
}
function models(){
 textSize(18);
 fill(255);
 noStroke();
 text("Width:"+width,135,15);
 text("Speed:"+abs(ball.dx),50,15);
 text("Height:"+height,235,15)
}
function paddleInCanvas(){
 if(mouseY + paddle1Height > height){
  mouseY = height - paddle1Height;
 }
 if(mouseY < 0){
  mouseY =0;
 }  
}
function model_loaded(){
 console.log("Model Loaded.");
}
function got_poses(results){
 if(results.length > 0){
  console.log(results);
  wristX = results[0].pose.rightWrist.x;
  wristY = results[0].pose.rightWrist.y;
  wristAccuracy = results[0].pose.rightWrist.confidence;
 }
}
function start_game(){
 status = "started";
 document.getElementById("status").innerHTML = "The game is loaded.";
 video.hide();
}
function restart(){
 pcscore = 0;
 playerscore = 0;
 loop();
}