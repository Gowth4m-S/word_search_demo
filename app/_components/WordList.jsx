'use client'
import React, { memo, useEffect, useMemo, useState } from "react";
import { useWordSearchStore } from "../store";

const getWordDisplay = (word, difficulty) => {
  const wordLength = word.length;

  if (difficulty === "hard") {
    const randomIndex = Math.floor(Math.random() * (wordLength - 2)) + 1;
    let displayedWord = "";
    for (let i = 0; i < wordLength; i++) {
      if (i === wordLength - 1 || i === randomIndex) {
        displayedWord += word[i];
      } else {
        displayedWord += "-";
      }
    }
    return displayedWord;
    // return "-".repeat(wordLength); 
  } else if (difficulty === "medium" && wordLength > 2) {
    const randomIndex = Math.floor(Math.random() * (wordLength - 2)) + 1;
    let displayedWord = "";
    for (let i = 0; i < wordLength; i++) {
      if (i == 0 || i === wordLength - 1 || i === randomIndex) {
        displayedWord += word[i];
      } else {
        displayedWord += "-";
      }
    }
    return displayedWord;
  } else {
    return word;
  }
};

const WordList = memo(({words}) => {
  const gameData = useWordSearchStore(s => s.gameData)
  const [foundWords, setFoundWords] = useState(gameData.foundWords)
  const [difficulty, setDifficulty] = useState(gameData.difficulty)
  // const words = gameData.words
  // const foundWords = gameData.foundWords
  // const difficulty = gameData.difficulty

  useEffect(() => {
    setFoundWords(gameData.foundWords)
    setDifficulty(gameData.difficulty)
  },[gameData])

  const wordsDifficultyDisplay = useMemo(() => {
    const tempWords = words.map((word) => {
      const displayWords = {
        display: getWordDisplay(word, difficulty),
        word: word
      }
      return displayWords
    })
    return tempWords
  }, [words])

  return (
    <div className="mt-4 max-w-[250px] mx-auto">
      <h3 className="font-bold text-lg mb-2">Find the Words:</h3>
      <ul className="flex items-center flex-wrap gap-2">
        {wordsDifficultyDisplay.map((data) => (
          <li
            key={data.word}
            className={`text-lg font-semibold ${foundWords.includes(data.word) ? "line-through text-gray-400" : ""}`}
          >
            {data.display}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default WordList;

