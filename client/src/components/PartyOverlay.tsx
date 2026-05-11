import React from 'react';
import type { GameState, ClientToServerEvents, ServerToClientEvents } from '../../../shared/types';
import { Socket } from 'socket.io-client';

interface Props {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  gameState: GameState | null;
}

export const PartyOverlay: React.FC<Props> = ({ socket, gameState }) => {
  if (!gameState) return null;

  const me = gameState.players[socket.id || ''];
  if (!me) return null;

  const otherPlayers = Object.values(gameState.players).filter(p => p.id !== socket.id);

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      border: '4px solid white',
      zIndex: 1000,
      fontSize: '10px',
      maxWidth: '200px'
    }}>
      <div>PARTY: {me.partyId || 'None'}</div>
      <div style={{ marginTop: '10px' }}>NEARBY PLAYERS:</div>
      {otherPlayers.map(p => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
          <span>{p.name}</span>
          {!me.partyId && !p.partyId && (
            <button
              className="pixel-button"
              style={{ fontSize: '8px', padding: '2px 5px', margin: 0 }}
              onClick={() => socket.emit('inviteToParty', p.id)}
            >
              INVITE
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
