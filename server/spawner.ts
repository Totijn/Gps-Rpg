import { computeDestinationPoint, getDistance } from "geolib";
import { state, addMonster } from "./state";
import type { Position, Monster } from "../shared/types";
import { v4 as uuidv4 } from "uuid";

// Safe Zone Center (e.g. Starting coordinates)
const SAFE_ZONE = { latitude: 52.5200, longitude: 13.4050 };
const SAFE_RADIUS = 100; // meters

export function spawnMonstersAroundPlayer(playerPos: Position) {
  const currentMonsterCount = Object.keys(state.monsters).length;
  if (currentMonsterCount > 50) return; // Cap monsters

  // Spawn a few monsters randomly around the player
  for (let i = 0; i < 3; i++) {
    const distance = Math.random() * 500 + 50; // 50m to 550m away
    const bearing = Math.random() * 360;
    const pos = computeDestinationPoint(playerPos, distance, bearing);

    // Check safe zone
    if (getDistance({ latitude: pos.latitude, longitude: pos.longitude }, SAFE_ZONE) < SAFE_RADIUS) continue;

    const monster: Monster = {
      id: uuidv4(),
      type: ["Slime", "Goblin", "Skeleton"][Math.floor(Math.random() * 3)],
      level: Math.floor(Math.random() * 5) + 1,
      hp: 20,
      maxHp: 20,
      position: { latitude: pos.latitude, longitude: pos.longitude }
    };

    addMonster(monster);
  }
}

export function startSpawning() {
  setInterval(() => {
    Object.values(state.players).forEach(player => {
      if (Math.random() > 0.7) {
        spawnMonstersAroundPlayer(player.position);
      }
    });
  }, 10000);
}
