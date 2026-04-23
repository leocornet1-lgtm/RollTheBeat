'use client'
import { useGameStore } from '@/store/gameStore'

export function RecapScreen() {
  const { state, playerId, nextRound } = useGameStore()
  const ranking = [...state.players].sort((a, b) => b.score - a.score)
  const isHost = playerId === state.hostId

  return (
    <section className="screen">
      <div className="card">
        <h2 className="section-title">🏆 Récap — Manche {state.currentRound + 1}</h2>
        <p className="subtitle">
          {state.round.guessed
            ? `✅ Deviné ! Morceau : ${state.round.selectedSong}`
            : `❌ Pas deviné — ${state.round.selectedSong}`}
        </p>
      </div>

      <div className="card">
        <h2 className="section-title">Classement</h2>
        <ol className="ranking-list">
          {ranking.map((p, i) => (
            <li key={p.id} className={`ranking-item ${i === 0 ? 'first' : ''}`}>
              <span className="rank">#{i + 1}</span>
              <span className="name">{p.name} {p.id === playerId ? <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>(toi)</span> : null}</span>
              <span className="score">{p.score} pts</span>
            </li>
          ))}
        </ol>
      </div>

      {state.history.length > 0 && (
        <div className="card">
          <h2 className="section-title">Historique</h2>
          <ul className="history-list">
            {state.history.map((h, i) => (
              <li key={i} className="history-item">
                Manche {h.round} — {h.song} ({h.instrument}) — {h.guessed ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isHost ? (
        <div className="actions">
          <button className="btn btn-primary" onClick={nextRound}>▶ Manche suivante</button>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="subtitle">⏳ En attente que l'hôte lance la manche suivante…</p>
        </div>
      )}
    </section>
  )
}
