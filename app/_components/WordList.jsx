'use client'
import React from "react";

const WordList = ({ words, foundWords }) => {
  return (
    <div className="mt-4">
      <h3 className="font-bold text-lg mb-2">Find the Words:</h3>
      <ul>
        {words.map((word) => (
          <li
            key={word}
            className={`text-lg ${foundWords.includes(word) ? "line-through text-gray-400" : ""}`}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;

