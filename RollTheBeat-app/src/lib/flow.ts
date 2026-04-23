import type { GameState, Player } from '@/types/game'
export type ViewName = 'PreparationScreen' | 'InterpreterScreen' | 'GuessersScreen' | 'RecapScreen'
export function getActivePlayer(state: GameState, playerId?: string | null): Player | null { return playerId ? state.players.find((p) => p.id === playerId) ?? null : null }
export function resolveView(state: GameState, playerId?: string | null): ViewName { if (state.phase === 'preparation') return 'PreparationScreen'; if (state.phase === 'recap') return 'RecapScreen'; const me = getActivePlayer(state, playerId); if (me?.role === 'interpreter' || me?.id === state.round.interpreterId) return 'InterpreterScreen'; return 'GuessersScreen' }
