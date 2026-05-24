import { useState, useEffect, useRef } from 'react';

// We generate ambient sounds using Web Audio API — no external files needed
function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

function playRadarPing(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(880, time);
  osc.frequency.exponentialRampToValueAtTime(440, time + 0.3);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
  osc.start(time);
  osc.stop(time + 0.4);
}

function playStaticBurst(ctx, time, duration = 0.05) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.03;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  source.connect(filter);
  filter.connect(ctx.destination);
  source.start(time);
}

function createDroneTone(ctx, frequency, volume = 0.02) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  return { osc, gain };
}

const PRESETS = [
  {
    id: 'warroom',
    name: 'War Room',
    icon: '🎯',
    desc: 'Radar pings + low tension drone',
    color: 'var(--accent)',
  },
  {
    id: 'crisis',
    name: 'Crisis Alert',
    icon: '🔴',
    desc: 'High tension + rapid static bursts',
    color: 'var(--accent2)',
  },
  {
    id: 'intel',
    name: 'Intel Ops',
    icon: '📡',
    desc: 'Slow radar + deep drone tone',
    color: 'var(--accent3)',
  },
  {
    id: 'silent',
    name: 'Silent Ops',
    icon: '🔇',
    desc: 'Minimal ambient with rare pings',
    color: 'var(--green)',
  },
];

export default function AmbientSound() {
  const [active, setActive] = useState(false);
  const [preset, setPreset] = useState('warroom');
  const [volume, setVolume] = useState(50);
  const ctxRef = useRef(null);
  const dronesRef = useRef([]);
  const intervalRef = useRef(null);
  const masterGainRef = useRef(null);

  const stopAll = () => {
    dronesRef.current.forEach(({ osc, gain }) => {
      try { gain.gain.setValueAtTime(0, ctxRef.current?.currentTime || 0); osc.stop(); } catch {}
    });
    dronesRef.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const startAudio = async (presetId) => {
    if (ctxRef.current) { try { await ctxRef.current.close(); } catch {} }
    const ctx = createAudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume / 100;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Override destination for drones
    const connectDrone = (freq, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = vol * (volume / 100);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      return { osc, gain };
    };

    if (presetId === 'warroom') {
      dronesRef.current.push(connectDrone(60, 0.03));
      dronesRef.current.push(connectDrone(120, 0.015));
      intervalRef.current = setInterval(() => {
        playRadarPing(ctx, ctx.currentTime);
        if (Math.random() > 0.6) playStaticBurst(ctx, ctx.currentTime + 0.5);
      }, 3000);
    } else if (presetId === 'crisis') {
      dronesRef.current.push(connectDrone(80, 0.04));
      dronesRef.current.push(connectDrone(160, 0.02));
      dronesRef.current.push(connectDrone(240, 0.01));
      intervalRef.current = setInterval(() => {
        playRadarPing(ctx, ctx.currentTime);
        playStaticBurst(ctx, ctx.currentTime + 0.3);
        playStaticBurst(ctx, ctx.currentTime + 0.6);
      }, 1500);
    } else if (presetId === 'intel') {
      dronesRef.current.push(connectDrone(40, 0.04));
      dronesRef.current.push(connectDrone(80, 0.02));
      intervalRef.current = setInterval(() => {
        playRadarPing(ctx, ctx.currentTime);
      }, 5000);
    } else if (presetId === 'silent') {
      dronesRef.current.push(connectDrone(50, 0.01));
      intervalRef.current = setInterval(() => {
        if (Math.random() > 0.5) playRadarPing(ctx, ctx.currentTime);
      }, 8000);
    }
  };

  const toggle = async () => {
    if (active) {
      stopAll();
      setActive(false);
    } else {
      await startAudio(preset);
      setActive(true);
    }
  };

  const switchPreset = async (id) => {
    setPreset(id);
    if (active) {
      stopAll();
      await startAudio(id);
    }
  };

  const handleVolume = (val) => {
    setVolume(val);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime(val / 100, ctxRef.current.currentTime);
    }
  };

  useEffect(() => () => { stopAll(); try { ctxRef.current?.close(); } catch {} }, []);

  const currentPreset = PRESETS.find(p => p.id === preset);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">War Room Ambient Sound</div>
        <div className="page-subtitle">CINEMATIC AUDIO ENGINE · WEB AUDIO API</div>
      </div>

      {/* Main control */}
      <div className="card" style={{ textAlign: 'center', padding: '40px 32px', marginBottom: 20, border: active ? `1px solid ${currentPreset?.color}` : '1px solid var(--border)', background: active ? `${currentPreset?.color}08` : 'var(--bg-card)', transition: 'all 0.3s' }}>
        <div style={{ fontSize: 48, marginBottom: 16, filter: active ? `drop-shadow(0 0 12px ${currentPreset?.color})` : 'none', transition: 'filter 0.3s' }}>{currentPreset?.icon}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: active ? currentPreset?.color : 'var(--text-primary)', letterSpacing: 3, marginBottom: 4, transition: 'color 0.3s' }}>
          {active ? `▌ ${currentPreset?.name.toUpperCase()} ACTIVE` : 'AUDIO OFFLINE'}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 28 }}>{currentPreset?.desc}</div>

        <button onClick={toggle} style={{
          width: 100, height: 100, borderRadius: '50%',
          background: active ? `${currentPreset?.color}20` : 'var(--bg-secondary)',
          border: `3px solid ${active ? currentPreset?.color : 'var(--border)'}`,
          fontSize: 28, cursor: 'pointer',
          boxShadow: active ? `0 0 30px ${currentPreset?.color}40` : 'none',
          transition: 'all 0.3s',
          animation: active ? 'pulse 2s infinite' : 'none',
        }}>
          {active ? '⏹' : '▶'}
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 16 }}>
          {active ? 'CLICK TO STOP' : 'CLICK TO START'}
        </div>
      </div>

      {/* Volume */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1 }}>VOLUME</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--accent)' }}>{volume}%</div>
        </div>
        <input type="range" min="0" max="100" value={volume} onChange={e => handleVolume(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
      </div>

      {/* Presets */}
      <div className="section-title">SOUND PRESETS</div>
      <div className="grid-2" style={{ gap: 10 }}>
        {PRESETS.map(p => (
          <div key={p.id} className="card" style={{ cursor: 'pointer', border: `1px solid ${preset === p.id ? p.color : 'var(--border)'}`, background: preset === p.id ? `${p.color}10` : 'var(--bg-card)', transition: 'all 0.2s' }}
            onClick={() => switchPreset(p.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: preset === p.id ? p.color : 'var(--text-primary)', letterSpacing: 1 }}>{p.name.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{p.desc}</div>
              </div>
              {preset === p.id && <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: p.color }}>● SELECTED</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1 }}>
          All sounds generated in-browser via Web Audio API · No external files required · Works offline
        </div>
      </div>
    </div>
  );
}
