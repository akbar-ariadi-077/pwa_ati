odoo.define('web.data.diri', function (require) {
"use strict";

var core = require('web.core');

function data_diri_lokasi(parent, params) {
	let watchId;
	function appendLocation(locations) {
		let save_location = parent._rpc({
			model: 'data.diri',
			method: 'set_location',
			args: [params.context.id, locations.coords.longitude, locations.coords.latitude]
		});
		if (save_location) {
			location.reload();
		}
	}

	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(function (locations) {
			appendLocation(locations);
		});
		watchId = navigator.geolocation.watchPosition(appendLocation);
	} else {
		alert('Geolocation API not supported.');
	}
}
core.action_registry.add("data_diri_lokasi", data_diri_lokasi);

function data_diri_photo(parent, params) {
	if (!('ImageCapture' in window)) {
		alert('ImageCapture is not available');
		return;
	}
	if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
		!navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
		alert('User Media API not supported.');
		return;
	}
	let constraints = {video:true};
	let api = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	if (api) {
		api.bind(navigator)(constraints, function (stream) {
			let theImageCapturer = new ImageCapture(stream.getVideoTracks()[0]);
			theImageCapturer.takePhoto().then(blob => {
				let reader = new FileReader();
				reader.readAsDataURL(blob); 
				reader.onloadend = function() {
					let base64data = '' + reader.result;                
					let save_photo = parent._rpc({
						model: 'data.diri',
						method: 'set_photo',
						args: [params.context.id, base64data.split(',')[1]]
					});
					if (save_photo) {
						location.reload();
					}
				}
			}).catch(err => alert('Error: ' + err));
		}, function (err) {
			alert('Error: ' + err);
		});
	}
}
core.action_registry.add("data_diri_photo", data_diri_photo);

});