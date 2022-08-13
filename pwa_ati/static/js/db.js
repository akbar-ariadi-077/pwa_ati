let tabel = document.getElementById('pwa_table_body')

$('#pwa_table_tambah').toggle();
$('#pwa_table_edit').toggle();

buatDatabase();

function uuidv4() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}

function buatTransaksi() {
    var transaction = db.transaction(['data_diri'], 'readwrite');
    // transaction.onerror = kesalahanHandler;
    transaction.oncomplete = console.log('Transaksi baru saja diselesaikan.');                  
    return transaction;
}

function buatDatabase() {
	if (!('indexedDB' in window)) {
		alert('Web Browser Anda tidak mendukung IndexedDB');
		return;
	}	
	var request = window.indexedDB.open('pwa_ati', 1);
    // request.onerror = kesalahanHandler;
    request.onupgradeneeded = function(e) {             
        var db = e.target.result;
        // db.onerror = kesalahanHandler;                          
        var objectstore = db.createObjectStore('data_diri', { keyPath: 'offline_id' });
        console.log('Object store data diri berhasil dibuat.');
    }
    request.onsuccess = function(e) {           
        db = e.target.result;
        // db.onerror = kesalahanHandler;                          
        console.log('Berhasil melakukan koneksi ke database lokal.');
        bacaDariDatabase();
    }
}

function bacaDariDatabase() {
    var objectstore = buatTransaksi().objectStore('data_diri');
    objectstore.openCursor().onsuccess = function(e) {
        var result = e.target.result;
        if (result) {
            console.log('Membaca data diri [' + result.value.offline_id + '] dari database.');
            let baris = tabel.insertRow();                  
            baris.id = result.value.offline_id;
            baris.insertCell().appendChild(document.createTextNode(result.value.nama));
            baris.insertCell().appendChild(document.createTextNode(result.value.alamat));
            
            // Tombol Edit
            let btnEdit = document.createElement('a');
            $(btnEdit).html('Edit');
            $(btnEdit).attr('href', 'javascript:editDariDatabase(\''+result.value.offline_id+'\')');      
            
            // Tombol Hapus
            let btnHapus = document.createElement('a');
            $(btnHapus).html('Hapus');
            $(btnHapus).attr('href', 'javascript:hapusDariDatabase(\''+result.value.offline_id+'\')');         
            
            let aksiCell = baris.insertCell()
            aksiCell.appendChild(btnEdit);
            aksiCell.appendChild(document.createTextNode('|'));
            aksiCell.appendChild(btnHapus);
            
            result.continue();
        }
    }   
}

function tambahBaris() {
      // Tambah ke database
      let uuid = uuidv4();
      let objectstore = buatTransaksi().objectStore('data_diri');
      let request = objectstore.add({
          offline_id: uuid,
          nama: $('#pwa_tambah_nama').val(),
          alamat: $('#pwa_tambah_alamat').val()
      });
      // Membuat baris baru
      request.onsuccess = (event) => {
			var baris = tabel.insertRow();  
			baris.id = uuid;
			baris.insertCell().appendChild(document.createTextNode($('#pwa_tambah_nama').val()));
			baris.insertCell().appendChild(document.createTextNode($('#pwa_tambah_alamat').val()));
			
			// Tombol Edit
			let btnEdit = document.createElement('a');
			$(btnEdit).html('Edit');
			$(btnEdit).attr('href', 'javascript:editDariDatabase(\''+uuid+'\')');
			
			      // Membuat tombol hapus 
			let btnHapus = document.createElement('a');
			$(btnHapus).html('Hapus');
			$(btnHapus).attr('href', 'javascript:hapusDariDatabase(\''+uuid+'\')');         
			  
			let aksiCell = baris.insertCell()
			aksiCell.appendChild(btnEdit);
			aksiCell.appendChild(document.createTextNode('|'));
			aksiCell.appendChild(btnHapus);
			  
			$('#pwa_table_tambah').toggle();
      };
}

function hapusDariDatabase(offline_id) {
	if(confirm('Anda Yakin?')) {
	    let objectstore = buatTransaksi().objectStore('data_diri');
	    let request = objectstore.delete(offline_id);
	    // request.onerror = kesalahanHandler;
	    request.onsuccess = (event) => {
	    	location.reload();
	    };
    }
}

function editDariDatabase(offline_id) {
	let objectstore = buatTransaksi().objectStore('data_diri');
	let request = objectstore.get(offline_id);
	request.onsuccess = (event) => {
		$('#pwa_edit_nama').val(event.target.result.nama);
		$('#pwa_edit_alamat').val(event.target.result.alamat);
		$('#pwa_edit_submit').attr('href', 'javascript:submitEditDariDatabase(\'' + offline_id + '\')');
		$('#pwa_table_edit').toggle();
	};
}

function submitEditDariDatabase(offline_id) {
	let objectstore = buatTransaksi().objectStore('data_diri');
	let request = objectstore.get(offline_id);
	request.onsuccess = (event) => {
		let data = event.target.result;
		data.nama = $('#pwa_edit_nama').val();
		data.alamat = $('#pwa_edit_alamat').val();
		let requestUpdate = objectstore.put(data);
		requestUpdate.onsuccess = (event) => {
			location.reload();
		};
	};
}