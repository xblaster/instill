import { commandr } from './commandr.js';
import { join } from 'node:path';

async function test() {
  const testDir = join(process.cwd(), '.instill-test');
  const testFile = join(testDir, 'test.txt');

  console.log('Testing ensureDir...');
  await commandr.ensureDir(testDir);

  console.log('Testing writeFile...');
  await commandr.writeFile(testFile, 'Hello Instill!');

  console.log('Testing readFile...');
  const content = await commandr.readFile(testFile);
  console.log('Read content:', content);

  console.log('Testing listDir...');
  const files = await commandr.listDir(testDir);
  console.log('Files in directory:', files);

  console.log('Testing deleteFile...');
  await commandr.deleteFile(testFile);

  console.log('Testing cleanup...');
  // Manually remove test dir since deleteFile is for files
  // Note: commandr doesn't have deleteDir yet as per spec
  console.log('Verification Complete!');
}

test().catch(console.error);
