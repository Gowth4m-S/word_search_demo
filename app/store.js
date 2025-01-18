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
  createGame: (difficulty, words, grids) => {
    const createGameData = {
      _id: uuidv4(),
      difficulty,
      difficultyChoosen: true,
      words,
      grids,
      foundWords: [],
      foundWordsStyles: []
    }
    set({ gameData: createGameData })
    window.localStorage.setItem('wordSearch', JSON.stringify(createGameData))
  },
  fetchGameData: () => {
    const data = JSON.parse(window.localStorage.getItem('wordSearch'))
    if (data) {
      set({ gameData: data })
    }
  },
  updateGameData: (data) => {
    set(state => ({ gameData: { ...state.gameData, ...data } }))
    const gameData = get().gameData
    window.localStorage.setItem('wordSearch', JSON.stringify(gameData))
  },
  resetGameData: () => {
    window.localStorage.removeItem('wordSearch')

  }

}))
