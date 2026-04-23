'use client'
import { create } from 'zustand'
import type { GameState } from '@/types/game'
import { initialGameState } from '@/types/game'
import { getSocket } from '@/lib/socket'

type GameStore = {
  state: GameState
  playerId: string | null
  playerName: string | null
  connected: boolean
  error: string | null
  setPlayerName: (name: string) => void
  createRoom: (name: string) => void
  joinRoom: (roomId: string, name: string) => void
  startGameWithCatalog: (catalog: GameState['catalog']) => void
  startRound: () => void
  guess: () => void
  nextRound: () => void
  togglePublic: () => void
  startTimer: () => void
  stopTimer: () => void
  useJoker: (jokerType: string) => void
}

function bindSocketEvents(set: any) {
  const socket = getSocket()
  socket.off('state:update')
  socket.off('timer:update')
  socket.off('room:error')
  socket.on('state:update', ({ state }: { state: GameState }) => set({ state }))
  socket.on('timer:update', ({ state }: { state: GameState }) => set({ state }))
  socket.on('room:error', ({ message }: { message: string }) => set({ error: message }))
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: initialGameState,
  playerId: null,
  playerName: null,
  connected: false,
  error: null,

  setPlayerName: (name) => set({ playerName: name }),

  createRoom: (name) => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()
    bindSocketEvents(set)
    socket.off('room:created')
    socket.on('room:created', ({ state }: { state: GameState }) => {
      set({ playerId: socket.id ?? null, state, connected: true, error: null })
    })
    socket.emit('room:create', { name })
  },

  joinRoom: (roomId, name) => {
    const socket = getSocket()
    if (!socket.connected) socket.connect()
    bindSocketEvents(set)
    socket.off('room:joined')
    socket.on('room:joined', ({ state }: { state: GameState }) => {
      set({ playerId: socket.id ?? null, state, connected: true, error: null })
    })
    socket.emit('room:join', { roomId: roomId.toUpperCase(), name })
  },

  startGameWithCatalog: (catalog) => {
    const socket = getSocket()
    socket.emit('game:start', { catalog })
  },

  startRound: () => getSocket().emit('round:start'),
  guess: () => { const { playerId } = get(); getSocket().emit('round:guess', { playerId }) },
  nextRound: () => getSocket().emit('round:next'),
  togglePublic: () => getSocket().emit('public:toggle'),
  startTimer: () => getSocket().emit('timer:start'),
  stopTimer: () => getSocket().emit('timer:stop'),
  useJoker: (jokerType) => { const { playerId } = get(); getSocket().emit('joker:use', { playerId, jokerType }) },
}))
