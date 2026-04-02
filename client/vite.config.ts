import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        proxy: {
            "/auth": "http://starwards_server:3000",
            "/hotels": "http://starwards_server:3000",
        },
    },
});
