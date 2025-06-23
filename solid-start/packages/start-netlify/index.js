import { copyFileSync, promises, existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { rollup } from "rollup";
import vite from "vite";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import common from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import { spawn } from "child_process";

export default function ({ edge } = {}) {
  return {
    start() {
      const proc = spawn("netlify", ["dev"]);
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);
    },
    async build(config) {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const appRoot = config.solidOptions.appRoot;
      await vite.build({
        build: {
          outDir: "./netlify/",
          minify: "terser",
          rollupOptions: {
            input: resolve(join(config.root, appRoot, `entry-client`)),
            output: {
              manualChunks: undefined
            }
          }
        }
      });
      await vite.build({
        build: {
          ssr: true,
          outDir: "./.solid/server",
          rollupOptions: {
            input: resolve(join(config.root, appRoot, `entry-server`)),
            output: {
              format: "esm"
            }
          }
        }
      });
      copyFileSync(
        join(config.root, ".solid", "server", `entry-server.js`),
        join(config.root, ".solid", "server", "app.js")
      );
      copyFileSync(join(__dirname, edge ? "entry-edge.js" : "entry.js"), join(config.root, ".solid", "server", "index.js"));
      const bundle = await rollup({
        input: join(config.root, ".solid", "server", "index.js"),
        plugins: [
          json(),
          nodeResolve({
            preferBuiltins: true,
            exportConditions: ["node", "solid"]
          }),
          common(),
          babel({
            babelHelpers: "bundled",
            presets: [["@babel/preset-env", { targets: { node: 14 } }]]
          })
        ]
      });
      // or write the bundle to disk
      await bundle.write({ format: edge ? "esm": "cjs", dir: join(config.root, "netlify", edge ? "edge-functions" : "functions") });

      // closes the bundle
      await bundle.close();

      if (edge) {
        const dir = join(config.root, ".netlify", "edge-functions");
        if (!(existsSync(dir))){
          await promises.mkdir(dir, { recursive: true });
        }
        await promises.writeFile(join(config.root, ".netlify", "edge-functions", "manifest.json"), `{
  "functions": [
    {
      "function": "index",
      "pattern": "^[^.]*$"
    }
  ],
  "version": 1
}`, 'utf-8');
      } else {
        await promises.writeFile(join(config.root, "netlify", "_redirects"), "/*    /.netlify/functions/index    200", 'utf-8');
      }
    }
  };
}
