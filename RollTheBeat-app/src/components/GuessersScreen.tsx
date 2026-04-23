'use client'
import { useEffect, useMemo } from 'react'
import { useGameStore } from '@/store/gameStore'

function Rockometer({ value, max = 20 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(1, value / max))
  const angle = -90 + (1 - pct) * 180
  const tone = pct > 0.65 ? 'green' : pct > 0.3 ? 'yellow' : 'red'
  return (
    <div className={`rockometer ${tone}`}>
      <div className="rockometer-top" />
      <div className="rockometer-face">
        <div className="rockometer-zones"><span>SAFE</span><span>ROCK</span><span>RISK</span></div>
        <div className="rockometer-arc" />
        <div className="rockometer-needle" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} />
        <div className="rockometer-center" />
        <div className="rockometer-text">Beat Master</div>
      </div>
    </div>
  )
}

function GuitarNeck() {
  return (
    <div className="guitar-neck">
      <div className="guitar-neck__head" />
      <div className="guitar-neck__board">
        <div className="guitar-neck__strings" />
        <div className="guitar-neck__frets">{Array.from({ length: 8 }).map((_, i) => <span key={i} />)}</div>
        <div className="guitar-neck__lane">{Array.from({ length: 5 }).map((_, i) => <span key={i} />)}</div>
        <div className="guitar-neck__hit" />
      </div>
      <div className="guitar-neck__tail" />
    </div>
  )
}

export function GuessersScreen() {
  const { state, playerId, guess, nextRound, startTimer, useJoker } = useGameStore()
  const current = state.players.find(p => p.id === state.round.interpreterId)
  const me = state.players.find(p => p.id === playerId)
  const t = state.timer
  const songs = (state.catalog as any)?.songs ?? (state.catalog as any)?.tracks ?? (state.currentRound as any)?.availableSongs ?? []

  useEffect(() => { console.log('[GuessersScreen] songs', songs) }, [songs])

  const phase1 = t.stage === 1
  const pointsLabel = phase1 ? '3 pts si tu devines' : '1 pt si tu devines'
  const phaseLabel = phase1 ? 'Phase 1 — Écoute et devine !' : 'Phase 2 — Dernière chance !'

  return (
    <section className="screen gh-shell">
      <div className="card gh-titlecard">
        <h2 className="gh-title">Devine le morceau !</h2>
        <p className="subtitle">Interprète : <strong>{current?.name}</strong></p>
        <p className="gh-subline">{phaseLabel} — <span>{pointsLabel}</span></p>
      </div>

      <GuitarNeck />

      <div className="gh-main-grid">
        <div className="card gh-rockocard">
          <p className="label">ROCK-O-MÈTRE</p>
          <Rockometer value={t.value} />
          {!t.running && phase1 && t.value === 20 && <button className="btn btn-primary gh-btn" onClick={startTimer}>▶ Démarrer le timer</button>}
          {t.running && <p className="subtitle">Phase {t.stage} en cours…</p>}
        </div>

        <div className="card gh-songcard">
          <h2 className="section-title">Morceaux possibles</h2>
          <div className="gh-songlist">
            {songs.length === 0 ? <div className="subtitle">Aucun morceau disponible.</div> : songs.map((song: string, i: number) => <div key={`${song}-${i}`} className="gh-songitem">{song}</div>)}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Jokers</h2>
        <div className="joker-row">
          <button className="btn btn-joker" disabled={(me?.jokers.replay ?? 0) <= 0} onClick={() => useJoker('replay')}>🔁 Rejouer ({me?.jokers.replay ?? 0})</button>
          <button className="btn btn-joker" disabled={(me?.jokers.rerollListed ?? 0) <= 0} onClick={() => useJoker('rerollListed')}>🎲 Relancer ({me?.jokers.rerollListed ?? 0})</button>
          <button className="btn btn-joker" disabled={(me?.jokers.rerollOutside ?? 0) <= 0} onClick={() => useJoker('rerollOutside')}>🃏 Hors liste ({me?.jokers.rerollOutside ?? 0})</button>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-success" onClick={guess}>✅ Morceau deviné !</button>
        <button className="btn btn-danger" onClick={nextRound}>❌ Pas deviné</button>
      </div>
    </section>
  )
}

export function InterpreterScreen() {
  const { state, nextRound } = useGameStore()
  const current = state.players.find(p => p.id === state.round.interpreterId)
  const t = state.timer
  const phase1 = t.stage === 1
  const song = (state.currentRound as any)?.songTitle ?? (state.currentRound as any)?.song ?? '—'
  const instrument = (state.currentRound as any)?.instrument ?? '—'

  return (
    <section className="screen gh-shell">
      <div className="card gh-titlecard">
        <h2 className="gh-title">Tu es l'interprète !</h2>
        <p className="subtitle"><strong>{current?.name}</strong></p>
        <p className="gh-subline">{phase1 ? 'Phase 1 — Joue le morceau !' : 'Phase 2 — Termine la manche !'}</p>
      </div>

      <GuitarNeck />

      <div className="gh-main-grid">
        <div className="card gh-rockocard">
          <p className="label">ROCK-O-MÈTRE</p>
          <Rockometer value={t.value} />
          {t.running && <p className="subtitle">Phase {t.stage} en cours…</p>}
          {!t.running && <button className="btn btn-primary gh-btn" onClick={() => {}}>▶ Démarrer le timer</button>}
        </div>

        <div className="card gh-songcard">
          <h2 className="section-title">Morceau à jouer</h2>
          <div className="gh-songitem gh-big">{song}</div>
          <h2 className="section-title" style={{ marginTop: 18 }}>Instrument</h2>
          <div className="gh-songitem gh-big">{instrument}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Action</h2>
        <button className="btn btn-primary gh-btn" onClick={nextRound}>✅ Manche suivante</button>
      </div>
    </section>
  )
}
