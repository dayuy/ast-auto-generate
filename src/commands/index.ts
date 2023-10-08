#!/usr/bin/env node
import { Command } from 'commander';
import generateCommand from './generate.command';

const bootstrap =async () => {
  const program = new Command();
  program
    .version(
      require('../../package.json').version,
      '-v, --version',
      'Output the current version.'
    )
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');
  
  await generateCommand(program);
  program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

bootstrap();
