'use client'
import React, { useMemo } from "react";

const getWordDisplay = (word, difficulty) => {
  const wordLength = word.length;

  if (difficulty === "hard") {
    return "-".repeat(wordLength); 
  } else if (difficulty === "medium" && wordLength > 2) {
    const randomIndex = Math.floor(Math.random() * (wordLength - 2)) + 1;
    let displayedWord = "";
    for (let i = 0; i < wordLength; i++) {
      if ( i === wordLength - 1 || i === randomIndex) {
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

const WordList = ({ words, foundWords, difficulty }) => {
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
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">Find the Words:</h3>
      <ul className="grid grid-cols-5 grid-flow-row gap-4">
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
};

export default WordList;

