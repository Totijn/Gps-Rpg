import React from 'react';
import type { GameState, Position } from '../../../shared/types';
import { getDistance, getRhumbLineBearing } from 'geolib';

interface MinimapProps {
  gameState: GameState;
  myPos: Position;
}

export const Minimap: React.FC<MinimapProps> = ({ gameState, myPos }) => {
  const range = 500; // 500m radius
  const size = 100; // 100px

  const renderEntities = () => {
    const entities: any[] = [];

    Object.values(gameState.monsters).forEach(m => {
      const dist = getDistance(myPos, m.position);
      if (dist <= range) {
        const bearing = getRhumbLineBearing(myPos, m.position);
        const radius = (dist / range) * (size / 2);
        const x = (size / 2) + radius * Math.sin(bearing * Math.PI / 180);
        const y = (size / 2) - radius * Math.cos(bearing * Math.PI / 180);
        entities.push(<div key={m.id} className="dot monster-dot" style={{ left: x, top: y }} />);
      }
    });

    Object.values(gameState.bosses).forEach(b => {
      const dist = getDistance(myPos, b.position);
      if (dist <= range) {
        const bearing = getRhumbLineBearing(myPos, b.position);
        const radius = (dist / range) * (size / 2);
        const x = (size / 2) + radius * Math.sin(bearing * Math.PI / 180);
        const y = (size / 2) - radius * Math.cos(bearing * Math.PI / 180);
        entities.push(<div key={b.id} className="dot boss-dot" style={{ left: x, top: y }} />);
      }
    });

    return entities;
  };

  return (
    <div className="minimap-container">
      <div className="minimap-circle">
        <div className="player-dot" />
        {renderEntities()}
      </div>
      <div className="minimap-label">RADAR (500m)</div>
    </div>
  );
};
