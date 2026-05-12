# 🌍 Pixel GPS MMORPG

A retro-style, location-based MMORPG. Walk in the real world to move your character, defeat monsters, and band together for epic boss raids.

## 🚀 Quick Start (One-Button Experience)

To install everything and start the game, just run:

```bash
bun start
```

This will:
1. Install all dependencies.
2. Build the game client.
3. Launch the game server.

### 🖥️ Desktop App (PC)
Run the following to launch the game as a standalone Desktop App:
```bash
npm run start:desktop
```
This opens the game in its own window—no browser needed.

### 📱 Mobile App (Phone)
1. Open the game once in your mobile browser via the IP address shown in the terminal.
2. Click the **"Install App"** button in the top-right corner.
3. The game will be added to your home screen and function as a standalone app.

### 🔗 How to Play
- **PC:** Use **WASD** or the arrow keys to move.
- **Mobile:** Use the **On-Screen D-Pad** to move.

## 🎮 Features
- **Classes:** Warrior, Mage, Archer with unique skills.
- **Quests:** Track objectives and earn bonus XP.
- **Chat:** Global real-time chat to coordinate with other players.
- **3D Map:** A clean, tilted perspective similar to Pokemon Go.
- **Bosses:** Massive multiplayer raids every 5 minutes.
- **Progression:** Level up, collect potions, and move in the real world to get stronger.

## 🛠 Tech Stack
- **Engine:** Bun
- **Frontend:** React + MapLibre GL (3D)
- **Backend:** Socket.io (Real-time)
- **App Wrapper:** Electron (Desktop) + PWA (Mobile)
- **Style:** Pixel-art CSS
