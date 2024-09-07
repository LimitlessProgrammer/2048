document.addEventListener('DOMContentLoaded', function() {
    const boardSize = 4;
    let board = [];
    let score = 0;
    let gameOver = false;

    const gameBoard = document.getElementById('game-board');
    const gameOverDiv = document.getElementById('game-over');
    const restartBtn = document.getElementById('restart-btn');
    const scoreValue = document.getElementById('score-value');
    const mergeSound = document.getElementById('merge-sound');
    const gameOverSound = document.getElementById('game-over-sound');

    initializeBoard();
    addRandomTile();
    addRandomTile();
    updateBoard();

    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            board[i] = [];
            for (let j = 0; j < boardSize; j++) {
                board[i][j] = 0;
            }
        }
    }

    function addRandomTile() {
        let emptyCells = [];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({ x: i, y: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const value = board[i][j];
                const tile = document.createElement('div');
                tile.className = value === 0 ? 'tile' : `tile tile-${value}`;
                tile.textContent = value === 0 ? '' : value;
                tile.style.transform = 'scale(1.2)';
                setTimeout(() => { tile.style.transform = 'scale(1)'; }, 100);
                gameBoard.appendChild(tile);
            }
        }
        scoreValue.textContent = score;
    }

    function checkGameOver() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
                if (j < boardSize - 1 && board[i][j] === board[i][j + 1]) {
                    return false;
                }
                if (i < boardSize - 1 && board[i][j] === board[i + 1][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function handleKeyPress(event) {
        if (gameOver) return;
        
        let moved = false;

        switch (event.key) {
            case 'ArrowUp':
                moved = moveTiles('up');
                break;
            case 'ArrowDown':
                moved = moveTiles('down');
                break;
            case 'ArrowLeft':
                moved = moveTiles('left');
                break;
            case 'ArrowRight':
                moved = moveTiles('right');
                break;
        }

        if (moved) {
            addRandomTile();
            updateBoard();
            if (checkGameOver()) {
                gameOver = true;
                gameOverDiv.style.display = 'block';
                gameOverSound.play();
            }
        }
    }

    function moveTiles(direction) {
        let moved = false;
        let mergedThisTurn = false;

        switch (direction) {
            case 'up':
                for (let j = 0; j < boardSize; j++) {
                    for (let i = 1; i < boardSize; i++) {
                        if (board[i][j] !== 0) {
                            let currentRow = i;
                            while (currentRow > 0 && board[currentRow - 1][j] === 0) {
                                currentRow--;
                            }
                            if (currentRow > 0 && board[currentRow - 1][j] === board[i][j] && !mergedThisTurn) {
                                board[currentRow - 1][j] *= 2;
                                score += board[currentRow - 1][j];
                                board[i][j] = 0;
                                mergedThisTurn = true;
                                mergeSound.play();
                            } else if (currentRow !== i) {
                                board[currentRow][j] = board[i][j];
                                board[i][j] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'down':
                for (let j = 0; j < boardSize; j++) {
                    for (let i = boardSize - 2; i >= 0; i--) {
                        if (board[i][j] !== 0) {
                            let currentRow = i;
                            while (currentRow < boardSize - 1 && board[currentRow + 1][j] === 0) {
                                currentRow++;
                            }
                            if (currentRow < boardSize - 1 && board[currentRow + 1][j] === board[i][j] && !mergedThisTurn) {
                                board[currentRow + 1][j] *= 2;
                                score += board[currentRow + 1][j];
                                board[i][j] = 0;
                                mergedThisTurn = true;
                                mergeSound.play();
                            } else if (currentRow !== i) {
                                board[currentRow][j] = board[i][j];
                                board[i][j] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'left':
                for (let i = 0; i < boardSize; i++) {
                    for (let j = 1; j < boardSize; j++) {
                        if (board[i][j] !== 0) {
                            let currentCol = j;
                            while (currentCol > 0 && board[i][currentCol - 1] === 0) {
                                currentCol--;
                            }
                            if (currentCol > 0 && board[i][currentCol - 1] === board[i][j] && !mergedThisTurn) {
                                board[i][currentCol - 1] *= 2;
                                score += board[i][currentCol - 1];
                                board[i][j] = 0;
                                mergedThisTurn = true;
                                mergeSound.play();
                            } else if (currentCol !== j) {
                                board[i][currentCol] = board[i][j];
                                board[i][j] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
            case 'right':
                for (let i = 0; i < boardSize; i++) {
                    for (let j = boardSize - 2; j >= 0; j--) {
                        if (board[i][j] !== 0) {
                            let currentCol = j;
                            while (currentCol < boardSize - 1 && board[i][currentCol + 1] === 0) {
                                currentCol++;
                            }
                            if (currentCol < boardSize - 1 && board[i][currentCol + 1] === board[i][j] && !mergedThisTurn) {
                                board[i][currentCol + 1] *= 2;
                                score += board[i][currentCol + 1];
                                board[i][j] = 0;
                                mergedThisTurn = true;
                                mergeSound.play();
                            } else if (currentCol !== j) {
                                board[i][currentCol] = board[i][j];
                                board[i][j] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
        }
        
        return moved;
    }

    // Restart Game
    restartBtn.addEventListener('click', function() {
        gameOver = false;
        score = 0;
        initializeBoard();
        addRandomTile();
        addRandomTile();
        updateBoard();
        gameOverDiv.style.display = 'none';
    });

    // Listen for arrow key presses
    document.addEventListener('keydown', handleKeyPress);
});

