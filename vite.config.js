import { defineConfig, loadEnv } from 'vite';
import commonjs from 'vite-plugin-commonjs'
import react from '@vitejs/plugin-react';
// import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };


  return defineConfig({
    plugins: [
      react({
      include: "**/*.tsx"
    }),
    commonjs(),
    
  ],
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      port: 3000, // you can replace this port with any port
    },
    build: {
      target: 'es2019',
      assetsDir: 'assets',
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
            return
          }
          warn(warning)
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          // S'assurer que les fichiers JS ont les bons noms et extensions
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        },
      }
    },
    // Utiliser un chemin absolu pour la production
    base: process.env.NODE_ENV === 'production' ? '/' : './',
    resolve: {
      alias: {
        require: 'esbuild-plugin-require',
      },
    },
    
  })

};
