import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import yaml from '@rollup/plugin-yaml';
import svg from 'vite-plugin-svgr';
import path from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const slides = fg
	.sync('src/procedure/*.ts') // find all your slide files
	.reduce((entries, file) => {
		const name = path.basename(file, '.ts'); // e.g. "sIntroduction"
		entries[name] = path.resolve(__dirname, file);
		return entries;
	}, {});

export default defineConfig({
	// mode: mode, // Set the mode to development or production
	root: './src',
	publicDir: '../public',
	base: '',
	build: {
		target: 'esnext', // Use the latest ECMAScript version
		outDir: '../dist',
		emptyOutDir: true,
		assetsDir: 'assets',
		hunkSizeWarningLimit: 1000,
		rollupOptions: {
			// 1) make each slide its own entry, so Rollup emits it with your entryFileNames pattern
			input: {
				index: 'src/index.html',
				app: path.resolve(__dirname, 'src/app.html'),
				goodbye: path.resolve(__dirname, 'src/goodbye.html'),
				...slides, // ← every slide.ts becomes an entry point named by its basename
			},
			// 2) preserve modules so imports between slides still work 1:1
			preserveModules: true,
			preserveModulesRoot: 'src', // strip off "src/" from the output paths
			output: {
				format: 'esm',
				// everything that came in as an entry (including your slides) will now go here:
				entryFileNames: 'assets/[name].js',
				// any code-split chunks will also live here, unhashed:
				chunkFileNames: 'assets/[name].js',
				// non-JS assets too
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
	plugins: [
		yaml(),
		svg(),
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'service-worker',
			filename: 'sw.js',
			registerType: 'prompt',
			injectRegister: 'auto',
			//includeAssets: ['**/*'],
			// this enables the pwa-assets.config.js
			// generates favicon etc on the fly
			// https://vite-pwa-org.netlify.app/assets-generator/integrations.html
			pwaAssets: {
				disabled: false,
				config: true,
			},
			manifest: {
				name: 'irToM',
				short_name: 'irToM',
				description: 'This is the irToM as a PWA.',
				background_color: '#006c66',
				theme_color: '#006c66',
				start_url: './',
				display: 'fullscreen',
				orientation: 'landscape',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: './favicon.svg',
						sizes: 'any',
						type: 'image/svg+xml',
					},
				],
			},

			injectManifest: {
				globPatterns: ['**/*.{js,ts,css,html,svg,png,ico,mp3,webm,json,yaml}'],
				maximumFileSizeToCacheInBytes: 300000000,
			},

			devOptions: {
				enabled: false, // no SW in dev mode
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
			// to cache images and pdfs, serve them offline
			workbox: {
				globPatterns: ['**/*.{js,ts,css,html,svg,png,ico,mp3,webm,json,yaml}'],
			},
		}),
	],

	resolve: {
		alias: { '@': path.resolve(__dirname, './src') },
		extensions: ['.ts', '.js', '.json', '.yaml'],
	},
	server: {
		open: '/index.html',
		strictPort: true,
		port: 3000,
	},
});
