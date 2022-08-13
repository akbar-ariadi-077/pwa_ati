let btnInstall = document.getElementById('install');
let deferredPrompt;
  
/*  
  window.addEventListener('beforeinstallprompt', function(event) {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = event;
    });
    // Installation must be done by a user gesture! Here, the button click
    btnInstall.addEventListener('click', () => {
      // hide our user interface that shows our A2HS button
      btnInstall.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
*/

window.addEventListener('beforeinstallprompt', (event) => {
	deferredPrompt = event;
});
document.getElementById('install').addEventListener('click',() => {
	console.log('Install Aplikasi PWA');
	if(deferredPrompt) {	
		deferredPrompt.userChoice.then((result) => {
			console.log(result.outcome);
			if(result.outcome === 'dismissed') {
				console.log('Aplikasi batal di-instal');
			} else {
				console.log('Aplikasi sudah di-install di home screen');
			}
		});
		delete deferredPrompt;
	}
});
