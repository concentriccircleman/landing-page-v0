import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import fs from "fs";
import type { Plugin } from "vite";

function reviewStatePlugin(): Plugin {
  const filePath = resolve(__dirname, "review-state.json");

  function readState(): Record<string, unknown> {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      return {};
    }
  }

  return {
    name: "review-state-api",
    configureServer(server) {
      server.middlewares.use("/__review-state", (req, res) => {
        if (req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(readState()));
          return;
        }
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
          req.on("end", () => {
            fs.writeFileSync(filePath, body, "utf-8");
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("ok");
          });
          return;
        }
        res.writeHead(405);
        res.end();
      });

      server.middlewares.use("/__review-fix", (req, res) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
          req.on("end", () => {
            try {
              const fix = JSON.parse(body) as {
                componentId: string;
                version: number;
                description: string;
                filesChanged: string[];
              };
              const state = readState() as Record<string, Record<string, unknown>>;
              const entry = state[fix.componentId];
              if (entry) {
                const fixes = (entry.fixes as unknown[] | undefined) ?? [];
                fixes.push({
                  version: fix.version,
                  timestamp: new Date().toISOString(),
                  description: fix.description,
                  filesChanged: fix.filesChanged,
                });
                entry.fixes = fixes;
                entry.status = "pending";
                fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
              }
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end("ok");
            } catch (err) {
              res.writeHead(400, { "Content-Type": "text/plain" });
              res.end(String(err));
            }
          });
          return;
        }
        if (req.method === "GET") {
          const state = readState() as Record<string, Record<string, unknown>>;
          const fixes: Record<string, unknown> = {};
          for (const [id, entry] of Object.entries(state)) {
            if (entry.fixes && (entry.fixes as unknown[]).length > 0) {
              fixes[id] = entry.fixes;
            }
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(fixes));
          return;
        }
        res.writeHead(405);
        res.end();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    reviewStatePlugin(),
    dts({
      insertTypeMaps: false,
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@tokens": resolve(__dirname, "src/tokens"),
      "@components": resolve(__dirname, "src/components"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SentraDS",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
});
