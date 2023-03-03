import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			},

			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',

			manifest: {
				name: 'kalanu scouting',
				short_name: 'kalanu',
				icons: [
					{
						src: '/favicon/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/favicon/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/favicon/maskable_512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				],
				theme_color: '#444444',
				background_color: '#444444',
				display: 'standalone'
			},

			workbox: {
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/use\.typekit\.net\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'typekit-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 28 // <== 28 days
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	]
});
