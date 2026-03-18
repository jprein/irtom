import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import yaml from '@rollup/plugin-yaml';
import svg from 'vite-plugin-svgr';
import path from 'path';
import fg from 'fast-glob';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Collect all TypeScript files in the procedure directory, e.g. "sIntroduction"
const slides = fg.sync('src/procedure/*.ts').reduce((entries, file) => {
	const name = path.basename(file, '.ts');
	entries[name] = path.resolve(__dirname, file);
	return entries;
}, {});

// Custom plugin to remove PNG files, .ai files, and community mp3s that are not needed after build
// for faster loading and deployment
const removeUnwantedFilesPlugin = {
	name: 'remove-unwanted-files',
	async closeBundle() {
		// Remove PNG files in assets
		const pngFiles = await fg('dist/assets/*.png', { absolute: true });
		// Remove .ai files anywhere in dist
		const aiFiles = await fg('dist/**/*.ai', { absolute: true });
		const experimentFiles = await fg('dist/**/experiment.svg', {
			absolute: true,
		});
		// Remove community audio directories (e.g. dist/communities/*/audio)
		const audioDirs = await fg('dist/communities/*/audio', {
			onlyDirectories: true,
			absolute: true,
		});
		const oldAudioDirs = await fg('dist/communities/*/oldaudio', {
			onlyDirectories: true,
			absolute: true,
		});
		// Delete unwanted files
		await Promise.all(
			[...pngFiles, ...aiFiles, ...experimentFiles].map((file) =>
				fs.unlink(file)
			)
		);
		// Remove unwanted directories recursively
		await Promise.all(
			audioDirs.map((dir) => fs.rm(dir, { recursive: true, force: true }))
		);
		await Promise.all(
			oldAudioDirs.map((dir) => fs.rm(dir, { recursive: true, force: true }))
		);
	},
};

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
		chunkSizeWarningLimit: 1000,
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
				background_color: '#cee1e8',
				theme_color: '#cee1e8',
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
				globPatterns: ['**/*.{js,ts,css,html,svg,ico,mp3,webm,json,yaml}'],
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
				globPatterns: ['**/*.{js,ts,css,html,svg,ico,mp3,webm,json,yaml}'],
			},
		}),
		// Use the combined cleanup plugin
		removeUnwantedFilesPlugin,
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
