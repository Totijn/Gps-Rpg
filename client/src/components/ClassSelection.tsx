import React, { useState } from 'react';
import type { GameClass } from '../../../shared/types';

interface Props {
  onJoin: (name: string, gameClass: GameClass) => void;
}

export const ClassSelection: React.FC<Props> = ({ onJoin }) => {
  const [name, setName] = useState('');

  return (
    <div className="class-selection">
      <h1>Pixel GPS MMO</h1>
      <input
        type="text"
        placeholder="Enter Character Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="pixel-input"
        style={{ marginBottom: '20px', padding: '10px', fontFamily: 'inherit' }}
      />
      <div className="classes">
        {(['Warrior', 'Mage', 'Archer'] as GameClass[]).map(c => (
          <button
            key={c}
            className="pixel-button"
            onClick={() => name && onJoin(name, c)}
            disabled={!name}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};
