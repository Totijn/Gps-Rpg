import { getDistance } from "geolib";
import { state, removeMonster, removeBoss } from "./state";
import { awardXp } from "./progression";
import type { Server } from "socket.io";
import type { ServerToClientEvents, Item } from "../shared/types";
import { v4 as uuidv4 } from "uuid";

export function handleAttackMonster(io: Server<any, ServerToClientEvents>, playerId: string, monsterId: string) {
  const player = state.players[playerId];
  const monster = state.monsters[monsterId];

  if (!player || !monster) return;

  const dist = getDistance(player.position, monster.position);
  if (dist > 50) {
    io.to(playerId).emit("message", "Too far away to attack!");
    return;
  }

  // Simple combat: player always hits for now
  const damage = player.level * 5;
  monster.hp -= damage;

  if (monster.hp <= 0) {
    removeMonster(monsterId);
    awardXp(io, playerId, monster.level * 10);
    dropLoot(io, playerId);
    io.emit("message", `${player.name} defeated a ${monster.type}!`);
  }
}

export function handleAttackBoss(io: Server<any, ServerToClientEvents>, playerId: string, bossId: string) {
  const player = state.players[playerId];
  const boss = state.bosses[bossId];

  if (!player || !boss || boss.status !== "active") return;

  const dist = getDistance(player.position, boss.position);
  if (dist > 100) {
    io.to(playerId).emit("message", "Too far away to attack the boss!");
    return;
  }

  const damage = player.level * 5;
  boss.hp -= damage;

  if (boss.hp <= 0) {
    removeBoss(bossId);
    // Award all players in proximity or in parties? For now just the attacker
    awardXp(io, playerId, boss.level * 100);
    io.emit("message", `${boss.name} has been defeated!`);
  }
}

function dropLoot(io: Server<any, ServerToClientEvents>, playerId: string) {
  if (Math.random() > 0.5) {
    const item: Item = {
      id: uuidv4(),
      name: "Health Potion",
      type: "consumable",
      effect: 20,
      rarity: "common"
    };
    state.players[playerId].inventory.push(item);
    io.to(playerId).emit("lootDropped", item);
  }
}
