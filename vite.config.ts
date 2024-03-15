import { defineConfig, ServerOptions } from 'vite'
import react from '@vitejs/plugin-react-swc'

const serverOptions: ServerOptions = {
  https: true
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
