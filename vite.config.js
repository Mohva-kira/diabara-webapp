import { defineConfig, loadEnv } from 'vite';
import commonjs from 'vite-plugin-commonjs'
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';
// import commonjs from '@rollup/plugin-commonjs';

// Plugin pour copier .htaccess dans dist
const copyHtaccessPlugin = () => {
  return {
    name: 'copy-htaccess',
    closeBundle() {
      const htaccessPath = join(process.cwd(), '.htaccess');
      const distPath = join(process.cwd(), 'dist', '.htaccess');
      
      if (existsSync(htaccessPath)) {
        copyFileSync(htaccessPath, distPath);
        console.log('✅ .htaccess copié dans dist');
      }
      
      // Copier _redirects pour Netlify
      const redirectsPath = join(process.cwd(), 'public', '_redirects');
      const distRedirectsPath = join(process.cwd(), 'dist', '_redirects');
      
      if (existsSync(redirectsPath)) {
        copyFileSync(redirectsPath, distRedirectsPath);
        console.log('✅ _redirects copié dans dist');
      }
    }
  };
};

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
    copyHtaccessPlugin(),
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
         
        },
    


      }
    },
    base: '/',
    resolve: {
      alias: {
        require: 'esbuild-plugin-require',
      },
    },
    
  })

};
