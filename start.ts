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
  console.log('Use WASD or the D-pad on mobile to move.');
  console.log('-----------------------------------------');

  spawn('bun', ['run', 'server/index.ts'], { stdio: 'inherit' });
}

run();
