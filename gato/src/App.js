import { useState } from 'react';
import React from 'react';

//  UTILIDAD: Lógica de Ganador 
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

//  UTILIDAD: Lógica de Empate 
function checkTie(squares) {
  const winner = calculateWinner(squares);
  return !winner && squares.every(square => square !== null);
}

//  UTILIDAD: Reinicio de Estado 
function resetGameToEmpty() {
  return [Array(9).fill(null)];
}


//  COMPONENTE: Casilla (Square) 
function Square({ value, onSquareClick }) {
  const squareClass = `square ${value === 'X' ? 'square-x' : value === 'O' ? 'square-o' : ''}`;
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

//  COMPONENTE: Tablero (Board) 
function Board({ xIsNext, squares, onPlay, onGameEnd, onEasterEggTrigger }) {
  
  const [easterEggClicks, setEasterEggClicks] = useState([]);
  const EASTER_EGG_SEQUENCE = [0, 4, 8];

  function handleClick(i) {
    const winner = calculateWinner(squares);
    const isTie = checkTie(squares);

    // Lógica del Easter Egg al finalizar el juego
    if (winner || isTie) {
        const newClicks = [...easterEggClicks, i];
        setEasterEggClicks(newClicks);

        if (newClicks.length === EASTER_EGG_SEQUENCE.length) {
            const sequenceMatch = newClicks.every((click, index) => click === EASTER_EGG_SEQUENCE[index]);
            if (sequenceMatch) {
                onEasterEggTrigger();
                setEasterEggClicks([]);
            } else {
                setEasterEggClicks([]);
            }
        }
        return;
    }

    // Lógica normal de juego
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isTie = checkTie(squares);
  let status;

  if (winner) {
    status = '¡GANADOR: ' + winner + '!';
  } else if (isTie) {
    status = '¡EMPATE!';
  } else {
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      {(winner || isTie) && (
        <button 
            onClick={onGameEnd}
            style={{ 
                marginTop: '20px', 
                padding: '10px 20px', 
                fontSize: '1em', 
                backgroundColor: '#00bcd4', 
                color: '#333', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
            }}
        >
            Reiniciar Juego
        </button>
      )}
    </>
  );
}

//  COMPONENTE: Easter Egg Overlay 
function EasterEggOverlay({ onClose }) {
  return (
    <div className="easter-egg-overlay" onClick={onClose}>
      <div className="easter-egg-content" onClick={(e) => e.stopPropagation()}>
        <img src="jackpot.gif" alt="Jackpot!" style={{ maxWidth: '150px', marginBottom: '20px' }} />
        <p style={{fontSize: '0.8em', color: '#555'}}>hi</p>
        <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>SergioFoster 72959</p>
        <p style={{fontSize: '0.6em', opacity: '0.7', marginTop: '20px'}}>Haz clic fuera del recuadro para cerrar esto</p>
      </div>
    </div>
  );
}


//  COMPONENTE PRINCIPAL: Juego (Game) 
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const [showEasterEgg, setShowEasterEgg] = useState(false); 

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setShowEasterEgg(false);
  }

  function restartGame() {
    setHistory(resetGameToEmpty()); 
    setCurrentMove(0);
    setShowEasterEgg(false);
  }

  function triggerEasterEgg() {
    setShowEasterEgg(true);
  }


  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir hacia la jugada #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board 
            xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
            onGameEnd={restartGame}
            onEasterEggTrigger={triggerEasterEgg}
          />
        </div>
      </div>
      
      <div className="game-info-container">
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>

      {showEasterEgg && <EasterEggOverlay onClose={restartGame} />}
    </>
  );
}
