'use client'
import { useGameStore } from '@/store/gameStore'
import { CatalogConfig } from '@/components/CatalogConfig'

export function PreparationScreen() {
  const { state, playerId, startGameWithCatalog, togglePublic } = useGameStore()
  const isHost = playerId === state.hostId

  return (
    <section className="screen">
      <div className="card">
        <h1 className="title">🎲 Roll The Beat</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <p className="subtitle">Room : <strong style={{ letterSpacing: '0.1em', fontSize: '1.1rem', color: 'var(--text)' }}>{state.roomId}</strong></p>
          <span style={{ fontSize: '0.85rem', color: state.publicMode ? 'var(--success)' : 'var(--muted)' }}>
            {state.publicMode ? '🌍 Public' : '🔒 Privé'}
          </span>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Joueurs ({state.players.length})</h2>
        <ul className="player-list">
          {state.players.map(p => (
            <li key={p.id} className="player-item">
              <span>
                {p.name}
                {p.id === playerId && <span style={{ color: 'var(--primary)', fontSize: '0.8rem', marginLeft: 6 }}>(toi)</span>}
                {p.id === state.hostId && <span style={{ color: 'var(--warning)', fontSize: '0.8rem', marginLeft: 4 }}>👑</span>}
              </span>
              <span style={{ color: p.connected ? 'var(--success)' : 'var(--muted)', fontSize: '0.8rem' }}>
                {p.connected ? '● connecté' : '○ déco'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {isHost ? (
        <>
          <div className="actions" style={{ flexDirection: 'row' }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={togglePublic}>
              {state.publicMode ? '🔒 Passer en privé' : '🌍 Passer en public'}
            </button>
          </div>
          <CatalogConfig onValidate={(catalog) => startGameWithCatalog(catalog)} />
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="subtitle">⏳ En attente que l'hôte configure et démarre la partie…</p>
        </div>
      )}
    </section>
  )
}
