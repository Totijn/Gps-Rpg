import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { GameState, ClientToServerEvents, ServerToClientEvents } from '../../../shared/types';
import { Socket } from 'socket.io-client';

// Simple pixel-y circles as icons for now
const createIcon = (color: string) => L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: ${color}; width: 20px; height: 20px; border: 2px solid white; border-radius: 4px;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const playerIcon = createIcon('blue');
const monsterIcon = createIcon('green');
const bossIcon = createIcon('red');

interface Props {
  gameState: GameState;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export const MapMarkers: React.FC<Props> = ({ gameState, socket }) => {
  return (
    <>
      {Object.values(gameState.players).map(p => (
        <Marker key={p.id} position={[p.position.latitude, p.position.longitude]} icon={playerIcon}>
          <Popup>
            {p.name} (Lv {p.level} {p.class})
          </Popup>
        </Marker>
      ))}

      {Object.values(gameState.monsters).map(m => (
        <Marker key={m.id} position={[m.position.latitude, m.position.longitude]} icon={monsterIcon}>
          <Popup>
            Lv {m.level} {m.type}
            <br />
            HP: {m.hp}/{m.maxHp}
            <br />
            <button onClick={() => socket.emit('attackMonster', m.id)}>Attack</button>
          </Popup>
        </Marker>
      ))}

      {Object.values(gameState.bosses).map(b => (
        <Marker key={b.id} position={[b.position.latitude, b.position.longitude]} icon={bossIcon}>
          <Popup>
            {b.name} ({b.status})
            <br />
            HP: {b.hp}/{b.maxHp}
            <br />
            {b.status === 'active' ? (
              <button onClick={() => socket.emit('attackBoss', b.id)}>ATTACK BOSS!</button>
            ) : (
              <span>Unleashing soon...</span>
            )}
          </Popup>
        </Marker>
      ))}
    </>
  );
};
