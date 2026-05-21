import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, 'package.json');

const command = process.argv[2];
const args = process.argv.slice(3);

try {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (command === 'get-version') {
    console.log(pkg.version);
  } else if (command === 'set-version') {
    const newVersion = args[0];
    if (!newVersion) {
      console.error('Version required');
      process.exit(1);
    }
    pkg.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('Updated to version: ' + newVersion);
  } else {
    console.error('Unknown command: ' + command);
    process.exit(1);
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
