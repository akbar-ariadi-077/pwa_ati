# -*- coding: utf-8 -*-

from odoo import models, fields, api
import uuid


class PWADataDiri(models.Model):
    _name = 'data.diri'
    
    offline_uuid = fields.Char(default=lambda self:uuid.uuid4(), required=True)
    nama = fields.Char()
    alamat = fields.Char()
    photo = fields.Binary()
    location_ids = fields.One2many('data.diri.location', 'data_diri_id')
    
    def data_diri_url(self):
        url = '/pwa/data/diri/form'
        if len(self) == 1:
            url = '/pwa/data/diri/form#action=edit&id=%s' % (self.id)
        return {
            'type': 'ir.actions.act_url',
            'url': url,
            'target': 'blank'
        }
        
    def data_diri_lokasi(self):
        return {
            'type': 'ir.actions.client',
            'tag': 'data_diri_lokasi',
            'context': {
                'id': self.id
            }
        }
        
    def data_diri_photo(self):
        return {
            'type': 'ir.actions.client',
            'tag': 'data_diri_photo',
            'context': {
                'id': self.id
            }
        }
        
    @api.model
    def set_location(self, data_diri_id, longitude, latitude):
        self.browse(data_diri_id).write({
            'location_ids': [(0, 0, {
                'longitude': longitude,
                'latitude': latitude
            })]
        })
        return True
    
    @api.model
    def set_photo(self, data_diri_id, photo):
        self.browse(data_diri_id).write({
            'photo': photo
        })
        return True

        
class PWADataDiriLocation(models.Model):
    _name = 'data.diri.location'
    
    data_diri_id = fields.Many2one('data.diri')
    longitude = fields.Float()
    latitude = fields.Float()
