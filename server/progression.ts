import { state } from "./state";
import type { Server } from "socket.io";
import type { ServerToClientEvents } from "../shared/types";

export function awardXp(io: Server<any, ServerToClientEvents>, playerId: string, amount: number) {
  const player = state.players[playerId];
  if (!player) return;

  player.xp += amount;
  const nextLevelXp = player.level * 100;

  if (player.xp >= nextLevelXp) {
    player.level += 1;
    player.xp -= nextLevelXp;
    player.maxHp += 20;
    player.hp = player.maxHp;
    io.to(playerId).emit("message", `Congratulations! You reached level ${player.level}!`);
  }
}

export function awardMovementBonus(io: Server<any, ServerToClientEvents>, playerId: string, distance: number) {
  const player = state.players[playerId];
  if (!player) return;

  player.totalDistanceMoved += distance;
  // Award 1 XP per 10 meters moved
  const movementXp = Math.floor(distance / 10);
  if (movementXp > 0) {
    awardXp(io, playerId, movementXp);
  }
}
