import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import vue2Jsx from "@vitejs/plugin-vue2-jsx";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Components from "unplugin-vue-components/vite";
import { ElementUiResolver } from "unplugin-vue-components/resolvers";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // console.log(env)

  return {
    plugins: [
      checker({
        vueTsc: true,
      }),
      vue2(),
      vue2Jsx(),
      Icons({
        compiler: "vue3",
        customCollections: {
          jt: FileSystemIconLoader("src/assets/icons"),
        },
      }),
      Components({
        dts: true,
        resolvers: [
          ElementUiResolver({
            importStyle: "sass",
          }),
          IconsResolver({
            customCollections: ["jt"],
            prefix: "icon",
          }),
        ],
        types: [],
        version: 2.7,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/index.scss";',
        },
      },
    },
    server: {
      host: true,
      port: Number(env.DEV_PORT ?? 3000),
      proxy: {
        "/apiLLM": {
          target: "http://10.0.1.168:35751",
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            "/apiLLM": "",
          },
        },
        "/apiNER": {
          target: "http://10.0.3.73:22890",
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            "/apiNER": "",
          },
        },
        "/apiToken": {
          target: "https://10.0.3.73:22891",
          changeOrigin: true,
          ws: true,
          secure: true,   // 使用的是http协议则设置为false，https协议则设置为true
          pathRewrite: {
            "/apiToken": "",
          },
        },
      },
    },
    build: {
      outDir: "dist",
    },
  };
});
