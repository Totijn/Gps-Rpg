import React from 'react';
import type { Player, GameState } from '../../../shared/types';
import { Socket } from 'socket.io-client';
import { Leaderboard } from './Leaderboard';

interface Props {
  player: Player;
  socket: Socket;
  gameState: GameState;
}

export const HUD: React.FC<Props> = ({ player, socket, gameState }) => {
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

      <div style={{ marginTop: '5px', fontSize: '7px', display: 'flex', gap: '10px' }}>
         <span>ATK: {player.attack}</span>
         <span>DEF: {player.defense}</span>
      </div>

      <div style={{ marginTop: '10px', borderTop: '1px solid #555', paddingTop: '5px' }}>
        <Leaderboard players={gameState.players} />
      </div>

      {player.quests.length > 0 && (
        <div style={{ marginTop: '10px', color: '#ffeb3b' }}>
          QUESTS:
          {player.quests.map(q => !q.completed && (
            <div key={q.id} style={{ fontSize: '7px' }}>
              • {q.name}: {q.currentCount}/{q.targetCount}
            </div>
          ))}
        </div>
      )}

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
