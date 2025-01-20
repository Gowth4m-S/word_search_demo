'use client'

import { useEffect, useRef, useState } from "react"
import WordSearch from "./WordSearch"
import { useWordSearchStore } from "../store";

const difficulties = ['easy', 'medium', 'hard']

const wordBank = {
  easy: [
    "CAT", "DOG", "SUN", "CAR", "BEE",
    "HAT", "BAT", "FISH", "CUP", "FOX",
    "BAG", "KEY", "PEN", "TOY", "BED"
  ],
  medium: [
    "APPLE", "HOUSE", "TRAIN", "GLOVE", "WATER",
    "PENCIL", "CANDLE", "BREAD", "PLANT", "MOUSE",
    "TABLE", "SPOON", "PHONE", "CHAIR", "RIVER",
    "SHEEP", "BRUSH", "HORSE", "CLOUD", "STORM"
  ],
  hard: [
    "ELEPHANT", "UMBRELLA", "KANGAROO", "CROCODILE", "CARPENTER",
    "CHOCOLATE", "NOTEBOOK", "TELEPHONE", "BACKPACK", "HEADPHONES",
    "RAILROAD", "HOSPITAL", "CHEMISTRY", "DIAMOND", "LANTERN",
    "FIREFIGHTER", "ASTRONAUT", "VOLCANO", "PYRAMID", "BULLETIN"
  ]
};

const generateGrid = (words, gridSize) => {
  let updatedWords = [...words]
  const grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(null)
  );

  const directions = [
    [0, 1],   // Right
    [0, -1],  // Left
    [1, 0],   // Down
    [-1, 0],  // Up
    [1, 1],   // Down-right
    [-1, -1], // Up-left
    [1, -1],  // Down-left
    [-1, 1],  // Up-right
  ];

  const isValidPosition = (row, col, dx, dy, word) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;

      if (
        newRow < 0 || newRow >= gridSize || // Out of vertical bounds
        newCol < 0 || newCol >= gridSize || // Out of horizontal bounds
        (grid[newRow][newCol] && grid[newRow][newCol] !== word[i]) // Conflict
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

  words.forEach((word) => {
    let placed = false;

    // Try shuffled positions and directions first
    const shuffledPositions = Array.from({ length: gridSize }, (_, i) => i).sort(
      () => Math.random() - 0.5
    );
    const shuffledDirections = directions.sort(() => Math.random() - 0.5);

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

    // Fallback: Force place the word if randomized strategy fails
    if (!placed) {
      updatedWords = updatedWords.filter((w) => {
        return w !== word
      })
      // while (!placed) {
      //   console.log
      //   for (let row = 0; row < gridSize; row++) {
      //     for (let col = 0; col < gridSize; col++) {
      //       for (const [dx, dy] of directions) {
      //         if (isValidPosition(row, col, dx, dy, word)) {
      //           placeWord(row, col, dx, dy, word);
      //           placed = true;
      //         }
      //       }
      //     }
      //   }
      // }
    }

    // As the grid is large enough, it will always find a valid position
  });

  // Fill empty cells with random letters
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random A-Z
      }
    }
  }

  return [grid, updatedWords];
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

export default function DifficultyChoose() {

  // const [difficultyChoose, setDifficutlyChoosen] = useState(false)
  // const [difficulty, setDifficutly] = useState('easy')
  const gameData = useWordSearchStore(s => s.gameData)
  const timeElapsed = useWordSearchStore(s => s.gameTime)
  const difficultyChoose = gameData.difficultyChoosen
  const difficulty = gameData.difficulty
  const [words, setWords] = useState(gameData.words)
  const updateGameTime = useWordSearchStore(s => s.updateGameTime)
  const updateGameData = useWordSearchStore(s => s.updateGameData)
  // const [timeElapsed, setTimeElapsed] = useState(0);
  const fetchGameData = useWordSearchStore(s => s.fetchGameData)
  const resetGameData = useWordSearchStore(s => s.resetGameData)
  const createGame = useWordSearchStore(s => s.createGame)
  const gameWon = useWordSearchStore(s => s.gameWon)
  const timeRef = useRef(timeElapsed)
  const setGameTime = useWordSearchStore(s => s.setGameTime)
  const [gridSize, setGridSize] = useState(7)

  const handleClick = (difficulty) => {
    setWords(wordBank[difficulty])
    // setDifficutly(difficulty)
    // setDifficutlyChoosen(true)
    const gridSizeget = getGridSize(difficulty)
    const [grids, updatedWords] = generateGrid(wordBank[difficulty], gridSizeget)
    setGridSize(gridSizeget)
    createGame(difficulty, updatedWords, grids , gridSizeget)
  }
  useEffect(() => {
    fetchGameData()
  }, [])

  useEffect(() => {
    let time = 0
    if (!gameData.difficultyChoosen) return;
    let interval;
    let interval2;

    if (!gameWon) {
      interval = setInterval(() => {
        setGameTime(timeRef.current + 1)
        timeRef.current += 1
        // setTimeElapsed((prev) => {
        //   return timeRef.current
        // });
      }, 1000);

      interval2 = setInterval(() => {
        updateGameTime()
      }, 5000)
    }

    return () => {
      clearInterval(interval)
      clearInterval(interval2)
    };
  }, [gameData.difficultyChoosen, gameWon]);

  useEffect(() => {
    if (timeElapsed) {
      timeRef.current = timeElapsed
    }
  }, [timeElapsed])

  useEffect(() => {
    if(gameData.difficultyChoosen){
      setGridSize(gameData.gridSize)
    }

  },[gameData.gridSize])
  // console.log('hi')


  return (
    <div className="min-h-dvh  flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-4">Word Puzzle Game</h1>
      {
        !difficultyChoose ?
          <div className="flex flex-col gap-4 items-center">
            {difficulties.map((diff) => {
              return (
                <button key={diff} onClick={() => handleClick(diff)} className="uppercase border p-4 bg-white rounded-xl">{diff}</button>
              )
            })}
          </div>
          :
          <>
            <div className="mb-4 text-black font-semibold text-lg">
              Timer: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
            </div>
            <button className="bg-white p-4 rounded-xl mb-4" onClick={() => {
              resetGameData()
              window.location.reload()
            }}>New Game</button>
            <WordSearch difficulty={difficulty} wordsChoosen={words} gridSize={gridSize} />
          </>
      }
      {gameWon &&
        <div className="absolute top-0 left-0 z-50 w-full h-full bg-black/30 flex items-center justify-center mx-auto">
          <div className="bg-white p-4 flex flex-col items-center">
            <p className="text-lg font-semibold">Game Won</p>
            <p>Time Taken:<span className="font-semibold ml-2">{Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</span></p>
            <button
              className="bg-blue-500 text-white p-4 rounded-xl"
              onClick={() => {
                window.location.reload()
              }}
            >New Game</button>
          </div>
        </div>
      }
    </div >
  )

}
