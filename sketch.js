var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, invisibleGround, groundImage;

var plr, player;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  plr = loadImage("rider.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  camera.position.x= 300
  camera.position.y= height/2
  

  var message = "This is a message";
 console.log(message)
  
  player = createSprite(50,160,20,50);
  player.addImage("running", plr);
  
  player.scale = 0.1;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(camera.position.x,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.position.x ,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //invisibleGround = createSprite(camera.position.x-100,190,400,10);
  //invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  player.setCollider("rectangle",0,0,player.width,player.height);

  ground.setCollider("rectangle",0,0,ground.width,3);
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score
  text("Score: "+ score, camera.position.x+200,50);
  
  
  if(gameState === PLAY){

    player.x = camera.position.x-250;
    gameOver.visible = false;
    restart.visible = false;
    
    camera.position.x = camera.position.x +7;
   // ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (camera.position.x> ground.width/2+350){
      camera.position.x = 300;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& player.y >= 100) {
        player.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    player.velocityY = player.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(player)){
        //player.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the player animation
      ground.velocityX = 0;
      player.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop player from falling down
  player.collide(ground);
  
  


  drawSprites();
}

function reset(){
  gameState = PLAY;
obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  player.changeAnimation("running",player_running)
  score=0
}
  


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite( camera.position.x+300,165,10,40);
 // obstacle.velocityX = -(6 + score/100);
   obstacle.x = camera.position.x+300;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 1200;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x+300,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}



