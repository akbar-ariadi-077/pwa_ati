if (!('Notification' in window)) {
	console.log('Notifications not supported in this browser');
}

Notification.requestPermission(function(status) {
	console.log('Notification permission status:', status);
});

function displayNotification() {
	if (Notification.permission == 'granted') {
		navigator.serviceWorker.getRegistration().then(function(reg) {
			var options = {
				image: '/pwa_ati/static/pwa/Bab5/pwa-push-notification/images/bookstore.png',
				body: 'Informasi Pemberitahuan...',
				tag: 'id1',
				icon: '/pwa_ati/static/pwa/Bab5/pwa-push-notification/images/notification.png',
				vibrate: [100, 50, 100],
				data: { dateOfArrival: Date.now(), primaryKey: 1},
				actions: [
					{action: 'explore', title: 'Buka notifikasi'},
					{action: 'close', title: 'Tutup notifikasi'},
				]
			};
			reg.showNotification('Pemberitahuan!', options);
		});
	}
}

function displayNotification2() {
	if (Notification.permission == 'granted') {
		navigator.serviceWorker.getRegistration().then(function(reg) {
			var options = {
				image: '/pwa_ati/static/pwa/Bab5/pwa-push-notification/images/bookstore.png',
				body: 'Informasi Pemberitahuan...',
				tag: 'id1',
				icon: '/pwa_ati/static/pwa/Bab5/pwa-push-notification/images/notification.png',
				vibrate: [100, 50, 100],
				data: { dateOfArrival: Date.now(), primaryKey: 1},
				actions: [
					{action: 'explore2', title: 'Buka notifikasi'},
					{action: 'close', title: 'Tutup notifikasi'},
				]
			};
			reg.showNotification('Pemberitahuan!', options);
		});
	}
}