/**
 * London''s Imports — Push Notification Service Worker Handler
 * Handles background push notifications from Firebase Cloud Messaging (FCM) & Web Push
 */
self.addEventListener("push", function (event) {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: "London''s Imports",
      body: event.data.text(),
    };
  }

  const title = payload.notification?.title || payload.title || "London''s Imports";
  const body = payload.notification?.body || payload.body || "You have an update regarding your order.";
  const icon = payload.notification?.icon || payload.icon || "/icon-192.png";
  const data = payload.data || {};
  const urlToOpen = data.url || (data.order_number ? "/track" : "/");

  const options = {
    body: body,
    icon: icon,
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      url: urlToOpen,
      ...data,
    },
    tag: data.order_number ? `order-${data.order_number}` : "londons-update",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          if ("navigate" in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
