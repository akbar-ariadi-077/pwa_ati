function pwa_post_action(action) {
	var aksi = {'aksi': action}
	var confirmed = true;
	if(action=='submit_tambah') {
		aksi['nama'] = $('#nama').val();
		aksi['alamat'] = $('#alamat').val();
	}
	if(action.startsWith('submit_edit')) {
		const actions = action.split(' ');
		aksi['aksi'] = actions[0];
		aksi['id'] = actions[1];
		aksi['nama'] = $('#nama').val();
		aksi['alamat'] = $('#alamat').val();
	}
	if(action.startsWith('edit')) {
		const actions = action.split(' ');
		aksi['aksi'] = actions[0];
		aksi['id'] = actions[1];
	}
	if(action.startsWith('hapus')) {
		const actions = action.split(' ');
		confirmed = confirm('Apakah anda yakin?');
		aksi['aksi'] = actions[0];
		aksi['id'] = actions[1];
	}
	if(confirmed) {
		$.post('/pwa/data/diri/form', aksi, function(data){
			if(action.startsWith('submit')) {
				$('#tabel_diri_body').html(data);
				$('#pwa_form').html('');
			} else if(action.startsWith('hapus')) {
				$('#tabel_diri_body').html(data);
				$('#pwa_form').html('');
			} else {
				$('#pwa_form').html(data);
			}
		});
	}
}

/* $(document).ready(function() {}); */