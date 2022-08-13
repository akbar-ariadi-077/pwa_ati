'use strict';
var app = (function() {
  var isSubscribed = false;
  var swRegistration = null;
  var notifyButton = document.querySelector('.js-notify-btn');
  var pushButton = document.querySelector('.js-push-btn');
  if (!('Notification' in window)) {
    console.log('Notifications not supported in this browser');
    return;
  }
  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
  });
  function displayNotification() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        var options = {
		  image: 'images/bookstore.png',
          body: 'Informasi Pemberitahuan...',
          tag: 'id1',
          icon: 'images/notification.png',
          vibrate: [100, 50, 100],
          data: { dateOfArrival: Date.now(), primaryKey: 1},
          actions: [
            {action: 'explore', title: 'Buka notifikasi',
              icon: 'images/checkmark.png'},
            {action: 'close', title: 'Tutup notifikasi',
              icon: 'images/xmark.png'},
          ]
        };
        reg.showNotification('Pemberitahuan!', options);
      });
    }
  }
  function initializeUI() {
    pushButton.addEventListener('click', function() {
      pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUser();
      }
    });
    // Set initial subscription value
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      isSubscribed = (subscription !== null);
      updateSubscriptionOnServer(subscription);
      if (isSubscribed) {
        console.log('User is subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }
      updateBtn();
    });
  }

  function subscribeUser() {
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
    })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);
      updateSubscriptionOnServer(subscription);
      isSubscribed = true;
      updateBtn();
    })
    .catch(function(err) {
      if (Notification.permission === 'denied') {
        console.warn('Permission for notifications was denied');
      } else {
        console.error('Failed to subscribe the user: ', err);
      }
      updateBtn();
    });
  }

  function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {console.log('Error unsubscribing', error);})
    .then(function() {
      updateSubscriptionOnServer(null);
      console.log('User is unsubscribed');
      isSubscribed = false;
      updateBtn();
    });
  }

  function updateSubscriptionOnServer(subscription) {
    // Here's where you would send the subscription to the application server
    var subscriptionJson = document.querySelector('.js-subscription-json');
    var endpointURL = document.querySelector('.js-endpoint-url');
    var subAndEndpoint = document.querySelector('.js-sub-endpoint');
    if (subscription) {
      subscriptionJson.textContent = JSON.stringify(subscription);
      endpointURL.textContent = subscription.endpoint;
      subAndEndpoint.style.display = 'block';
    } else {
      subAndEndpoint.style.display = 'none';
    }
  }

  function updateBtn() {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }
    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }
    pushButton.disabled = false;
  }

  notifyButton.addEventListener('click', function() {displayNotification();});
  
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker registered', swReg);
      swRegistration = swReg;
      initializeUI();
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
  } else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
  }

})();
