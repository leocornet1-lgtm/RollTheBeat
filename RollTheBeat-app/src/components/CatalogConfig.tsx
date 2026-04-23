'use client'
import { useState } from 'react'
import { PRESET_LISTS, DEFAULT_INSTRUMENTS, VIRTUAL_INSTRUMENTS } from '@/lib/catalogs'

interface Props {
  onValidate: (catalog: { songs: string[]; instruments: string[] }) => void
}

export function CatalogConfig({ onValidate }: Props) {
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [customSongs, setCustomSongs] = useState('')
  const [instruments, setInstruments] = useState<string[]>(DEFAULT_INSTRUMENTS)
  const [customInstrument, setCustomInstrument] = useState('')

  const getSongs = (): string[] => {
    if (selectedList === 'custom') {
      return customSongs.split('\n').map(s => s.trim()).filter(Boolean)
    }
    return PRESET_LISTS.find(l => l.id === selectedList)?.songs ?? []
  }

  const toggleInstrument = (instr: string) => {
    setInstruments(prev =>
      prev.includes(instr) ? prev.filter(i => i !== instr) : [...prev, instr]
    )
  }

  const addCustomInstrument = () => {
    const val = customInstrument.trim()
    if (val && !instruments.includes(val)) {
      setInstruments(prev => [...prev, val])
      setCustomInstrument('')
    }
  }

  const songs = getSongs()
  const canValidate = songs.length >= 2 && instruments.length >= 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Choix liste morceaux */}
      <div className="card">
        <h2 className="section-title">🎵 Liste de morceaux</h2>
        <div className="list-grid">
          {PRESET_LISTS.map(list => (
            <button
              key={list.id}
              className={`list-btn ${selectedList === list.id ? 'active' : ''}`}
              onClick={() => setSelectedList(list.id)}
            >
              <span className="list-emoji">{list.emoji}</span>
              <span className="list-label">{list.label}</span>
              <span className="list-count">20 morceaux</span>
            </button>
          ))}
          <button
            className={`list-btn ${selectedList === 'custom' ? 'active' : ''}`}
            onClick={() => setSelectedList('custom')}
          >
            <span className="list-emoji">✏️</span>
            <span className="list-label">Liste personnalisée</span>
            <span className="list-count">à définir</span>
          </button>
        </div>
      </div>

      {/* Liste personnalisée */}
      {selectedList === 'custom' && (
        <div className="card">
          <label className="label">Un morceau par ligne</label>
          <textarea
            className="input"
            rows={6}
            placeholder={"Bohemian Rhapsody\nBillie Jean\nSmells Like Teen Spirit\n..."}
            value={customSongs}
            onChange={e => setCustomSongs(e.target.value)}
            style={{ resize: 'vertical' }}
          />
          <p className="subtitle" style={{ marginTop: 6 }}>
            {getSongs().length} morceau{getSongs().length > 1 ? 'x' : ''} saisi{getSongs().length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Aperçu liste sélectionnée */}
      {selectedList && selectedList !== 'custom' && (
        <div className="card">
          <h2 className="section-title">Aperçu — {PRESET_LISTS.find(l => l.id === selectedList)?.label}</h2>
          <ul className="song-list" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {getSongs().map((s, i) => (
              <li key={i} className="song-item">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Instruments */}
      <div className="card">
        <h2 className="section-title">🎸 Instruments</h2>
        <div className="instrument-grid">
          {DEFAULT_INSTRUMENTS.map(instr => (
            <button
              key={instr}
              className={`instr-btn ${instruments.includes(instr) ? 'active' : ''}`}
              onClick={() => toggleInstrument(instr)}
            >
              {instr}
            </button>
          ))}
          {/* Custom instruments ajoutés */}
          {instruments.filter(i => !DEFAULT_INSTRUMENTS.includes(i)).map(instr => (
            <button
              key={instr}
              className="instr-btn active"
              onClick={() => toggleInstrument(instr)}
            >
              {instr} ✕
            </button>
          ))}
        </div>

        {/* Ajouter instrument custom */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            className="input"
            placeholder="Ajouter un instrument..."
            value={customInstrument}
            onChange={e => setCustomInstrument(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomInstrument()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-secondary" onClick={addCustomInstrument} style={{ whiteSpace: 'nowrap' }}>
            + Ajouter
          </button>
        </div>

        {/* Instruments virtuels (bientôt) */}
        <div style={{ marginTop: 16 }}>
          <p className="label" style={{ marginBottom: 8 }}>Instruments virtuels — bientôt disponibles</p>
          <div className="instrument-grid">
            {VIRTUAL_INSTRUMENTS.map(v => (
              <button key={v.id} className="instr-btn disabled" disabled title="Bientôt disponible">
                {v.label} <span style={{ fontSize: '0.7rem', color: 'var(--warning)' }}>bientôt</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton valider */}
      <button
        className="btn btn-primary"
        disabled={!canValidate}
        onClick={() => onValidate({ songs: getSongs(), instruments })}
      >
        ✅ Valider et démarrer la partie
      </button>

      {!canValidate && (
        <p className="subtitle" style={{ textAlign: 'center' }}>
          {!selectedList ? 'Choisis une liste de morceaux' : songs.length < 2 ? 'Saisis au moins 2 morceaux' : 'Sélectionne au moins un instrument'}
        </p>
      )}
    </div>
  )
}
