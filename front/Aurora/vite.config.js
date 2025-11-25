import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(async ({ mode }) => {


  const env = loadEnv(mode, process.cwd(), '');

  const https_host = env.VITE_BACK_END_URL;
  const wss_host = env.VITE_BACK_END_URL_WSS;
  const host = env.VITE_FRONT_END_URL;


  return {

    plugins: [react()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      https: {
        key: './certs/key.pem',
        cert: './certs/cert.pem'
      },
      port: 1420,
      strictPort: true,
      host: '0.0.0.0' , 
      proxy: {
        '/api': {
          target: https_host,
          changeOrigin: true,
          secure: false, // ← bypass cert validation for proxy (dev only)
        },
        '/ws': { // or your WS path
          target: wss_host,
          changeOrigin: true,
          secure: false,
          ws: true, // ← enable WebSocket proxy
        }
      },
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  }

}); 
