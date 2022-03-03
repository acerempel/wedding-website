import { defineConfig } from "vite";

export default defineConfig(async () => {
  const solid = (await import("solid-start")).default
  const startStatic = (await import("solid-start-static")).default
  return { plugins: [solid({ adapter: startStatic() })] }
});
