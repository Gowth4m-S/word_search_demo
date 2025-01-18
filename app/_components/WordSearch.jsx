'use client'

import React, { useState, useEffect, useRef } from "react";
import Grid from "./Grid";
import WordList from "./WordList";
import { useWordSearchStore } from "../store";

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

  const isValidPosition = (row, col, dx, dy, word) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;

      if (
        newRow < 0 || newRow >= gridSize ||
        newCol < 0 || newCol >= gridSize ||
        (grid[newRow][newCol] && grid[newRow][newCol] !== word[i])
      ) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (row, col, dx, dy, word) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      grid[newRow][newCol] = word[i];
    }
  };

  const shuffledPositions = Array.from({ length: gridSize }, (_, i) => i).sort(
    () => Math.random() - 0.5
  );

  const shuffledDirections = directions.sort(() => Math.random() - 0.5);

  words.forEach((word) => {
    let placed = false;

    for (let row of shuffledPositions) {
      if (placed) break;
      for (let col of shuffledPositions) {
        if (placed) break;

        for (const [dx, dy] of shuffledDirections) {
          if (isValidPosition(row, col, dx, dy, word)) {
            placeWord(row, col, dx, dy, word);
            placed = true;
            break;
          }
        }
      }
    }

    if (!placed) {
      throw new Error(`Could not place word: ${word}`);
    }
  });

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
};

const getGridSize = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 7;
    case 'medium':
      return 12
    case 'hard':
      return 15
  }
}

const WordSearch = ({ difficulty, words }) => {
  const gridSize = getGridSize(difficulty)
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const containerRef = useRef(null)
  const createGame = useWordSearchStore(s => s.createGame)
  const gameData = useWordSearchStore(s => s.gameData)
  const updateGameData = useWordSearchStore(s => s.updateGameData)
  const fetchGameData = useWordSearchStore(s => s.fetchGameData)

  // useEffect(() => {
  //   if (gridSize && words.length > 0) {
  //     const grids = generateGrid(words, gridSize)
  //     setGrid(grids);
  //   }
  // }, [gridSize]);

  useEffect(() => {
    fetchGameData()
  }, [])
  useEffect(() => {
    if (gameData.difficultyChoosen) {
      setFoundWords(gameData.foundWords)
      setGrid(gameData.grids)
    }
    else {
      const grids = generateGrid(words, gridSize)
      setGrid(grids);
      createGame(difficulty, words, grids)
    }
  }, [gameData, gridSize])

  const handleWordFound = (word, cells) => {
    if (!foundWords.includes(word)) {
      let updatedFoundWords = [...foundWords, word]
      setFoundWords(updatedFoundWords)
      // setFoundWords((prev) => {
      //   updatedFoundWords = [...prev, word]
      //   return updatedFoundWords
      // });
      updateGameData({ foundWords: updatedFoundWords })
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-scroll flex flex-col items-center justify-center bg-blue-500 p-4">
      {grid.length > 0 && (
        <Grid grid={grid} words={words} onWordFound={handleWordFound} gridSize={gridSize} />
      )}
      <WordList words={words} foundWords={foundWords} difficulty={difficulty} />
    </div>
  );
};

export default WordSearch;

