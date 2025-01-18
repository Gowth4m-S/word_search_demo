'use client'

import React, { useState, useEffect, useRef } from "react";
import Grid from "./Grid";
import WordList from "./WordList";
import { useWordSearchStore } from "../store";


const WordSearch = ({ difficulty, wordsChoosen, gridSize }) => {
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const containerRef = useRef(null)
  const createGame = useWordSearchStore(s => s.createGame)
  const gameData = useWordSearchStore(s => s.gameData)
  const updateGameData = useWordSearchStore(s => s.updateGameData)
  const [words, setWords] = useState(gameData.words)
  const fetchGameData = useWordSearchStore(s => s.fetchGameData)
  const wordsRef = useRef(gameData.words)


  useEffect(() => {
    fetchGameData()
  }, [])
  useEffect(() => {
    if (gameData.difficultyChoosen) {
      setFoundWords(gameData.foundWords)
      setGrid(gameData.grids)
      setWords(gameData.words)
    }
  }, [gameData,gridSize])

  const handleWordFound = (word, cells) => {
    if (!foundWords.includes(word)) {
      let updatedFoundWords = [...foundWords, word]
      setFoundWords(updatedFoundWords)
      updateGameData({ foundWords: updatedFoundWords })
    }
  };

  return (
    <div ref={containerRef} className="">
      {grid.length > 0 && (
        <Grid onWordFound={handleWordFound} gridSize={gridSize} />
      )}
      <WordList words={words} />
    </div>
  );
};

export default WordSearch;

