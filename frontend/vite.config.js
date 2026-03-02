import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {
    defineConfig
} from 'vite'
export default defineConfig({
    plugins: [react(), tailwindcss()], // This plugin handles the "React is not defined" issue automatically
})