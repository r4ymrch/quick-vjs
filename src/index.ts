import { style } from './utils';
import { handleInit } from './init';
import { handleRun } from './run';

const VERSION = "0.0.1";

function showHelp() {
  console.log(`
${style.text.bold}${style.text.underline}Usage:${style.reset} quick-vjs <command>

Quick-VJS is a simple tools to scaffolding vanilla javascript static website project with Built-in live server features.

${style.text.bold}${style.text.underline}Commands:${style.reset}
  -i, init                    Initialize new project.
  -r, run                     Run the project.
  -h, help                    Show this help message.
  -v, version                 Show program version.
  `);
}

function main() {
  const command: string | undefined = process.argv[2];

  switch (command) {
    case 'init':
    case '-i':
      handleInit();
      break;

    case 'run':
    case '-r':
      handleRun();
      break;

    case 'help':
    case '-h':
    case undefined:
      showHelp();
      break;

    case 'version':
    case '-v':
      console.log(`quick-vjs ${VERSION}`);
      break;

    default:
      console.log(`Unknown command: "${command}"`);
      console.log(`\nTo see a list of supported commands, run:
  quick-vjs help`);
      break;
  }
}

main();
