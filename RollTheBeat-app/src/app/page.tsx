'use client'
import { useGameStore } from '@/store/gameStore'
import { LobbyScreen } from '@/components/LobbyScreen'
import { PreparationScreen } from '@/components/PreparationScreen'
import { InterpreterScreen } from '@/components/InterpreterScreen'
import { GuessersScreen } from '@/components/GuessersScreen'
import { RecapScreen } from '@/components/RecapScreen'

export default function Page() {
  const { state, playerId } = useGameStore()

  if (state.phase === 'lobby') return <LobbyScreen />
  if (state.phase === 'preparation') return <PreparationScreen />
  if (state.phase === 'recap') return <RecapScreen />

  const me = state.players.find(p => p.id === playerId)
  if (me?.role === 'interpreter') return <InterpreterScreen />
  return <GuessersScreen />
}
