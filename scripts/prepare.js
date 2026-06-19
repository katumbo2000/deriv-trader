const fs = require('fs');
const { execSync } = require('child_process');

if (fs.existsSync('.git')) {
    execSync('husky install', { stdio: 'inherit' });
}
