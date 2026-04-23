export type GamePhase = 'lobby' | 'preparation' | 'round' | 'recap'
export type PlayerRole = 'host' | 'interpreter' | 'guesser'
export type JokerType = 'replay' | 'rerollListed' | 'rerollOutside'

export interface JokerInventory {
  replay: number
  rerollListed: number
  rerollOutside: number
}

export interface Player {
  id: string
  name: string
  role: PlayerRole
  score: number
  connected: boolean
  jokers: JokerInventory
}

export interface RoundState {
  selectedSong: string | null
  selectedInstrument: string | null
  interpreterId: string | null
  guessed: boolean
  result: 'good' | 'bad' | null
}

export interface HistoryEntry {
  round: number
  song: string
  instrument: string
  interpreterId: string | null
  winnerId: string | null
  guessed: boolean
  points: Record<string, number>
}

export interface GameState {
  roomId: string
  phase: GamePhase
  publicMode: boolean
  hostId: string | null
  currentRound: number
  players: Player[]
  catalog: { songs: string[]; instruments: string[] }
  round: RoundState
  history: HistoryEntry[]
  usedPairs: string[]
  remaining: { availableSongs: string[] }
  timer: { running: boolean; value: number; stage: 1 | 2 }
}

export const initialGameState: GameState = {
  roomId: '',
  phase: 'lobby',
  publicMode: false,
  hostId: null,
  currentRound: 0,
  players: [],
  catalog: { songs: [], instruments: [] },
  round: {
    selectedSong: null,
    selectedInstrument: null,
    interpreterId: null,
    guessed: false,
    result: null,
  },
  history: [],
  usedPairs: [],
  remaining: { availableSongs: [] },
  timer: { running: false, value: 20, stage: 1 },
}
