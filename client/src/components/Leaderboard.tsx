import React from 'react';
import type { Player } from '../../../shared/types';

interface LeaderboardProps {
  players: Record<string, Player>;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const sorted = Object.values(players)
    .sort((a, b) => b.level - a.level || b.xp - a.xp)
    .slice(0, 5);

  return (
    <div className="leaderboard">
      <h4 style={{ margin: '0 0 5px 0', fontSize: '8px', color: '#ffeb3b' }}>TOP PLAYERS</h4>
      {sorted.map((p, i) => (
        <div key={p.id} className="leaderboard-entry">
          {i + 1}. {p.name} - Lv {p.level}
        </div>
      ))}
    </div>
  );
};
