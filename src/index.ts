import { Command } from 'commander';

const program = new Command();

program
  .name('instill')
  .description('Instill: A local skill orchestrator for AI assistants.')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize or update skills in the current project.')
  .action(() => {
    console.log('Instill init placeholder...');
  });

program.parse();
