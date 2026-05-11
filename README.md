# GPS Pixel-Art MMORPG

A real-time, location-based MMORPG built with React, Leaflet, Bun, and Socket.io. Walk in the real world to explore a fantasy realm filled with monsters, bosses, and loot.

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.

### Installation & Launch
1. **Install Dependencies:**
   ```bash
   bun install
   ```

2. **Start the Backend:**
   ```bash
   cd server
   bun index.ts
   ```

3. **Start the Frontend:**
   ```bash
   cd client
   bun run dev
   ```

4. **Access the Game:**
   Open `http://localhost:3000` in your browser.

---

## 🎮 Game Mechanics

### 🌍 Movement & Exploration
- **GPS Integration:** The game uses your real-world coordinates. As you move, your character moves on the map.
- **Walk to Progress:** Every 10 meters you walk in real life grants you 1 XP.
- **Debug Mode:** For developers, use the **"Enable Debug Move"** button to toggle WASD/Arrow key movement.

### ⚔️ Class System
Choose from three distinct classes, each with unique starting stats and skills:
- **Warrior:** High HP and Defense. Uses *Shield Bash* to stun and damage.
- **Mage:** High Attack but low HP. Devastates foes with *Fireball*.
- **Archer:** Balanced stats. High fire rate with *Steady Shot*.

### 🥊 Instance-Based Combat
- Click a monster (👾) or a Boss (👹) on the map to engage.
- Combat opens a dedicated **Combat Instance**.
- **Actions:** Attack, use a Class Skill, or Flee.
- **Cooldowns:** Class skills have turn-based cooldowns.

### 👥 Parties & Social
- **Band Together:** Click on nearby players to invite them to your party.
- **Shared Combat:** If you are in a party and within 100m of a monster, party members are automatically pulled into the combat instance to help.
- **Boss Events:** Global bosses appear every 5 minutes. They have a massive HP pool and require multiple players to take down.

### 💎 Loot & Progression
- **Level Up:** Gain XP from combat and movement. Leveling up increases your Max HP, Attack, and Defense.
- **Item Drops:** Defeating enemies has a chance to drop **Health Potions**.
- **Inventory:** Use potions from your HUD to restore HP during or between fights.

---

## 🛠 Technical Architecture

- **Shared Types (`/shared`):** Single source of truth for interfaces and socket event definitions used by both client and server.
- **Backend (`/server`):**
  - `state.ts`: Centralized in-memory game state.
  - `combat.ts`: Manages turn-based combat logic and instances.
  - `spawner.ts`: Handles procedural monster generation near active players.
- **Frontend (`/client`):**
  - `react-leaflet`: Renders the game world using OpenStreetMap tiles.
  - `Socket.io`: Handles bi-directional real-time communication.
  - Pixel-Art CSS: Retro aesthetic using custom fonts and pixelated rendering.

---

## 👨‍💻 Developer Notes
- **Testing GPS:** Use Chrome DevTools -> Three dots -> More tools -> Sensors to simulate different Geolocation coordinates.
- **Force Debug:** If GPS detection is slow, use the "Force Debug Mode" button on the loading screen to start in Berlin.
