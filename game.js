let gameOver;
let snakeDrew;
let gameSpeed;
let playerLength;
let currPlayerDir;
let frameCount;
let score;
let playerPos;
let getPlayerPos;

let foodPos = {};
let maxWidth = 40;
let maxHeight = 30;
let gameArea = $("#game-area");


$(document).ready(function(){
  init();

  function init() {
    drawGameArea();
    resetGame();
    drawPlayer();
    placeFood();
  }

  function drawGameArea() {
    for (let index = 0; index < maxHeight; index++) {
      gameArea.append("<tr class='tr'></tr>");
      let currTr = $('.tr').eq(index);
      for (let indexTd = 0; indexTd < maxWidth; indexTd++) {
        currTr.append("<td class='tr" + index + 'td' + indexTd + "'" + "></td>");
      }
    }
  }

  function drawInitialPlayer() {
    if (!snakeDrew) {
      for (let i = 1; i < playerLength; i++) {
        frameCount++;
        getPlayerPos = $('.tr' + playerPos['tr'] + 'td' + playerPos['td']);
        getPlayerPos.addClass('player framecount' + frameCount);
        playerPos['td']++;
      }
      playerPos['td']--;
      snakeDrew = true;
    }
  }

  function drawPlayer() {
    drawInitialPlayer();
    movePlayer();

    // Take food and increment score
    if (playerPos['tr'] === foodPos['tr'] &&
        playerPos['td'] === foodPos['td']) {
      score++;
      $('#score').text("Score: "+score);
      playerLength++;
      placeFood();
    }

    // Set death condition
    if (playerPos['tr'] < 0 ||
        playerPos['tr'] >= maxHeight ||
        playerPos['td'] < 0 ||
        playerPos['td'] >= maxWidth) {
      gameOver = true;
    }

    // Restart game
    if (!gameOver) {
      setTimeout(drawPlayer, gameSpeed);
    } else {
      alert("Game over!\nYour score: " + score);
      resetGame();
      drawPlayer();
      placeFood();
    }
  }

  function movePlayer() {
    // 1 = 'up', 2 = 'right', 3 = 'down', 4 = 'left'
    switch (currPlayerDir) {
      case 1:
        playerPos['tr']--;
        break;
      case 2:
        playerPos['td']++;
        break;
      case 3:
        playerPos['tr']++;
        break;
      case 4:
        playerPos['td']--;
        break;
      default:
        alert("Error drawing player");
    }


    $('td').removeClass('head');
    frameCount++;
    getPlayerPos = $('.tr' + playerPos['tr'] + 'td' + playerPos['td']);
    if (!getPlayerPos.hasClass('player')) {
      getPlayerPos.addClass('player framecount' + frameCount);
      $('.player.framecount' + frameCount).addClass('head');
    } else {
      gameOver = true;
    }

    let calcPlayerTailPos = frameCount - playerLength;
    let getPlayerTailPos = $('.framecount' + calcPlayerTailPos);
    getPlayerTailPos.removeClass('player framecount' + calcPlayerTailPos)
  }

  function placeFood() {
    $('td').removeClass('food');
    let foodTr = Math.floor(Math.random() * maxHeight);
    let foodTd = Math.floor(Math.random() * maxWidth);
    console.log(gameArea.find('.tr'+foodTr+'td'+foodTd));
    if (!gameArea.find('.tr'+foodTr+'td'+foodTd).hasClass('player')) {
      foodPos['tr'] = foodTr;
      foodPos['td'] = foodTd;
      gameArea.find('.tr'+foodTr+'td'+foodTd).addClass('food');
    } else {
      placeFood();
    }
  }

  function resetGame() {
    score = 0;
    $('#score').text("Score: "+score);
    gameOver = false;
    snakeDrew = false;
    playerPos = {
      'tr' : 0, 'td': 0
    };
    gameSpeed = 200;
    playerLength = 4;
    currPlayerDir = 2;
    frameCount = 0;
    gameSpeed = 200;
    $('td').removeClass('player');
  }


  // Change direction on key press
  $(document).on('keydown', function(e){
      switch (e.key) {
        case 'ArrowDown':
          if (currPlayerDir !== 1) {
            currPlayerDir = 3;
          }
          break;
        case 'ArrowUp':
          if (currPlayerDir !== 3) {
            currPlayerDir = 1;
          }
          break;
        case 'ArrowRight':
          if (currPlayerDir !== 4) {
            currPlayerDir = 2;
          }
          break;
        case 'ArrowLeft':
          if (currPlayerDir !== 2) {
            currPlayerDir = 4;
          }
          break;
      }
  });

  // Accelerate when shift key pressed
  let pressed = false;
  $(document).on('keydown', function(e){
    if (e.key === 'Shift') {
      if (!pressed) {
        gameSpeed = gameSpeed / 3;
      }
      pressed = true;
    }
  });

  $(document).on('keyup', function(e){
    if (e.key === 'Shift') {
      if (pressed) {
        gameSpeed = 200;
      }
      pressed = false;
    }
  });

});
