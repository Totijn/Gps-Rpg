import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents, GameState, Player, Position, GameClass } from '../../shared/types';
import { HUD } from './components/HUD';
import { ClassSelection } from './components/ClassSelection';
import { MapMarkers } from './components/MapMarkers';
import { BossCountdown } from './components/BossCountdown';
import { PartyOverlay } from './components/PartyOverlay';
import { CombatUI } from './components/CombatUI';

const SOCKET_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : `http://${window.location.hostname}:3001`;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function App() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [me, setMe] = useState<Player | null>(null);
  const [joined, setJoined] = useState(false);
  const [myPos, setMyPos] = useState<Position | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [currentCombat, setCurrentCombat] = useState<CombatInstance | null>(null);

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
        <MapContainer center={[myPos.latitude, myPos.longitude]} zoom={18} style={{ height: '100vh', width: '100vw' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="pixelated-tiles"
          />
          <ChangeView center={[myPos.latitude, myPos.longitude]} />
          {gameState && <MapMarkers gameState={gameState} socket={socket!} />}
        </MapContainer>
      </div>
      {me && <HUD player={me} socket={socket!} />}
      <BossCountdown gameState={gameState} />
      <PartyOverlay socket={socket!} gameState={gameState} />

      {currentCombat && <CombatUI combat={currentCombat} socket={socket!} />}

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
