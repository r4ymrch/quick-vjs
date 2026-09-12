import { join } from 'node:path';
import { exec } from "node:child_process";
import { watch, existsSync } from "node:fs";
import { style } from './utils';

function openBrowser(url: string) {
  const opener = 
    process.platform === "darwin" ? "open" :  // macos
    process.platform === "win32" ? "start" :  // windows
    "xdg-open";                               // linux
  exec(`${opener} ${url}`);
}

function isValidProject(dir: string) {
  try {
    return existsSync(join(dir, 'quick-vjs.json'));
  } catch {
    return false;
  }
}

export function handleRun() {
  const PORT = 8080;
  const ROOT = process.cwd();
  const SERVER_URL = `http://localhost:${PORT}`;

  if (!isValidProject(ROOT)) {
    console.log(`\n${style.text.bold}${style.colors.red}Bad:${style.reset} There's no Quick-VJS project found! (quick-vjs.json)\n`);
    return null;
  }

  const clients = new Set<ReadableStreamDefaultController>();
  const clientScript = `
  <script>
    (function() {
      const eventsrc = new EventSource('/__live_reload');
      eventsrc.onmessage = function(e) {
        if (e.data === 'reload') {
          window.location.reload(); 
        }
      };
    })();
  </script>`;

  const server = Bun.serve({
    port: PORT,
    idleTimeout: 0,

    async fetch(req) {
      const requestUrl = new URL(req.url);
      const pathName = requestUrl.pathname;

      if (pathName === "/__live_reload") {
        const body = new ReadableStream({
          start(controller) { 
            clients.add(controller); 
          },
          cancel(controller) { 
            clients.delete(controller); 
          },
        });

        return new Response(body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }

      let targetPath = join(ROOT, pathName);
      let file = Bun.file(targetPath);

      if (pathName.endsWith("/")) {
        targetPath = join(targetPath, "index.html");
        file = Bun.file(targetPath);
      }

      if (!(await file.exists()) && !pathName.includes(".")) {
        const htmlFallback = `${targetPath}.html`;
        const fallbackFile = Bun.file(htmlFallback);
        if (await fallbackFile.exists()) {
          targetPath = htmlFallback;
          file = fallbackFile;
        }
      }

      if (!(await file.exists())) {
        return new Response("404 Not Found", { status: 404 });
      }

      if (targetPath.endsWith(".html")) {
        const htmlText = await file.text();
        const injectedHtml = htmlText.includes("</body>") ? htmlText.replace("</body>", `${clientScript}\n</body>`) : htmlText + clientScript;
        return new Response(injectedHtml, {
          headers: { "Content-Type": "text/html" },
        });
      }

      return new Response(file);
    },
  });

  const watcher = watch(ROOT, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`${style.colors.cyan}[quick-vjs-server]${style.reset} Change found! at ${filename}, reloading browser...`);
      const message = new TextEncoder().encode("data: reload\n\n");
      for (const controller of clients) {
        try {
          controller.enqueue(message);
        } catch {
          clients.delete(controller);
        }
      }
    }
  });

  console.log(`\n[✓] ${style.text.bold}${style.colors.green}Quick-VJS Live Server is running${style.reset}...\n`);
  console.log(`[?] No browser opened?, go to this address ${style.colors.cyan}${SERVER_URL}${style.reset} instead`);
  console.log(`[?] Press CTRL + C to quit and stop the server\n`);

  openBrowser(SERVER_URL);

  return { server, watcher,
    stop: () => {
      watcher.close();
      server.stop();
    },
  };
}
