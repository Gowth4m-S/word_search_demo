'use client'

import { useEffect, useState } from "react"
import WordSearch from "./WordSearch"
import { useWordSearchStore } from "../store";

const difficulties = ['easy', 'medium', 'hard']

const wordBank = {
  easy: [
    "CAT", "DOG", "SUN", "CAR", "BEE",
    "HAT", "BAT", "FISH", "CUP", "FOX",
    // "BAG", "KEY", "PEN", "TOY", "BED"
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
    // "FIREFIGHTER", "ASTRONAUT", "VOLCANO", "PYRAMID", "BULLETIN"
  ]
};


export default function DifficultyChoose() {

  const [difficultyChoose, setDifficutlyChoosen] = useState(false)
  const [difficulty, setDifficutly] = useState('easy')
  const [words, setWords] = useState([])
  const fetchGameData = useWordSearchStore(s => s.fetchGameData)
  const gameData = useWordSearchStore(s => s.gameData)
  const resetGameData = useWordSearchStore(s => s.resetGameData)

  const handleClick = (difficulty) => {
    setWords(wordBank[difficulty])
    setDifficutly(difficulty)
    setDifficutlyChoosen(true)
  }
  useEffect(() => {
    fetchGameData()

  }, [])

  useEffect(() => {
    if (gameData.difficultyChoosen) {
      setDifficutlyChoosen(true)
      setDifficutly(gameData.difficulty)
      setWords(gameData.words)
    }

  }, [gameData])


  return (
    <div className="">
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
            <button className="bg-white p-4 rounded-xl" onClick={() => {
              resetGameData()
              window.location.reload()
            }}>New Game</button>
            <WordSearch difficulty={difficulty} words={words} />
          </>
      }
    </div >
  )

}
