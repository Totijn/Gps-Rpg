import { getDistance } from "geolib";
import { state, removeMonster, removeBoss } from "./state";
import { awardXp } from "./progression";
import type { Server } from "socket.io";
import type { ServerToClientEvents, Item, CombatInstance, Player, Monster, Boss } from "../shared/types";
import { v4 as uuidv4 } from "uuid";

export const activeCombats: Record<string, CombatInstance> = {};

export function handleAttackMonster(io: Server<any, ServerToClientEvents>, playerId: string, monsterId: string) {
  const player = state.players[playerId];
  const monster = state.monsters[monsterId];

  if (!player || !monster) return;

  const dist = getDistance(player.position, monster.position);
  if (dist > 50) {
    io.to(playerId).emit("message", "Too far away to attack!");
    return;
  }

  startCombat(io, player, monster, 'monster');
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

  startCombat(io, player, boss, 'boss');
}

function startCombat(io: Server<any, ServerToClientEvents>, player: Player, enemy: Monster | Boss, type: 'monster' | 'boss') {
  const combatId = uuidv4();
  const players = [player];

  // If in a party, pull in nearby party members
  if (player.partyId) {
    Object.values(state.players).forEach(p => {
      if (p.partyId === player.partyId && p.id !== player.id) {
        const d = getDistance(p.position, enemy.position);
        if (d < 100) {
          players.push(p);
        }
      }
    });
  }

  const combat: CombatInstance = {
    id: combatId,
    players,
    enemy: { ...enemy },
    turn: 0,
    logs: [`Combat started against ${enemy.type || (enemy as Boss).name}!`],
    isOver: false
  };

  activeCombats[combatId] = combat;

  players.forEach(p => {
    io.to(p.id).emit("combatStarted", combat);
  });
}

export function handleCombatAction(io: Server<any, ServerToClientEvents>, playerId: string, combatId: string, action: 'attack' | 'skill' | 'flee') {
  const combat = activeCombats[combatId];
  if (!combat || combat.isOver) return;

  const player = combat.players.find(p => p.id === playerId);
  if (!player) return;

  if (action === 'flee') {
    combat.isOver = true;
    combat.players.forEach(p => io.to(p.id).emit("combatEnded", { victory: false }));
    delete activeCombats[combatId];
    return;
  }

  // Player Turn
  let damage = player.attack;
  if (action === 'skill') {
    const skill = player.skills[0]; // Simplified: use first skill
    if (skill.lastUsedTurn !== undefined && combat.turn - skill.lastUsedTurn < skill.cooldown) {
      io.to(playerId).emit("message", "Skill on cooldown!");
      return;
    }
    damage *= skill.damageMultiplier;
    skill.lastUsedTurn = combat.turn;
  }

  // Basic damage calc
  damage = Math.floor(damage * (1 + (player.level - 1) * 0.1));
  combat.enemy.hp -= damage;
  combat.logs.push(`${player.name} used ${action} for ${damage} damage!`);

  if (combat.enemy.hp <= 0) {
    finishCombat(io, combat, true);
    return;
  }

  // Enemy Turn
  let enemyDamage = Math.max(1, combat.enemy.level * 5);
  // Attack a random player
  const target = combat.players[Math.floor(Math.random() * combat.players.length)];

  // Defense reduction
  const finalDamage = Math.max(1, enemyDamage - target.defense);
  target.hp -= finalDamage;
  state.players[target.id].hp = target.hp; // Sync back to main state

  combat.logs.push(`${combat.enemy.type || (combat.enemy as Boss).name} attacks ${target.name} for ${enemyDamage} damage!`);

  if (target.hp <= 0) {
    // If all players dead, lose
    const allDead = combat.players.every(p => p.hp <= 0);
    if (allDead) {
      finishCombat(io, combat, false);
      return;
    }
  }

  combat.turn++;
  combat.players.forEach(p => io.to(p.id).emit("combatUpdate", combat));
}

function finishCombat(io: Server<any, ServerToClientEvents>, combat: CombatInstance, victory: boolean) {
  combat.isOver = true;

  if (victory) {
    const xp = combat.enemy.level * 20;
    combat.players.forEach(p => {
      awardXp(io, p.id, xp);
      const items = dropLoot(io, p.id);
      io.to(p.id).emit("combatEnded", { victory: true, xpGained: xp, rewards: items });
    });

    if ('name' in combat.enemy) {
      removeBoss(combat.enemy.id);
    } else {
      removeMonster(combat.enemy.id);
    }
  } else {
    combat.players.forEach(p => io.to(p.id).emit("combatEnded", { victory: false }));
  }

  delete activeCombats[combat.id];
}

function dropLoot(io: Server<any, ServerToClientEvents>, playerId: string): Item[] {
  const items: Item[] = [];
  if (Math.random() > 0.4) {
    const item: Item = {
      id: uuidv4(),
      name: "Health Potion",
      type: "consumable",
      effect: 30,
      rarity: "common"
    };
    state.players[playerId].inventory.push(item);
    items.push(item);
  }
  return items;
}
