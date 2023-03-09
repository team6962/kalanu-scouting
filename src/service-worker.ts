import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
	({ url }) => url.href.startsWith('https://www.thebluealliance.com/api/v3'),
	new CacheFirst({
		cacheName: 'tba-cache',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 20,
				maxAgeSeconds: 4 * 24 * 60 * 60
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200]
			})
		]
	})
);
