import React from 'react';
import type { CombatInstance, Socket } from '../shared/types';

interface CombatUIProps {
  combat: CombatInstance;
  socket: Socket;
}

export const CombatUI: React.FC<CombatUIProps> = ({ combat, socket }) => {
  const me = combat.players.find(p => p.hp > 0); // Simplified for now

  return (
    <div className="combat-overlay">
      <div className="combat-screen">
        <div className="enemy-side">
          <div className="pixel-art-monster">👾</div>
          <div className="monster-info">
            <h3>{combat.enemy.type || 'BOSS'}</h3>
            <div className="hp-bar-container">
              <div className="hp-bar" style={{ width: `${(combat.enemy.hp / combat.enemy.maxHp) * 100}%`, background: 'red' }}></div>
            </div>
            <span>{combat.enemy.hp} / {combat.enemy.maxHp} HP</span>
          </div>
        </div>

        <div className="player-side">
          {combat.players.map(p => (
            <div key={p.id} className={`player-mini-card ${p.hp <= 0 ? 'dead' : ''}`}>
               <div className="p-info">
                 <span>{p.name} (Lv {p.level} {p.class})</span>
                 <div className="hp-bar-container">
                   <div className="hp-bar" style={{ width: `${(p.hp / p.maxHp) * 100}%`, background: 'green' }}></div>
                 </div>
                 <span>{p.hp} / {p.maxHp} HP</span>
               </div>
            </div>
          ))}
        </div>

        <div className="combat-logs">
          {combat.logs.slice(-5).map((log, i) => <div key={i}>{log}</div>)}
        </div>

        {!combat.isOver && (
          <div className="combat-actions">
            <button className="pixel-button" onClick={() => socket.emit('combatAction', combat.id, 'attack')}>Attack</button>
            <button className="pixel-button" onClick={() => socket.emit('combatAction', combat.id, 'skill')}>Skill</button>
            <button className="pixel-button" onClick={() => socket.emit('combatAction', combat.id, 'flee')}>Flee</button>
          </div>
        )}
      </div>
    </div>
  );
};
