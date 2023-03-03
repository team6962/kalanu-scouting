import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
	({ url }) => url.href.startsWith('https://www.thebluealliance.com/api/v3'),
	new NetworkFirst({
		cacheName: 'tba-cache',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200]
			})
		]
	})
);
