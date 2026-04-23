'use client'
import { useGameStore } from '@/store/gameStore'

export function InterpreterScreen() {
  const { state, playerId, nextRound } = useGameStore()
  const round = state.round
  const t = state.timer
  const timerColor = t.value > 10 ? '#4ade80' : t.value > 5 ? '#facc15' : '#f87171'

  const phaseLabel = t.stage === 1
    ? '🎵 Phase 1 — Joue le morceau !'
    : '🤫 Phase 2 — Ne joue plus, laisse deviner…'

  return (
    <section className="screen">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2 className="section-title">🎸 Tu es l'interprète !</h2>
        <p style={{ fontSize: '0.85rem', color: t.stage === 1 ? 'var(--success)' : 'var(--warning)', fontWeight: 700, marginTop: 4 }}>
          {phaseLabel}
        </p>
      </div>

      <div className="card card-highlight">
        <p className="label">Morceau à jouer</p>
        <p className="value">{round.selectedSong}</p>
        <p className="label" style={{ marginTop: 12 }}>Instrument</p>
        <p className="value">{round.selectedInstrument}</p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p className="label">Timer — Phase {t.stage}</p>
        <p className="timer" style={{ color: timerColor }}>{t.value}s</p>
        <p className="subtitle" style={{ marginTop: 4 }}>
          {t.stage === 1 ? 'Les guessers peuvent démarrer le timer' : 'Phase 2 en cours'}
        </p>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={nextRound}>✅ Manche suivante</button>
      </div>
    </section>
  )
}
