import { create, createStore } from 'zustand'
import { v4 as uuidv4 } from 'uuid';

const initalGameData = {
  _id: '',
  difficulty: 'easy',
  difficultyChoose: false,
  foundWords: [],
  foundWordsStyles: [],
  grids: [],
  words: [],
}

export const useWordSearchStore = create((set, get) => ({
  gameData: initalGameData,
  gameWon: false,
  gameTime: 0,
  createGame: (difficulty, words, grids) => {
    console.log(words)
    const createGameData = {
      _id: uuidv4(),
      difficulty,
      difficultyChoosen: true,
      words,
      grids,
      foundWords: [],
      foundWordsStyles: []
    }
    const time = 0
    set({ gameData: createGameData })
    window.localStorage.setItem('wordSearch', JSON.stringify(createGameData))
    window.localStorage.setItem('wordSearchGameTime', JSON.stringify({ current: time }))
  },
  fetchGameData: () => {
    const data = JSON.parse(window.localStorage.getItem('wordSearch'))
    const currentTime = JSON.parse(window.localStorage.getItem('wordSearchGameTime'))
    if (data) {
      set({ gameData: data })
    }
    if (currentTime) {
      set({ gameTime: currentTime.current })
    }
  },
  updateGameData: (data) => {
    set(state => ({ gameData: { ...state.gameData, ...data } }))
    const gameData = get().gameData
    window.localStorage.setItem('wordSearch', JSON.stringify(gameData))
    const wordsLength = gameData.words.length
    const foundWordLength = gameData.foundWords.length
    if (wordsLength > 0 && (wordsLength === foundWordLength)) {
      set({ gameWon: true })
      window.localStorage.removeItem('wordSearch')
    }

  },
  resetGameData: () => {
    window.localStorage.removeItem('wordSearch')
    window.localStorage.removeItem('wordSearchGameTime')
  },
  updateGameTime: () => {
    const time = get().gameTime
    window.localStorage.setItem('wordSearchGameTime', JSON.stringify({ current: time }))
  },
  setGameTime: (time) => {
    set({ gameTime: time })
  }

}))
