import { Server, Socket } from 'socket.io'
import { GameState, Player, HistoryEntry, initialGameState } from './types'

const rooms = new Map<string, GameState>()
const timers = new Map<string, NodeJS.Timeout>()

const DEFAULT_CATALOG = {
  songs: [
    'Super Mario Bros Theme', 'Zelda - Song of Storms', 'Tetris Theme', 'Halo Theme',
    'Bohemian Rhapsody', 'Hotel California', 'Thriller', 'Take On Me', 'Wonderwall',
    'Smells Like Teen Spirit', 'Blinding Lights', 'Dancing Queen', 'Eye of the Tiger',
    'The Imperial March', 'Pirates of the Caribbean Theme', 'Rehab', 'Seven Nation Army',
    'My Heart Will Go On', 'Careless Whisper', 'Umbrella',
  ],
  instruments: ['Guitare', 'Piano', 'Batterie', 'Basse', 'Voix', 'Violon', 'Saxophone', 'Flûte'],
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function getRoomId(socket: Socket): string | undefined {
  return socket.data.roomId as string | undefined
}

function getRoom(socket: Socket): GameState | undefined {
  const roomId = getRoomId(socket)
  if (!roomId) return undefined
  return rooms.get(roomId)
}

function broadcast(io: Server, roomId: string) {
  const state = rooms.get(roomId)
  if (state) io.to(roomId).emit('state:update', { state })
}

function stopTimer(roomId: string) {
  const timer = timers.get(roomId)
  if (timer) {
    clearInterval(timer)
    timers.delete(roomId)
  }
}

function awardPoints(state: GameState, guesserId: string, stage: 1 | 2) {
  const guesserPts = stage === 1 ? 3 : 1
  const interpreterPts = stage === 1 ? 3 : 2

  state.players = state.players.map(p => {
    if (p.id === guesserId) return { ...p, score: p.score + guesserPts }
    if (p.id === state.round.interpreterId) return { ...p, score: p.score + interpreterPts }
    return p
  })
}

function startPhaseTimer(io: Server, roomId: string) {
  const state = rooms.get(roomId)
  if (!state) return
  stopTimer(roomId)

  state.timer.running = true
  broadcast(io, roomId)

  const timer = setInterval(() => {
    const s = rooms.get(roomId)
    if (!s) return

    s.timer.value = Math.max(0, s.timer.value - 1)
    io.to(roomId).emit('timer:update', { state: s })

    if (s.timer.value !== 0) return

    clearInterval(timer)
    timers.delete(roomId)
    s.timer.running = false

    if (s.timer.stage === 1) {
      s.timer.stage = 2
      s.timer.value = 20
      broadcast(io, roomId)
      setTimeout(() => {
        const current = rooms.get(roomId)
        if (current && current.phase === 'round' && current.timer.stage === 2 && !current.timer.running) {
          startPhaseTimer(io, roomId)
        }
      }, 1200)
    } else {
      s.phase = 'recap'
      s.timer.stage = 1
      s.timer.value = 20
      broadcast(io, roomId)
    }
  }, 1000)

  timers.set(roomId, timer)
}

function prepareNextRound(io: Server, roomId: string) {
  const state = rooms.get(roomId)
  if (!state) return

  const songs = state.catalog.songs.length ? state.catalog.songs : DEFAULT_CATALOG.songs
  const instruments = state.catalog.instruments.length ? state.catalog.instruments : DEFAULT_CATALOG.instruments

  const availableSongs = songs.filter(s => !state.usedPairs.includes(s))
  const songPool = availableSongs.length ? availableSongs : songs
  const selectedSong = songPool[Math.floor(Math.random() * songPool.length)]
  const selectedInstrument = instruments[Math.floor(Math.random() * instruments.length)]
  state.usedPairs.push(selectedSong)

  const currentInterpreterId = state.round.interpreterId ?? state.hostId
  const prevIdx = state.players.findIndex(p => p.id === currentInterpreterId)
  const nextIdx = prevIdx >= 0 ? (prevIdx + 1) % state.players.length : 0
  const nextInterpreterId = state.players[nextIdx]?.id ?? state.hostId

  state.players = state.players.map((p, i) => ({ ...p, role: i === nextIdx ? 'interpreter' : 'guesser' }))
  state.round = {
    selectedSong,
    selectedInstrument,
    interpreterId: nextInterpreterId,
    guessed: false,
    result: null,
  }
  state.phase = 'round'
  state.timer = { running: false, value: 20, stage: 1 }
  broadcast(io, roomId)
}

export function registerHandlers(io: Server, socket: Socket) {
  socket.on('room:create', ({ name }: { name: string }) => {
    const roomId = generateRoomId()
    const player: Player = {
      id: socket.id,
      name,
      role: 'host',
      score: 0,
      connected: true,
      jokers: { replay: 1, rerollListed: 1, rerollOutside: 1 },
    }

    const state: GameState = {
      ...initialGameState,
      roomId,
      hostId: socket.id,
      players: [player],
      phase: 'preparation',
      round: { ...initialGameState.round },
    }

    rooms.set(roomId, state)
    socket.join(roomId)
    socket.data.roomId = roomId
    socket.emit('room:created', { roomId, state })
  })

  socket.on('room:join', ({ roomId, name }: { roomId: string; name: string }) => {
    const state = rooms.get(roomId)
    if (!state) {
      socket.emit('room:error', { message: 'Room introuvable.' })
      return
    }
    if (state.phase !== 'preparation') {
      socket.emit('room:error', { message: 'La partie a déjà commencé.' })
      return
    }

    const player: Player = {
      id: socket.id,
      name,
      role: 'guesser',
      score: 0,
      connected: true,
      jokers: { replay: 1, rerollListed: 1, rerollOutside: 1 },
    }

    state.players.push(player)
    socket.join(roomId)
    socket.data.roomId = roomId
    socket.emit('room:joined', { state })
    broadcast(io, roomId)
  })

  socket.on('game:start', ({ catalog }: { catalog?: GameState['catalog'] }) => {
    const state = getRoom(socket)
    if (!state || socket.id !== state.hostId) return

    state.catalog = catalog && catalog.songs.length ? catalog : DEFAULT_CATALOG
    state.usedPairs = []
    state.history = []
    state.currentRound = 1
    state.players = state.players.map((p, i) => ({ ...p, role: i === 0 ? 'interpreter' : 'guesser' }))
    state.round = {
      selectedSong: null,
      selectedInstrument: null,
      interpreterId: state.players[0]?.id ?? state.hostId,
      guessed: false,
      result: null,
    }
    prepareNextRound(io, state.roomId)
  })

  socket.on('timer:start', () => {
    const state = getRoom(socket)
    if (!state || state.timer.running) return
    const me = state.players.find(p => p.id === socket.id)
    if (!me || me.role !== 'guesser') return
    if (state.phase !== 'round') return
    if (state.timer.stage !== 1 || state.timer.value !== 20) return
    startPhaseTimer(io, state.roomId)
  })

  socket.on('round:guess', ({ playerId }: { playerId: string }) => {
    const state = getRoom(socket)
    if (!state) return
    const stage = state.timer.stage as 1 | 2
    stopTimer(state.roomId)
    state.timer.running = false
    state.round.guessed = true
    state.round.result = 'good'
    awardPoints(state, playerId, stage)
    state.phase = 'recap'
    broadcast(io, state.roomId)
  })

  socket.on('round:next', () => {
    const state = getRoom(socket)
    if (!state) return
    stopTimer(state.roomId)
    state.history.push({
      round: state.currentRound,
      song: state.round.selectedSong ?? '',
      instrument: state.round.selectedInstrument ?? '',
      interpreterId: state.round.interpreterId,
      winnerId: null,
      guessed: state.round.guessed,
      points: {},
    } as HistoryEntry)
    state.currentRound += 1
    prepareNextRound(io, state.roomId)
  })

  socket.on('public:toggle', () => {
    const state = getRoom(socket)
    if (!state || socket.id !== state.hostId) return
    state.publicMode = !state.publicMode
    broadcast(io, state.roomId)
  })

  socket.on('joker:use', ({ playerId, jokerType }: { playerId: string; jokerType: string }) => {
    const state = getRoom(socket)
    if (!state) return
    const player = state.players.find(p => p.id === playerId)
    if (!player) return
    const key = jokerType as keyof typeof player.jokers
    if (player.jokers[key] > 0) {
      player.jokers[key] -= 1
      broadcast(io, state.roomId)
    }
  })

  socket.on('disconnect', () => {
    const state = getRoom(socket)
    if (!state) return
    const player = state.players.find(p => p.id === socket.id)
    if (player) {
      player.connected = false
      broadcast(io, state.roomId)
    }
  })
}
