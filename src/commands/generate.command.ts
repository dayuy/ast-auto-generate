import { ChildProcess, SpawnOptions, spawn } from "child_process";
import { Command } from "commander";

export default async function generateCommand(program: Command): Promise<void> {
  program
    .command('generate <schematic> [name]')
    .alias('g')
    .description('Generate a Nest element.')
    .action(async (schematic: string, name: string) => {
      if (!schematic) {
        program.error('error: missing required argument "schematic"');
      }
      if (!name) {
        program.error('error: missing required argument "name"');
      }
      try {
        await run(schematic, name);
      } catch (error) {
        console.error(error)
      }
    })
}

async function run(schematic: string, name: string): Promise<null | string> {
  const cwd = process.cwd();
  const resolvePath = require.resolve(
    'generate-nest-module/bin/compiler/index.js',
    { paths: module.paths },
  );
  const options: SpawnOptions = {
    cwd,
    stdio: 'inherit',
    shell: true,
  }
  return new Promise<null | string>((resolve, reject) => {
    const child: ChildProcess = spawn(
      'node',
      [resolvePath, schematic, name],
      options
    );
    child.stdout?.on('data', (data) => resolve(data))
    child.stderr?.on('data', (data) => reject(data))
    child.on('close', (code) => {
      if (code === 0) {
        resolve(null);
      } else {
        console.error(`\nFailed to execute command: generate ${schematic} ${name}`)
        reject();
      }
    })
  })
}
