import { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents, GameState, Player, Position, GameClass } from '../../shared/types';
import { HUD } from './components/HUD';
import { ClassSelection } from './components/ClassSelection';
import { BossCountdown } from './components/BossCountdown';
import { PartyOverlay } from './components/PartyOverlay';
import { CombatUI } from './components/CombatUI';

const SOCKET_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : `http://${window.location.hostname}:3001`;

export default function App() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [me, setMe] = useState<Player | null>(null);
  const [joined, setJoined] = useState(false);
  const [myPos, setMyPos] = useState<Position | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [currentCombat, setCurrentCombat] = useState<any | null>(null);

  useEffect(() => {
    if (debugMode && myPos) {
      const handleKeyDown = (e: KeyboardEvent) => {
        const step = 0.0001; // Approx 10 meters
        let nextPos = { ...myPos };
        if (e.key === 'w' || e.key === 'ArrowUp') nextPos.latitude += step;
        if (e.key === 's' || e.key === 'ArrowDown') nextPos.latitude -= step;
        if (e.key === 'a' || e.key === 'ArrowLeft') nextPos.longitude -= step;
        if (e.key === 'd' || e.key === 'ArrowRight') nextPos.longitude += step;

        if (nextPos.latitude !== myPos.latitude || nextPos.longitude !== myPos.longitude) {
          setMyPos(nextPos);
          if (socket && joined) {
            socket.emit('updatePosition', nextPos);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [debugMode, myPos, socket, joined]);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on('gameStateUpdate', (state) => {
      setGameState(state);
      if (s.id && state.players[s.id]) {
        setMe(state.players[s.id]);
      }
    });

    s.on('message', (msg) => {
      console.log('Server message:', msg);
    });

    s.on('combatStarted', (combat) => {
      setCurrentCombat(combat);
    });

    s.on('combatUpdate', (combat) => {
      setCurrentCombat(combat);
    });

    s.on('combatEnded', (result) => {
      alert(result.victory ? `Victory! XP Gained: ${result.xpGained}` : 'Defeat...');
      setCurrentCombat(null);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator && !debugMode) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setMyPos(newPos);
          if (socket && joined) {
            socket.emit('updatePosition', newPos);
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [socket, joined]);

  const handleJoin = (name: string, gameClass: GameClass) => {
    if (socket && myPos) {
      socket.emit('joinGame', name, gameClass, myPos);
      setJoined(true);
    }
  };

  const moveDebug = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (!myPos) return;
    const step = 0.0001;
    let nextPos = { ...myPos };
    if (dir === 'up') nextPos.latitude += step;
    if (dir === 'down') nextPos.latitude -= step;
    if (dir === 'left') nextPos.longitude -= step;
    if (dir === 'right') nextPos.longitude += step;
    setMyPos(nextPos);
    if (socket && joined) {
      socket.emit('updatePosition', nextPos);
    }
  };

  if (!myPos) return (
    <div className="loading">
      Detecting GPS...
      <button
        className="pixel-button"
        onClick={() => {
          setMyPos({ latitude: 52.52, longitude: 13.405 });
          setDebugMode(true);
        }}
        style={{ marginTop: '20px' }}
      >
        Force Debug Mode (Berlin)
      </button>
    </div>
  );
  if (!joined) return <ClassSelection onJoin={handleJoin} />;

  return (
    <div className="game-container">
      <div className="pixel-map-wrapper">
        <Map
          initialViewState={{
            longitude: myPos.longitude,
            latitude: myPos.latitude,
            zoom: 18,
            pitch: 45
          }}
          style={{ width: '100vw', height: '100vh' }}
          mapStyle="/map-style.json"
          latitude={myPos.latitude}
          longitude={myPos.longitude}
        >
          <Marker latitude={myPos.latitude} longitude={myPos.longitude}>
            <div className="player-marker">
              <div className="player-sprite">🚶</div>
              <div className="player-name-tag">{me?.name || 'You'}</div>
            </div>
          </Marker>

          {gameState && Object.values(gameState.monsters).map(monster => (
            <Marker
              key={monster.id}
              latitude={monster.position.latitude}
              longitude={monster.position.longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                socket?.emit('attackMonster', monster.id);
              }}
            >
              <div className="pixel-monster-marker">👾</div>
            </Marker>
          ))}

          {gameState && Object.values(gameState.bosses).map(boss => (
            <Marker
              key={boss.id}
              latitude={boss.position.latitude}
              longitude={boss.position.longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                socket?.emit('attackBoss', boss.id);
              }}
            >
              <div className={`pixel-boss-marker ${boss.status}`}>👹</div>
            </Marker>
          ))}

          {gameState && Object.values(gameState.players).map(p => {
             if (p.id === socket?.id) return null;
             return (
               <Marker key={p.id} latitude={p.position.latitude} longitude={p.position.longitude}>
                 <div className="other-player-marker">
                   <div className="player-sprite">👤</div>
                   <div className="player-name-tag">{p.name}</div>
                 </div>
               </Marker>
             );
          })}
        </Map>
      </div>
      {me && <HUD player={me} socket={socket!} />}
      <BossCountdown gameState={gameState} />
      <PartyOverlay socket={socket!} gameState={gameState} />

      {currentCombat && <CombatUI combat={currentCombat} socket={socket!} />}

      {debugMode && (
        <div className="d-pad">
          <div className="d-btn" style={{ gridArea: 'up' }} onClick={() => moveDebug('up')}>↑</div>
          <div className="d-btn" style={{ gridArea: 'left' }} onClick={() => moveDebug('left')}>←</div>
          <div className="d-btn" style={{ gridArea: 'right' }} onClick={() => moveDebug('right')}>→</div>
          <div className="d-btn" style={{ gridArea: 'down' }} onClick={() => moveDebug('down')}>↓</div>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 2000 }}>
        <button
          className="pixel-button"
          onClick={() => setDebugMode(!debugMode)}
          style={{ fontSize: '8px', padding: '5px' }}
        >
          {debugMode ? "Disable Debug Move" : "Enable Debug Move (WASD)"}
        </button>
      </div>
    </div>
  );
}
