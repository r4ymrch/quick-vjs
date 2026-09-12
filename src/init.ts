import { join } from 'node:path';
import { style } from './utils';
import { htmlTemplate, cssTemplate, jsTemplate } from './template';

interface ProjectConfig {
  name: string;
  description: string;
  version: string;
  author: string;
}

// aturan semantic versioning
function getVersionInput() {
  const rule = /^[0-9]+\.[0-9]+\.[0-9]+$/; 
  let version = "1.0.0";

  while (true) {
    const input = prompt("> version: (1.0.0)");
    
    if (!input || input.trim() === "") { 
      break; 
    }
    
    if (rule.test(input)) {
      version = input;
      break;
    }
    
    console.log(`${style.text.bold}${style.colors.red}Bad:${style.reset} Please use semantic versioning! (e.g., 1.0.0)\n`);
  }

  return version;
}

export function handleInit() {
  console.log(`\n${style.text.bold}[+] Initializing new project${style.reset}...\n`);

  let getName: string;

  while (true) {
    getName = prompt("> project name:");

    if (getName == null) {
      console.log(`${style.text.bold}${style.colors.red}Bad:${style.reset} Name cannot be empty!\n`);
    } else {
      break;
    }
  }

  const getDesc: string | null = prompt("> description:");
  const getVersion: string | null = getVersionInput();
  const getAuthor: string | null = prompt("> author:");

  const projectConfig: ProjectConfig = {
    name: getName,
    description: getDesc,
    version: getVersion,
    author: getAuthor,
  };

  const projectPath: string = join(process.cwd(), projectConfig.name);

  console.log(`\n${style.text.bold}[+] Generating project${style.reset}...`);

  Bun.write(join(projectPath, 'index.html'), htmlTemplate);
  Bun.write(join(projectPath, 'style.css'), cssTemplate);
  Bun.write(join(projectPath, 'index.js'), jsTemplate);
  Bun.write(join(projectPath, 'quick-vjs.json'), JSON.stringify(projectConfig, null, 2));

  console.log(`[✓] ${style.text.bold}${style.colors.green}Done!${style.reset}`);
  console.log(`
[?] ${style.text.bold}Next steps?${style.reset}
  > Change working directory to the project, run:
      cd ${projectConfig.name}
  > Then run the project, run:
      quick-vjs run
  > Start editing your web :)
  `);
}
