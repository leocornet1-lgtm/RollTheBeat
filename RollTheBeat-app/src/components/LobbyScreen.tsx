'use client'
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export function LobbyScreen() {
  const { createRoom, joinRoom, error } = useGameStore()
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [tab, setTab] = useState<'create' | 'join'>('create')

  const handleCreate = () => {
    if (!name.trim()) return
    createRoom(name.trim())
  }

  const handleJoin = () => {
    if (!name.trim() || !roomCode.trim()) return
    joinRoom(roomCode.trim(), name.trim())
  }

  return (
    <section className="screen">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 className="title">🎲 Roll The Beat</h1>
        <p className="subtitle">Le jeu musical en temps réel</p>
      </div>

      <div className="card">
        <label className="label" htmlFor="name">Ton prénom</label>
        <input
          id="name"
          className="input"
          type="text"
          placeholder="Ex: Léo"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
        />
      </div>

      <div className="tab-row">
        <button
          className={`tab-btn ${tab === 'create' ? 'active' : ''}`}
          onClick={() => setTab('create')}
        >
          ✨ Créer une room
        </button>
        <button
          className={`tab-btn ${tab === 'join' ? 'active' : ''}`}
          onClick={() => setTab('join')}
        >
          🔗 Rejoindre
        </button>
      </div>

      {tab === 'create' && (
        <div className="card">
          <p className="subtitle" style={{ marginBottom: 16 }}>
            Tu seras l&apos;hôte de la partie. Les autres joueurs pourront te rejoindre avec le code room.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            ✨ Créer la room
          </button>
        </div>
      )}

      {tab === 'join' && (
        <div className="card">
          <label className="label" htmlFor="code">Code de la room</label>
          <input
            id="code"
            className="input"
            type="text"
            placeholder="Ex: AB12CD"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}
          />
          <button
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={handleJoin}
            disabled={!name.trim() || !roomCode.trim()}
          >
            🔗 Rejoindre la room
          </button>
        </div>
      )}

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>⚠️ {error}</p>
        </div>
      )}
    </section>
  )
}
