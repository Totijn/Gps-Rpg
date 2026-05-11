import React from 'react';
import type { Player, Socket } from '../../../shared/types';

interface Props {
  player: Player;
  socket: Socket;
}

export const HUD: React.FC<Props> = ({ player, socket }) => {
  return (
    <div className="hud">
      <div>NAME: {player.name}</div>
      <div>CLASS: {player.class}</div>
      <div>LEVEL: {player.level}</div>
      <div>XP: {player.xp} / {player.level * 100}</div>
      <div style={{ marginTop: '10px' }}>
        HP: {player.hp} / {player.maxHp}
        <div style={{ width: '100%', background: '#333', height: '10px', border: '2px solid #fff' }}>
          <div style={{ width: `${(player.hp / player.maxHp) * 100}%`, background: 'red', height: '100%' }} />
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        DISTANCE: {Math.floor(player.totalDistanceMoved)}m
      </div>
      <div style={{ marginTop: '10px' }}>
        INVENTORY: {player.inventory.length} items
        <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
          {player.inventory.slice(0, 5).map((item) => (
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span>{item.name}</span>
              <button
                className="pixel-button"
                onClick={() => socket.emit('useItem', item.id)}
                style={{ fontSize: '8px', padding: '2px 4px', margin: 0 }}
              >
                Use
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
