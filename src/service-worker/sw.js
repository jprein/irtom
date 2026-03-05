/// <reference lib="webworker" />
import {
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});
// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
const allowlist = [/^\/$/]; // Same allowlist for both dev and prod modes

// To allow work offline
registerRoute(
	new NavigationRoute(createHandlerBoundToURL('index.html'), {
		denylist: [
			/\/assets\//,
			/\/.*\.[^/]+$/, // IMPORTANT: excludes app.html and anything with an extension
		],
	}),
);

console.log('⚙️ Service Worker is running');
