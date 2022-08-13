var deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
	deferredPrompt = event;
});
document.getElementById('install').addEventListener('click',() => {
	if(deferredPrompt) {		
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then((result) => {
			console.log(result.outcome);
			if(result.outcome === 'dismissed') {
				console.log('The app was not added to the home screen');
			} else {
				console.log('The app was added to home screen');
			}
		});
		delete deferredPrompt;
	}
});
