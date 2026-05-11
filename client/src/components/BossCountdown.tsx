import React from 'react';
import type { GameState } from '../../../shared/types';

interface Props {
  gameState: GameState | null;
}

export const BossCountdown: React.FC<Props> = ({ gameState }) => {
  if (!gameState) return null;

  const bosses = Object.values(gameState.bosses).filter(b => b.status === 'spawning');
  if (bosses.length === 0) return null;

  const boss = bosses[0];
  const timeLeft = Math.max(0, Math.floor((boss.unleashesAt - Date.now()) / 1000));

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255, 0, 0, 0.8)',
      color: 'white',
      padding: '10px 20px',
      border: '4px solid white',
      zIndex: 1001,
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '12px' }}>BOSS INCOMING: {boss.name}</div>
      <div style={{ fontSize: '20px' }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
    </div>
  );
};
