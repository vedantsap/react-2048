import { useReducer, useEffect, useCallback } from 'react';
import './App.css';
import Tile from './Tile';

// need to export these actions because they will be used outside of this component too
export const ACTIONS = {
  PUSH_LEFT: 'left',
  PUSH_UP: 'up',
  PUSH_RIGHT: 'right',
  PUSH_DOWN: 'down'
}

function reducer(state, action) {
  switch (action.type) {

    case ACTIONS.PUSH_LEFT:
      console.log("left")
      const { scoreDelta: scoreDelta_left, matrix: updatedMatrix_left } = aggregateLeft(state.matrix)
      const currentScore_left = state.score
      console.log(updatedMatrix_left)
      const { matrix: updatedMatrixWithNewRandom_left } = addRandom(updatedMatrix_left)
      return {
        ...state,
        score: currentScore_left + scoreDelta_left,
        matrix: updatedMatrixWithNewRandom_left,
      }

    case ACTIONS.PUSH_UP:
      console.log("up")
      const { matrix: rotatedMatrix_up } = rotate(1, state.matrix)
      const { scoreDelta: scoreDelta_up, matrix: updatedMatrix_up } = aggregateLeft(rotatedMatrix_up)
      const currentScore_up = state.score
      console.log(updatedMatrix_up)
      const { matrix: updatedMatrixWithNewRandom_up } = addRandom(updatedMatrix_up)
      const { matrix: rotatedUpdatedMatrixWithNewRandom_up } = rotate(3, updatedMatrixWithNewRandom_up)
      return {
        ...state,
        score: currentScore_up + scoreDelta_up,
        matrix: rotatedUpdatedMatrixWithNewRandom_up,
      }

    case ACTIONS.PUSH_RIGHT:
      console.log("right")
      const { matrix: rotatedMatrix_right } = rotate(2, state.matrix)
      const { scoreDelta: scoreDelta_right, matrix: updatedMatrix_right } = aggregateLeft(rotatedMatrix_right)
      const currentScore_right = state.score
      console.log(updatedMatrix_right)
      const { matrix: updatedMatrixWithNewRandom_right } = addRandom(updatedMatrix_right)
      const { matrix: rotatedUpdatedMatrixWithNewRandom_right } = rotate(2, updatedMatrixWithNewRandom_right)
      return {
        ...state,
        score: currentScore_right + scoreDelta_right,
        matrix: rotatedUpdatedMatrixWithNewRandom_right,
      }

    case ACTIONS.PUSH_DOWN:
      console.log("down")
      const { matrix: rotatedMatrix_down } = rotate(3, state.matrix)
      const { scoreDelta: scoreDelta_down, matrix: updatedMatrix_down } = aggregateLeft(rotatedMatrix_down)
      const currentScore_down = state.score
      console.log(updatedMatrix_down)
      const { matrix: updatedMatrixWithNewRandom_down } = addRandom(updatedMatrix_down)
      const { matrix: rotatedUpdatedMatrixWithNewRandom_down } = rotate(1, updatedMatrixWithNewRandom_down)
      return {
        ...state,
        score: currentScore_down + scoreDelta_down,
        matrix: rotatedUpdatedMatrixWithNewRandom_down,
      }

    default:
      return state
  }
}

// rotate anticlockwise n times
function rotate(n, matrix) {
  for (let i = 0; i < n; i++) {
    // flip along y-axis
    for (let j = 0; j < 4; j++) {
      matrix[j].reverse()
    }
    // transpose
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        let temp = matrix[i][j]
        matrix[i][j] = matrix[j][i]
        matrix[j][i] = temp
      }
    }
  }
  return { matrix: matrix }
}

function aggregateLeft(matrixCopy) {
  let scoreDelta = 0
  let m = new Array(4);
  for (let i = 0; i < 4; i++) {
    m[i] = new Array(4).fill(0);
  }
  for (let i = 0; i < 4; i++) {
    let queue = []
    for (let j = 0; j < 4; j++) {
      if (matrixCopy[i][j] !== 0) queue.push(matrixCopy[i][j])
    }
    let prev = 0
    let k = 0
    while (queue.length > 0) {
      if (prev === 0) {
        prev = queue.shift()
      } else {
        let top = queue.shift()
        if (prev === top) {
          m[i][k] = prev + top
          scoreDelta += m[i][k]
          k++
          prev = 0
        } else {
          m[i][k++] = prev
          prev = top
        }
      }
    }
    if (prev !== 0) m[i][k++] = prev
    while (k < 4) m[i][k++] = 0
  }
  return { scoreDelta: scoreDelta, matrix: m }
}

function addRandom(m) {
  const empty = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (m[i][j] === 0) empty.push([i, j]);
    }
  }
  // TODO if empty.length===0: GAME OVER
  const randomIndex = Math.floor(Math.random() * (empty.length - 1))
  m[empty[randomIndex][0]][empty[randomIndex][1]] = randomFill()
  return { matrix: m }
}

// TODO
function randomFill() {
  return 2
}

function App() {

  // The third parameter is the initial state definition
  const [{ score, matrix }, dispatch] = useReducer(reducer, {}, () => {
    const matrix = new Array(4);
    for (let i = 0; i < 4; i++) {
      matrix[i] = new Array(4).fill(0);
    }
    let index = Math.floor(Math.random() * 16)
    matrix[parseInt(index / 4)][parseInt(index % 4)] = randomFill()
    return { score: 0, matrix };
  })

  // The use callback prevent re-renders
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowLeft':
        dispatch({ type: ACTIONS.PUSH_LEFT })
        break;
      case 'ArrowUp':
        dispatch({ type: ACTIONS.PUSH_UP })
        break;
      case 'ArrowRight':
        dispatch({ type: ACTIONS.PUSH_RIGHT })
        break;
      case 'ArrowDown':
        dispatch({ type: ACTIONS.PUSH_DOWN })
        break;
      default:
        break;
    }
  }, [dispatch]);

  document.addEventListener('keydown', handleKeyDown);

  const tiles = []
  for (var tile = 0; tile < 16; tile++) {
    tiles.push(<Tile id={tile} value={matrix[parseInt(tile / 4)][parseInt(tile % 4)]} />)
  }

  return (
    <div>
      <div className='scoreboard'>
        <div className='score'> Score: {score}</div>
      </div>
      <div className='grid'>
        {tiles}
      </div>
    </div>
  )
}

export default App;