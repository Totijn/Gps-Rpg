import { Server } from "socket.io";
import { createServer } from "http";
import type { ClientToServerEvents, ServerToClientEvents, GameClass, Position, Player } from "../shared/types";
import { state, addPlayer, removePlayer } from "./state";
import { startSpawning } from "./spawner";
import { scheduleBoss } from "./bossEvents";
import { handleAttackMonster, handleAttackBoss } from "./combat";
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
    const player: Player = {
      id: socket.id,
      name,
      class: gameClass,
      level: 1,
      xp: 0,
      hp: 100,
      maxHp: 100,
      position,
      inventory: [],
      totalDistanceMoved: 0
    };
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
