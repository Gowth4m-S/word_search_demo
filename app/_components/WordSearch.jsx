'use client'

import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import WordList from "./WordList";

const generateGrid = (words, gridSize) => {
  const grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(null)
  );

  const directions = [
    [0, 1], 
    [1, 0], 
    [1, 1], 
    [1, -1],
  ];

  const placeWordInGrid = (word) => {
    const wordLength = word.length;
    let placed = false;

    while (!placed) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];

      if (
        row + dx * (wordLength - 1) >= 0 &&
        row + dx * (wordLength - 1) < gridSize &&
        col + dy * (wordLength - 1) >= 0 &&
        col + dy * (wordLength - 1) < gridSize
      ) {
        let fits = true;

        for (let i = 0; i < wordLength; i++) {
          const newRow = row + dx * i;
          const newCol = col + dy * i;

          if (grid[newRow][newCol] && grid[newRow][newCol] !== word[i]) {
            fits = false;
            break;
          }
        }

        if (fits) {
          for (let i = 0; i < wordLength; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            grid[newRow][newCol] = word[i];
          }
          placed = true;
        }
      }
    }
  };

  words.forEach((word) => placeWordInGrid(word));

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
      }
    }
  }

  return grid;
};

const WordSearch = () => {
  const gridSize = 10; 
  const words = ["ARM", "BANJO", "CATCH", "FOE", "LIB", "MAPLE", "MICRO", "MOON", "PILOT", "PLUM", "REEF", "UNZIP"];
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  useEffect(() => {
    setGrid(generateGrid(words, gridSize));
  }, []);

  const handleWordFound = (word, cells) => {
    if (!foundWords.includes(word)) {
      setFoundWords((prev) => [...prev, word]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-500 p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Word Puzzle Game</h1>
      {grid.length > 0 && (
        <Grid grid={grid} words={words} onWordFound={handleWordFound} gridSize={gridSize} />
      )}
      <WordList words={words} foundWords={foundWords} />
    </div>
  );
};

export default WordSearch;

