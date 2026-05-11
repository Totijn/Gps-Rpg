import { computeDestinationPoint } from "geolib";
import { state, addBoss } from "./state";
import type { Boss, ServerToClientEvents } from "../shared/types";
import { v4 as uuidv4 } from "uuid";
import type { Server } from "socket.io";

export function scheduleBoss(io: Server<any, ServerToClientEvents>) {
  setInterval(() => {
    if (Object.keys(state.players).length === 0) return;
    if (Object.keys(state.bosses).length > 0) return; // Only one boss at a time for now

    // Pick a random player to spawn near
    const players = Object.values(state.players);
    const targetPlayer = players[Math.floor(Math.random() * players.length)];

    const distance = Math.random() * 200 + 100;
    const bearing = Math.random() * 360;
    const pos = computeDestinationPoint(targetPlayer.position, distance, bearing);

    const boss: Boss = {
      id: uuidv4(),
      name: "World Destroyer",
      type: "Boss",
      level: 20,
      hp: 1000,
      maxHp: 1000,
      position: { latitude: pos.latitude, longitude: pos.longitude },
      status: "spawning",
      unleashesAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    addBoss(boss);
    io.emit("bossAnnounced", boss);
    io.emit("message", `A boss ${boss.name} will be unleashed in 5 minutes!`);

    setTimeout(() => {
      if (state.bosses[boss.id]) {
        state.bosses[boss.id].status = "active";
        io.emit("message", `${boss.name} has been unleashed!`);
      }
    }, 5 * 60 * 1000);
  }, 10 * 60 * 1000); // Every 10 minutes attempt to spawn a boss
}
