const $BOARD = document.querySelector('.game-board');
const $SCORE_DISPLAY = document.querySelector('#score');
const $START_BUTTON = document.querySelector('#start-button');
let $cells = Array.from(document.querySelectorAll('.game-board div'));
let score = 0;

const WIDTH = 10;

const theTetrominoes = {
  lTetromino: [
    [1, WIDTH+1, WIDTH*2+1, 2],
    [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+2],
    [1, WIDTH+1, WIDTH*2, WIDTH*2+1],
    [WIDTH, WIDTH*2, WIDTH*2+1, WIDTH*2+2]
  ],
  zTetromino: [
    [WIDTH*2, WIDTH*2+1, WIDTH+1, WIDTH+2],
    [0, WIDTH, WIDTH+1, WIDTH*2+1],
    [WIDTH*2, WIDTH*2+1, WIDTH+1, WIDTH+2],
    [0, WIDTH, WIDTH+1, WIDTH*2+1]
  ],
  tTetromino: [
    [1, WIDTH, WIDTH+1, WIDTH+2],
    [1, WIDTH+1, WIDTH+2, WIDTH*2+1],
    [WIDTH, WIDTH+1, WIDTH+2, WIDTH*2+1],
    [1, WIDTH, WIDTH+1, WIDTH*2+1]
  ],
  oTetromino: [
    [0, 1, WIDTH, WIDTH+1],
    [0, 1, WIDTH, WIDTH+1],
    [0, 1, WIDTH, WIDTH+1],
    [0, 1, WIDTH, WIDTH+1]
  ],
  iTetromino: [
    [1, WIDTH+1, WIDTH*2+1, WIDTH*3+1],
    [WIDTH, WIDTH+1, WIDTH+2, WIDTH+3],
    [1, WIDTH+1, WIDTH*2+1, WIDTH*3+1],
    [WIDTH, WIDTH+1, WIDTH+2, WIDTH+3]
  ],
}

const TETROMINOES = [theTetrominoes.lTetromino, theTetrominoes.zTetromino, theTetrominoes.tTetromino, theTetrominoes.oTetromino, theTetrominoes.iTetromino];

let randomTetromino = Math.floor(Math.random()*TETROMINOES.length);
let nextTetromino = Math.floor(Math.random()*TETROMINOES.length);

let currentPosition = 4;
let currentRotation = 0;
let currentTetromino = TETROMINOES[randomTetromino][currentRotation];

const drawTetromino = () => {
  currentTetromino.forEach(index => {
    $cells[currentPosition + index].classList.add('tetromino');
  });
}

const undrawTetromino = () => {
  currentTetromino.forEach(index => {
    $cells[currentPosition + index].classList.remove('tetromino');
  })
}

const moveTetromino = () => {
  undrawTetromino();
  currentPosition += WIDTH;
  drawTetromino();
  stopTetromino();
};

const stopTetromino = () => {
  if(currentTetromino.some(index => $cells[currentPosition + index + WIDTH].classList.contains('taken'))) {
    currentTetromino.forEach(index => $cells[currentPosition + index].classList.add('taken'));

    randomTetromino = nextTetromino;
    nextTetromino = Math.floor(Math.random()*TETROMINOES.length);

    currentTetromino = TETROMINOES[randomTetromino][currentRotation];
    currentPosition = 4;

    addScore();
    drawTetromino();
    drawNextTetromino();
    gameOver();
  }
};

const moveLeft = () => {
  undrawTetromino();
  const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % WIDTH === 0);

  if (!isAtLeftEdge) {
    currentPosition -= 1;
  }

  if(currentTetromino.some(index => $cells[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }

  drawTetromino();
};

const moveRight = () => {
  undrawTetromino();
  const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % WIDTH === WIDTH -1);

  if (!isAtRightEdge) {
    currentPosition += 1;
  }

  if(currentTetromino.some(index => $cells[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }

  drawTetromino();
};

const rotateTetromino = () => {
  undrawTetromino();
  const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % WIDTH === WIDTH -1);
  const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % WIDTH === 0);
  
  if (!(isAtRightEdge || isAtLeftEdge)) {
    currentRotation = currentRotation === 3 ? 0 : currentRotation + 1;
    currentTetromino = TETROMINOES[randomTetromino][currentRotation]; 
  }

  drawTetromino();  
}

function controlTetromino(e){
  if (e.keyCode === 37) {
    moveLeft();
  } else if (e.keyCode === 38) {
    rotateTetromino();
  } else if (e.keyCode === 39) {
    moveRight();
  } else if (e.keyCode === 40) {
    moveDown();
  }
}

document.addEventListener('keyup', controlTetromino);

// Next Tetromino Display

const $DISPLAY_CELLS = document.querySelectorAll('#next-display div');
const DISPLAY_WIDTH = 4;
let displayIndex = 0;

const NEXT_TETROMINOES = [
  [1, DISPLAY_WIDTH+1, DISPLAY_WIDTH*2+1, 2],
  [DISPLAY_WIDTH*2, DISPLAY_WIDTH*2+1, DISPLAY_WIDTH+1, DISPLAY_WIDTH+2],
  [1, DISPLAY_WIDTH, DISPLAY_WIDTH+1, DISPLAY_WIDTH+2],
  [0, 1, DISPLAY_WIDTH, DISPLAY_WIDTH+1],
  [1, DISPLAY_WIDTH+1, DISPLAY_WIDTH*2+1, DISPLAY_WIDTH*3+1]
]

const drawNextTetromino = () => {
  $DISPLAY_CELLS.forEach($cell => {
    $cell.classList.remove('tetromino');
  })

  NEXT_TETROMINOES[nextTetromino].forEach(index => {
    $DISPLAY_CELLS[displayIndex + index].classList.add('tetromino');    
  })
}

let timerId;

$START_BUTTON.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    drawTetromino();
    timerId = setInterval(() => {moveTetromino()}, 500);
    drawNextTetromino();
  }
});

const addScore = () => {
  for (let i = 0; i < $cells.length; i += WIDTH) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
    if(row.every(index => $cells[index].classList.contains('taken'))
    && row.every(index => $cells[index].classList.contains('tetromino'))) {
      
      score += 10;
      $SCORE_DISPLAY.innerText = score;

      row.forEach(index => {
        $cells[index].classList.remove('taken', 'tetromino');
      })

      const $CELLS_REMOVED = $cells.splice(i, WIDTH);
      $cells = $CELLS_REMOVED.concat($cells);
      $cells.forEach($cell => $BOARD.appendChild($cell));
    }
  }
};

const gameOver = () => {
  if (currentTetromino.some(index => $cells[currentPosition + index].classList.contains('taken'))) {
    $SCORE_DISPLAY.innerHTML = 'GAME OVER';
    clearInterval(timerId);
  }
};

