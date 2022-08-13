// get a reference to the install button
var button = document.getElementById('install');
// if browser support installable apps, run the install code; if not, hide the install button
if('mozApps' in navigator) {
    var manifest_url = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
    function install(ev) {
      ev.preventDefault();
      // install the app
      var installLocFind = navigator.mozApps.install(manifest_url);
      installLocFind.onsuccess = function(data) {
        console.log('App is installed, do something if you like');
		
      };
      installLocFind.onerror = function() {
        // App wasn't installed
        alert(installLocFind.error.name);
      };
    };
    // if app is already installed, hide button. If not, add event listener to call install() on click
    var installCheck = navigator.mozApps.checkInstalled(manifest_url);
    installCheck.onsuccess = function() {
      if(installCheck.result) {
        button.style.display = "none";
      } else {
        button.addEventListener('click', install, false);
      };
    };
} else {
  //button.style.display = "none";
}