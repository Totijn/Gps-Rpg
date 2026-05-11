import { Server } from "socket.io";
import { createServer } from "http";
import type { ClientToServerEvents, ServerToClientEvents, GameClass, Position, Player } from "../shared/types";
import { state, addPlayer, removePlayer } from "./state";
import { startSpawning } from "./spawner";
import { scheduleBoss } from "./bossEvents";
import { handleAttackMonster, handleAttackBoss, handleCombatAction } from "./combat";
import { handlePlayerMovement } from "./movement";
import { v4 as uuidv4 } from "uuid";

const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinGame", (name, gameClass, position) => {
    let player: Player = {
      id: socket.id,
      name,
      class: gameClass,
      level: 1,
      xp: 0,
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      skills: [],
      position,
      inventory: [],
      totalDistanceMoved: 0
    };

    if (gameClass === 'Warrior') {
      player.hp = 150;
      player.maxHp = 150;
      player.defense = 10;
      player.skills = [{ name: 'Shield Bash', damageMultiplier: 1.5, cooldown: 2 }];
    } else if (gameClass === 'Mage') {
      player.hp = 80;
      player.maxHp = 80;
      player.attack = 20;
      player.skills = [{ name: 'Fireball', damageMultiplier: 3, cooldown: 3 }];
    } else if (gameClass === 'Archer') {
      player.attack = 15;
      player.skills = [{ name: 'Steady Shot', damageMultiplier: 2, cooldown: 1 }];
    }
    addPlayer(player);
    console.log(`${name} joined as ${gameClass}`);
  });

  socket.on("updatePosition", (position) => {
    handlePlayerMovement(io, socket.id, position);
  });

  socket.on("attackMonster", (monsterId) => {
    handleAttackMonster(io, socket.id, monsterId);
  });

  socket.on("attackBoss", (bossId) => {
    handleAttackBoss(io, socket.id, bossId);
  });

  socket.on("combatAction", (combatId, action) => {
    handleCombatAction(io, socket.id, combatId, action);
  });

  socket.on("useItem", (itemId) => {
    const player = state.players[socket.id];
    if (!player) return;

    const itemIdx = player.inventory.findIndex(i => i.id === itemId);
    if (itemIdx === -1) return;

    const item = player.inventory[itemIdx];
    if (item.type === 'consumable') {
      player.hp = Math.min(player.maxHp, player.hp + (item.effect || 0));
      player.inventory.splice(itemIdx, 1);
      io.to(socket.id).emit("message", `Used ${item.name}. Restored ${item.effect} HP.`);
    }
  });

  socket.on("inviteToParty", (targetId) => {
    const partyId = uuidv4();
    io.to(targetId).emit("message", `You've been invited to a party by ${state.players[socket.id]?.name}!`);
    // Auto-accept for simplicity in this MVP
    if (state.players[socket.id] && state.players[targetId]) {
      state.players[socket.id].partyId = partyId;
      state.players[targetId].partyId = partyId;
      io.to(socket.id).emit("message", `Joined party with ${state.players[targetId].name}`);
      io.to(targetId).emit("message", `Joined party with ${state.players[socket.id].name}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removePlayer(socket.id);
  });
});

// Broadcast game state
setInterval(() => {
  io.emit("gameStateUpdate", state);
}, 1000);

startSpawning();
scheduleBoss(io);

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
