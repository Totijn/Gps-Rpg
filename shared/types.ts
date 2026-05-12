export type GameClass = 'Warrior' | 'Mage' | 'Archer';

export interface Position {
  latitude: number;
  longitude: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'gear';
  effect?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Player {
  id: string;
  name: string;
  class: GameClass;
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  skills: Skill[];
  position: Position;
  inventory: Item[];
  partyId?: string;
  lastPosition?: Position;
  totalDistanceMoved: number;
  equipment: {
    weapon?: Item;
    armor?: Item;
  };
  quests: Quest[];
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  completed: boolean;
}

export interface Skill {
  name: string;
  damageMultiplier: number;
  cooldown: number; // in turns
  lastUsedTurn?: number;
}

export interface Monster {
  id: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  position: Position;
}

export interface Boss extends Monster {
  name: string;
  status: 'spawning' | 'active';
  unleashesAt: number; // timestamp
}

export interface CombatInstance {
  id: string;
  players: Player[];
  enemy: Monster | Boss;
  turn: number;
  logs: string[];
  isOver: boolean;
}

export interface GameState {
  players: Record<string, Player>;
  monsters: Record<string, Monster>;
  bosses: Record<string, Boss>;
}

export interface ServerToClientEvents {
  gameStateUpdate: (state: GameState) => void;
  bossAnnounced: (boss: Boss) => void;
  message: (msg: string) => void;
  lootDropped: (item: Item) => void;
  combatStarted: (combat: CombatInstance) => void;
  combatUpdate: (combat: CombatInstance) => void;
  combatEnded: (result: { victory: boolean, rewards?: Item[], xpGained?: number }) => void;
  chatMessage: (msg: { sender: string, text: string }) => void;
}

export interface ClientToServerEvents {
  joinGame: (name: string, gameClass: GameClass, position: Position) => void;
  updatePosition: (position: Position) => void;
  attackMonster: (monsterId: string) => void;
  attackBoss: (bossId: string) => void;
  inviteToParty: (playerId: string) => void;
  acceptPartyInvite: (partyId: string) => void;
  useItem: (itemId: string) => void;
  combatAction: (combatId: string, action: 'attack' | 'skill' | 'flee') => void;
  sendChat: (message: string) => void;
}
