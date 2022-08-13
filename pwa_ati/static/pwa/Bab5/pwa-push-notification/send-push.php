<?php 
	define('SERVER_API_KEY', 'AAAA3saUcJ8:APA91bFHkJ9eHLkxYc9YLDmsSTabwL8zk2jAzWqpUbqvkXnEhIPKG9gOY0vQkwYaWRHrBZMhLjWaLBcQ3fb68bp1peY0Sw1dy_1mHAZYGgrY26TC9PnlrMFbcrQ_qSxAxBDjArV4xySI');
	$registrationIds[0] = 'esD_bskM_kM:APA91bFbIOMBKbhEyGwCegh9tOwT5bGUQ8Tu1WT7MakubsbpZHoha5EaE3lzdNDsxn8ONnKDhOkLXrUzDUtak7rCUzQEbpR1Y_0hNJoL0o1tqZogk8U_NeLQMIofoyLupXL6gbrsFDNE';
	$header = [
		'Authorization: Key=' . SERVER_API_KEY,
		'Content-Type: Application/json'
	];
	$msg = [
		'title' => 'KABAR BERITA!',
		'body'  => 'Informasi pemberitahuan push message.',
		'icon'  => 'images\notification.png',
		'image' => 'images\bookstore.png',
		'click_action' => 'pages\page-push-notification.html'
	];
	$payload = [
		'registration_ids'  => $registrationIds,
		'data'				=> $msg
	];

	$curl = curl_init();
	curl_setopt_array($curl, array(
	  CURLOPT_URL => "https://fcm.googleapis.com/fcm/send",
	  CURLOPT_RETURNTRANSFER => true,
	  CURLOPT_CUSTOMREQUEST => "POST",
	  CURLOPT_POSTFIELDS => json_encode($payload),
	  CURLOPT_HTTPHEADER => $header
	));

	$response = curl_exec($curl);
	$err = curl_error($curl);
	curl_close($curl);
	if ($err) echo "cURL Error #:" . $err;
	else echo $response;
