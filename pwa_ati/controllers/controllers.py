# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request


class PWAController(http.Controller):
    
    @http.route('/pwa/data/diri/pwa/manifest.json', auth='public')
    def data_diri_pwa_manifest(self, **kw):
        pwa_path = '/pwa_ati/static/pwa/Bab4/pwa-addtohomescreen'
        return request.make_response('''
        {
          "name": "PWA Add to Homescreen",
          "short_name": "A2HC",
          "icons": [
            {
              "src": "%(pwa_path)s/logo192.png",
              "type": "image/png",
              "sizes": "192x192"
            },
            {
              "src": "%(pwa_path)s/logo256.png",
              "type": "image/png",
              "sizes": "256x256"
            },
            {
              "src": "%(pwa_path)s/logo512.png",
              "type": "image/png",
              "sizes": "512x512"
            }
          ],
          "start_url": "./",
          "background_color": "#ffaa00",
          "theme_color": "#ffaa00",
          "display": "standalone"
        }
        ''' % {
            'pwa_path': pwa_path
        }, [('Content-Type', 'application/json')])
    
    @http.route('/pwa/data/diri/pwa/sw.js', auth='public')
    def data_diri_pwa_service(self, **kw):
        pwa_path = '/pwa_ati/static/pwa/Bab4/pwa-addtohomescreen'
        return request.make_response('''
        var CACHE_NAME = 'a2hc-v1';
        var urlsToCache = [
            './',
            '%(pwa_path)s/index.html',
            '%(pwa_path)s/offline.html',
            './sw.js',
            './manifest.json',
            '%(pwa_path)s/A2HS.js',
            '%(pwa_path)s/logo.png',
            '%(pwa_path)s/logo192.png',
            '%(pwa_path)s/logo256.png',
            '%(pwa_path)s/logo512.png',
            '/pwa_ati/static/js/db.js',
            '/pwa_ati/static/js/notif.js',
            '/web/static/lib/jquery/jquery.js'
        ];
        
        self.addEventListener('notificationclick', function (event) {
            event.notification.close();
            if(event.action == 'explore') {
                clients.openWindow("/pwa/data/diri/pwa/");
            }
            if(event.action == 'explore2') {
                clients.openWindow("/web/");
            }
        });
        
        self.addEventListener('install', function(event) {
            console.log('installing service worker');
            event.waitUntil(
                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        console.log('cache opened');
                        var x = cache.addAll(urlsToCache);
                        console.log('cache added');
                        return x;
                    })
            );
        });
        
        self.addEventListener('fetch', function(event) {
          event.respondWith(
            caches.match(event.request).then(function(response) {
                return fetch(event.request).then(function(response) {
                    if (response.status === 404) {
                        //return caches.match('offline.html');
                        console.log("Offline");
                        event.respondWith(pullFromCache(event));
                    }
                    return response
                });
            }).catch(function() {
              return caches.match('./');
            })
          );
        });
        
        function pullFromCache(event) {
          return caches.match(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, response.clone());
                  return response;
                });
          });
        }
        ''' % {
            'pwa_path': pwa_path
        }, [('Content-Type', 'text/javascript')])
    
    @http.route('/pwa/data/diri/pwa/', auth='public')
    def data_diri_pwa(self, **kw):
        return request.render('pwa_ati.pwa_a2hs')
    
    @http.route('/pwa/data/diri', csrf=False, auth='public')
    def data_diri(self, **kw):
        data_diri = request.env['data.diri'].create({
            'nama': kw.get('nama'),
            'alamat': kw.get('alamat'),
        })
        if kw.get('silent'):
            return '%s' % (data_diri.id)
        else:
            return '''
            <table>
                <tr>
                    <td>ID</td>
                    <td>:</td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>%s</td>
                </tr>
            </table>
            ''' % (data_diri.id, data_diri.nama, data_diri.alamat)
            
    @http.route('/pwa/data/diri/form', auth='user', website=True, csrf=False)
    def data_diri_form(self, **kw):
        data_diri = request.env['data.diri']
        if kw.get('aksi') in ['edit', 'hapus', 'submit_edit']:
            data_diri_id = data_diri.browse(int(kw.get('id')))
            if kw.get('aksi') == 'edit':
                return '''
                    <table>
                        <tr>
                            <td>Nama</td>
                            <td>:</td>
                            <td><input type="text" id="nama" value="%s"/></td>
                        </tr>
                        <tr>
                            <td>Alamat</td>
                            <td>:</td>
                            <td><input type="text" id="alamat" value="%s"/></td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <a href="#action=submit_edit&id=%s">Submit</a>
                            </td>
                        </tr>
                    </table>
                ''' % (
                    data_diri_id.nama,
                    data_diri_id.alamat,
                    data_diri_id.id,
                )
            elif kw.get('aksi') == 'hapus':
                data_diri_id.unlink()
            elif kw.get('aksi') == 'submit_edit':
                data_diri_id.write({
                    'nama': kw.get('nama'),
                    'alamat': kw.get('alamat'),
                })
        elif kw.get('aksi') == 'tambah':
            return '''
                <table>
                    <tr>
                        <td>Nama</td>
                        <td>:</td>
                        <td><input type="text" id="nama"/></td>
                    </tr>
                    <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td><input type="text" id="alamat"/></td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <a href="#action=submit_tambah">Submit</a>
                        </td>
                    </tr>
                </table>
            '''
        elif kw.get('aksi') == 'submit_tambah':
            data_diri.create({
                'nama': kw.get('nama'),
                'alamat': kw.get('alamat'),
            })
        to_render = {
            'table_list': request.env['data.diri'].search([]).read(
                fields=['id', 'nama', 'alamat'], load=False),
        }
        if kw.get('aksi') in ['submit_tambah', 'hapus', 'submit_edit']:
            return request.render('pwa_ati.pwa_tbody_template', to_render)
        else:
            return request.render('pwa_ati.pwa_template', to_render)

