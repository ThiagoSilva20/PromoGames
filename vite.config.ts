import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

/** Evita resolver exports "node" no bundle do Worker */
const removeNodeConditions: Plugin = {
  name: "remove-node-conditions",
  config(config) {
    if (config.ssr?.resolve?.conditions) {
      config.ssr.resolve.conditions = config.ssr.resolve.conditions.filter((c) => c !== "node");
    }
    if (config.ssr?.resolve?.externalConditions) {
      config.ssr.resolve.externalConditions =
        config.ssr.resolve.externalConditions.filter((c) => c !== "node");
    }
    if (config.environments?.ssr?.resolve?.conditions) {
      config.environments.ssr.resolve.conditions =
        config.environments.ssr.resolve.conditions.filter((c) => c !== "node");
    }
    if (config.environments?.ssr?.resolve?.externalConditions) {
      config.environments.ssr.resolve.externalConditions =
        config.environments.ssr.resolve.externalConditions.filter((c) => c !== "node");
    }
  },
};

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    removeNodeConditions,
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
