import { networkInterfaces } from 'os';
import { spawn } from 'child_process';

function getLocalIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIp();
const port = 3001;

console.log('-----------------------------------------');
console.log('🚀 Starting GPS RPG MMORPG Build & Launch');
console.log('-----------------------------------------');

async function run() {
  console.log('🏗️ Building client...');
  const build = spawn('bun', ['run', 'build'], { stdio: 'inherit' });
  await new Promise(resolve => build.on('close', resolve));

  console.log('🌟 Launching Server...');
  console.log('');
  console.log(`✅ GAME IS LIVE!`);
  console.log(`🔗 Local:   http://localhost:${port}?dev=true`);
  console.log(`📱 Mobile:  http://${ip}:${port}?dev=true`);
  console.log('');
  console.log('🌈 CHILD-FRIENDLY TIPS:');
  console.log('1. On your phone? Click the "Install" button in the game!');
  console.log('2. Want a PC App? Type "bun run dist:win" in a new window.');
  console.log('3. Walking outside is the best way to level up! 🏃‍♂️');
  console.log('-----------------------------------------');

  spawn('bun', ['run', 'server/index.ts'], { stdio: 'inherit' });
}

run();
