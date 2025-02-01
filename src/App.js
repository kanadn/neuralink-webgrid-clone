import React, { useState } from 'react';
import './App.css';

const gridSize = 10; // change this to 35 or any number for a larger grid
const totalCells = gridSize * gridSize;
const bitsPerSelection = Math.log2(totalCells);

function getRandomCell() {
  return Math.floor(Math.random() * totalCells);
}

function App() {
  const [target, setTarget] = useState(getRandomCell());
  const [startTime, setStartTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState([]);
  const [count, setCount] = useState(0);

  function handleCellClick(index) {
    // Only register the click if it is the target cell
    if (index === target) {
      const reactionTime = (Date.now() - startTime) / 1000; // in seconds
      setReactionTimes([...reactionTimes, reactionTime]);
      setCount(count + 1);
      setTarget(getRandomCell());
      setStartTime(Date.now());
    }
  }

  // Calculate average reaction time and BPS (bits per second)
  const averageReactionTime =
    reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;
  const bps = averageReactionTime > 0 ? bitsPerSelection / averageReactionTime : 0;

  return (
    <div className="App">
      <h1>Neuralink Webgrid Clone</h1>
      <p>Click the blue cell as fast as you can!</p>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 40px)`,
          gridGap: '5px',
          justifyContent: 'center',
          margin: '20px auto',
          maxWidth: gridSize * 45,
        }}
      >
        {[...Array(totalCells)].map((_, i) => (
          <div
            key={i}
            onClick={() => handleCellClick(i)}
            className={`cell ${i === target ? 'target' : ''}`}
          />
        ))}
      </div>
      <div className="stats">
        <p>Selections: {count}</p>
        <p>
          Average Reaction Time: {averageReactionTime ? averageReactionTime.toFixed(3) : '--'} seconds
        </p>
        <p>BPS: {bps ? bps.toFixed(2) : '--'}</p>
      </div>
    </div>
  );
}

export default App;
