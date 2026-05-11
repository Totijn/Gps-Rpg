# GPS Pixel-Art MMORPG

A real-time, location-based MMORPG built with React, Leaflet, Bun, and Socket.io. Walk in the real world to explore a fantasy realm filled with monsters, bosses, and loot.

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.

### Installation & Launch
1. **Install All Dependencies:**
   ```bash
   bun run install:all
   ```

2. **Start the Game (One Command):**
   ```bash
   bun start
   ```

3. **Access the Game:**
   - **On PC:** Open `http://localhost:3001` in your browser.
   - **On Mobile:** Open `http://YOUR_PC_IP:3001` in your mobile browser.
     *Tip: Make sure your phone and PC are on the same WiFi.*

---

## 📱 Mobile Accessibility
- **Responsive UI:** The HUD and Combat screens adjust for smaller screens.
- **PWA Ready:** On Android/iOS, you can use "Add to Home Screen" for a full-screen app experience.
- **On-Screen D-Pad:** Use the virtual joystick in Debug Mode for movement without real GPS.

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
