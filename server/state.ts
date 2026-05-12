import type { GameState, Player, Monster, Boss } from "../shared/types";
import { loadState } from "./persistence";

const savedPlayers = loadState();

export const state: GameState = {
  players: savedPlayers,
  monsters: {},
  bosses: {}
};

export function addPlayer(player: Player) {
  state.players[player.id] = player;
}

export function removePlayer(id: string) {
  delete state.players[id];
}

export function updatePlayerPosition(id: string, lat: number, lng: number) {
  if (state.players[id]) {
    state.players[id].position = { latitude: lat, longitude: lng };
  }
}

export function addMonster(monster: Monster) {
  state.monsters[monster.id] = monster;
}

export function removeMonster(id: string) {
  delete state.monsters[id];
}

export function addBoss(boss: Boss) {
  state.bosses[boss.id] = boss;
}

export function removeBoss(id: string) {
  delete state.bosses[id];
}
