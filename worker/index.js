"use strict";

self.addEventListener("push", function (event) {
  const { title, ...options } = event.data.json();

  event.waitUntil(
    registration.showNotification(title, {
      ...options,
      icon: "https://animet.tv/assets/logo/animet-tv_chibi_1.webp",
      badge: "https://animet.tv/assets/logo/animet-tv_chibi_1.webp",
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  const { data } = event.notification;
  const { redirectUrl } = data;

  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];

          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }

          if (client.url.includes(redirectUrl)) return;

          await client.navigate(redirectUrl);
          client.focus();
        }
        return clients.openWindow(redirectUrl);
      })
  );
});
