import React, { useState, useEffect } from 'react';
import './App.css';

// This helper computes grid properties based on the current window dimensions.
// It uses a 12x12 grid for small screens (width < 600px) and a 20x20 grid for larger screens.
// The grid container will take up 90% of the available window size (both width and height),
// ensuring that the grid fits without scrolling.
function getGridProps(width, height) {
  const gap = 5; // gap between cells in pixels
  // Use a breakpoint: if width < 600, use a 12x12 grid; otherwise, use a 20x20 grid.
  const gridSize = width < 600 ? 12 : 20;
  // Calculate available space: 90% of the window's width and height, take the smaller dimension
  const availableSize = Math.min(width * 0.7, height * 0.7);
  // Total gap space = (gridSize - 1) * gap; compute cell size so that the grid (cells + gaps) fits into availableSize.
  const cellSize = Math.floor((availableSize - (gridSize - 1) * gap) / gridSize);
  // Compute the actual grid container dimension.
  const computedSize = gridSize * cellSize + (gridSize - 1) * gap;
  return { gridSize, cellSize, gap, computedSize };
}

function App() {
  // Store window dimensions so we can recalc on resize.
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [gridProps, setGridProps] = useState(getGridProps(window.innerWidth, window.innerHeight));
  const { gridSize, cellSize, gap, computedSize } = gridProps;
  const totalCells = gridSize * gridSize;
  const bitsPerSelection = Math.log2(totalCells);

  // Update windowSize and gridProps on window resize.
  useEffect(() => {
    function handleResize() {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setWindowSize({ width: newWidth, height: newHeight });
      setGridProps(getGridProps(newWidth, newHeight));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game state
  const [target, setTarget] = useState(Math.floor(Math.random() * totalCells));
  const [startTime, setStartTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState([]);
  const [count, setCount] = useState(0);

  // When grid dimensions change, you might want to reset the game.
  useEffect(() => {
    setTarget(Math.floor(Math.random() * totalCells));
    setReactionTimes([]);
    setCount(0);
    setStartTime(Date.now());
  }, [gridSize, totalCells]);

  function handleCellClick(index) {
    if (index === target) {
      const reactionTime = (Date.now() - startTime) / 1000; // seconds
      setReactionTimes([...reactionTimes, reactionTime]);
      setCount(count + 1);
      setTarget(Math.floor(Math.random() * totalCells));
      setStartTime(Date.now());
    }
  }

  const averageReactionTime =
    reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;
  const bps = averageReactionTime > 0 ? bitsPerSelection / averageReactionTime : 0;

  return (
    <div className="App">
      <h1>Neuralink Webgrid Clone</h1>
      <p>Click the blue cell as fast as you can!</p>
      
      {/* New container to hold the stats and grid side-by-side */}
      <div className="container">
        <div className="stats">
          <p>Selections: {count}</p>
          <p>
            Average Reaction Time: {averageReactionTime ? averageReactionTime.toFixed(3) : '--'} seconds
          </p>
          <p>BPS: {bps ? bps.toFixed(2) : '--'}</p>
        </div>
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gridGap: `${gap}px`,
            margin: '20px',
            width: `${computedSize}px`,
            height: `${computedSize}px`
          }}
        >
          {[...Array(totalCells)].map((_, i) => (
            <div
              key={i}
              onClick={() => handleCellClick(i)}
              className={`cell ${i === target ? 'target' : ''}`}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
