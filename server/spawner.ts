import { computeDestinationPoint } from "geolib";
import { state, addMonster } from "./state";
import type { Position, Monster } from "../shared/types";
import { v4 as uuidv4 } from "uuid";

export function spawnMonstersAroundPlayer(playerPos: Position) {
  const currentMonsterCount = Object.keys(state.monsters).length;
  if (currentMonsterCount > 50) return; // Cap monsters

  // Spawn a few monsters randomly around the player
  for (let i = 0; i < 3; i++) {
    const distance = Math.random() * 500 + 50; // 50m to 550m away
    const bearing = Math.random() * 360;
    const pos = computeDestinationPoint(playerPos, distance, bearing);

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
