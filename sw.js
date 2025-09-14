// Service Worker for Image Compressor PWA
const CACHE_NAME = 'image-compressor-v1.0.0';
const STATIC_CACHE = 'image-compressor-static-v1.0.0';
const DYNAMIC_CACHE = 'image-compressor-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (url.origin === location.origin) {
        // Same origin requests
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    return fetch(request)
                        .then((response) => {
                            // Don't cache if not a valid response
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            
                            // Clone the response
                            const responseToCache = response.clone();
                            
                            // Cache dynamic content
                            caches.open(DYNAMIC_CACHE)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                            
                            return response;
                        })
                        .catch(() => {
                            // Return offline page for navigation requests
                            if (request.mode === 'navigate') {
                                return caches.match('/index.html');
                            }
                        });
                })
        );
    } else if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
        // Google Fonts requests
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    return fetch(request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                const responseToCache = response.clone();
                                caches.open(STATIC_CACHE)
                                    .then((cache) => {
                                        cache.put(request, responseToCache);
                                    });
                            }
                            return response;
                        });
                })
        );
    }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered');
    
    if (event.tag === 'image-compression-sync') {
        event.waitUntil(
            // Handle any pending compression tasks
            handleBackgroundSync()
        );
    }
});

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Image compression completed!',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192x192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Image Compressor', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Helper function for background sync
async function handleBackgroundSync() {
    try {
        // Get any pending compression tasks from IndexedDB
        const pendingTasks = await getPendingTasks();
        
        for (const task of pendingTasks) {
            try {
                await processCompressionTask(task);
                await removePendingTask(task.id);
            } catch (error) {
                console.error('Service Worker: Failed to process task', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Background sync failed', error);
    }
}

// Helper function to get pending tasks (placeholder)
async function getPendingTasks() {
    // This would typically interact with IndexedDB
    // For now, return empty array
    return [];
}

// Helper function to process compression task (placeholder)
async function processCompressionTask(task) {
    // This would handle the actual compression logic
    console.log('Service Worker: Processing task', task);
}

// Helper function to remove pending task (placeholder)
async function removePendingTask(taskId) {
    // This would remove the task from IndexedDB
    console.log('Service Worker: Removing task', taskId);
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicSync', (event) => {
        if (event.tag === 'image-compressor-cleanup') {
            event.waitUntil(cleanupOldCache());
        }
    });
}

// Cleanup old cache entries
async function cleanupOldCache() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        for (const request of requests) {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader && new Date(dateHeader).getTime() < oneWeekAgo) {
                await cache.delete(request);
            }
        }
        
        console.log('Service Worker: Cache cleanup completed');
    } catch (error) {
        console.error('Service Worker: Cache cleanup failed', error);
    }
}
