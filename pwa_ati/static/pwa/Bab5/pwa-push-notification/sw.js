'use strict';
(function() {
  self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    console.log('Closed notification: ' + primaryKey);
  });
  self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;
    if (action === 'close') {
      notification.close();
    } else {
      e.waitUntil(
        clients.matchAll().then(function(clis) {
          var client = clis.find(function(c) {
            return c.visibilityState === 'visible';
          });
          if (client !== undefined) {
            client.navigate('pages/page' + primaryKey + '.html');
            client.focus();
          } else {
            // there are no visible windows. Open one.
            clients.openWindow('pages/page' + primaryKey + '.html');
            notification.close();
          }
        })
      );
    }
    self.registration.getNotifications().then(function(notifications) {
      notifications.forEach(function(notification) {
        notification.close();
      });
    });
  });
  self.addEventListener('push', function(e) {
    var body;
	console.log(e.data);
    if (e.data) {
      body = e.data.json();
    } else {
      body = 'Informasi pemberitahuan push message.';
    }
    var options = {
      body: body,
      icon: 'http://localhost:8080/pwa-push-notification/images/notification.png',
	  image: 'http://localhost:8080/pwa-push-notification/images/bookstore.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {action: 'explore', title: 'Buka notifikasi',
          icon: 'images/checkmark.png'},
        {action: 'close', title: 'Hapus notifikasi',
          icon: 'images/xmark.png'}
      ]
    };
    e.waitUntil(
      clients.matchAll().then(function(c) {
		console.log(e.data);
        //console.log(c);
        if (c.length === 0) {
          // Show notification
          self.registration.showNotification('Pemberitahuan!', options);
        } else {
          // Send message to the page to update the UI
          console.log('Application sedang terbuka!');
        }
      })
    );
  });
})();
