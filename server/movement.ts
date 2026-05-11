import { getDistance } from "geolib";
import { state, updatePlayerPosition } from "./state";
import { awardMovementBonus } from "./progression";
import type { Position, ServerToClientEvents } from "../shared/types";
import type { Server } from "socket.io";

export function handlePlayerMovement(io: Server<any, ServerToClientEvents>, playerId: string, newPos: Position) {
  const player = state.players[playerId];
  if (!player) return;

  if (player.lastPosition) {
    const dist = getDistance(player.lastPosition, newPos);
    if (dist > 5) { // Only count if moved more than 5 meters to avoid GPS jitter
      awardMovementBonus(io, playerId, dist);
      player.lastPosition = newPos;
    }
  } else {
    player.lastPosition = newPos;
  }

  updatePlayerPosition(playerId, newPos.latitude, newPos.longitude);
}
