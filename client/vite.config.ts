import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            "/api": "http://starwards_server:3000",
            "/auth": "http://starwards_server:3000",
        },
    },
});
